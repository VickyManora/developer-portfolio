import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SECTIONS } from '../../content/sections.data';
import { ActiveSectionService } from '../../core/services/active-section.service';
import { SceneStateService } from '../../core/services/scene-state.service';

/**
 * Desktop-only vertical section rail, styled as instrument gauges.
 *
 * It is real navigation (anchor links inside a labelled <nav>), so it is
 * keyboard reachable and announced properly — the instrument styling is
 * decoration on top of a conventional jump list, never a replacement for one.
 */
@Component({
  selector: 'app-layer-rail',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  templateUrl: './layer-rail.html',
  styleUrl: './layer-rail.scss',
})
export class LayerRail {
  private readonly activeSection = inject(ActiveSectionService);
  private readonly sceneState = inject(SceneStateService);

  protected readonly sections = SECTIONS.filter((section) => section.inRail);
  protected readonly activeId = this.activeSection.activeId;
  protected readonly progressPercent = computed(
    () => `${Math.round(this.sceneState.scrollProgress() * 100)}%`,
  );

  /** Scale factor for the progress fill. Transform only — never height. */
  protected readonly progressRatio = computed(() => this.sceneState.scrollProgress().toFixed(4));
}
