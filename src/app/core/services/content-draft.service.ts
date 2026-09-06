import { computed, inject, Injectable, isDevMode } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { IS_BROWSER } from '../tokens/platform.tokens';

/**
 * Controls whether unresolved-content markers are visible.
 *
 * The `NEEDS INPUT` architecture stays exactly as it is in the data model —
 * nothing is guessed, nothing is filled in. What changes is who sees the
 * markers: they are an authoring affordance, not visitor-facing content, and a
 * finished portfolio should not show a visitor an amber "missing" box.
 *
 * Visible in dev, or on any URL carrying `?draft`. Hidden otherwise, and the
 * surrounding section omits itself rather than rendering an empty heading.
 */
@Injectable({ providedIn: 'root' })
export class ContentDraftService {
  private readonly document = inject(DOCUMENT);
  private readonly isBrowser = inject(IS_BROWSER);

  readonly enabled = computed(() => {
    if (isDevMode()) return true;
    if (!this.isBrowser) return false;
    return this.document.defaultView?.location.search.includes('draft') ?? false;
  });
}
