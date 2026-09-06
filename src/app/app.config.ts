import {
  ApplicationConfig,
  ErrorHandler,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import {
  provideRouter,
  withComponentInputBinding,
  withInMemoryScrolling,
  withRouterConfig,
  withViewTransitions,
} from '@angular/router';
import {
  provideClientHydration,
  withEventReplay,
  withIncrementalHydration,
} from '@angular/platform-browser';

import { routes } from './app.routes';
import { GlobalErrorHandler } from './core/errors/global-error-handler';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),

    // Zoneless is stable in Angular 20 and is load-bearing here: with Zone.js,
    // the Three.js rAF loop would trigger change detection 60x/second
    // across the whole tree. Without it, Angular only re-renders on real signal
    // changes and the render loop runs uncontested.
    provideZonelessChangeDetection(),

    provideRouter(
      routes,
      // Route params bind straight to signal inputs — no ActivatedRoute
      // subscriptions in components.
      withComponentInputBinding(),
      withInMemoryScrolling({
        anchorScrolling: 'enabled',
        scrollPositionRestoration: 'enabled',
      }),
      withRouterConfig({ paramsInheritanceStrategy: 'always' }),

      // Route transitions use the platform's View Transitions API rather than a
      // library: no bundle cost, no long loading state, and it degrades to an
      // instant swap where unsupported. Skipped entirely under reduced motion.
      withViewTransitions({
        skipInitialTransition: true,
        onViewTransitionCreated: ({ transition }) => {
          const root = document.documentElement;
          const reduced =
            root.dataset['motion'] === 'reduced' ||
            (root.dataset['motion'] !== 'full' &&
              window.matchMedia('(prefers-reduced-motion: reduce)').matches);
          if (reduced) transition.skipTransition();
        },
      }),
    ),

    // Incremental hydration: below-fold sections ship as prerendered HTML and
    // only hydrate when they scroll into view. The homepage got substantially
    // richer in Phase 5 and hydrating all of it up front cost ~40ms of mobile
    // total blocking time.
    provideClientHydration(withEventReplay(), withIncrementalHydration()),

    { provide: ErrorHandler, useClass: GlobalErrorHandler },
  ],
};
