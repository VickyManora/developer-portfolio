import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { IS_BROWSER } from '../tokens/platform.tokens';

/**
 * Accessibility foundation for client-side navigation.
 *
 * A single-page app changes the view without a page load, so screen readers
 * announce nothing and keyboard focus stays where it was. On every completed
 * navigation this moves focus to <main> and announces the new page title in a
 * polite live region.
 */
@Injectable({ providedIn: 'root' })
export class RouteAnnouncerService {
  private readonly document = inject(DOCUMENT);
  private readonly isBrowser = inject(IS_BROWSER);
  private readonly title = inject(Title);

  announceNavigation(): void {
    if (!this.isBrowser) return;

    const region = this.document.getElementById('route-announcer');
    if (region) {
      region.textContent = `Navigated to ${this.title.getTitle()}`;
    }

    const main = this.document.getElementById('main-content');
    if (main) {
      main.focus({ preventScroll: true });
    }
  }
}
