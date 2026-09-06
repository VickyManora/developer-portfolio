import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  OnDestroy,
  viewChild,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { DeviceCapabilityService } from '../../../core/services/device-capability.service';
import { SceneDirectorService } from '../../../core/three/scene-director.service';
import { ThreeEngineService } from '../../../core/three/three-engine.service';
import { IS_BROWSER } from '../../../core/tokens/platform.tokens';
import { SystemBackdrop } from '../../../shared/ui/system-backdrop/system-backdrop';

/**
 * Host for the persistent system-core canvas.
 *
 * Two responsibilities and nothing else: own the canvas element's lifecycle,
 * and decide between the live scene and the static fallback.
 *
 * The fallback is not a placeholder — it is the Phase 2 SVG architecture
 * composition, which was the site's designed background before WebGL existed.
 * A visitor without WebGL gets a deliberate graphic, never a blank canvas or an
 * error.
 *
 * Prerendered HTML always contains the fallback, so a crawler and a
 * JavaScript-less visitor see the composed page.
 */
@Component({
  selector: 'app-system-canvas',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SystemBackdrop],
  templateUrl: './system-canvas.html',
  styleUrl: './system-canvas.scss',
  host: { 'aria-hidden': 'true', class: 'stage' },
})
export class SystemCanvas implements AfterViewInit, OnDestroy {
  private readonly engine = inject(ThreeEngineService);
  private readonly director = inject(SceneDirectorService);
  private readonly capability = inject(DeviceCapabilityService);
  private readonly document = inject(DOCUMENT);
  private readonly isBrowser = inject(IS_BROWSER);

  private readonly canvasRef = viewChild<ElementRef<HTMLCanvasElement>>('canvas');
  private pointerHandler: ((event: PointerEvent) => void) | null = null;
  private pointerFrame = 0;

  protected readonly status = this.engine.status;

  /**
   * The canvas is present when WebGL may be used, and STAYS present once an
   * engine has mounted — including after motion is switched off mid-session,
   * where the engine settles to a still frame rather than being torn out.
   */
  protected readonly canUseWebgl = computed(
    () =>
      this.isBrowser &&
      this.status() !== 'failed' &&
      (this.capability.canRenderScene() || this.engine.mounted()),
  );

  /**
   * The static composition holds until the engine has actually produced a
   * frame, and returns permanently if the engine fails or is unavailable.
   */
  protected readonly showFallback = computed(
    () => this.status() !== 'running' && this.status() !== 'still',
  );

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;
    const canvas = this.canvasRef()?.nativeElement;
    if (canvas) this.engine.scheduleMount(canvas);
    this.attachPointer();
  }

  ngOnDestroy(): void {
    this.detachPointer();
    // Explicit teardown on leaving the homepage: no renderer is left running
    // behind a case-study route.
    this.engine.teardown();
  }

  /**
   * Damped pointer parallax.
   *
   * A pointermove listener, not a scroll listener — it adds no second scroll
   * authority. Coalesced to one rAF so a fast mouse cannot flood the engine.
   */
  private attachPointer(): void {
    const view = this.document.defaultView;
    if (!view || !this.capability.canRenderScene()) return;
    if (view.matchMedia('(pointer: coarse)').matches) return;

    this.pointerHandler = (event: PointerEvent) => {
      if (this.pointerFrame) return;
      this.pointerFrame = view.requestAnimationFrame(() => {
        this.pointerFrame = 0;
        const x = (event.clientX / view.innerWidth) * 2 - 1;
        const y = (event.clientY / view.innerHeight) * 2 - 1;
        this.director.setPointer(x, y);
      });
    };

    view.addEventListener('pointermove', this.pointerHandler, { passive: true });
  }

  private detachPointer(): void {
    const view = this.document.defaultView;
    if (view && this.pointerHandler) {
      view.removeEventListener('pointermove', this.pointerHandler);
      if (this.pointerFrame) view.cancelAnimationFrame(this.pointerFrame);
    }
    this.pointerHandler = null;
    this.pointerFrame = 0;
  }
}
