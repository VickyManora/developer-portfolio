import { Color, FogExp2, Group, PerspectiveCamera, Scene, Vector3 } from 'three';
import { buildGraph, type SystemGraph } from '../graph/graph-model';
import { NodeField } from '../graph/node-field';
import { EdgeField } from '../graph/edge-field';
import { FlowField } from '../graph/flow-field';
import { GroundGrid } from '../graph/ground-grid';
import { Perimeter } from '../graph/perimeter';
import { SCENE_PALETTE } from '../config/palette';
import { QUALITY_PRESETS, type QualityPreset } from '../config/quality-presets';
import type { ChapterId, GraphSpec, SceneInput, StratumId } from '../types/scene-contract';
import { createChapters } from './chapters/system-chapters';
import type { SceneChapter } from './chapters/chapter';

/**
 * The one persistent scene. Built once, never rebuilt as the reader scrolls.
 *
 * Chapters change camera pose and emphasis; geometry is untouched. That is the
 * whole reason the scene can be both expressive and cheap.
 */
export class SystemCoreScene {
  readonly scene = new Scene();
  readonly camera: PerspectiveCamera;
  readonly graph: SystemGraph;

  private readonly root = new Group();
  private readonly nodes: NodeField;
  private readonly edges: EdgeField;
  private readonly flow: FlowField | null;
  private readonly grid: GroundGrid | null;
  private readonly perimeter: Perimeter | null;

  private readonly chapters = new Map<ChapterId, SceneChapter>();
  private activeChapter: ChapterId = 'hero';

  private readonly cameraTarget = new Vector3(0, 0.6, 15.4);
  private readonly lookTarget = new Vector3();
  private readonly currentLook = new Vector3();

  private readonly warmSet = new Set<number>();
  private readonly emphasisNodes = new Set<number>();

  constructor(
    spec: GraphSpec,
    private readonly preset: QualityPreset,
  ) {
    this.graph = buildGraph(spec, preset.edgesPerNode);

    this.scene.background = new Color(SCENE_PALETTE.background);
    this.scene.fog = new FogExp2(SCENE_PALETTE.fog, preset.fogDensity);

    this.camera = new PerspectiveCamera(38, 1, 0.1, 90);
    this.camera.position.copy(this.cameraTarget);

    this.nodes = new NodeField(this.graph);
    this.edges = new EdgeField(this.graph);
    this.edges.setFogDensity(preset.fogDensity);

    this.root.add(this.nodes.mesh, this.edges.lines);

    this.flow = preset.packetCount > 0 ? new FlowField(this.graph, preset.packetCount) : null;
    if (this.flow) this.root.add(this.flow.points);

    this.grid = preset.groundGrid ? new GroundGrid() : null;
    if (this.grid) this.root.add(this.grid.mesh);

    this.perimeter = preset.perimeter ? new Perimeter() : null;
    if (this.perimeter) this.root.add(this.perimeter.lines);

    // A fixed, slight three-quarter tilt. The scene never rotates at runtime;
    // the camera moves instead, which keeps the architecture legible.
    //
    // Offset to the right so the graph occupies the half of the viewport the
    // text column does not, rather than sitting behind the copy where the
    // contrast scrim would erase it.
    this.root.rotation.set(0.07, -0.26, 0);
    this.root.position.set(3.6, 0, 0);
    this.scene.add(this.root);

    for (const chapter of createChapters()) this.chapters.set(chapter.id, chapter);
  }

  get nodeCount(): number {
    return this.graph.nodes.length;
  }

  get edgeCount(): number {
    return this.graph.edges.length;
  }

  /** World-space extents of the graph including the root offset. */
  get bounds(): { x: [number, number]; y: [number, number] } {
    const xs = this.graph.nodes.map((n) => n.x + this.root.position.x);
    const ys = this.graph.nodes.map((n) => n.y + this.root.position.y);
    return {
      x: [Math.min(...xs), Math.max(...xs)],
      y: [Math.min(...ys), Math.max(...ys)],
    };
  }

