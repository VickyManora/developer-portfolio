import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { environment } from '../../../environments/environment';
import {
  OG_IMAGE_ALT,
  OG_IMAGE_HEIGHT,
  OG_IMAGE_TYPE,
  OG_IMAGE_WIDTH,
  SITE_NAME,
} from '../../content/seo.data';
import type { SeoMeta } from '../models/content.models';

/**
 * Per-route metadata, driven by the same typed content data that renders the
 * page — so titles, descriptions, OG tags, JSON-LD and the sitemap can never
 * drift apart.
 *
 * Canonical and og:url are withheld while `siteUrlIsPlaceholder` is true, so a
 * provisional domain is never published to a crawler.
 */
@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly document = inject(DOCUMENT);

  apply(seo: SeoMeta): void {
    const fullTitle = seo.path === '/' ? seo.title : `${seo.title} — ${SITE_NAME}`;

    this.title.setTitle(fullTitle);
    this.meta.updateTag({ name: 'description', content: seo.description });
    this.meta.updateTag({
      name: 'robots',
      content: seo.noIndex ? 'noindex, nofollow' : 'index, follow',
    });

    this.meta.updateTag({ property: 'og:title', content: fullTitle });
    this.meta.updateTag({ property: 'og:description', content: seo.description });
    this.meta.updateTag({ property: 'og:type', content: seo.type ?? 'website' });
    this.meta.updateTag({ property: 'og:site_name', content: SITE_NAME });

    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: fullTitle });
    this.meta.updateTag({ name: 'twitter:description', content: seo.description });

    if (environment.siteUrlIsPlaceholder) {
      this.removeCanonical();
      this.meta.removeTag("property='og:url'");
      return;
    }

    const absolute = `${environment.siteUrl}${seo.path === '/' ? '' : seo.path}`;
    this.setCanonical(absolute);
    this.meta.updateTag({ property: 'og:url', content: absolute });

    if (seo.ogImage) {
      const image = `${environment.siteUrl}${seo.ogImage}`;

      this.meta.updateTag({ property: 'og:image', content: image });
      // Some crawlers (LinkedIn among them) still read the pre-2015 secure_url
      // variant, and skip the card when only `og:image` is present.
      this.meta.updateTag({ property: 'og:image:secure_url', content: image });
      this.meta.updateTag({ property: 'og:image:type', content: OG_IMAGE_TYPE });
      this.meta.updateTag({ property: 'og:image:width', content: OG_IMAGE_WIDTH });
      this.meta.updateTag({ property: 'og:image:height', content: OG_IMAGE_HEIGHT });
      this.meta.updateTag({ property: 'og:image:alt', content: OG_IMAGE_ALT });

      this.meta.updateTag({ name: 'twitter:image', content: image });
      this.meta.updateTag({ name: 'twitter:image:alt', content: OG_IMAGE_ALT });
    }
  }

  /** Injects a JSON-LD block, replacing any previous one for the same id. */
  setStructuredData(id: string, data: Record<string, unknown>): void {
    const elementId = `ld-${id}`;
    this.document.getElementById(elementId)?.remove();

    const script = this.document.createElement('script');
    script.id = elementId;
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(data);
    this.document.head.appendChild(script);
  }

  private setCanonical(href: string): void {
    let link = this.document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = this.document.createElement('link');
      link.rel = 'canonical';
      this.document.head.appendChild(link);
    }
    link.href = href;
  }

  private removeCanonical(): void {
    this.document.head.querySelector('link[rel="canonical"]')?.remove();
  }
}
