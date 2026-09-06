import { DOCUMENT } from '@angular/common';
import { DestroyRef, inject, Injectable } from '@angular/core';
import { IS_BROWSER } from '../tokens/platform.tokens';
import { SceneStateService } from './scene-state.service';

/**
 * Owns the one scroll listener in the application.
 *
 * Phase 3 replaces the internals with GSAP ScrollTrigger as the single source
 * of scroll truth; the public surface (a normalized progress signal on
 * SceneStateService) stays the same so nothing downstream has to change.
 */
@Injectable({ providedIn: 'root' })
export class ScrollService {
  private readonly document = inject(DOCUMENT);
  private readonly isBrowser = inject(IS_BROWSER);
  private readonly sceneState = inject(SceneStateService);
  private readonly destroyRef = inject(DestroyRef);

  private frame = 0;
  private started = false;
  private teardown: (() => void) | null = null;

  start(): void {
    if (!this.isBrowser || this.started) return;
    this.started = true;

    const view = this.document.defaultView;
    if (!view) return;

    const onScroll = () => {
      if (this.frame) return;
      this.frame = view.requestAnimationFrame(() => {
        this.frame = 0;
        this.sceneState.scrollProgress.set(this.computeProgress());
        this.sceneState.scrolled.set(this.document.documentElement.scrollTop > 40);
      });
    };

    view.addEventListener('scroll', onScroll, { passive: true });
    view.addEventListener('resize', onScroll, { passive: true });
    onScroll();

    this.teardown = () => {
      view.removeEventListener('scroll', onScroll);
      view.removeEventListener('resize', onScroll);
      if (this.frame) view.cancelAnimationFrame(this.frame);
      this.frame = 0;
    };

    this.destroyRef.onDestroy(() => this.stop());
  }

  /**
   * Retires this listener once GSAP ScrollTrigger takes over, so exactly one
   * scroll listener is live at a time. Called by MotionService.
   */
  stop(): void {
    this.teardown?.();
    this.teardown = null;
    this.started = true;
  }

  private computeProgress(): number {
    const el = this.document.documentElement;
    const scrollable = el.scrollHeight - el.clientHeight;
    if (scrollable <= 0) return 0;
    return Math.min(1, Math.max(0, el.scrollTop / scrollable));
  }
}