  /** Number of nodes currently carrying emphasis. Telemetry only. */
  get emphasisedNodeCount(): number {
    return this.emphasisNodes.size;
  }

  get packetCount(): number {
    return this.flow ? Math.min(this.preset.packetCount, this.graph.edges.length) : 0;
  }

  setPixelRatio(ratio: number): void {
    this.flow?.setPixelRatio(ratio);
  }

  setAspect(width: number, height: number): void {
    this.camera.aspect = width / Math.max(height, 1);
    this.camera.updateProjectionMatrix();
  }

  /**
   * Advances the scene one frame.
   *
   * `immediate` snaps everything to its target instead of easing — used for the
   * single still frame rendered in static / reduced-motion mode, so the
   * composition is never captured mid-transition.
   */
  update(delta: number, elapsed: number, input: SceneInput, immediate = false): void {
    const chapter = this.chapters.get(input.chapter) ?? this.chapters.get('hero');
    if (!chapter) return;

    if (chapter.id !== this.activeChapter) {
      this.chapters.get(this.activeChapter)?.leave();
      chapter.enter();
      this.activeChapter = chapter.id;
    }

    const state = chapter.update(input.chapterProgress, input);

    // --- Camera -------------------------------------------------------------
    this.cameraTarget.set(state.camera.x, state.camera.y, state.camera.z);
    this.lookTarget.set(state.target.x, state.target.y, state.target.z);
    const ease = immediate ? 1 : 1 - Math.exp(-delta * 2.4);
    this.camera.position.lerp(this.cameraTarget, ease);
    this.currentLook.lerp(this.lookTarget, ease);
    this.camera.lookAt(this.currentLook);

    // --- Emphasis -----------------------------------------------------------
    this.nodes.clearEmphasis();
    this.edges.resetTargets();
    this.emphasisNodes.clear();
    this.warmSet.clear();

    for (const [stratum, amount] of state.strata) {
      if (amount <= 0.001) continue;
      const indices = this.graph.strataIndex.get(stratum as StratumId);
      if (!indices) continue;
      this.nodes.setEmphasis(indices, amount);
      if (amount > 0.4) for (const index of indices) this.emphasisNodes.add(index);
    }

    for (const [anchorId, amount] of state.anchors) {
      const cluster = this.graph.anchorClusters.get(anchorId);
      const anchor = this.graph.anchorIndex.get(anchorId);
      if (cluster) {
        this.nodes.setEmphasis(cluster, amount * 0.8);
        for (const index of cluster) this.emphasisNodes.add(index);
      }
      if (anchor !== undefined) {
        this.nodes.setEmphasis([anchor], amount);
        this.emphasisNodes.add(anchor);
        // The warm accent marks a DOM-driven highlight, and only that.
        this.warmSet.add(anchor);
        if (cluster) for (const index of cluster) this.warmSet.add(index);
      }
    }

    this.edges.emphasiseNodes(this.emphasisNodes, 0.75);

    this.nodes.update(immediate ? 1 : delta, this.warmSet);
    this.edges.update(immediate ? 1 : delta);

    // --- Ambient ------------------------------------------------------------
    if (this.flow) {
      this.flow.setIntensity(input.reducedMotion ? 0 : state.flow);
      if (!input.reducedMotion) this.flow.advance(elapsed);
    }
    this.grid?.setOpacity(state.ambient);
    this.perimeter?.update(input.reducedMotion ? 0 : elapsed, state.ambient);
  }

  dispose(): void {
    for (const chapter of this.chapters.values()) chapter.dispose();
    this.chapters.clear();

    this.nodes.dispose();
    this.edges.dispose();
    this.flow?.dispose();
    this.grid?.dispose();
    this.perimeter?.dispose();

    this.root.clear();
    this.scene.clear();
    this.scene.background = null;
    this.scene.fog = null;
  }
}

export { QUALITY_PRESETS };
