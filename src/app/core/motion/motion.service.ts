import { DestroyRef, effect, inject, Injectable, signal } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import type { gsap as GsapType } from 'gsap';
import { IS_BROWSER } from '../tokens/platform.tokens';
import { MotionPreferenceService } from '../services/motion-preference.service';
import { SceneStateService } from '../services/scene-state.service';
import { ScrollService } from '../services/scroll.service';
import { MOTION } from './motion.tokens';

type Gsap = typeof GsapType;

export type RevealVariant = 'rise' | 'fade';

export interface TimelineRequest {
  readonly container: HTMLElement;
  /** Element scaled from 0 to 1 as the reader moves through the timeline. */
  readonly progressBar: HTMLElement;
  readonly itemSelector: string;
  readonly bodySelector: string;
  readonly activeClass: string;
}

interface RevealRequest {
  readonly element: HTMLElement;
  readonly variant: RevealVariant;
  readonly delay: number;
  /** When set, children matching this selector are staggered instead. */
  readonly childSelector?: string;
}

/**
 * The single authority for scroll-driven motion.
 *
 * Architecture:
 *
 *   native scroll → GSAP ScrollTrigger → normalized progress signal
 *                                      → SceneStateService
 *                                      → SceneDirectorService → ThreeEngineService
 *
 * Nothing downstream is allowed to attach its own scroll listener. The
 * Three.js engine reads `SceneStateService.scrollProgress`, written here.
 *
 * GSAP is imported dynamically so it stays out of the initial bundle: the
 * hero's entrance is pure CSS and does not wait for this to resolve.
 */
@Injectable({ providedIn: 'root' })
export class MotionService {
  private readonly document = inject(DOCUMENT);
  private readonly isBrowser = inject(IS_BROWSER);
  private readonly motionPreference = inject(MotionPreferenceService);
  private readonly sceneState = inject(SceneStateService);
  private readonly scrollService = inject(ScrollService);
  private readonly destroyRef = inject(DestroyRef);

  private gsap: Gsap | null = null;
  private scrollTrigger: unknown = null;
  private pending: RevealRequest[] = [];
  private pendingTimelines: TimelineRequest[] = [];
  private loadStarted = false;
  private timeoutHandle: ReturnType<typeof setTimeout> | null = null;

  /**
   * Set when the engine gives up (load timeout or import failure). Once set,
   * no tween may ever be built — otherwise a late-resolving import would
   * re-hide content that has already been force-revealed.
   */
  private abandoned = false;

  /** Every element the engine has touched, so its inline styles can be undone. */
  private readonly touched = new Set<HTMLElement>();

  readonly engineReady = signal(false);

  constructor() {
    // The in-app motion toggle must be able to switch animation off mid-session.
    // GSAP writes inline opacity/transform, which no stylesheet rule should have
    // to fight, so the engine undoes its own work rather than being overridden.
    effect(() => {
      if (!this.motionPreference.reducedMotion()) return;
      this.disengage();
    });
  }

  /** True when animation should run at all. Read before any motion work. */
  get enabled(): boolean {
    return this.isBrowser && !this.motionPreference.reducedMotion();
  }

  /**
   * Schedules the engine load for after the page has finished loading and the
   * main thread is idle.
   *
   * Motion is decoration and must never compete with LCP. Loading GSAP straight
   * after hydration measurably cost 0.5s of mobile LCP and tripled TBT on a
   * throttled CPU; deferring past `load` + idle removes both.
   *
   * The idle callback carries a timeout so the engine still arrives on a busy
   * main thread, and `initialize()` remains callable directly for tests.
   */
  scheduleInitialize(): void {
    if (!this.isBrowser || this.loadStarted) return;

    const view = this.document.defaultView;
    if (!view) return;

    const start = () => {
      const idle = (view as Window & { requestIdleCallback?: typeof requestIdleCallback })
        .requestIdleCallback;
      if (idle) {
        idle(() => void this.initialize(), { timeout: 1200 });
      } else {
        view.setTimeout(() => void this.initialize(), 200);
      }
    };

    if (this.document.readyState === 'complete') {
      start();
    } else {
      view.addEventListener('load', start, { once: true });
    }
  }

