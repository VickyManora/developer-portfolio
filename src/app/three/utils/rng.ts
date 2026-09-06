/**
 * Deterministic PRNG (mulberry32).
 *
 * The graph must generate identically on every load and on every device —
 * otherwise the scene would differ between the prerendered fallback and the
 * live render, and screenshots would be untestable. Nothing in this engine
 * calls Math.random().
 */
export function createRng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Uniform value in [min, max). */
export function range(rng: () => number, min: number, max: number): number {
  return min + rng() * (max - min);
}
