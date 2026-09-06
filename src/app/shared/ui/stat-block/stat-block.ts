import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Featured metric.
 *
 * Reserved for hard, defensible numbers. The four self-reported satisfaction
 * figures stay as inline body text so they cannot dilute these by association
 * — a cluster of soft percentages makes a reader discount the hard ones too.
 */
@Component({
  selector: 'app-stat-block',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="stat">
      <span class="stat__value">{{ value() }}</span>
      <span class="stat__label">{{ label() }}</span>
      @if (source()) {
        <span class="stat__source">{{ source() }}</span>
      }
    </div>
  `,
  styleUrl: './stat-block.scss',
})
export class StatBlock {
  readonly value = input.required<string>();
  readonly label = input.required<string>();
  /** Project the figure comes from — keeps every number attributable. */
  readonly source = input<string | null>(null);
}
