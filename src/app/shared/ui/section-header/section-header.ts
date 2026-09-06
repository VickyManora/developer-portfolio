import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Editorial section header: "03 / WORK" over the heading, with an accent
 * lead-in rule. One component so numbering, rhythm and heading levels stay
 * consistent across every section.
 */
@Component({
  selector: 'app-section-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="section-header">
      <p class="eyebrow">
        <span class="eyebrow__index">{{ index() }}</span>
        <span class="eyebrow__divider" aria-hidden="true">/</span>
        <span>{{ label() }}</span>
      </p>
      <h2 class="section-header__heading" [id]="headingId()">{{ heading() }}</h2>
      @if (lede()) {
        <p class="section-header__lede">{{ lede() }}</p>
      }
    </div>
  `,
  styleUrl: './section-header.scss',
})
export class SectionHeader {
  readonly index = input.required<string>();
  readonly label = input.required<string>();
  readonly heading = input.required<string>();
  readonly headingId = input.required<string>();
  readonly lede = input<string | null>(null);
}
