import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { IS_BROWSER } from '../tokens/platform.tokens';
import { SceneStateService } from './scene-state.service';

/**
 * Tracks which section is in view, for the layer rail and the top nav.
 *
 * One shared IntersectionObserver rather than one per section, and the result
 * is written into SceneStateService — so the scene's camera reads exactly the
 * same signal the rail does, with no second tracking mechanism.
 */
@Injectable({ providedIn: 'root' })
export class ActiveSectionService {
  private readonly document = inject(DOCUMENT);
  private readonly isBrowser = inject(IS_BROWSER);
  private readonly sceneState = inject(SceneStateService);
  private readonly destroyRef = inject(DestroyRef);

  private observer: IntersectionObserver | null = null;
  private readonly visible = new Map<string, number>();

  readonly activeId = signal<string>('hero');

  register(element: HTMLElement): void {
    if (!this.isBrowser) return;
    this.ensureObserver();
    this.observer?.observe(element);
  }

  unregister(element: HTMLElement): void {
    this.observer?.unobserve(element);
    if (element.id) this.visible.delete(element.id);
  }

  private ensureObserver(): void {
    if (this.observer) return;
    const view = this.document.defaultView;
    if (!view || !('IntersectionObserver' in view)) return;

    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = (entry.target as HTMLElement).id;
          if (!id) continue;
          if (entry.isIntersecting) {
            this.visible.set(id, entry.intersectionRatio);
          } else {
            this.visible.delete(id);
          }
        }

        let best: string | null = null;
        let bestRatio = 0;
        for (const [id, ratio] of this.visible) {
          if (ratio >= bestRatio) {
            bestRatio = ratio;
            best = id;
          }
        }

        if (best && best !== this.activeId()) {
          this.activeId.set(best);
          this.sceneState.setActiveSection(best);
        }
      },
      {
        // A band across the middle of the viewport: a section counts as active
        // when it occupies the reading area, not merely when it peeks in.
        rootMargin: '-35% 0px -55% 0px',
        threshold: [0, 0.25, 0.5, 0.75, 1],
      },
    );

    this.destroyRef.onDestroy(() => {
      this.observer?.disconnect();
      this.observer = null;
    });
  }
}
