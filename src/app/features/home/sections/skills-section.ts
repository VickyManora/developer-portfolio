import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { PRIMARY_SKILLS, SKILL_GROUPS } from '../../../content/skills.data';
import { SceneStateService } from '../../../core/services/scene-state.service';
import { ObservedSection } from '../../../shared/directives/observed-section.directive';
import { SectionHeader } from '../../../shared/ui/section-header/section-header';
import { Reveal } from '../../../shared/directives/reveal.directive';
import { RevealGroup } from '../../../shared/directives/reveal-group.directive';

/**
 * The tech arsenal.
 *
 * Two reading levels: the frontend core the portfolio leads with, then the
 * supporting stack grouped by role. No proficiency bars, no percentages, no
 * years-per-technology — the resume states none, so neither does this.
 *
 * Every skill is a real <button>. That is what makes pointer and keyboard
 * behave identically: hover and focus both preview a technology, click and
 * Enter/Space both pin it. Nothing here requires a mouse, and nothing requires
 * the 3D scene — the highlight is a progressive enhancement over a list that is
 * already complete.
 */
@Component({
  selector: 'app-skills-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionHeader, ObservedSection, Reveal, RevealGroup],
  templateUrl: './skills-section.html',
  styleUrl: './skills-section.scss',
})
export class SkillsSection {
  private readonly sceneState = inject(SceneStateService);

  protected readonly primary = PRIMARY_SKILLS;

  /**
   * The supporting stack: every group with its primary skills removed, since
   * those are already featured above. A group left with nothing is dropped
   * rather than rendered as an empty row.
   */
  protected readonly groups = SKILL_GROUPS.map((group) => ({
    ...group,
    skills: group.skills.filter((skill) => skill.emphasis !== 'primary'),
  })).filter((group) => group.skills.length > 0);

  /** Pinned by click or Enter. Survives the pointer leaving. */
  private readonly pinned = signal<string | null>(null);
  /** Previewed by hover or focus. Transient. */
  private readonly previewed = signal<string | null>(null);

  protected readonly active = computed(() => this.previewed() ?? this.pinned());

  constructor() {
    // One writer to the scene bridge, so preview and pin can never disagree.
    // The scene reads this; it never reads the DOM.
    queueMicrotask(() => this.sync());
  }

  protected preview(id: string | null): void {
    this.previewed.set(id);
    this.sync();
  }

  protected toggle(id: string): void {
    this.pinned.update((current) => (current === id ? null : id));
    this.sync();
  }

  protected isActive(id: string): boolean {
    return this.active() === id;
  }

  protected isPinned(id: string): boolean {
    return this.pinned() === id;
  }

  private sync(): void {
    this.sceneState.hoveredSkill.set(this.active());
  }
}
