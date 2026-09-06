import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { IS_BROWSER } from '../tokens/platform.tokens';

export type MotionPreference = 'system' | 'full' | 'reduced';

const STORAGE_KEY = 'vm.motion';

/**
 * Motion policy, with two independent off-switches:
 *   1. the OS `prefers-reduced-motion` setting
 *   2. an in-app toggle, for users on shared or managed machines who never set
 *      the OS flag
 *
 * `reducedMotion()` is the single value the whole app reads — including, in
 * the Three.js render loop, which settles to one composed frame
 * rather than running a degraded animation.
 */
@Injectable({ providedIn: 'root' })
export class MotionPreferenceService {
  private readonly document = inject(DOCUMENT);
  private readonly isBrowser = inject(IS_BROWSER);

  private readonly preference = signal<MotionPreference>(this.readStoredPreference());
  private readonly systemPrefersReduced = signal(false);

  readonly currentPreference = this.preference.asReadonly();

  readonly reducedMotion = computed(() => {
    const pref = this.preference();
    if (pref === 'reduced') return true;
    if (pref === 'full') return false;
    return this.systemPrefersReduced();
  });

  constructor() {
    if (this.isBrowser) {
      const query = this.document.defaultView?.matchMedia('(prefers-reduced-motion: reduce)');
      if (query) {
        this.systemPrefersReduced.set(query.matches);
        query.addEventListener('change', (event) => this.systemPrefersReduced.set(event.matches));
      }
    }

    effect(() => {
      const pref = this.preference();
      const root = this.document.documentElement;
      if (pref === 'system') {
        root.removeAttribute('data-motion');
      } else {
        root.setAttribute('data-motion', pref);
      }
    });
  }

  set(preference: MotionPreference): void {
    this.preference.set(preference);
    if (!this.isBrowser) return;
    try {
      if (preference === 'system') {
        localStorage.removeItem(STORAGE_KEY);
      } else {
        localStorage.setItem(STORAGE_KEY, preference);
      }
    } catch {
      // Storage unavailable; the in-memory signal still governs this session.
    }
  }

  toggle(): void {
    this.set(this.reducedMotion() ? 'full' : 'reduced');
  }

  private readStoredPreference(): MotionPreference {
    if (!this.isBrowser) return 'system';
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored === 'full' || stored === 'reduced' ? stored : 'system';
    } catch {
      return 'system';
    }
  }
}
