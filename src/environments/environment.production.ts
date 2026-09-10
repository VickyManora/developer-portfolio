import type { AppEnvironment } from './environment.model';

export const environment: AppEnvironment = {
  production: true,
  // Launch origin, chosen 2026-09-10: the Vercel production alias. This must
  // match the Vercel project name exactly — the alias is derived from it, so
  // a project named anything other than `vicky-manora-portfolio` would make
  // every canonical, og:url and sitemap entry point at a host that does not
  // resolve.
  //
  // On moving to a custom domain: change the origin here, redeploy, and add a
  // redirect from this alias so the indexed URLs do not simply 404.
  siteUrl: 'https://vicky-manora-portfolio.vercel.app',
  siteUrlIsPlaceholder: false,
  analytics: { enabled: false, provider: 'none' },
};
