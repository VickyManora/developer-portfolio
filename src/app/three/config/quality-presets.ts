import type { QualityTier } from '../types/scene-contract';

/**
 * Rendering budgets per tier.
 *
 * The engine reads these; it never decides its own tier — Angular's capability
 * service owns that call, so there is exactly one place that answers "how much
 * machine do we have".
 *
 * DPR caps were chosen after measuring: 2.0 on FULL showed no frame-time
 * headroom loss on the reference desktop, while LITE at 1.5 keeps a mid-range
 * phone inside its frame budget.
 */
export interface QualityPreset {
  readonly nodeBudget: number;
  readonly edgesPerNode: number;
  readonly packetCount: number;
  readonly maxDevicePixelRatio: number;
  readonly antialias: boolean;
  readonly bloom: boolean;
  readonly pointerParallax: boolean;
  readonly groundGrid: boolean;
  readonly perimeter: boolean;
  /** Fog density: more on lite, to hide the smaller graph's edges. */
  readonly fogDensity: number;
}

export const QUALITY_PRESETS: Record<QualityTier, QualityPreset> = {
  full: {
    nodeBudget: 232,
    edgesPerNode: 2,
    packetCount: 260,
    maxDevicePixelRatio: 2,
    antialias: true,
    // Deliberately off — see three/README.md. An in-shader radial falloff on the
    // accent nodes gives the glow without a post-processing pass.
    bloom: false,
    pointerParallax: true,
    groundGrid: true,
    perimeter: true,
    fogDensity: 0.055,
  },
  lite: {
    nodeBudget: 84,
    edgesPerNode: 1,
    packetCount: 70,
    maxDevicePixelRatio: 1.5,
    antialias: false,
    bloom: false,
    pointerParallax: false,
    groundGrid: false,
    perimeter: false,
    fogDensity: 0.075,
  },
  static: {
    nodeBudget: 84,
    edgesPerNode: 1,
    packetCount: 0,
    maxDevicePixelRatio: 1.5,
    antialias: false,
    bloom: false,
    pointerParallax: false,
    groundGrid: false,
    perimeter: false,
    fogDensity: 0.07,
  },
};

/** Hard ceilings asserted by the performance report. */
export const RENDER_BUDGET = {
  maxDrawCalls: 30,
  maxTriangles: 60_000,
  targetFrameMs: 16.6,
  /** Sustained FPS below this triggers a one-way downgrade to LITE. */
  downgradeFpsThreshold: 45,
  downgradeSustainedMs: 2000,
} as const;
