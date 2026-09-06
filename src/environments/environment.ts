import type { AppEnvironment } from './environment.model';

export const environment: AppEnvironment = {
  production: false,
  // LAUNCH-GATED: final domain not yet confirmed. `siteUrlIsPlaceholder` keeps
  // this honest — canonical/OG tags are suppressed while it is true, so we
  // never publish canonical URLs pointing at a domain that may not be ours.
  siteUrl: 'http://localhost:4200',
  siteUrlIsPlaceholder: true,
  analytics: { enabled: false, provider: 'none' },
};
