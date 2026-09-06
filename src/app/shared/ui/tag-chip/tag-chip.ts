import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-tag-chip',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<span class="chip" [class.chip--signal]="signal()"><ng-content /></span>`,
})
export class TagChip {
  /** Marks a technology that also appears as a node in the 3D graph. */
  readonly signal = input(false);
}
