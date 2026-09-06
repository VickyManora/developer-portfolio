# `src/app/three/` — the engine boundary

**This directory must contain ZERO Angular imports.** Enforced by an ESLint
`no-restricted-imports` rule (see `eslint.config.js`), not by convention.

## Why

The render loop runs at 60fps. Anything Angular imported here would risk
pulling change detection, DI or the router into the hot path. Keeping the engine
framework-agnostic means:

- it is unit-testable without a TestBed
- change detection can never leak into a per-frame code path
- the whole engine could be lifted into any framework unchanged

## The scroll authority

There is exactly one, established in Phase 3 and extended in Phase 4:

```
native scroll
  → GSAP ScrollTrigger        (MotionService — the only scroll listener)
  → normalized progress
  → SceneStateService
  → SceneDirectorService      (Angular; maps state to the engine contract)
  → ThreeEngineService        (Angular; the only seam)
  → createEngine()            (this directory)
```

The engine has **no** scroll listener, **no** resize listener and **no** DOM
queries. Angular pushes a plain `SceneInput` object in and calls `resize()`.

## Structure

```
three/
  types/scene-contract.ts   the Angular ↔ engine contract (plain data only)
  config/                   palette, quality presets, render budget
  graph/                    graph model + GPU objects
    graph-model.ts          deterministic procedural graph
    node-field.ts           all nodes, 1 draw call (InstancedMesh)
    edge-field.ts           all edges, 1 draw call (merged LineSegments)
    flow-field.ts           all packets, 1 draw call (GPU-driven Points)
    ground-grid.ts          shader grid, 1 draw call
    perimeter.ts            security boundary, 1 draw call
  scene/
    system-core-scene.ts    the one persistent scene
    chapters/               five stateless chapters
  engine/create-engine.ts   dynamic-import entry point; owns renderer + rAF
  utils/rng.ts              seeded PRNG — nothing here calls Math.random()
```

## Deliberate omissions

**No bloom.** A selective-bloom pass would add a post-processing dependency, at
least two extra render targets and a full-screen pass, in exchange for a soften
that this composition does not need. The accent nodes get their presence from
additive flow packets and per-instance emissive colour instead. A crisp graph
was judged preferable to an expensive glowing one — see the Phase 4 brief, §8.

**No text in WebGL.** No `TextGeometry`, no canvas sprites, no font atlas. All
labels are DOM.

**No raycasting.** DOM → 3D highlighting covers every interaction the design
needs, and it works identically for pointer, keyboard focus and touch. Adding a
raycaster would have introduced a pointer-driven code path that keyboard users
could not reach.

**No models.** All geometry is procedural, so the engine downloads nothing
beyond its own code.
