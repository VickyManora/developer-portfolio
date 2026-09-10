import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  Points,
  ShaderMaterial,
} from 'three';
import type { SystemGraph } from './graph-model';
import { SCENE_PALETTE } from '../config/palette';
import { createRng } from '../utils/rng';

/**
 * Directional flow along the edges, computed entirely on the GPU.
 *
 * Each packet is one vertex carrying its edge's endpoints, a phase offset and a
 * speed. The vertex shader interpolates position from a single `uTime` uniform,
 * so the CPU writes ONE float per frame no matter how many packets exist —
 * there is no per-packet JavaScript, no position buffer rewrite, and one draw
 * call for the whole system.
 */
export class FlowField {
  readonly points: Points;

  private readonly material: ShaderMaterial;

  constructor(graph: SystemGraph, packetCount: number) {
    const rng = createRng(0xf10a);
    const count = Math.min(packetCount, graph.edges.length);

    const starts = new Float32Array(count * 3);
    const ends = new Float32Array(count * 3);
    const phase = new Float32Array(count);
    const speed = new Float32Array(count);
    const strength = new Float32Array(count);

    // Spread packets across the edge set rather than clustering them, so flow
    // reads as system-wide activity instead of a few busy lanes.
    const stride = Math.max(1, Math.floor(graph.edges.length / Math.max(count, 1)));
    for (let i = 0; i < count; i++) {
      const edge = graph.edges[(i * stride) % graph.edges.length];
      const a = graph.nodes[edge.from];
      const b = graph.nodes[edge.to];
      starts.set([a.x, a.y, a.z], i * 3);
      ends.set([b.x, b.y, b.z], i * 3);
      phase[i] = rng();
      speed[i] = 0.06 + rng() * 0.1;
      strength[i] = edge.strength;
    }

    const geometry = new BufferGeometry();
    // `position` is required by three's bounds handling; the shader ignores it.
    geometry.setAttribute('position', new BufferAttribute(new Float32Array(count * 3), 3));
    geometry.setAttribute('aStart', new BufferAttribute(starts, 3));
    geometry.setAttribute('aEnd', new BufferAttribute(ends, 3));
    geometry.setAttribute('aPhase', new BufferAttribute(phase, 1));
    geometry.setAttribute('aSpeed', new BufferAttribute(speed, 1));
    geometry.setAttribute('aStrength', new BufferAttribute(strength, 1));

    this.material = new ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
      toneMapped: false,
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new Color(SCENE_PALETTE.packet) },
        uSize: { value: 12 },
        uIntensity: { value: 1 },
        uPixelRatio: { value: 1 },
      },
      vertexShader: /* glsl */ `
        attribute vec3 aStart;
        attribute vec3 aEnd;
        attribute float aPhase;
        attribute float aSpeed;
        attribute float aStrength;

        uniform float uTime;
        uniform float uSize;
        uniform float uPixelRatio;

        varying float vFade;

        void main() {
          float t = fract(aPhase + uTime * aSpeed);
          vec3 pos = mix(aStart, aEnd, t);

          // Fade in and out at the ends so packets emerge from and arrive at
          // nodes rather than popping.
          vFade = smoothstep(0.0, 0.18, t) * (1.0 - smoothstep(0.82, 1.0, t)) * aStrength;

          vec4 mv = modelViewMatrix * vec4(pos, 1.0);
          gl_Position = projectionMatrix * mv;
          gl_PointSize = uSize * uPixelRatio * (1.0 / max(-mv.z, 0.6));
        }
      `,
      fragmentShader: /* glsl */ `
        precision mediump float;
        uniform vec3 uColor;
        uniform float uIntensity;
        varying float vFade;

        void main() {
          // Soft round sprite, generated procedurally — no texture to load,
          // upload or dispose.
          vec2 d = gl_PointCoord - vec2(0.5);
          float r = dot(d, d);
          float alpha = smoothstep(0.25, 0.0, r) * vFade * uIntensity;
          if (alpha < 0.01) discard;
          gl_FragColor = vec4(uColor, alpha);
        }
      `,
    });

    this.points = new Points(geometry, this.material);
    this.points.frustumCulled = false;
    this.points.renderOrder = 3;
  }

  setPixelRatio(value: number): void {
    this.material.uniforms['uPixelRatio'].value = value;
  }

  /** 0 stills the flow completely without removing the packets. */
  setIntensity(value: number): void {
    this.material.uniforms['uIntensity'].value = value;
  }

  advance(elapsed: number): void {
    this.material.uniforms['uTime'].value = elapsed;
  }

  dispose(): void {
    this.points.geometry.dispose();
    this.material.dispose();
  }
}
