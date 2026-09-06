/**
 * Scene palette, mirroring the SCSS design tokens.
 *
 * Duplicated deliberately: the engine must not read CSS custom properties on
 * the hot path, and it must not import anything Angular. Keep in sync with
 * `src/styles/_themes.scss` — these values are the contract.
 *
 * Most geometry sits at the low-contrast end on purpose. Saturated accent is
 * reserved for anchors, active state and flow, per the project's neon rule.
 */
export const SCENE_PALETTE = {
  background: 0x08090c,
  fog: 0x08090c,

  /** Support / cluster geometry. Deliberately close to the background. */
  nodeMuted: 0x4e5768,
  nodeCluster: 0x717b8c,
  /** Named-technology anchors. */
  nodeAnchor: 0xc3cad6,
  /** Anchor in the active stratum / active chapter. */
  nodeActive: 0x4d8dff,
  /** DOM-highlighted anchor. The only place the warm accent appears. */
  nodeHighlight: 0xffb86b,

  edge: 0x3f4d68,
  edgeActive: 0x5c8fd6,

  packet: 0x5ee9d0,

  grid: 0x1d2532,
  perimeter: 0x2c3849,
} as const;
