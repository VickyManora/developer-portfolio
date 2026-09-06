import { RenderMode, type ServerRoute } from '@angular/ssr';
import { DEEP_PROJECT_SLUGS } from './content/projects.data';

/**
 * Every route is prerendered to static HTML at build time — no server runtime,
 * no cold starts, and full content in the source for crawlers.
 *
 * `/work/:slug` params come from the content data, so adding a deep-tier
 * project automatically adds its prerendered page with no config change.
 */
export const serverRoutes: ServerRoute[] = [
  {
    path: 'work/:slug',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => DEEP_PROJECT_SLUGS.map((slug) => ({ slug })),
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
