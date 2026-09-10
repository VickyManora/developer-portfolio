import type { ChapterId, SceneInput, StratumId } from '../../types/scene-contract';

/** What a chapter asks the scene to look like on a given frame. */
export interface ChapterState {
  /** Camera position target in world space. */
  readonly camera: { x: number; y: number; z: number };
  /** Camera look-at target. */
  readonly target: { x: number; y: number; z: number };
  /** Strata to emphasise, with 0..1 amount. */
  readonly strata: ReadonlyMap<StratumId, number>;
  /** Anchor ids to emphasise, with 0..1 amount. */
  readonly anchors: ReadonlyMap<string, number>;
  /** 0..1 multiplier on packet flow. */
  readonly flow: number;
  /** 0..1 multiplier on perimeter and grid presence. */
  readonly ambient: number;
  /**
   * 0..1 reveal of the double helix.
   *
   * The helix is its own geometry rather than a re-layout of the graph — see
   * helix-strand.ts for why. As it reveals, the lattice recedes, so the two
   * read as one system resolving into another form rather than as two scenes.
   */
  readonly helix: number;
}

/**
 * A chapter is a pure function of scene input.
 *
 * Deliberately stateless: chapters compute a target every frame and the scene
 * eases toward it, so switching chapters mid-transition can never leave the
 * camera stranded in an in-between pose — which matters for the reduced-motion
 * requirement that the composition settle immediately.
 */
export interface SceneChapter {
  readonly id: ChapterId;
  enter(): void;
  /** `progress` is 0..1 through this chapter. */
  update(progress: number, input: SceneInput): ChapterState;
  leave(): void;
  dispose(): void;
}

/**
 * Writable view used while a chapter composes its frame. The public
 * `ChapterState` stays readonly so the scene cannot mutate what a chapter
 * returned.
 */
export interface MutableChapterState {
  camera: { x: number; y: number; z: number };
  target: { x: number; y: number; z: number };
  strata: Map<StratumId, number>;
  anchors: Map<string, number>;
  flow: number;
  ambient: number;
  helix: number;
}

/**
 * Base for the stateless chapters.
 *
 * Every chapter in this scene is a pure function of scene input — they hold no
 * resources, so `enter`, `leave` and `dispose` have nothing to do. Declaring
 * that once here keeps the five implementations down to their `update` method,
 * which is the only part that differs.
 */
export abstract class StatelessChapter implements SceneChapter {
  abstract readonly id: ChapterId;
  abstract update(progress: number, input: SceneInput): ChapterState;

  enter(): void {
    // Stateless: nothing to allocate on entry.
  }

  leave(): void {
    // Stateless: nothing to release on exit.
  }

  dispose(): void {
    // Stateless: the scene owns all GPU resources, not the chapters.
  }
}

export function emptyState(): ChapterState {
  return {
    camera: { x: 0, y: 0, z: 16 },
    target: { x: 0, y: 0, z: 0 },
    strata: new Map(),
    anchors: new Map(),
    flow: 1,
    ambient: 1,
    helix: 0,
  };
}
