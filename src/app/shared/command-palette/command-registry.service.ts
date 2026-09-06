import { computed, inject, Injectable, signal } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';
import { CONTACT } from '../../content/profile.data';
import { SECTIONS } from '../../content/sections.data';
import { PROJECTS } from '../../content/projects.data';
import { resolveProjectName } from '../../core/models/content.models';
import { MotionPreferenceService } from '../../core/services/motion-preference.service';
import { IS_BROWSER } from '../../core/tokens/platform.tokens';
import { CommandPaletteState } from './command-palette-state.service';
import type { Command } from './command.model';

/**
 * Builds the command list.
 *
 * Injected only by the lazily-loaded palette component, so the command
 * definitions — and everything they import — stay out of the initial bundle.
 * Open/closed state lives in CommandPaletteState, which is the only palette
 * code the initial bundle carries.
 */
@Injectable({ providedIn: 'root' })
export class CommandRegistryService {
  private readonly router = inject(Router);
  private readonly document = inject(DOCUMENT);
  private readonly motion = inject(MotionPreferenceService);
  private readonly isBrowser = inject(IS_BROWSER);

  private readonly state = inject(CommandPaletteState);

  /** Route-aware: the command list changes with where the visitor is. */
  readonly commands = computed<readonly Command[]>(() => {
    const onCaseStudy = this.currentUrl().startsWith('/work/');
    const list: Command[] = [];

    if (onCaseStudy) {
      list.push({
        id: 'back-to-work',
        label: 'Back to work',
        group: 'Navigate',
        keywords: 'projects home',
        run: () => void this.router.navigate(['/'], { fragment: 'work' }),
      });
    }

    for (const section of SECTIONS) {
      list.push({
        id: `go-${section.id}`,
        label: `Go to ${section.label}`,
        group: 'Navigate',
        keywords: section.id,
        run: () => void this.router.navigate(['/'], { fragment: section.id }),
      });
    }

    for (const project of PROJECTS.filter((p) => p.tier === 'deep')) {
      list.push({
        id: `case-${project.slug}`,
        label: `Case study — ${resolveProjectName(project)}`,
        group: 'Work',
        keywords: 'project case study',
        run: () => void this.router.navigate(['/work', project.slug]),
      });
    }

    list.push(
      {
        id: 'resume',
        label: 'Download résumé',
        group: 'Actions',
        keywords: 'cv pdf',
        hint: '↓',
        run: () => this.openExternal(CONTACT.resumeFile, false),
      },
      {
        id: 'email',
        label: 'Email Vicky',
        group: 'Actions',
        keywords: `mail contact ${CONTACT.email}`,
        run: () => this.openExternal(`mailto:${CONTACT.email}`, false),
      },
      {
        id: 'github',
        label: 'Open GitHub',
        group: 'Elsewhere',
        keywords: 'code repositories',
        hint: '↗',
        run: () => this.openExternal(CONTACT.github, true),
      },
      {
        id: 'linkedin',
        label: 'Open LinkedIn',
        group: 'Elsewhere',
        keywords: 'profile network',
        hint: '↗',
        run: () => this.openExternal(CONTACT.linkedin, true),
      },
      {
        id: 'motion',
        label: this.motion.reducedMotion() ? 'Turn motion on' : 'Turn motion off',
        group: 'Preferences',
        keywords: 'animation reduce accessibility',
        run: () => this.motion.toggle(),
      },
    );

    return list;
  });

  private readonly url = signal('/');

  constructor() {
    if (this.isBrowser) {
      this.url.set(this.router.url);
      this.router.events.subscribe(() => this.url.set(this.router.url));
    }
  }

  close(): void {
    this.state.close();
  }

  private currentUrl(): string {
    return this.url();
  }

  /**
   * `noopener,noreferrer` on every new tab: without `noopener` the opened page
   * gets a handle on this window via `window.opener`.
   */
  private openExternal(href: string, newTab: boolean): void {
    const view = this.document.defaultView;
    if (!view) return;
    if (newTab) view.open(href, '_blank', 'noopener,noreferrer');
    else view.location.assign(href);
  }
}
