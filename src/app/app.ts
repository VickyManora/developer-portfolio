import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { IS_BROWSER } from './core/tokens/platform.tokens';
import { filter } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Header } from './layout/header/header';
import { Footer } from './layout/footer/footer';
import { DestroyRef } from '@angular/core';
import { RouteAnnouncerService } from './core/services/route-announcer.service';
import { ScrollService } from './core/services/scroll.service';
import { MotionService } from './core/motion/motion.service';
import { CommandPaletteState } from './shared/command-palette/command-palette-state.service';
import { CommandPaletteHost } from './shared/command-palette/command-palette-host';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, Header, Footer, CommandPaletteHost],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  private readonly router = inject(Router);
  private readonly announcer = inject(RouteAnnouncerService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly scroll = inject(ScrollService);
  private readonly motion = inject(MotionService);
  private readonly commands = inject(CommandPaletteState);
  private readonly document = inject(DOCUMENT);
  private readonly isBrowser = inject(IS_BROWSER);

  constructor() {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe(() => this.announcer.announceNavigation());
  }

  /**
   * Cmd/Ctrl+K opens the palette.
   *
   * One listener on the document, registered after hydration. It does not
   * intercept the shortcut while the visitor is typing in a field, and it never
   * pulls in the palette UI — that arrives in its own chunk on first open.
   */
  private bindCommandShortcut(): void {
    if (!this.isBrowser) return;
    const handler = (event: KeyboardEvent) => {
      if (event.key !== 'k' && event.key !== 'K') return;
      if (!event.metaKey && !event.ctrlKey) return;
      const target = event.target as HTMLElement | null;
      const tag = target?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || target?.isContentEditable) return;
      event.preventDefault();
      this.commands.toggle();
    };
    this.document.addEventListener('keydown', handler);
    this.destroyRef.onDestroy(() => this.document.removeEventListener('keydown', handler));
  }

  ngOnInit(): void {
    // Native scroll listener first: it is the progress source until the GSAP
    // chunk resolves, and the only source if motion is disabled.
    this.scroll.start();
    // Deferred to after `load` + idle: motion must never compete with LCP.
    this.motion.scheduleInitialize();
    this.bindCommandShortcut();
  }
}
