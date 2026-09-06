import type { AppEnvironment } from './environment.model';

export const environment: AppEnvironment = {
  production: true,
  // LAUNCH-GATED: no domain is configured yet, so none is baked into the
  // bundle. An empty origin cannot leak a provisional host into the output,
  // and `siteUrlIsPlaceholder` already suppresses every absolute URL that
  // would need it (canonical, og:url, JSON-LD url, sitemap).
  //
  // To go live: set the real origin here and flip the flag to false.
  siteUrl: '',
  siteUrlIsPlaceholder: true,
  analytics: { enabled: false, provider: 'none' },
};
