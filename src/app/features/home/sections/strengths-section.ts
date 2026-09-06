import { ChangeDetectionStrategy, Component } from '@angular/core';
import { STRENGTHS } from '../../../content/strengths.data';
import { ObservedSection } from '../../../shared/directives/observed-section.directive';
import { SectionHeader } from '../../../shared/ui/section-header/section-header';
import { Reveal } from '../../../shared/directives/reveal.directive';
import { RevealGroup } from '../../../shared/directives/reveal-group.directive';

/**
 * Engineering principles.
 *
 * The eleven approved strengths, presented as a numbered editorial list rather
 * than a card grid — closer to a statement of how the work is done than to a
 * list of attributes. The one-liners are the Phase 0 drafts unchanged; each is
 * traceable to a resume line via `evidence` in the data.
 */
@Component({
  selector: 'app-strengths-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionHeader, ObservedSection, Reveal, RevealGroup],
  template: `
    <section class="section" id="strengths" appObservedSection aria-labelledby="strengths-heading">
      <div class="container">
        <app-section-header
          appReveal
          index="05"
          label="Engineering Strengths"
          heading="How I work"
          headingId="strengths-heading"
          lede="Eleven capabilities the delivered work demonstrates — each one traceable to something actually shipped."
        />

        <ol class="principles" appRevealGroup>
          @for (strength of strengths; track strength.id; let i = $index) {
            <li class="principle">
              <span class="principle__index" aria-hidden="true">{{ pad(i + 1) }}</span>
              <div class="principle__body">
                <h3 class="principle__name">{{ strength.name }}</h3>
                <p class="principle__summary">{{ strength.summary }}</p>
              </div>
            </li>
          }
        </ol>
      </div>
    </section>
  `,
  styleUrl: './strengths-section.scss',
})
export class StrengthsSection {
  protected readonly strengths = STRENGTHS;

  protected pad(value: number): string {
    return value.toString().padStart(2, '0');
  }
}
