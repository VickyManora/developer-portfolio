import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  OnDestroy,
  signal,
  viewChild,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { CommandRegistryService } from './command-registry.service';
import type { Command } from './command.model';

interface CommandGroup {
  readonly label: string;
  readonly commands: readonly Command[];
}

/**
 * Command palette. No dependency — Angular, the design system and native
 * behaviour only.
 *
 * Accessibility contract:
 *   - `role="dialog" aria-modal="true"`, focus moves to the input on open
 *   - the input owns a `combobox`/`listbox` relationship via `aria-activedescendant`,
 *     so arrow keys move a visual selection while focus stays in the field —
 *     which is what lets the user keep typing while browsing results
 *   - Escape closes; focus returns to whatever opened it
 *   - Tab is trapped inside the dialog
 *   - the result count is announced politely
 */
@Component({
  selector: 'app-command-palette',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './command-palette.html',
  styleUrl: './command-palette.scss',
})
export class CommandPalette implements AfterViewInit, OnDestroy {
  private readonly registry = inject(CommandRegistryService);
  private readonly document = inject(DOCUMENT);
  private readonly input = viewChild.required<ElementRef<HTMLInputElement>>('input');
  private readonly panel = viewChild.required<ElementRef<HTMLElement>>('panel');

  private readonly restoreFocusTo = this.document.activeElement as HTMLElement | null;
  private readonly previousOverflow = this.document.body.style.overflow;

  protected readonly query = signal('');
  protected readonly activeIndex = signal(0);

  protected readonly results = computed<readonly Command[]>(() => {
    const q = this.query().trim().toLowerCase();
    const all = this.registry.commands();
    if (!q) return all;
    const terms = q.split(/\s+/);
    return all.filter((command) => {
      const haystack = `${command.label} ${command.group} ${command.keywords ?? ''}`.toLowerCase();
      return terms.every((term) => haystack.includes(term));
    });
  });

  protected readonly groups = computed<readonly CommandGroup[]>(() => {
    const map = new Map<string, Command[]>();
    for (const command of this.results()) {
      const bucket = map.get(command.group);
      if (bucket) bucket.push(command);
      else map.set(command.group, [command]);
    }
    return [...map].map(([label, commands]) => ({ label, commands }));
  });

  protected readonly activeId = computed(() => this.results()[this.activeIndex()]?.id ?? null);

  ngAfterViewInit(): void {
    this.document.body.style.overflow = 'hidden';
    this.input().nativeElement.focus();
  }

  ngOnDestroy(): void {
    this.document.body.style.overflow = this.previousOverflow;
    // Focus goes back to the trigger, not to the top of the document.
    this.restoreFocusTo?.focus?.();
  }

  protected onInput(value: string): void {
    this.query.set(value);
    this.activeIndex.set(0);
  }

  protected indexOf(command: Command): number {
    return this.results().indexOf(command);
  }

  protected select(index: number): void {
    this.activeIndex.set(index);
  }

  protected runAt(index: number): void {
    const command = this.results()[index];
    if (!command) return;
    this.registry.close();
    command.run();
  }

  protected close(): void {
    this.registry.close();
  }

  protected onKeydown(event: KeyboardEvent): void {
    const total = this.results().length;

    switch (event.key) {
      case 'Escape':
        event.preventDefault();
        this.close();
        return;
      case 'ArrowDown':
        event.preventDefault();
        if (total > 0) this.activeIndex.set((this.activeIndex() + 1) % total);
        return;
      case 'ArrowUp':
        event.preventDefault();
        if (total > 0) this.activeIndex.set((this.activeIndex() - 1 + total) % total);
        return;
      case 'Home':
        event.preventDefault();
        this.activeIndex.set(0);
        return;
      case 'End':
        event.preventDefault();
        this.activeIndex.set(Math.max(0, total - 1));
        return;
      case 'Enter':
        event.preventDefault();
        this.runAt(this.activeIndex());
        return;
      case 'Tab':
        this.trapTab(event);
        return;
      default:
        return;
    }
  }

  private trapTab(event: KeyboardEvent): void {
    const focusable = Array.from(
      this.panel().nativeElement.querySelectorAll<HTMLElement>(
        'input, button:not([disabled])',
      ),
    ).filter((el) => el.offsetParent !== null);
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