  /**
   * Kicks off the dynamic GSAP import. Prefer `scheduleInitialize()`, which
   * defers this until the page is loaded and the main thread is free.
   */
  async initialize(): Promise<void> {
    if (!this.isBrowser || this.loadStarted) return;
    this.loadStarted = true;

    if (!this.enabled) {
      // Reduced motion: no engine, no triggers. Everything is already in its
      // final state because the reveal directives never hid it.
      this.flushPendingAsVisible();
      return;
    }

    // Safety net: if the chunk fails or stalls, show the content anyway — and
    // permanently, by abandoning the engine rather than merely un-hiding once.
    this.timeoutHandle = setTimeout(() => {
      this.abandoned = true;
      this.flushPendingAsVisible();
    }, MOTION.loadTimeoutMs);

    try {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ]);

      if (this.abandoned) return;

      gsap.registerPlugin(ScrollTrigger);
      this.gsap = gsap;
      this.scrollTrigger = ScrollTrigger;

      this.clearTimeout();
      this.installProgressTracker(ScrollTrigger);
      this.engineReady.set(true);

      for (const request of this.pending) this.build(request);
      this.pending = [];
      for (const request of this.pendingTimelines) this.buildTimeline(request);
      this.pendingTimelines = [];

      this.destroyRef.onDestroy(() => {
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      });
    } catch {
      // Never let a failed animation chunk hide content.
      this.clearTimeout();
      this.abandoned = true;
      this.flushPendingAsVisible();
    }
  }

  /** Called by the reveal directives. Queues until the engine is ready. */
  register(request: RevealRequest): void {
    if (!this.enabled || this.abandoned) {
      this.reveal(request.element, request.childSelector);
      return;
    }
    if (this.gsap) {
      this.build(request);
      return;
    }
    this.pending.push(request);
  }

  /**
   * Progressive timeline: a spine that fills as the reader descends, and each
   * role activating as it reaches the reading band.
   *
   * Under reduced motion the spine is drawn at full height immediately and
   * every item is marked active, so the finished state is identical — the
   * timeline never depends on motion to be readable.
   */
  registerTimeline(request: TimelineRequest): void {
    if (!this.enabled || this.abandoned) {
      this.settleTimeline(request);
      return;
    }
    if (this.gsap) {
      this.buildTimeline(request);
      return;
    }
    this.pendingTimelines.push(request);
  }

  private buildTimeline(request: TimelineRequest): void {
    const gsap = this.gsap;
    if (!gsap || this.abandoned) return;

    const { container, progressBar, itemSelector, bodySelector, activeClass } = request;

    // Scrubbed spine. scaleY only — the element's height never changes, so no
    // layout is triggered on any frame.
    gsap.fromTo(
      progressBar,
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: container,
          start: 'top 70%',
          end: 'bottom 70%',
          // A short scrub smooths the fill without decoupling it from scroll.
          scrub: 0.4,
        },
      },
    );

    const items = Array.from(container.querySelectorAll<HTMLElement>(itemSelector));
    const ScrollTrigger = this.scrollTrigger as typeof import('gsap/ScrollTrigger').ScrollTrigger;

    for (const item of items) {
      const body = item.querySelector<HTMLElement>(bodySelector);

      // Node activation. A class toggle, so the visual treatment lives in SCSS
      // next to the rest of the timeline styling.
      ScrollTrigger.create({
        trigger: item,
        start: 'top 72%',
        onEnter: () => item.classList.add(activeClass),
      });

      if (!body) continue;
      gsap.fromTo(
        body,
        { opacity: 0, y: MOTION.travel },
        {
          opacity: 1,
          y: 0,
          duration: MOTION.enter,
          ease: MOTION.ease,
          clearProps: 'transform,opacity',
          scrollTrigger: { trigger: item, start: MOTION.start, once: true },
        },
      );
    }
  }

  private settleTimeline(request: TimelineRequest): void {
    request.progressBar.style.transform = 'scaleY(1)';
    for (const item of Array.from(
      request.container.querySelectorAll<HTMLElement>(request.itemSelector),
    )) {
      item.classList.add(request.activeClass);
    }
  }

  // ---------------------------------------------------------------------------

  /**
   * One ScrollTrigger for the whole document, publishing normalized progress.
   * ScrollService's own rAF listener is retired here so exactly one scroll
   * listener is live at a time.
   */
  private installProgressTracker(
    ScrollTrigger: typeof import('gsap/ScrollTrigger').ScrollTrigger,
  ): void {
    this.scrollService.stop();

    ScrollTrigger.create({
      trigger: this.document.documentElement,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        this.sceneState.scrollProgress.set(self.progress);
        this.sceneState.scrolled.set(self.scroll() > 40);
      },
    });
  }

  private build(request: RevealRequest): void {
    const gsap = this.gsap;
    if (!gsap || this.abandoned) return;

    const { element, variant, delay, childSelector } = request;
    const targets = childSelector
      ? Array.from(element.querySelectorAll<HTMLElement>(childSelector))
      : [element];

    if (targets.length === 0) return;
    for (const target of targets) this.touched.add(target);

    const compact = this.document.defaultView
      ? this.document.defaultView.matchMedia('(max-width: 899px)').matches
      : false;
    const travel = compact ? MOTION.travelMobile : MOTION.travel;

    gsap.fromTo(
      targets,
      { opacity: 0, y: variant === 'fade' ? 0 : travel },
      {
        opacity: 1,
        y: 0,
        duration: MOTION.enter,
        delay,
        ease: MOTION.ease,
        // Stagger is capped so a long list cannot turn into a slow cascade.
        stagger: childSelector ? Math.min(MOTION.stagger, MOTION.staggerMax / targets.length) : 0,
        overwrite: 'auto',
        // Clears the inline transform so nothing is left on a composited layer
        // once the element has arrived.
        clearProps: 'transform,opacity',
        scrollTrigger: {
          trigger: element,
          start: MOTION.start,
          once: true,
        },
        onComplete: () => this.reveal(element, childSelector),
      },
    );
  }

  /** Removes the pre-hidden class so the element is permanently visible. */
  private reveal(element: HTMLElement, childSelector?: string): void {
    element.classList.remove('is-reveal-pending');
    if (!childSelector) return;
    for (const child of Array.from(element.querySelectorAll('.is-reveal-pending'))) {
      child.classList.remove('is-reveal-pending');
    }
  }

  /**
   * Switches animation off for the rest of the session and restores every
   * element the engine touched to its natural, final state.
   */
  private disengage(): void {
    this.abandoned = true;
    this.clearTimeout();

    const ScrollTrigger = this.scrollTrigger as
      typeof import('gsap/ScrollTrigger').ScrollTrigger | null;
    ScrollTrigger?.getAll().forEach((trigger) => trigger.kill());

    for (const element of this.touched) {
      this.gsap?.killTweensOf(element);
      element.style.removeProperty('opacity');
      element.style.removeProperty('transform');
      element.style.removeProperty('will-change');
    }
    this.touched.clear();

    this.flushPendingAsVisible();
    this.engineReady.set(false);
  }

  private flushPendingAsVisible(): void {
    for (const request of this.pending) this.reveal(request.element, request.childSelector);
    this.pending = [];
    for (const request of this.pendingTimelines) this.settleTimeline(request);
    this.pendingTimelines = [];
    for (const el of Array.from(this.document.querySelectorAll('.is-reveal-pending'))) {
      el.classList.remove('is-reveal-pending');
    }
  }

  private clearTimeout(): void {
    if (this.timeoutHandle !== null) {
      clearTimeout(this.timeoutHandle);
      this.timeoutHandle = null;
    }
  }
}
