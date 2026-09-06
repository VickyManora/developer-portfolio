import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import type { Metric, Project } from '../../../../core/models/content.models';
import { isPending, resolveProjectName } from '../../../../core/models/content.models';
import { formatRange } from '../../../../core/models/date.utils';
import { TagChip } from '../../../../shared/ui/tag-chip/tag-chip';
import { PendingNote } from '../../../../shared/ui/pending-note/pending-note';

/**
 * A secondary project: summary always visible, with two independently
 * expandable regions for the detail.
 *
 * Built on native <details>/<summary>. That is deliberate — correct keyboard
 * and screen-reader semantics with no ARIA to get wrong, working before
 * hydration on a prerendered page, at zero JavaScript cost. `aria-expanded` is
 * not added because <summary> already exposes expanded state natively; adding
 * it would duplicate and can conflict.
 */
@Component({
  selector: 'app-project-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TagChip, PendingNote],
  templateUrl: './project-card.html',
  styleUrl: './project-card.scss',
})
export class ProjectCard {
  readonly project = input.required<Project>();

  protected readonly name = computed(() => resolveProjectName(this.project()));
  protected readonly range = computed(() =>
    formatRange(this.project().start, this.project().end),
  );
  protected readonly stack = computed(() => {
    const stack = this.project().stack;
    return isPending(stack) ? null : stack;
  });

  /** The strongest verified outcomes, capped at three. */
  protected readonly headlineMetrics = computed<readonly Metric[]>(() =>
    this.project()
      .metrics.filter((metric) => metric.weight === 'hard')
      .slice(0, 3),
  );

  protected readonly softMetrics = computed<readonly Metric[]>(() =>
    this.project().metrics.filter((metric) => metric.weight === 'soft'),
  );
}
