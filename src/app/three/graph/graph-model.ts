import type { AnchorSpec, GraphSpec, StratumId } from '../types/scene-contract';
import { createRng, range } from '../utils/rng';

/**
 * The architecture graph, generated procedurally from the semantic anchors
 * Angular supplies.
 *
 * Four strata, top to bottom: client → application → services → data/cloud.
 * Anchors are the named technologies; the rest are supporting infrastructure
 * nodes that give the layer visual body. Every node belongs to a stratum and,
 * where relevant, to an anchor's cluster — which is what lets a DOM hover
 * light up a whole region rather than a single dot.
 */

export const STRATA: readonly StratumId[] = ['client', 'application', 'services', 'data-cloud'];

/** World-space Y for each stratum. Client nearest the top. */
export const STRATUM_Y: Record<StratumId, number> = {
  client: 3.3,
  application: 1.1,
  services: -1.1,
  'data-cloud': -3.3,
};

export type NodeKind = 'anchor' | 'cluster' | 'support';

export interface GraphNode {
  readonly index: number;
  readonly x: number;
  readonly y: number;
  readonly z: number;
  readonly stratum: StratumId;
  readonly kind: NodeKind;
  /** Anchor id this node belongs to, or null for free-floating support nodes. */
  readonly anchorId: string | null;
  /** 0..1 visual weight, drives scale and emissive strength. */
  readonly weight: number;
}

export interface GraphEdge {
  readonly from: number;
  readonly to: number;
  /** 0..1; long cross-stratum links are dimmer than local ones. */
  readonly strength: number;
}

export interface SystemGraph {
  readonly nodes: readonly GraphNode[];
  readonly edges: readonly GraphEdge[];
  /** anchor id → node indices belonging to that anchor's cluster. */
  readonly anchorClusters: ReadonlyMap<string, readonly number[]>;
  /** anchor id → the anchor node's own index. */
  readonly anchorIndex: ReadonlyMap<string, number>;
  /** stratum → all node indices in it. */
  readonly strataIndex: ReadonlyMap<StratumId, readonly number[]>;
}

/**
 * Graph extents.
 *
 * Narrow on purpose: at the original width the graph filled the viewport edge
 * to edge and read as wallpaper rather than as an object suspended in space.
 * Keeping it roughly as tall as it is wide lets the four strata separate.
 */
const SPREAD_X = 4.2;
const SPREAD_Z = 2.5;

