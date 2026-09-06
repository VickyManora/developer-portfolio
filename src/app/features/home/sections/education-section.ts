import { ChangeDetectionStrategy, Component } from '@angular/core';
import { EDUCATION } from '../../../content/education.data';
import { formatRange } from '../../../core/models/date.utils';
import { isPending, type Education } from '../../../core/models/content.models';
import { ObservedSection } from '../../../shared/directives/observed-section.directive';
import { SectionHeader } from '../../../shared/ui/section-header/section-header';
import { PendingNote } from '../../../shared/ui/pending-note/pending-note';
import { Reveal } from '../../../shared/directives/reveal.directive';
import { RevealGroup } from '../../../shared/directives/reveal-group.directive';

interface EducationView {
  readonly entry: Education;
  readonly range: string;
  readonly branch: string | null;
}

@Component({
  selector: 'app-education-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionHeader, PendingNote, ObservedSection, Reveal, RevealGroup],
  template: `
    <section class="section" id="education" appObservedSection aria-labelledby="education-heading">
      <div class="container">
        <app-section-header
          appReveal
          index="06"
          label="Education"
          heading="Education"
          headingId="education-heading"
        />

        <ul class="education" role="list" appRevealGroup>
          @for (item of entries; track item.entry.institution) {
            <li class="education__card">
              <p class="education__dates">
                <time [attr.datetime]="item.entry.start">{{ item.range }}</time>
              </p>

              <div class="education__body">
                <h3 class="education__institution">{{ item.entry.institution }}</h3>
                @if (item.branch) {
                  <p class="education__degree">{{ item.entry.degree }}, {{ item.branch }}</p>
                } @else {
                  <!-- Branch unresolved: the degree stands alone rather than
                       showing a placeholder or a guessed discipline. -->
                  <p class="education__degree">{{ item.entry.degree }}</p>
                  <app-pending-note field="B.Tech branch / discipline" />
                }
                <p class="education__grade">{{ item.entry.grade }}</p>
              </div>
            </li>
          }
        </ul>
      </div>
    </section>
  `,
  styleUrl: './education-section.scss',
})
export class EducationSection {
  protected readonly entries: readonly EducationView[] = EDUCATION.map((entry) => ({
    entry,
    range: formatRange(entry.start, entry.end),
    branch: isPending(entry.branch) ? null : entry.branch,
  }));
}
