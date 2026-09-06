import { BoxGeometry, Color, EdgesGeometry, LineBasicMaterial, LineSegments } from 'three';
import { SCENE_PALETTE } from '../config/palette';

/**
 * The security boundary enclosing the system: a wireframe box on a slow pulse.
 *
 * One draw call, twelve segments. It is the quietest element in the scene by
 * design — a boundary you notice on second look, not a sci-fi containment field.
 */
export class Perimeter {
  readonly lines: LineSegments;
  private readonly material: LineBasicMaterial;

  constructor() {
    const box = new BoxGeometry(10.4, 8.8, 6.4);
    const geometry = new EdgesGeometry(box);
    box.dispose();

    this.material = new LineBasicMaterial({
      color: new Color(SCENE_PALETTE.perimeter),
      transparent: true,
      opacity: 0.5,
      toneMapped: false,
    });

    this.lines = new LineSegments(geometry, this.material);
    this.lines.renderOrder = 0;
  }

  update(elapsed: number, intensity: number): void {
    const pulse = 0.24 + Math.sin(elapsed * 0.42) * 0.07;
    this.material.opacity = pulse * intensity;
  }

  dispose(): void {
    this.lines.geometry.dispose();
    this.material.dispose();
  }
}
