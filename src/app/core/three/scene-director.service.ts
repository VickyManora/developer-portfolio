import { computed, inject, Injectable, signal } from '@angular/core';
import { SKILL_GROUPS } from '../../content/skills.data';
import { SceneStateService } from '../services/scene-state.service';
import { DeviceCapabilityService } from '../services/device-capability.service';
import type {
  AnchorSpec,
  ChapterId,
  GraphSpec,
  SceneInput,
  StratumId,
} from '../../three/types/scene-contract';
import { QUALITY_PRESETS } from '../../three/config/quality-presets';

/**
 * Translates Angular state into the engine's input contract.
 *
 * This is Phase 4 infrastructure, not a later phase: it sits between
 * SceneStateService (which the single scroll authority writes) and
 * ThreeEngineService (which owns the engine). It never touches Three.js types
 * and never reads the DOM.
 *
 *   native scroll → ScrollTrigger → SceneStateService
 *                                 → SceneDirectorService → ThreeEngineService → engine
 */
@Injectable({ providedIn: 'root' })
export class SceneDirectorService {
  private readonly sceneState = inject(SceneStateService);
  private readonly capability = inject(DeviceCapabilityService);

  /** Damped pointer, written by the canvas host. Not a scroll source. */
  private readonly pointer = signal<{ x: number; y: number }>({ x: 0, y: 0 });

  /**
   * Maps the site's DOM section ids onto the five scene chapters. Sections
   * without a chapter of their own borrow the nearest relevant one, so every
   * scroll position has a defined scene state.
   */
  private static readonly SECTION_TO_CHAPTER: Record<string, ChapterId> = {
    hero: 'hero',
    intro: 'hero',
    experience: 'experience',
    work: 'projects',
    skills: 'skills',
    strengths: 'skills',
    education: 'contact',
    contact: 'contact',
  };

  private static readonly CHAPTER_ORDER: readonly ChapterId[] = [
    'hero',
    'experience',
    'projects',
    'skills',
    'contact',
  ];

  /** Layer id in the content model → stratum id in the scene. */
  private static readonly LAYER_TO_STRATUM: Record<string, StratumId> = {
    client: 'client',
    application: 'application',
    services: 'services',
    'data-cloud': 'data-cloud',
    // Delivery and quality tooling lives with the services stratum, matching
    // the approved architecture model.
    delivery: 'services',
  };

  readonly chapter = computed<ChapterId>(
    () => SceneDirectorService.SECTION_TO_CHAPTER[this.sceneState.activeSection()] ?? 'hero',
  );

  /**
   * Progress through the active chapter.
   *
   * Derived from the same normalized document progress the rail uses, so the
   * scene and the 2D page can never disagree about where the reader is.
   */
  readonly chapterProgress = computed(() => {
    const chapters = SceneDirectorService.CHAPTER_ORDER;
    const index = chapters.indexOf(this.chapter());
    if (index < 0) return 0;
    const span = 1 / chapters.length;
    const local = (this.sceneState.scrollProgress() - index * span) / span;
    return Math.min(1, Math.max(0, local));
  });

  readonly input = computed<SceneInput>(() => ({
    tier: this.capability.tier(),
    reducedMotion: this.sceneState.reducedMotion(),
    scrollProgress: this.sceneState.scrollProgress(),
    chapter: this.chapter(),
    chapterProgress: this.chapterProgress(),
    highlightedAnchor: this.sceneState.hoveredSkill(),
    highlightedStratum: this.highlightedStratum(),
    focusedProject: this.sceneState.focusedProject(),
    pointer: this.pointer(),
  }));

  private readonly highlightedStratum = computed<StratumId | null>(() => {
    const skillId = this.sceneState.hoveredSkill();
    if (!skillId) return null;
    for (const group of SKILL_GROUPS) {
      if (group.skills.some((skill) => skill.id === skillId)) {
        return SceneDirectorService.LAYER_TO_STRATUM[group.layer] ?? null;
      }
    }
    return null;
  });

  /**
   * The graph specification, derived from the site's own skills content.
   *
   * Every named node in the scene is a technology Vicky actually lists. Nothing
   * is invented, and no client-specific topology is implied — the graph is a
   * model of an engineering ecosystem, not of any one delivered system.
   */
  buildGraphSpec(): GraphSpec {
    const anchors: AnchorSpec[] = [];
    for (const group of SKILL_GROUPS) {
      const stratum = SceneDirectorService.LAYER_TO_STRATUM[group.layer];
      if (!stratum) continue;
      for (const skill of group.skills) {
        anchors.push({
          id: skill.id,
          label: skill.name,
          stratum,
          // Nodes that also appear in the curated graph set read as primary.
          weight: skill.inGraph ? 1 : 0.45,
        });
      }
    }

    return {
      anchors,
      nodeBudget: QUALITY_PRESETS[this.capability.tier()].nodeBudget,
    };
  }

  setPointer(x: number, y: number): void {
    this.pointer.set({ x, y });
  }
}
