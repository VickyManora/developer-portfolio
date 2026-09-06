import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CONTACT } from '../../content/profile.data';
import { SECTIONS } from '../../content/sections.data';
import { ActiveSectionService } from '../../core/services/active-section.service';
import { MotionPreferenceService } from '../../core/services/motion-preference.service';
import { SceneStateService } from '../../core/services/scene-state.service';
import { CommandPaletteState } from '../../shared/command-palette/command-palette-state.service';
import { MobileMenu } from '../mobile-menu/mobile-menu';

@Component({
  selector: 'app-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, MobileMenu],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  private readonly motionService = inject(MotionPreferenceService);
  private readonly activeSection = inject(ActiveSectionService);
  private readonly sceneState = inject(SceneStateService);
  private readonly commands = inject(CommandPaletteState);

  private trigger: HTMLElement | null = null;

  protected readonly contact = CONTACT;
  protected readonly sections = SECTIONS;
  protected readonly menuOpen = signal(false);
  protected readonly reducedMotion = this.motionService.reducedMotion;
  protected readonly activeId = this.activeSection.activeId;

  /** Compact state: the bar tightens once the reader leaves the hero. */
  protected readonly compact = this.sceneState.scrolled;

  /** Drives the 2px scroll indicator under the bar. */
  protected readonly progressWidth = computed(
    () => `${(this.sceneState.scrollProgress() * 100).toFixed(2)}%`,
  );

  protected openMenu(event: Event): void {
    this.trigger = event.currentTarget as HTMLElement;
    this.menuOpen.set(true);
  }

  /** Focus returns to the button that opened the menu. */
  protected closeMenu(): void {
    this.menuOpen.set(false);
    this.trigger?.focus();
    this.trigger = null;
  }

  protected openCommands(): void {
    this.commands.toggle();
  }

  protected toggleMotion(): void {
    this.motionService.toggle();
  }
}
