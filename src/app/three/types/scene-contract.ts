/**
 * The contract between Angular and the 3D engine.
 *
 * Plain data only — no Angular types, no Three.js types in the inbound
 * direction. Both sides depend on this file and on nothing of each other's.
 */

export type QualityTier = 'full' | 'lite' | 'static';

export type ChapterId = 'hero' | 'experience' | 'projects' | 'skills' | 'contact';

export type StratumId = 'client' | 'application' | 'services' | 'data-cloud';

/**
 * A semantic anchor in the architecture graph.
 *
 * Angular derives these from the site's content data and hands them to the
 * engine, so the engine never reads application content or the DOM. `id`
 * matches the skill id used by the DOM, which is what makes the skills
 * interaction a pure data lookup rather than a selector query.
 */
export interface AnchorSpec {
  readonly id: string;
  readonly label: string;
  readonly stratum: StratumId;
  /** Relative visual importance, 0..1. Drives node scale and emissiveness. */
  readonly weight: number;
}

/** Everything the engine needs to build the graph. */
export interface GraphSpec {
  readonly anchors: readonly AnchorSpec[];
  /** Total node budget for the current tier, anchors included. */
  readonly nodeBudget: number;
}

/** Snapshot pushed from Angular into the engine. Read once per frame. */
export interface SceneInput {
  readonly tier: QualityTier;
  readonly reducedMotion: boolean;
  /** Normalized 0..1 document scroll progress, from the single scroll authority. */
  readonly scrollProgress: number;
  readonly chapter: ChapterId;
  /** Progress 0..1 through the active chapter. */
  readonly chapterProgress: number;
  /** Anchor id highlighted from the DOM (hover or keyboard focus), or null. */
  readonly highlightedAnchor: string | null;
  /** Stratum to emphasise wholesale, or null. */
  readonly highlightedStratum: StratumId | null;
  /** Project slug focused in the DOM, or null. */
  readonly focusedProject: string | null;
  /** Damped pointer position in -1..1, already smoothed by Angular. */
  readonly pointer: { readonly x: number; readonly y: number };
}

/** Telemetry the engine reports back. Read by the debug overlay and tests. */
export interface SceneReport {
  readonly fps: number;
  readonly drawCalls: number;
  readonly triangles: number;
  readonly geometries: number;
  readonly textures: number;
  readonly programs: number;
  readonly nodeCount: number;
  readonly edgeCount: number;
  readonly packetCount: number;
  readonly devicePixelRatio: number;
  readonly tier: QualityTier;
  readonly bloom: boolean;
  readonly running: boolean;
  /** Live input echo — lets a test assert the DOM → 3D bridge actually landed. */
  readonly chapter: ChapterId;
  readonly highlightedAnchor: string | null;
  readonly highlightedStratum: StratumId | null;
  readonly emphasisedNodes: number;
  /** World-space extents of the graph, for composition verification. */
  readonly bounds: { x: [number, number]; y: [number, number] };
}

/** What the Angular bridge is allowed to call. */
export interface SceneEngine {
  update(input: SceneInput): void;
  resize(): void;
  /** Renders exactly one frame, then stops. Used by static/reduced-motion mode. */
  renderStill(): void;
  start(): void;
  pause(): void;
  dispose(): void;
  readonly report: SceneReport;
}

export interface EngineOptions {
  readonly canvas: HTMLCanvasElement;
  readonly graph: GraphSpec;
  readonly tier: QualityTier;
  readonly reducedMotion: boolean;
  /** Called if the WebGL context is lost and recovery is not attempted. */
  readonly onFatal: (reason: string) => void;
}
