import {
  DestroyRef,
  effect,
  inject,
  Injectable,
  isDevMode,
  signal,
  untracked,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { IS_BROWSER } from '../tokens/platform.tokens';
import { DeviceCapabilityService } from '../services/device-capability.service';
import { SceneDirectorService } from './scene-director.service';
import type { SceneEngine, SceneReport } from '../../three/types/scene-contract';

/**
 * `still` means the engine is mounted and has rendered one settled frame, but
 * the loop is stopped — the reduced-motion end state. It is distinct from
 * `idle` because the canvas must stay mounted and must keep showing that frame.
 */
export type EngineStatus = 'idle' | 'loading' | 'running' | 'still' | 'failed';

/**
 * The ONLY seam between Angular and the Three.js engine.
 *
 * Angular signals are read here and pushed into the engine as a plain object.
 * The engine never calls back into Angular, never queries the DOM, and never
 * attaches a scroll listener.
 *
 * The Three.js chunk is dynamically imported, so it cannot enter the initial
 * bundle or delay the hero's paint.
 */
@Injectable({ providedIn: 'root' })
export class ThreeEngineService {
  private readonly document = inject(DOCUMENT);
  private readonly isBrowser = inject(IS_BROWSER);
  private readonly capability = inject(DeviceCapabilityService);
  private readonly director = inject(SceneDirectorService);
  private readonly destroyRef = inject(DestroyRef);

  private engine: SceneEngine | null = null;
  private canvas: HTMLCanvasElement | null = null;
  private resizeObserver: ResizeObserver | null = null;
  private intersectionObserver: IntersectionObserver | null = null;
  private visibilityHandler: (() => void) | null = null;
  private inViewport = true;

  readonly status = signal<EngineStatus>('idle');

  /**
   * True once an engine has been created for the current canvas.
   *
   * The canvas element must not be removed when motion is switched off
   * mid-session: tearing it out orphans the WebGL context on a detached
   * element, and the replacement canvas never gets an engine because
   * ngAfterViewInit has already run.
   */
  readonly mounted = signal(false);

  constructor() {
    // Push Angular state into the engine whenever it changes. This is the only
    // place the two systems touch.
    effect(() => {
      const input = this.director.input();
      untracked(() => {
        if (!this.engine) return;
        this.engine.update(input);
        // The engine settles itself on the reduced-motion transition; the
        // service only mirrors the resulting state.
        if (this.status() === 'running' || this.status() === 'still') {
          this.status.set(input.reducedMotion ? 'still' : 'running');
        }
      });
    });

    this.destroyRef.onDestroy(() => this.teardown());
  }

  private scheduled = false;

  /**
   * Defers the mount until the page has loaded and the main thread is idle.
   *
   * The engine chunk is ~115KB gzip and compiling it cost 166ms of total
   * blocking time when the mount ran during hydration. Nothing about a
   * decorative background justifies competing with the hero's paint, so it
   * waits — exactly as the GSAP layer does.
   */
  scheduleMount(canvas: HTMLCanvasElement): void {
    if (!this.isBrowser || this.scheduled) return;
    const view = this.document.defaultView;
    if (!view) return;
    this.scheduled = true;

    const begin = () => {
      const idle = (view as Window & { requestIdleCallback?: typeof requestIdleCallback })
        .requestIdleCallback;
      if (idle) idle(() => this.measureThenMount(canvas), { timeout: 1500 });
      else view.setTimeout(() => this.measureThenMount(canvas), 300);
    };

    if (this.document.readyState === 'complete') begin();
    else view.addEventListener('load', begin, { once: true });
  }

  /**
   * Runs the capability probe and only then decides whether to import Three.js.
   *
   * The ordering is the whole point of the gate: a constrained device must
   * never pay the chunk's download, parse and compile cost. The probe is
   * skipped entirely when a cheaper signal has already ruled the scene out
   * (reduced motion, no WebGL2, save-data), so those visitors pay nothing at all.
   */
  private measureThenMount(canvas: HTMLCanvasElement): void {
    if (!this.capability.canRenderScene()) return;
    this.capability.measureCpu();
    if (!this.capability.canRenderScene()) return;
    void this.mount(canvas);
  }

  /**
   * Mounts the engine onto a canvas. Safe to call repeatedly: a second call
   * for the same canvas is a no-op, which is what prevents duplicate renderers
   * and duplicate rAF loops across route changes.
   */
  async mount(canvas: HTMLCanvasElement): Promise<void> {
    if (!this.isBrowser) return;
    if (this.engine && this.canvas === canvas) return;
    if (this.status() === 'loading') return;
    if (!this.capability.canRenderScene()) return;

    this.teardown();
    this.canvas = canvas;
    this.status.set('loading');

    try {
      const { createEngine } = await import('../../three/engine/create-engine');

      // The canvas may have been torn down while the chunk was in flight.
      if (this.canvas !== canvas) return;

      this.engine = createEngine({
        canvas,
        graph: this.director.buildGraphSpec(),
        tier: this.capability.tier(),
        reducedMotion: this.director.input().reducedMotion,
        onFatal: (reason) => this.fail(reason),
      });

      this.engine.update(this.director.input());
      this.observe(canvas);

      this.mounted.set(true);

      if (this.director.input().reducedMotion) {
        // Static composition: one settled frame, then no loop at all.
        this.engine.renderStill();
        this.status.set('still');
      } else {
        this.engine.start();
        this.status.set('running');
      }

      this.exposeDebugHook();
    } catch {
      this.fail('engine-load-failed');
    }
  }

  get report(): SceneReport | null {
    return this.engine?.report ?? null;
  }

  /** Full teardown. Called on route change and on destroy. */
  teardown(): void {
    this.resizeObserver?.disconnect();
    this.resizeObserver = null;

    this.intersectionObserver?.disconnect();
    this.intersectionObserver = null;

    if (this.visibilityHandler) {
      this.document.removeEventListener('visibilitychange', this.visibilityHandler);
      this.visibilityHandler = null;
    }

    this.engine?.dispose();
    this.engine = null;
    this.canvas = null;
    this.mounted.set(false);
    this.scheduled = false;
    if (this.status() !== 'failed') this.status.set('idle');
  }

  /**
   * Exposes renderer telemetry on `window` for local debugging.
   *
   * Development builds only. A production bundle must not carry an internal
   * telemetry surface at all — `isDevMode()` is statically false in a
   * production build, so this branch is dead code the optimiser removes rather
   * than a runtime check an attacker could satisfy with a query string.
   */
  private exposeDebugHook(): void {
    if (!isDevMode()) return;
    const view = this.document.defaultView;
    if (!view || !view.location.search.includes('debug')) return;
    (view as Window & { __systemCore?: () => SceneReport | null }).__systemCore = () => this.report;
  }

  private fail(_reason: string): void {
    this.engine?.dispose();
    this.engine = null;
    this.mounted.set(false);
    // 'failed' makes the host swap permanently to the static composition, so a
    // lost context never leaves a blank canvas on screen.
    this.status.set('failed');
  }

  /**
   * Pause/resume, driven by observers rather than by a scroll listener.
   *
   * The render loop stops when the tab is hidden or the canvas leaves the
   * viewport, so a reader deep in the case-study content is not paying for a
   * scene they cannot see.
   */
  private observe(canvas: HTMLCanvasElement): void {
    const view = this.document.defaultView;
    if (!view) return;

    if ('ResizeObserver' in view) {
      this.resizeObserver = new ResizeObserver(() => this.engine?.resize());
      this.resizeObserver.observe(canvas);
    }

    if ('IntersectionObserver' in view) {
      this.intersectionObserver = new IntersectionObserver(
        (entries) => {
          this.inViewport = entries.some((entry) => entry.isIntersecting);
          this.syncRunState();
        },
        { threshold: 0 },
      );
      this.intersectionObserver.observe(canvas);
    }

    this.visibilityHandler = () => this.syncRunState();
    this.document.addEventListener('visibilitychange', this.visibilityHandler);
  }

  private syncRunState(): void {
    if (!this.engine) return;
    const hidden = this.document.visibilityState === 'hidden';
    const reduced = this.director.input().reducedMotion;
    if (hidden || !this.inViewport || reduced) this.engine.pause();
    else this.engine.start();
  }
}
