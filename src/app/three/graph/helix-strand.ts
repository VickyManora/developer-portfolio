import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  Mesh,
  ShaderMaterial,
} from 'three';
import { SCENE_PALETTE } from '../config/palette';
import { addTube, createSink } from '../utils/tube';

/**
 * The double helix shown during the Experience chapter.
 *
 * Purpose-built geometry rather than a re-layout of the architecture graph.
 * That earlier approach failed for a structural reason worth recording: a helix
 * reads because it is sparse and regular, and the graph is dense and irregular
 * by design. Coiling it produced a wave, then a tangle; thinning it to fix that
 * removed the connective tissue. Two strands and evenly spaced rungs need to be
 * *built*, not borrowed.
 *
 * Both strands and every rung are swept into ONE BufferGeometry, so the whole
 * structure is a single draw call. Nothing is downloaded: the geometry is
 * generated from the parameters below.
 */

export interface HelixOptions {
  /** Points per strand. Lower on constrained devices. */
  readonly segments: number;
  readonly radialSegments: number;
  readonly rungs: number;
}

const LENGTH = 8.4;
const TURNS = 3;
const RADIUS = 1.42;
const STRAND_THICKNESS = 0.052;
const RUNG_THICKNESS = 0.028;

// Vertex `kind` channel: distinguishes the two backbones from the rungs so one
// material can colour all three.
const KIND_STRAND_A = 0;
const KIND_STRAND_B = 1;
const KIND_RUNG = 2;

function strandPoint(t: number, phase: number): [number, number, number] {
  const angle = t * TURNS * Math.PI * 2 + phase;
  return [(t - 0.5) * LENGTH, Math.sin(angle) * RADIUS, Math.cos(angle) * RADIUS];
}

export class HelixStrand {
  readonly mesh: Mesh;
  private readonly material: ShaderMaterial;
  readonly triangleCount: number;

  constructor(options: HelixOptions) {
    const sink = createSink();

    // --- Backbones ----------------------------------------------------------
    for (const [phase, kind] of [
      [0, KIND_STRAND_A],
      [Math.PI, KIND_STRAND_B],
    ] as const) {
      const path: [number, number, number][] = [];
      for (let i = 0; i <= options.segments; i++) {
        path.push(strandPoint(i / options.segments, phase));
      }
      addTube(sink, path, STRAND_THICKNESS, options.radialSegments, kind);
    }

    // --- Rungs --------------------------------------------------------------
    // Evenly spaced along the axis, each joining the two backbones. Even
    // spacing is the whole reason the structure reads as a ladder.
    for (let i = 0; i < options.rungs; i++) {
      const t = (i + 0.5) / options.rungs;
      const a = strandPoint(t, 0);
      const b = strandPoint(t, Math.PI);
      addTube(sink, [a, b], RUNG_THICKNESS, Math.max(4, options.radialSegments - 2), KIND_RUNG);
    }

    const geometry = new BufferGeometry();
    geometry.setAttribute('position', new BufferAttribute(new Float32Array(sink.positions), 3));
    geometry.setAttribute('normal', new BufferAttribute(new Float32Array(sink.normals), 3));
    geometry.setAttribute('aKind', new BufferAttribute(new Float32Array(sink.kinds), 1));
    geometry.setAttribute('aAlong', new BufferAttribute(new Float32Array(sink.along), 1));
    geometry.setIndex(sink.indices);
    geometry.computeBoundingSphere();
    this.triangleCount = sink.indices.length / 3;

    this.material = new ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
      toneMapped: false,
      uniforms: {
        uReveal: { value: 0 },
        uTime: { value: 0 },
        uStrandA: { value: new Color(SCENE_PALETTE.nodeActive) },
        uStrandB: { value: new Color(SCENE_PALETTE.packet) },
        uRung: { value: new Color(SCENE_PALETTE.nodeAnchor) },
        uFogDensity: { value: 0.055 },
        uFogColor: { value: new Color(SCENE_PALETTE.fog) },
      },
      vertexShader: /* glsl */ `
        attribute float aKind;
        attribute float aAlong;
        uniform float uReveal;
        varying float vKind;
        varying float vAlong;
        varying float vDepth;
        varying vec3 vNormal;

        void main() {
          vKind = aKind;
          vAlong = aAlong;
          vNormal = normalize(normalMatrix * normal);
          // Grows out of the centre as it reveals, so the structure assembles
          // rather than fading in as a finished object.
          vec3 p = position;
          p.x *= mix(0.55, 1.0, uReveal);
          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          vDepth = -mv.z;
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: /* glsl */ `
        uniform float uReveal;
        uniform float uTime;
        uniform vec3 uStrandA;
        uniform vec3 uStrandB;
        uniform vec3 uRung;
        uniform float uFogDensity;
        uniform vec3 uFogColor;
        varying float vKind;
        varying float vAlong;
        varying float vDepth;
        varying vec3 vNormal;

        void main() {
          vec3 colour = vKind < 0.5 ? uStrandA : (vKind < 1.5 ? uStrandB : uRung);
          float isRung = step(1.5, vKind);

          // Rim term: the tube edges read brighter than the centre, which is
          // what gives a thin additive tube any sense of volume.
          float rim = 0.35 + 0.65 * pow(1.0 - abs(vNormal.z), 1.6);

          // A slow travelling pulse along the backbones only.
          float pulse = 0.82 + 0.18 * sin(vAlong * 18.0 - uTime * 1.1);
          pulse = mix(pulse, 1.0, isRung);

          float alpha = uReveal * rim * pulse * mix(1.15, 0.75, isRung);

          float f = clamp(1.0 - exp(-uFogDensity * uFogDensity * vDepth * vDepth), 0.0, 1.0);
          colour = mix(colour, uFogColor, f);
          alpha *= 1.0 - f;

          if (alpha < 0.004) discard;
          gl_FragColor = vec4(colour, alpha);
        }
      `,
    });

    this.mesh = new Mesh(geometry, this.material);
    this.mesh.frustumCulled = false;
    this.mesh.renderOrder = 4;
    this.mesh.visible = false;
  }

  setFogDensity(value: number): void {
    this.material.uniforms['uFogDensity'].value = value;
  }

  /** 0 hides the structure entirely, including its draw call. */
  setReveal(value: number): void {
    this.material.uniforms['uReveal'].value = value;
    this.mesh.visible = value > 0.001;
  }

  advance(elapsed: number): void {
    this.material.uniforms['uTime'].value = elapsed;
  }

  dispose(): void {
    this.mesh.geometry.dispose();
    this.material.dispose();
  }
}
