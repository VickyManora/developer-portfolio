import { Injectable, signal } from '@angular/core';

/**
 * Open/closed state for the command palette — and nothing else.
 *
 * Deliberately tiny: this is the only palette code in the initial bundle. The
 * command list, the filtering and the UI all live in the lazy chunk, so a
 * visitor who never presses the shortcut downloads none of it.
 */
@Injectable({ providedIn: 'root' })
export class CommandPaletteState {
  readonly open = signal(false);

  toggle(): void {
    this.open.update((value) => !value);
  }

  close(): void {
    this.open.set(false);
  }
}
