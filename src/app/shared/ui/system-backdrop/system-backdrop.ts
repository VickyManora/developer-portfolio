import { ChangeDetectionStrategy, Component } from '@angular/core';

interface Node {
  readonly x: number;
  readonly y: number;
  readonly key: boolean;
}

interface Edge {
  readonly x1: number;
  readonly y1: number;
  readonly x2: number;
  readonly y2: number;
}

const VIEW_W = 1600;
const VIEW_H = 900;

/** Four strata, matching the architecture layers in the skills section. */
const STRATA = [
  { y: 250, count: 11, offset: 0 },
  { y: 380, count: 13, offset: 0.5 },
  { y: 510, count: 9, offset: 0.25 },
  { y: 640, count: 7, offset: 0.6 },
];

/**
 * The static architectural composition.
 *
 * A generated lattice of the four architecture strata — client, application,
 * services, data/cloud — with each node linked to its nearest neighbours in the
 * layer below. Generation is deterministic (no randomness, no Math.random), so
 * the prerendered SVG and the hydrated SVG are byte-identical.
 *
 * Inline SVG rather than an image: zero network cost, resolution-independent,
 * theme-aware through CSS custom properties, and no layout shift.
 *
 * Decorative only — aria-hidden, and it carries no information that is not also
 * in the DOM. It is the deliberate fallback whenever WebGL is unavailable,
 * fails, or the visitor prefers reduced motion.
 */
@Component({
  selector: 'app-system-backdrop',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './system-backdrop.html',
  styleUrl: './system-backdrop.scss',
  host: { 'aria-hidden': 'true', class: 'backdrop' },
})
export class SystemBackdrop {
  protected readonly viewBox = `0 0 ${VIEW_W} ${VIEW_H}`;
  protected readonly strataY = STRATA.map((stratum) => stratum.y);

  protected readonly nodes: readonly Node[] = SystemBackdrop.buildNodes();
  protected readonly edges: readonly Edge[] = SystemBackdrop.buildEdges();

  /** The four nodes that carry saturated accent. Kept deliberately few. */
  protected readonly signals: readonly Node[] = [
    SystemBackdrop.layer(0)[3],
    SystemBackdrop.layer(1)[8],
    SystemBackdrop.layer(2)[2],
    SystemBackdrop.layer(3)[5],
  ];

  private static layer(index: number): Node[] {
    const { y, count, offset } = STRATA[index];
    const margin = 90;
    const span = VIEW_W - margin * 2;
    const step = span / (count - 1);
    return Array.from({ length: count }, (_, i) => ({
      x: Math.round(margin + step * (i + offset * 0.35)),
      y,
      // Every third node reads slightly brighter, giving the lattice texture
      // without introducing a second colour.
      key: i % 3 === 1,
    }));
  }

  private static buildNodes(): Node[] {
    return STRATA.flatMap((_, index) => SystemBackdrop.layer(index));
  }

  /** Links each node to the two nearest nodes in the stratum below. */
  private static buildEdges(): Edge[] {
    const edges: Edge[] = [];
    for (let i = 0; i < STRATA.length - 1; i++) {
      const upper = SystemBackdrop.layer(i);
      const lower = SystemBackdrop.layer(i + 1);
      for (const node of upper) {
        const nearest = [...lower]
          .sort((a, b) => Math.abs(a.x - node.x) - Math.abs(b.x - node.x))
          .slice(0, 2);
        for (const target of nearest) {
          edges.push({ x1: node.x, y1: node.y, x2: target.x, y2: target.y });
        }
      }
    }
    return edges;
  }
}