export function buildGraph(spec: GraphSpec, edgesPerNode: number): SystemGraph {
  const rng = createRng(0x5e1f);
  const nodes: GraphNode[] = [];
  const anchorClusters = new Map<string, number[]>();
  const anchorIndex = new Map<string, number>();
  const strataIndex = new Map<StratumId, number[]>();
  for (const stratum of STRATA) strataIndex.set(stratum, []);

  const byStratum = new Map<StratumId, AnchorSpec[]>();
  for (const stratum of STRATA) byStratum.set(stratum, []);
  for (const anchor of spec.anchors) byStratum.get(anchor.stratum)?.push(anchor);

  const push = (node: Omit<GraphNode, 'index'>): number => {
    const index = nodes.length;
    nodes.push({ ...node, index });
    strataIndex.get(node.stratum)?.push(index);
    if (node.anchorId) {
      const bucket = anchorClusters.get(node.anchorId);
      if (bucket) bucket.push(index);
      else anchorClusters.set(node.anchorId, [index]);
    }
    return index;
  };

  // --- Anchors, evenly distributed across each stratum ----------------------
  for (const stratum of STRATA) {
    const anchors = byStratum.get(stratum) ?? [];
    const y = STRATUM_Y[stratum];
    anchors.forEach((anchor, i) => {
      const t = anchors.length === 1 ? 0.5 : i / (anchors.length - 1);
      const x = (t - 0.5) * SPREAD_X * 1.92;
      const z = range(rng, -SPREAD_Z * 0.45, SPREAD_Z * 0.45);
      const index = push({
        x,
        y: y + range(rng, -0.08, 0.08),
        z,
        stratum,
        kind: 'anchor',
        anchorId: anchor.id,
        weight: 0.72 + anchor.weight * 0.28,
      });
      anchorIndex.set(anchor.id, index);
    });
  }

  // --- Cluster nodes orbiting each anchor -----------------------------------
  // These give an anchor visual mass, so highlighting a technology lights a
  // region of the architecture rather than one pixel.
  const anchorCount = spec.anchors.length;
  const clusterBudget = Math.max(0, Math.round((spec.nodeBudget - anchorCount) * 0.55));
  const perAnchor = anchorCount > 0 ? Math.floor(clusterBudget / anchorCount) : 0;

  for (const anchor of spec.anchors) {
    const parent = nodes[anchorIndex.get(anchor.id) ?? 0];
    for (let i = 0; i < perAnchor; i++) {
      const angle = range(rng, 0, Math.PI * 2);
      const radius = range(rng, 0.2, 0.56);
      push({
        x: parent.x + Math.cos(angle) * radius,
        y: parent.y + range(rng, -0.2, 0.2),
        z: parent.z + Math.sin(angle) * radius * 0.8,
        stratum: anchor.stratum,
        kind: 'cluster',
        anchorId: anchor.id,
        weight: range(rng, 0.2, 0.42),
      });
    }
  }

  // --- Support nodes: unaffiliated infrastructure ---------------------------
  let remaining = spec.nodeBudget - nodes.length;
  let guard = 0;
  while (remaining > 0 && guard++ < 4000) {
    const stratum = STRATA[Math.floor(rng() * STRATA.length)];
    push({
      x: range(rng, -SPREAD_X, SPREAD_X),
      y: STRATUM_Y[stratum] + range(rng, -0.3, 0.3),
      z: range(rng, -SPREAD_Z, SPREAD_Z),
      stratum,
      kind: 'support',
      anchorId: null,
      weight: range(rng, 0.12, 0.3),
    });
    remaining--;
  }

  const edges = buildEdges(nodes, edgesPerNode, rng);

  return {
    nodes,
    edges,
    anchorClusters,
    anchorIndex,
    strataIndex,
  };
}

/**
 * Links each node downward to its nearest neighbours in the stratum below,
 * producing a lattice that reads as a system rather than a scribble.
 *
 * Nearest-neighbour rather than random pairing is what keeps the composition
 * legible: long crossing diagonals read as noise.
 */
function buildEdges(nodes: GraphNode[], edgesPerNode: number, rng: () => number): GraphEdge[] {
  const edges: GraphEdge[] = [];
  const seen = new Set<number>();

  for (let s = 0; s < STRATA.length - 1; s++) {
    const upper = nodes.filter((n) => n.stratum === STRATA[s]);
    const lower = nodes.filter((n) => n.stratum === STRATA[s + 1]);
    if (lower.length === 0) continue;

    for (const node of upper) {
      // Anchors fan out slightly more than support nodes.
      const links = node.kind === 'anchor' ? edgesPerNode + 1 : edgesPerNode;
      const nearest = lower
        .map((candidate) => ({
          candidate,
          d: (candidate.x - node.x) ** 2 + (candidate.z - node.z) ** 2,
        }))
        .sort((a, b) => a.d - b.d)
        .slice(0, links);

      for (const { candidate, d } of nearest) {
        const key = node.index * 100000 + candidate.index;
        if (seen.has(key)) continue;
        seen.add(key);
        const strength = Math.max(0.22, 1 - Math.sqrt(d) / 3.2);
        edges.push({ from: node.index, to: candidate.index, strength });
      }
    }
  }

  // A few lateral links inside the application stratum, so the middle of the
  // system does not read as a flat row.
  const application = nodes.filter((n) => n.stratum === 'application');
  for (let i = 0; i + 1 < application.length; i += 3) {
    if (rng() > 0.55) continue;
    edges.push({ from: application[i].index, to: application[i + 1].index, strength: 0.3 });
  }

  return edges;
}
