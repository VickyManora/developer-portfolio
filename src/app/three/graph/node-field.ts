import {
  Color,
  DynamicDrawUsage,
  InstancedMesh,
  MeshBasicMaterial,
  Object3D,
  OctahedronGeometry,
} from 'three';
import type { SystemGraph } from './graph-model';
import { SCENE_PALETTE } from '../config/palette';

/**
 * Every graph node in ONE draw call.
 *
 * An InstancedMesh of a zero-subdivision octahedron: 8 triangles each, so even
 * the full 232-node budget costs ~1.9k triangles. Colour and scale are
 * per-instance attributes, which is what allows highlighting without rebuilding
 * geometry or adding draw calls.
 */
export class NodeField {
  readonly mesh: InstancedMesh;

  private readonly dummy = new Object3D();
  private readonly colour = new Color();
  private readonly baseScale: Float32Array;
  private readonly targetIntensity: Float32Array;
  private readonly currentIntensity: Float32Array;
  private readonly baseColour: Color[] = [];

  constructor(private readonly graph: SystemGraph) {
    const count = graph.nodes.length;
    const geometry = new OctahedronGeometry(0.075, 0);
    const material = new MeshBasicMaterial({ toneMapped: false, transparent: true, opacity: 0.95 });

    this.mesh = new InstancedMesh(geometry, material, count);
    this.mesh.instanceMatrix.setUsage(DynamicDrawUsage);
    this.mesh.frustumCulled = false;
    this.mesh.renderOrder = 2;

    this.baseScale = new Float32Array(count);
    this.targetIntensity = new Float32Array(count);
    this.currentIntensity = new Float32Array(count);

    for (const node of graph.nodes) {
      const scale = node.kind === 'anchor' ? 2.1 + node.weight * 1.0 : 0.6 + node.weight * 0.9;
      this.baseScale[node.index] = scale;

      const base =
        node.kind === 'anchor'
          ? SCENE_PALETTE.nodeAnchor
          : node.kind === 'cluster'
            ? SCENE_PALETTE.nodeCluster
            : SCENE_PALETTE.nodeMuted;
      this.baseColour[node.index] = new Color(base);

      this.dummy.position.set(node.x, node.y, node.z);
      this.dummy.scale.setScalar(scale);
      this.dummy.rotation.set(node.x, node.y, node.z);
      this.dummy.updateMatrix();
      this.mesh.setMatrixAt(node.index, this.dummy.matrix);
      this.mesh.setColorAt(node.index, this.baseColour[node.index]);
    }

    this.mesh.instanceMatrix.needsUpdate = true;
    if (this.mesh.instanceColor) this.mesh.instanceColor.needsUpdate = true;
  }

  /** Requests emphasis on a set of nodes. Applied smoothly by `update`. */
  setEmphasis(indices: readonly number[] | undefined, amount: number): void {
    if (!indices) return;
    for (const index of indices) {
      this.targetIntensity[index] = Math.max(this.targetIntensity[index], amount);
    }
  }

  clearEmphasis(): void {
    this.targetIntensity.fill(0);
  }

  /**
   * Eases current toward target and writes colour/scale.
   *
   * Only instances whose intensity actually changed are rewritten, so a still
   * scene costs almost nothing even though the buffer is dynamic.
   */
  update(delta: number, highlightWarm: ReadonlySet<number>): void {
    const ease = 1 - Math.exp(-delta * 9);
    let dirtyColour = false;
    let dirtyMatrix = false;

    for (let i = 0; i < this.currentIntensity.length; i++) {
      const target = this.targetIntensity[i];
      const current = this.currentIntensity[i];
      if (Math.abs(target - current) < 0.002) {
        if (current !== target) this.currentIntensity[i] = target;
        continue;
      }

      const next = current + (target - current) * ease;
      this.currentIntensity[i] = next;

      const accent = highlightWarm.has(i) ? SCENE_PALETTE.nodeHighlight : SCENE_PALETTE.nodeActive;
      this.colour.copy(this.baseColour[i]).lerp(new Color(accent), next);
      this.mesh.setColorAt(i, this.colour);
      dirtyColour = true;

      const node = this.graph.nodes[i];
      this.dummy.position.set(node.x, node.y, node.z);
      this.dummy.scale.setScalar(this.baseScale[i] * (1 + next * 0.55));
      this.dummy.rotation.set(node.x, node.y, node.z);
      this.dummy.updateMatrix();
      this.mesh.setMatrixAt(i, this.dummy.matrix);
      dirtyMatrix = true;
    }

    if (dirtyColour && this.mesh.instanceColor) this.mesh.instanceColor.needsUpdate = true;
    if (dirtyMatrix) this.mesh.instanceMatrix.needsUpdate = true;
  }

  dispose(): void {
    this.mesh.geometry.dispose();
    (this.mesh.material as MeshBasicMaterial).dispose();
    this.mesh.dispose();
  }
}
