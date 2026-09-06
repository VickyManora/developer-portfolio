import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CONTACT, PROFILE } from '../../../content/profile.data';
import { PROJECTS } from '../../../content/projects.data';
import { ROLES } from '../../../content/experience.data';
import { yearsOfExperience } from '../../../core/models/date.utils';
import { ObservedSection } from '../../../shared/directives/observed-section.directive';
import { SectionHeader } from '../../../shared/ui/section-header/section-header';
import { Reveal } from '../../../shared/directives/reveal.directive';

@Component({
  selector: 'app-intro-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionHeader, ObservedSection, Reveal],
  template: `
    <section class="section" id="intro" appObservedSection aria-labelledby="intro-heading">
      <div class="container">
        <app-section-header
          appReveal
          index="01"
          label="Introduction"
          heading="Engineering across the full stack"
          headingId="intro-heading"
        />

        <div class="intro">
          <p class="intro__summary" appReveal>{{ profile.summary }}</p>

          <aside class="intro__aside" appReveal revealDelay="90">
            <dl class="intro__facts">
              <div>
                <dt>Experience</dt>
                <dd>{{ years }}</dd>
              </div>
              <div>
                <dt>Companies</dt>
                <dd>{{ companyCount }}</dd>
              </div>
              <div>
                <dt>Flagship projects</dt>
                <dd>{{ projectCount }}</dd>
              </div>
              <div>
                <dt>Based in</dt>
                <dd>{{ profile.location }}</dd>
              </div>
            </dl>

            <a class="btn btn--primary intro__cta" [href]="contact.resumeFile" download>
              Download Résumé<span aria-hidden="true">↓</span>
            </a>
          </aside>
        </div>
      </div>
    </section>
  `,
  styleUrl: './intro-section.scss',
})
export class IntroSection {
  protected readonly profile = PROFILE;
  protected readonly contact = CONTACT;
  protected readonly years = yearsOfExperience(PROFILE.careerStart);
  protected readonly companyCount = String(ROLES.length);
  protected readonly projectCount = String(PROJECTS.length);
}
