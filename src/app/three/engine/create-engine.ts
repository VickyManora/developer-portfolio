import { WebGLRenderer } from 'three';
import { SystemCoreScene } from '../scene/system-core-scene';
import { QUALITY_PRESETS, RENDER_BUDGET } from '../config/quality-presets';
import type { EngineOptions, SceneEngine, SceneInput, SceneReport } from '../types/scene-contract';

/**
 * Builds the engine. This module is the dynamic-import entry point, so nothing
 * above it pulls Three.js into the initial bundle.
 *
 * The engine owns exactly one rAF loop and one WebGL context. It has no scroll
 * listener, no resize listener and no DOM queries — Angular pushes state in and
 * calls `resize()`. That is what keeps the single-scroll-authority rule true.
 */
export function createEngine(options: EngineOptions): SceneEngine {
  const { canvas, graph, tier, reducedMotion, onFatal } = options;
  const preset = QUALITY_PRESETS[tier];

  const renderer = new WebGLRenderer({
    canvas,
    antialias: preset.antialias,
    alpha: true,
    powerPreference: 'high-performance',
    // The scene is decorative and never read back; skipping the stencil and
    // depth-preserving buffers keeps memory down on mobile.
    stencil: false,
    failIfMajorPerformanceCaveat: false,
  });

  const dpr = Math.min(
    typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1,
    preset.maxDevicePixelRatio,
  );
  renderer.setPixelRatio(dpr);
  renderer.setClearColor(0x000000, 0);

  const scene = new SystemCoreScene(graph, preset);
  scene.setPixelRatio(dpr);

  let rafHandle = 0;
  let running = false;
  let disposed = false;
  let lastTime = 0;
  let elapsed = 0;
  let fps = 0;
  let frameAccumulator = 0;
  let frameCount = 0;

  let input: SceneInput = {
    tier,
    reducedMotion,
    scrollProgress: 0,
    chapter: 'hero',
    chapterProgress: 0,
    highlightedAnchor: null,
    highlightedStratum: null,
    focusedProject: null,
    pointer: { x: 0, y: 0 },
  };

  function resize(): void {
    if (disposed) return;
    const width = canvas.clientWidth || 1;
    const height = canvas.clientHeight || 1;
    renderer.setSize(width, height, false);
    scene.setAspect(width, height);
  }

  function renderFrame(delta: number): void {
    scene.update(delta, elapsed, input);
    renderer.render(scene.scene, scene.camera);
  }

  function tick(now: number): void {
    if (disposed) return;
    rafHandle = requestAnimationFrame(tick);

    const delta = lastTime === 0 ? 0.016 : Math.min((now - lastTime) / 1000, 0.05);
    lastTime = now;
    elapsed += delta;

    frameAccumulator += delta;
    frameCount++;
    if (frameAccumulator >= 0.5) {
      fps = frameCount / frameAccumulator;
      frameAccumulator = 0;
      frameCount = 0;
    }

    renderFrame(delta);
  }

  function start(): void {
    if (disposed || running || input.reducedMotion) return;
    running = true;
    lastTime = 0;
    rafHandle = requestAnimationFrame(tick);
  }

  function pause(): void {
    if (!running) return;
    running = false;
    cancelAnimationFrame(rafHandle);
    rafHandle = 0;
  }

  /**
   * Renders exactly one composed frame and stops.
   *
   * `immediate` snaps camera and emphasis to their targets so the still is the
   * settled composition, never a half-finished transition — which is precisely
   * what reduced motion requires.
   */
  function renderStill(): void {
    if (disposed) return;
    resize();
    scene.update(0.016, elapsed, input, true);
    renderer.render(scene.scene, scene.camera);
  }

  // --- Context loss ---------------------------------------------------------
  // Recovery is not attempted: a lost context on a decorative layer is better
  // handled by falling back to the static composition than by rebuilding a
  // renderer the device may not sustain.
  function handleContextLost(event: Event): void {
    event.preventDefault();
    pause();
    onFatal('webgl-context-lost');
  }

  canvas.addEventListener('webglcontextlost', handleContextLost, false);

  resize();

  const engine: SceneEngine = {
    update(next: SceneInput): void {
      const wasReduced = input.reducedMotion;
      input = next;

      if (next.reducedMotion && !wasReduced) {
        // Settle immediately, then stop: no in-between camera pose is left.
        pause();
        renderStill();
        return;
      }
      if (!next.reducedMotion && wasReduced) {
        start();
      }
    },
    resize,
    renderStill,
    start,
    pause,
    dispose(): void {
      if (disposed) return;
      disposed = true;
      pause();
      canvas.removeEventListener('webglcontextlost', handleContextLost, false);
      scene.dispose();
      renderer.dispose();
      // Releases the GPU context rather than waiting for GC to maybe do it.
      renderer.forceContextLoss();
    },
    get report(): SceneReport {
      const info = renderer.info;
      return {
        fps: Math.round(fps),
        drawCalls: info.render.calls,
        triangles: info.render.triangles,
        geometries: info.memory.geometries,
        textures: info.memory.textures,
        programs: info.programs?.length ?? 0,
        nodeCount: scene.nodeCount,
        edgeCount: scene.edgeCount,
        packetCount: scene.packetCount,
        devicePixelRatio: dpr,
        tier,
        bloom: preset.bloom,
        running,
        chapter: input.chapter,
        highlightedAnchor: input.highlightedAnchor,
        highlightedStratum: input.highlightedStratum,
        emphasisedNodes: scene.emphasisedNodeCount,
        helix: Number(scene.helixReveal.toFixed(3)),
        bounds: scene.bounds,
      };
    },
  };

  return engine;
}

export { RENDER_BUDGET };
