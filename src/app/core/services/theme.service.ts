import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { IS_BROWSER } from '../tokens/platform.tokens';

export type ThemePreference = 'system' | 'dark' | 'light';

const STORAGE_KEY = 'vm.theme';

/**
 * Theme infrastructure.
 *
 * Dark is the CSS default on bare `:root`, so the prerendered page paints dark
 * with no JavaScript and no flash. This service only ever writes `data-theme`
 * for an explicit user choice, which is why there is no blocking inline script
 * in index.html — and therefore no `script-src` CSP exception to carve out.
 *
 * Known limitation, deferred to Phase 7: a visitor who has chosen the light
 * theme sees one dark frame before hydration. Fixing that needs a hashed
 * inline script, which is a launch-hardening task rather than a foundation one.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly isBrowser = inject(IS_BROWSER);

  private readonly preference = signal<ThemePreference>(this.readStoredPreference());
  private readonly systemPrefersLight = signal(false);

  /**
   * 'system' resolves to dark, not to the OS preference.
   *
   * The design is dark-first: the light "Blueprint" theme is a Phase 6
   * deliverable and is not yet visually finished, so it ships behind the
   * explicit toggle rather than being handed to every light-OS visitor. This
   * also keeps the header label honest — previously it could read "THEME LIGHT"
   * while the page rendered dark, because the CSS only switches on
   * [data-theme] while this computed consulted the media query.
   *
   * `systemPrefersLight` is still tracked; Phase 6 flips this to honour it.
   */
  readonly theme = computed<'dark' | 'light'>(() => {
    const pref = this.preference();
    return pref === 'light' ? 'light' : 'dark';
  });

  readonly currentPreference = this.preference.asReadonly();

  constructor() {
    if (this.isBrowser) {
      const query = this.document.defaultView?.matchMedia('(prefers-color-scheme: light)');
      if (query) {
        this.systemPrefersLight.set(query.matches);
        query.addEventListener('change', (event) => this.systemPrefersLight.set(event.matches));
      }
    }

    effect(() => {
      const pref = this.preference();
      const root = this.document.documentElement;
      if (pref === 'system') {
        root.removeAttribute('data-theme');
      } else {
        root.setAttribute('data-theme', pref);
      }
    });
  }

  set(preference: ThemePreference): void {
    this.preference.set(preference);
    if (!this.isBrowser) return;
    try {
      if (preference === 'system') {
        localStorage.removeItem(STORAGE_KEY);
      } else {
        localStorage.setItem(STORAGE_KEY, preference);
      }
    } catch {
      // Private browsing or blocked site data — the in-memory signal still works.
    }
  }

  toggle(): void {
    this.set(this.theme() === 'dark' ? 'light' : 'dark');
  }

  private readStoredPreference(): ThemePreference {
    if (!this.isBrowser) return 'system';
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored === 'dark' || stored === 'light' ? stored : 'system';
    } catch {
      return 'system';
    }
  }
}
