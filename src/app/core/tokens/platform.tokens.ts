import { inject, InjectionToken, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * SSR safety. Every service that touches `window`, `document`, `localStorage`
 * or `matchMedia` must gate on IS_BROWSER — the prerender pass runs in Node.
 */
export const IS_BROWSER = new InjectionToken<boolean>('IS_BROWSER', {
  providedIn: 'root',
  factory: () => isPlatformBrowser(inject(PLATFORM_ID)),
});
