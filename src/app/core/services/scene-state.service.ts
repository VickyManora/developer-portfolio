import { computed, inject, Injectable, signal } from '@angular/core';
import { DeviceCapabilityService } from './device-capability.service';
import { MotionPreferenceService } from './motion-preference.service';

/**
 * The single signal surface the 3D layer reads each frame.
 *
 * Deliberately framework-facing but engine-agnostic: it holds no Three.js
 * types, and the engine never imports Angular. The bridge service is the only
 * place the two meet.
 */
@Injectable({ providedIn: 'root' })
export class SceneStateService {
  private readonly capability = inject(DeviceCapabilityService);
  private readonly motion = inject(MotionPreferenceService);

  /** Section id currently in view. Drives the scene's chapter selection. */
  readonly activeSection = signal<string>('hero');

  /**
   * Normalized 0..1 document scroll progress.
   * Written by ScrollService before the motion engine loads, then by
   * MotionService's single ScrollTrigger once it does.
   */
  readonly scrollProgress = signal(0);

  /** True once the page has scrolled past the header's compact threshold. */
  readonly scrolled = signal(false);

  /** Skill id hovered or focused in the DOM; highlights the matching 3D anchor. */
  readonly hoveredSkill = signal<string | null>(null);

  /** Project slug focused in the DOM. Reserved for project-focused scene states. */
  readonly focusedProject = signal<string | null>(null);

  readonly qualityTier = computed(() => this.capability.tier());
  readonly reducedMotion = computed(() => this.motion.reducedMotion());
  readonly sceneEnabled = computed(() => this.capability.canRenderScene());

  setActiveSection(id: string): void {
    this.activeSection.set(id);
  }
}
