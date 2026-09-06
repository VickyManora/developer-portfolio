import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { ConceptGroup } from '../../../core/models/content.models';

/**
 * A conceptual capability map.
 *
 * Deliberately NOT an architecture diagram. It groups technologies and
 * practices the resume documents; it asserts nothing about services, data
 * stores, deployment topology or request flow. The heading above it says so in
 * words, and the visual language — grouped columns of chips rather than boxes
 * joined by directed arrows — avoids implying a topology in the first place.
 *
 * Built from DOM elements rather than SVG so every label is real, selectable,
 * translatable text that a screen reader reads in order.
 */
@Component({
  selector: 'app-concept-map',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="map">
      @for (group of groups(); track group.label) {
        <section class="map__group" [attr.aria-label]="group.label">
          <h3 class="meta map__label">{{ group.label }}</h3>
          <ul class="map__items" role="list">
            @for (item of group.items; track item) {
              <li class="map__item">
                <span class="map__tick" aria-hidden="true"></span>
                {{ item }}
              </li>
            }
          </ul>
        </section>
      }
    </div>
  `,
  styleUrl: './concept-map.scss',
})
export class ConceptMap {
  readonly groups = input.required<readonly ConceptGroup[]>();
}
