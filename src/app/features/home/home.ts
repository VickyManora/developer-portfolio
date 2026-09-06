import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { DEFAULT_SEO } from '../../content/seo.data';
import { SeoService } from '../../core/services/seo.service';
import { StructuredDataService } from '../../core/services/structured-data.service';
import { LayerRail } from '../../layout/layer-rail/layer-rail';
import { SystemCanvas } from './system-canvas/system-canvas';
import { HeroSection } from './sections/hero-section';
import { IntroSection } from './sections/intro-section';
import { OutcomesSection } from './sections/outcomes-section';
import { ExperienceSection } from './sections/experience-section';
import { WorkSection } from './sections/work-section';
import { SkillsSection } from './sections/skills-section';
import { StrengthsSection } from './sections/strengths-section';
import { EducationSection } from './sections/education-section';
import { ContactSection } from './sections/contact-section';

@Component({
  selector: 'app-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    SystemCanvas,
    LayerRail,
    HeroSection,
    IntroSection,
    OutcomesSection,
    ExperienceSection,
    WorkSection,
    SkillsSection,
    StrengthsSection,
    EducationSection,
    ContactSection,
  ],
  template: `
    <app-system-canvas />
    <app-layer-rail />
    <app-hero-section />
    <app-intro-section />
    <app-outcomes-section />

    <!-- Everything below the fold hydrates on viewport entry. The prerendered
         HTML is complete either way, so a crawler and a no-JS visitor see the
         whole page; only the hydration work is deferred. -->
    @defer (hydrate on viewport) {
      <app-experience-section />
    } @placeholder {
      <app-experience-section />
    }

    @defer (hydrate on viewport) {
      <app-work-section />
    } @placeholder {
      <app-work-section />
    }

    @defer (hydrate on viewport) {
      <app-skills-section />
    } @placeholder {
      <app-skills-section />
    }

    @defer (hydrate on viewport) {
      <app-strengths-section />
    } @placeholder {
      <app-strengths-section />
    }

    @defer (hydrate on viewport) {
      <app-education-section />
    } @placeholder {
      <app-education-section />
    }

    @defer (hydrate on viewport) {
      <app-contact-section />
    } @placeholder {
      <app-contact-section />
    }
  `,
})
export class Home implements OnInit {
  private readonly seo = inject(SeoService);
  private readonly structuredData = inject(StructuredDataService);

  ngOnInit(): void {
    this.seo.apply(DEFAULT_SEO);
    this.structuredData.applyPersonSchema();
  }
}
