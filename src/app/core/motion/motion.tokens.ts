/**
 * Motion constants shared by the GSAP layer and the SCSS motion tokens.
 *
 * Kept in TypeScript as the single source: `src/styles/_tokens.scss` mirrors
 * these values as custom properties for the CSS-only interactions. If one
 * changes, change both — the pairing is asserted by eye, not by tooling, so
 * the numbers are deliberately few.
 */
export const MOTION = {
  /** Entrance durations. Nothing entering may exceed `enter`. */
  enter: 0.56,
  enterFast: 0.32,
  micro: 0.2,

  /** Stagger between siblings in a group reveal. */
  stagger: 0.07,
  /** Cap on total group stagger, so a long list never crawls. */
  staggerMax: 0.42,

  /** Distance travelled by an entering element. Small on purpose. */
  travel: 18,
  travelMobile: 12,

  /**
   * Custom cubic-bezier matching --ease-out in SCSS. Decelerating, no
   * overshoot: precision, not bounce.
   */
  ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
  easeInOut: 'cubic-bezier(0.65, 0, 0.35, 1)',

  /** Viewport position at which a reveal fires. */
  start: 'top 88%',

  /** If the engine has not loaded by then, reveal everything unconditionally. */
  loadTimeoutMs: 2500,
} as const;
