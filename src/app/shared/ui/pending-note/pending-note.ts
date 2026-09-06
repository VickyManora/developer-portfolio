import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { ContentDraftService } from '../../../core/services/content-draft.service';

/**
 * Marks content that is still [NEEDS INPUT].
 *
 * Visible in dev and on `?draft` URLs, hidden for ordinary visitors. The data
 * model is unchanged either way — nothing is invented to fill the gap; the
 * surrounding content simply omits the field until it is supplied.
 */
@Component({
  selector: 'app-pending-note',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (draft.enabled()) {
      <p class="pending" role="note">
        <span class="pending__tag">NEEDS INPUT</span>
        <span>{{ field() }}</span>
      </p>
    }
  `,
  styles: `
    .pending {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 10px;
      border: 1px dashed color-mix(in srgb, var(--accent-warm) 55%, transparent);
      border-radius: var(--radius-chip);
      background-color: color-mix(in srgb, var(--accent-warm) 10%, transparent);
      color: var(--text-secondary);
      font-size: var(--fs-xs);
    }

    .pending__tag {
      font-family: var(--font-mono);
      font-size: var(--fs-mono-label);
      letter-spacing: var(--tracking-mono);
      color: var(--accent-warm);
    }
  `,
})
export class PendingNote {
  readonly field = input.required<string>();
  protected readonly draft = inject(ContentDraftService);
}
