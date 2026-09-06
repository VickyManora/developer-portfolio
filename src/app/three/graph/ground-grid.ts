import { Color, DoubleSide, Mesh, PlaneGeometry, ShaderMaterial } from 'three';
import { SCENE_PALETTE } from '../config/palette';

/**
 * The technical ground plane: two triangles, one draw call, grid drawn in the
 * fragment shader with a radial fade so it never reads as graph paper.
 */
export class GroundGrid {
  readonly mesh: Mesh;
  private readonly material: ShaderMaterial;

  constructor() {
    const geometry = new PlaneGeometry(24, 24, 1, 1);
    this.material = new ShaderMaterial({
      transparent: true,
      depthWrite: false,
      side: DoubleSide,
      toneMapped: false,
      uniforms: {
        uColor: { value: new Color(SCENE_PALETTE.grid) },
        uOpacity: { value: 1 },
      },
      vertexShader: /* glsl */ `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        precision mediump float;
        uniform vec3 uColor;
        uniform float uOpacity;
        varying vec2 vUv;

        void main() {
          vec2 grid = abs(fract(vUv * 26.0 - 0.5) - 0.5) / fwidth(vUv * 26.0);
          float line = 1.0 - min(min(grid.x, grid.y), 1.0);
          float fade = 1.0 - smoothstep(0.15, 0.5, distance(vUv, vec2(0.5)));
          float alpha = line * fade * uOpacity;
          if (alpha < 0.01) discard;
          gl_FragColor = vec4(uColor, alpha);
        }
      `,
    });

    this.mesh = new Mesh(geometry, this.material);
    this.mesh.rotation.x = -Math.PI / 2;
    this.mesh.position.y = -4.9;
    this.mesh.renderOrder = 0;
  }

  setOpacity(value: number): void {
    this.material.uniforms['uOpacity'].value = value;
  }

  dispose(): void {
    this.mesh.geometry.dispose();
    this.material.dispose();
  }
}
