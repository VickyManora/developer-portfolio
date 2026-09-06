import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PROJECTS } from '../../../content/projects.data';
import { resolveProjectName } from '../../../core/models/content.models';
import { StatBlock } from '../../../shared/ui/stat-block/stat-block';
import { Reveal } from '../../../shared/directives/reveal.directive';
import { RevealGroup } from '../../../shared/directives/reveal-group.directive';

interface OutcomeView {
  readonly value: string;
  readonly label: string;
  readonly source: string;
}

/**
 * The seven verified hard metrics, gathered into one band and attributed to
 * their project.
 *
 * Collecting them here rather than scattering stat blocks through the project
 * cards does two things: it gives the numbers the prominence a recruiter scans
 * for in the first screenful after the summary, and it stops the same figure
 * appearing twice on one page (the project bullets already state them in
 * context). The four self-reported satisfaction figures are deliberately absent
 * — they remain in the verbatim bullets below.
 */
@Component({
  selector: 'app-outcomes-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [StatBlock, Reveal, RevealGroup],
  template: `
    <section class="outcomes" aria-labelledby="outcomes-heading">
      <div class="container">
        <h2 class="visually-hidden" id="outcomes-heading">Measured outcomes</h2>
        <p class="eyebrow outcomes__label" appReveal="fade">Measured outcomes</p>

        <ul class="outcomes__grid" role="list" appRevealGroup>
          @for (outcome of outcomes; track outcome.value + outcome.label) {
            <li>
              <app-stat-block
                [value]="outcome.value"
                [label]="outcome.label"
                [source]="outcome.source"
              />
            </li>
          }
        </ul>
      </div>
    </section>
  `,
  styleUrl: './outcomes-section.scss',
})
export class OutcomesSection {
  protected readonly outcomes: readonly OutcomeView[] = PROJECTS.flatMap((project) =>
    project.metrics
      .filter((metric) => metric.weight === 'hard')
      .map((metric) => ({
        value: metric.value,
        label: metric.label,
        // Attribution is mandatory: a metric with no project is a metric with
        // no provenance, and figures must never migrate between projects.
        source: resolveProjectName(project).split(' — ')[0],
      })),
  );
}
