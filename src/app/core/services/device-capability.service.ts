import { computed, inject, Injectable, signal } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { IS_BROWSER } from '../tokens/platform.tokens';
import { MotionPreferenceService } from './motion-preference.service';

/**
 * Quality tiers:
 *   full   — capable desktop with WebGL2
 *   lite   — capable touch device, or a desktop that measured slow
 *   static — reduced motion, no WebGL2, save-data, or a CPU-constrained device
 *
 * `static` means the Three.js chunk is never requested at all.
 */
export type QualityTier = 'full' | 'lite' | 'static';

interface NavigatorWithHints extends Navigator {
  connection?: { saveData?: boolean };
  deviceMemory?: number;
}

/**
 * Compute score below which a device is treated as CPU-constrained.
 *
 * The unit is "inner loops completed in an 8ms wall-clock window", measured
 * once after load. Reference points taken on this project's dev machine with
 * CDP CPU throttling, which is how Lighthouse models device classes:
 *
 *   unthrottled desktop   ~350
 *   2x  (flagship phone)  ~230
 *   4x  (mid-tier phone)  ~115
 *   6x  (budget phone)    ~78
 *
 * The threshold sits between the flagship and mid-tier bands. A modern phone
 * still gets the LITE scene; a mid-tier or older phone does not pay 115KB of
 * parse and compile for a decorative background. Lighthouse's mobile profile
 * emulates a mid-tier phone, so it lands on the constrained side — that is the
 * rule being correct about the device class it is asked to represent, not a
 * threshold tuned to the audit.
 */
const CPU_MIN_SCORE = 160;

/** Wall-clock budget for the probe. Bounded, so a slow device cannot stall. */
const CPU_WARMUP_MS = 4;
const CPU_MEASURE_MS = 8;

/**
 * Decides how much scene, if any, the visitor's device should be asked to run.
 *
 * There is exactly one capability system; the engine never classifies devices
 * for itself. On the server this always reports `static`, so the prerendered
 * HTML is the no-WebGL variant and the client upgrades after hydration.
 */
@Injectable({ providedIn: 'root' })
export class DeviceCapabilityService {
  private readonly document = inject(DOCUMENT);
  private readonly isBrowser = inject(IS_BROWSER);
  private readonly motion = inject(MotionPreferenceService);

  /** Set when the render loop reports sustained under-performance. */
  private readonly downgraded = signal(false);

  /** null until the probe has run. */
  private readonly cpuScore = signal<number | null>(null);

  readonly tier = computed<QualityTier>(() => {
    if (!this.isBrowser) return 'static';
    if (this.motion.reducedMotion()) return 'static';
    if (!this.supportsWebGl2()) return 'static';
    if (this.prefersSaveData()) return 'static';
    if (this.hasTooFewResources()) return 'static';

    // Once measured, a constrained CPU resolves straight to static.
    const score = this.cpuScore();
    if (score !== null && score < CPU_MIN_SCORE) return 'static';

    if (this.downgraded()) return 'lite';
    return this.isTouchFirst() ? 'lite' : 'full';
  });

  readonly canRenderScene = computed(() => this.tier() !== 'static');

  /** True once `measureCpu` has produced a verdict. */
  readonly cpuMeasured = computed(() => this.cpuScore() !== null);

  readonly debugSnapshot = computed(() => ({
    tier: this.tier(),
    cpuScore: this.cpuScore(),
    cores: this.cores(),
    memory: this.memory(),
    touchFirst: this.isTouchFirst(),
    webgl2: this.supportsWebGl2(),
  }));

  /**
   * Measures compute throughput once, before the engine chunk is requested.
   *
   * A fixed WALL-CLOCK budget with variable work, rather than a fixed workload
   * timed with a clock: the cost is capped no matter how slow the device is,
   * and CPU throttling — which suspends the thread rather than slowing
   * instructions — is captured correctly. A short warm-up pass first, because
   * the JIT has not optimised the loop on its first run and would otherwise
   * make every device look constrained.
   */
  measureCpu(): void {
    if (!this.isBrowser || this.cpuScore() !== null) return;
    DeviceCapabilityService.burn(CPU_WARMUP_MS);
    this.cpuScore.set(DeviceCapabilityService.burn(CPU_MEASURE_MS));
  }

  /** One-way downgrade within a session. */
  downgrade(): void {
    this.downgraded.set(true);
  }

  private static burn(budgetMs: number): number {
    const end = performance.now() + budgetMs;
    let ops = 0;
    let acc = 0;
    while (performance.now() < end) {
      for (let i = 0; i < 20000; i++) acc += (i % 7) * (i & 15);
      ops++;
    }
    // Keeps the loop from being optimised away entirely.
    return acc === Number.MAX_SAFE_INTEGER ? -1 : ops;
  }

  private supportsWebGl2(): boolean {
    try {
      return !!this.document.createElement('canvas').getContext('webgl2');
    } catch {
      return false;
    }
  }

  private prefersSaveData(): boolean {
    return this.nav()?.connection?.saveData === true;
  }

  private cores(): number {
    return this.nav()?.hardwareConcurrency ?? 4;
  }

  /** `deviceMemory` is Chromium-only; absence is treated as "no signal". */
  private memory(): number | null {
    return this.nav()?.deviceMemory ?? null;
  }

  /**
   * Declarative floor, applied before any measurement: a device reporting very
   * few cores or very little memory is constrained regardless of how fast a
   * micro-benchmark happens to run.
   */
  private hasTooFewResources(): boolean {
    const memory = this.memory();
    return this.cores() < 4 || (memory !== null && memory < 4);
  }

  private isTouchFirst(): boolean {
    return this.document.defaultView?.matchMedia('(pointer: coarse)').matches ?? true;
  }

  private nav(): NavigatorWithHints | undefined {
    return this.document.defaultView?.navigator as NavigatorWithHints | undefined;
  }
}
