import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { CONTACT, PROFILE } from '../../content/profile.data';
import { EDUCATION } from '../../content/education.data';
import { ALL_SKILLS } from '../../content/skills.data';
import { ROLES } from '../../content/experience.data';
import { isResolved } from '../models/content.models';
import { SeoService } from './seo.service';

/**
 * JSON-LD built from the confirmed content data only.
 *
 * Nothing here is asserted that the resume does not state — the education
 * `branch` is omitted entirely while it is still [NEEDS INPUT], rather than
 * emitting an empty or guessed value into structured data.
 */
@Injectable({ providedIn: 'root' })
export class StructuredDataService {
  private readonly seo = inject(SeoService);

  applyPersonSchema(): void {
    const education = EDUCATION[0];

    const person: Record<string, unknown> = {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: PROFILE.name,
      jobTitle: PROFILE.role,
      description: PROFILE.summary,
      email: `mailto:${CONTACT.email}`,
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Pune',
        addressCountry: 'IN',
      },
      alumniOf: {
        '@type': 'CollegeOrUniversity',
        name: education.institution,
      },
      worksFor: {
        '@type': 'Organization',
        name: ROLES[0].company,
      },
      knowsAbout: ALL_SKILLS.map((skill) => skill.name),
      sameAs: [CONTACT.github, CONTACT.linkedin],
    };

    if (!environment.siteUrlIsPlaceholder) {
      person['url'] = environment.siteUrl;
    }

    if (isResolved(education.branch)) {
      person['hasCredential'] = {
        '@type': 'EducationalOccupationalCredential',
        credentialCategory: 'degree',
        name: `${education.degree}, ${education.branch}`,
      };
    }

    this.seo.setStructuredData('person', person);
  }

  /**
   * CreativeWork schema for a deep case study.
   *
   * `url` is emitted only once a real domain is configured, so a provisional
   * host is never published to a crawler.
   */
  applyCaseStudySchema(name: string, description: string, path: string): void {
    const work: Record<string, unknown> = {
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      name,
      description,
      author: { '@type': 'Person', name: PROFILE.name },
      about: ALL_SKILLS.slice(0, 12).map((skill) => skill.name),
    };

    if (!environment.siteUrlIsPlaceholder) {
      work['url'] = `${environment.siteUrl}${path}`;
    }

    this.seo.setStructuredData('case-study', work);
  }
}
