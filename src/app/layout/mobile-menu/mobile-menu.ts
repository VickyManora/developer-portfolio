import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  effect,
  inject,
  input,
  output,
  viewChild,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CONTACT } from '../../content/profile.data';
import { SECTIONS } from '../../content/sections.data';
import { IS_BROWSER } from '../../core/tokens/platform.tokens';

/**
 * Full-screen navigation dialog.
 *
 * Split out of Header because the two are separate UI systems that happened to
 * share a file: the header is a persistent bar, this is a modal surface with
 * its own focus management. Keeping them together also pushed header.scss past
 * the component style budget.
 *
 * Implements the modal contract manually rather than using <dialog>: it needs
 * to render inside the app's stacking context and inherit theme tokens without
 * the top-layer quirks that ::backdrop introduces.
 */
@Component({
  selector: 'app-mobile-menu',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  templateUrl: './mobile-menu.html',
  styleUrl: './mobile-menu.scss',
})
export class MobileMenu {
  readonly activeId = input<string>('');
  readonly closed = output<void>();

  private readonly document = inject(DOCUMENT);
  private readonly isBrowser = inject(IS_BROWSER);
  private readonly panel = viewChild.required<ElementRef<HTMLElement>>('panel');

  protected readonly sections = SECTIONS;
  protected readonly contact = CONTACT;

  constructor() {
    effect((onCleanup) => {
      if (!this.isBrowser) return;

      // Scroll lock while the dialog owns the viewport.
      const previous = this.document.body.style.overflow;
      this.document.body.style.overflow = 'hidden';

      queueMicrotask(() => {
        this.panel().nativeElement.querySelector<HTMLElement>('a, button')?.focus();
      });

      onCleanup(() => {
        this.document.body.style.overflow = previous;
      });
    });
  }

  protected close(): void {
    this.closed.emit();
  }

  /** Escape closes; Tab is trapped inside the panel. */
  protected onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.close();
      return;
    }
    if (event.key !== 'Tab') return;

    const focusable = Array.from(
      this.panel().nativeElement.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'),
    );
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = this.document.activeElement;

    if (event.shiftKey && active === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  }
}
