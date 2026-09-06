import { ErrorHandler, inject, Injectable, isDevMode } from '@angular/core';
import { IS_BROWSER } from '../tokens/platform.tokens';

/**
 * Last-resort error boundary.
 *
 * During prerendering an unhandled error would otherwise fail the whole build;
 * during a browser session it should never take the page down. Both paths log
 * and continue. Phase 7 can forward to an error reporter here — this is the
 * single place that would need to change.
 */
@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  private readonly isBrowser = inject(IS_BROWSER);

  handleError(error: unknown): void {
    const context = this.isBrowser ? 'browser' : 'prerender';
    if (isDevMode()) {
      console.error(`[${context}]`, error);
      return;
    }
    console.error(`[${context}] Unhandled error:`, error instanceof Error ? error.message : error);
  }
}
