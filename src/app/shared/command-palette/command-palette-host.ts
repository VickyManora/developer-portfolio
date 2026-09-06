import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommandPaletteState } from './command-palette-state.service';
import { CommandPalette } from './command-palette';

/**
 * Mounts the palette only while it is open.
 *
 * `@defer (when …)` keeps the palette implementation in its own chunk, so the
 * initial bundle carries the key listener and the command registry but not the
 * UI. Nothing is fetched until the visitor actually presses the shortcut.
 */
@Component({
  selector: 'app-command-palette-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommandPalette],
  template: `
    @defer (when state.open()) {
      @if (state.open()) {
        <app-command-palette />
      }
    }
  `,
})
export class CommandPaletteHost {
  protected readonly state = inject(CommandPaletteState);
}
