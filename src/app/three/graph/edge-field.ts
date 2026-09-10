import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  LineSegments,
  ShaderMaterial,
} from 'three';
import type { SystemGraph } from './graph-model';
import { SCENE_PALETTE } from '../config/palette';

/**
 * Every edge in ONE draw call.
 *
 * A single merged BufferGeometry of line segments rather than one Line object
 * per edge — several hundred Line objects would be several hundred draw calls.
 * Per-vertex attributes carry each edge's base strength and its emphasis, so
 * highlighting writes a small typed array instead of touching materials.
 *
 * WebGL line width is capped at 1px on every desktop driver, which suits the
 * hairline aesthetic; no attempt is made to fake thickness with quads.
 */
export class EdgeField {
  readonly lines: LineSegments;

  private readonly emphasis: Float32Array;
  private readonly attribute: BufferAttribute;
  private readonly current: Float32Array;
  private readonly targets: Float32Array;

  constructor(private readonly graph: SystemGraph) {
    const edgeCount = graph.edges.length;
    const positions = new Float32Array(edgeCount * 6);
    const strengths = new Float32Array(edgeCount * 2);
    this.emphasis = new Float32Array(edgeCount * 2);
    this.current = new Float32Array(edgeCount);
    this.targets = new Float32Array(edgeCount);

    graph.edges.forEach((edge, i) => {
      const a = graph.nodes[edge.from];
      const b = graph.nodes[edge.to];
      positions.set([a.x, a.y, a.z, b.x, b.y, b.z], i * 6);
      strengths[i * 2] = edge.strength;
      strengths[i * 2 + 1] = edge.strength;
    });

    const geometry = new BufferGeometry();
    geometry.setAttribute('position', new BufferAttribute(positions, 3));
    geometry.setAttribute('aStrength', new BufferAttribute(strengths, 1));
    this.attribute = new BufferAttribute(this.emphasis, 1);
    geometry.setAttribute('aEmphasis', this.attribute);

    const material = new ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
      toneMapped: false,
      uniforms: {
        uBase: { value: new Color(SCENE_PALETTE.edge) },
        uActive: { value: new Color(SCENE_PALETTE.edgeActive) },
        uOpacity: { value: 1.0 },
        uRecede: { value: 0 },
        uFogDensity: { value: 0.055 },
        uFogColor: { value: new Color(SCENE_PALETTE.fog) },
      },
      vertexShader: /* glsl */ `
        attribute float aStrength;
        attribute float aEmphasis;
        varying float vStrength;
        varying float vEmphasis;
        varying float vDepth;

        void main() {
          vStrength = aStrength;
          vEmphasis = aEmphasis;
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          vDepth = -mv.z;
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: /* glsl */ `
        precision mediump float;
        uniform vec3 uBase;
        uniform vec3 uActive;
        uniform float uOpacity;
        uniform float uRecede;
        uniform float uFogDensity;
        uniform vec3 uFogColor;
        varying float vStrength;
        varying float vEmphasis;
        varying float vDepth;

        void main() {
          vec3 colour = mix(uBase, uActive, vEmphasis);
          float alpha = uOpacity * (0.62 + vStrength * 0.6 + vEmphasis * 0.8) * (1.0 - uRecede * 0.86);

          // Exponential-squared fog, matched to the scene fog so edges recede
          // with everything else rather than floating in front of it.
          float f = 1.0 - exp(-uFogDensity * uFogDensity * vDepth * vDepth);
          colour = mix(colour, uFogColor, clamp(f, 0.0, 1.0));
          alpha *= 1.0 - clamp(f, 0.0, 1.0);

          if (alpha < 0.004) discard;
          gl_FragColor = vec4(colour, alpha);
        }
      `,
    });

    this.lines = new LineSegments(geometry, material);
    this.lines.frustumCulled = false;
    this.lines.renderOrder = 1;
  }

  setRecede(value: number): void {
    (this.lines.material as ShaderMaterial).uniforms['uRecede'].value = value;
  }

  setFogDensity(value: number): void {
    (this.lines.material as ShaderMaterial).uniforms['uFogDensity'].value = value;
  }

  /** Emphasises every edge touching one of the given nodes. */
  emphasiseNodes(nodeIndices: ReadonlySet<number>, amount: number): void {
    if (nodeIndices.size === 0) return;
    this.graph.edges.forEach((edge, i) => {
      if (nodeIndices.has(edge.from) || nodeIndices.has(edge.to)) {
        this.targets[i] = Math.max(this.targets[i], amount);
      }
    });
  }

  /** Called once per frame before emphasis is re-applied for the new state. */
  resetTargets(): void {
    this.targets.fill(0);
  }

  update(delta: number): void {
    const ease = 1 - Math.exp(-delta * 8);
    let dirty = false;
    for (let i = 0; i < this.current.length; i++) {
      const target = this.targets[i];
      const value = this.current[i];
      if (Math.abs(target - value) < 0.003) continue;
      const next = value + (target - value) * ease;
      this.current[i] = next;
      this.emphasis[i * 2] = next;
      this.emphasis[i * 2 + 1] = next;
      dirty = true;
    }
    if (dirty) this.attribute.needsUpdate = true;
  }

  dispose(): void {
    this.lines.geometry.dispose();
    (this.lines.material as ShaderMaterial).dispose();
  }
}
