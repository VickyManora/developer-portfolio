export interface AppEnvironment {
  readonly production: boolean;
  /** Absolute origin used for canonical URLs, OG tags, sitemap and JSON-LD. */
  readonly siteUrl: string;
  /**
   * True while `siteUrl` is a placeholder. Canonical and OG URL tags are
   * withheld when set, so a provisional domain never reaches a crawler.
   */
  readonly siteUrlIsPlaceholder: boolean;
  readonly analytics: {
    readonly enabled: boolean;
    readonly provider: 'none' | 'plausible';
  };
}
