/**
 * Minimal tube builder.
 *
 * Appends a swept tube along a polyline into shared vertex arrays, so an
 * entire structure — many tubes — can live in ONE BufferGeometry and cost one
 * draw call. Written here rather than pulled from three's addons: it is forty
 * lines, it keeps the engine free of example-module imports, and it lets every
 * tube in a structure share one buffer.
 */
export interface TubeSink {
  readonly positions: number[];
  readonly normals: number[];
  /** Per-vertex channel the material uses to tell parts apart. */
  readonly kinds: number[];
  /** 0..1 along the tube, for gradients. */
  readonly along: number[];
  readonly indices: number[];
}

export function createSink(): TubeSink {
  return { positions: [], normals: [], kinds: [], along: [], indices: [] };
}

/**
 * Sweeps a circle of `radialSegments` along `path`.
 *
 * Frames are built with a fixed reference up-vector rather than a parallel
 * transport frame: these paths never fold back on themselves, so the simpler
 * construction is stable and avoids the twist artefacts a naive Frenet frame
 * produces on a helix.
 */
export function addTube(
  sink: TubeSink,
  path: readonly [number, number, number][],
  radius: number,
  radialSegments: number,
  kind: number,
): void {
  if (path.length < 2) return;
  const base = sink.positions.length / 3;

  for (let i = 0; i < path.length; i++) {
    const p = path[i];
    const next = path[Math.min(i + 1, path.length - 1)];
    const prev = path[Math.max(i - 1, 0)];

    // Tangent.
    let tx = next[0] - prev[0];
    let ty = next[1] - prev[1];
    let tz = next[2] - prev[2];
    const tl = Math.hypot(tx, ty, tz) || 1;
    tx /= tl;
    ty /= tl;
    tz /= tl;

    // Reference up, swapped when the tangent is near-parallel to it.
    const upY = Math.abs(ty) > 0.9 ? 0 : 1;
    const upZ = Math.abs(ty) > 0.9 ? 1 : 0;

    // normal = normalise(cross(tangent, up))
    let nx = ty * upZ - tz * upY;
    let ny = tz * 0 - tx * upZ;
    let nz = tx * upY - ty * 0;
    const nl = Math.hypot(nx, ny, nz) || 1;
    nx /= nl;
    ny /= nl;
    nz /= nl;

    // binormal = cross(tangent, normal)
    const bx = ty * nz - tz * ny;
    const by = tz * nx - tx * nz;
    const bz = tx * ny - ty * nx;

    const t = i / (path.length - 1);
    for (let r = 0; r <= radialSegments; r++) {
      const a = (r / radialSegments) * Math.PI * 2;
      const cos = Math.cos(a);
      const sin = Math.sin(a);
      const ox = nx * cos + bx * sin;
      const oy = ny * cos + by * sin;
      const oz = nz * cos + bz * sin;
      sink.positions.push(p[0] + ox * radius, p[1] + oy * radius, p[2] + oz * radius);
      sink.normals.push(ox, oy, oz);
      sink.kinds.push(kind);
      sink.along.push(t);
    }
  }

  const ring = radialSegments + 1;
  for (let i = 0; i < path.length - 1; i++) {
    for (let r = 0; r < radialSegments; r++) {
      const a = base + i * ring + r;
      const b = a + ring;
      sink.indices.push(a, b, a + 1, b, b + 1, a + 1);
    }
  }
}
