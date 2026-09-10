import type { SceneInput, StratumId } from '../../types/scene-contract';
import { StatelessChapter } from './chapter';
import type { ChapterState, MutableChapterState, SceneChapter } from './chapter';

/**
 * The five homepage chapters.
 *
 * Every one views the SAME graph — none adds, removes or rebuilds geometry.
 * They differ only in camera pose and in which strata or anchors are emphasised,
 * which is what makes the scene read as one architecture being inspected from
 * different angles rather than five separate visuals.
 *
 * Camera moves are deliberately small: a dolly and a lateral drift, never an
 * orbit or a swoop.
 */

const STRATA_ORDER: readonly StratumId[] = ['client', 'application', 'services', 'data-cloud'];

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function base(): MutableChapterState {
  return {
    camera: { x: 0, y: 0.6, z: 15.4 },
    target: { x: 0, y: 0, z: 0 },
    strata: new Map(),
    anchors: new Map(),
    flow: 1,
    ambient: 1,
    helix: 0,
  };
}

/** HERO — the whole system, calm and wide. No fly-in. */
export class HeroChapter extends StatelessChapter {
  readonly id = 'hero' as const;

  update(progress: number, input: SceneInput): ChapterState {
    const state = base();
    // A 1.1-unit dolly across the entire chapter. That is the whole move.
    state.camera.z = lerp(15.8, 14.7, progress);
    state.camera.y = lerp(0.85, 0.4, progress);
    state.camera.x = input.pointer.x * 0.55;
    state.target.y = input.pointer.y * -0.18;
    state.flow = 1;
    state.ambient = 1;
    // All four strata read equally: the point of the hero is the whole stack.
    for (const stratum of STRATA_ORDER) state.strata.set(stratum, 0.14);
    return state;
  }
}

/**
 * EXPERIENCE — the architecture resolves into a double helix.
 *
 * The lattice recedes and the helix assembles in its place, then reverses on
 * the way out. Emphasis still travels down the strata underneath, so the
 * widening-responsibility reading survives.
 */
export class ExperienceChapter extends StatelessChapter {
  readonly id = 'experience' as const;

  update(progress: number, input: SceneInput): ChapterState {
    const state = base();

    // Assemble over the first third and hold; smoothstep so it does not read
    // as a mechanical wipe.
    const t = Math.min(1, progress / 0.32);
    state.helix = t * t * (3 - 2 * t);

    // Framed on the helix, which sits at the graph's centre in the clear
    // right-hand half of the viewport.
    const centre = 3.4 * state.helix;
    state.camera.z = lerp(14.6, 13.4, progress);
    state.camera.x = centre + lerp(-0.7, 0.7, progress) + input.pointer.x * 0.3;
    state.camera.y = lerp(0.9, -0.7, progress);
    state.target.x = centre;
    state.target.y = lerp(0.5, -0.5, progress);

    // A soft band of emphasis sweeping through the strata.
    const head = progress * (STRATA_ORDER.length - 1);
    STRATA_ORDER.forEach((stratum, i) => {
      const distance = Math.abs(i - head);
      state.strata.set(stratum, Math.max(0, 1 - distance) * 0.62);
    });

    state.flow = 0.9;
    // The perimeter frames the lattice, not the helix.
    state.ambient = lerp(1, 0.4, state.helix);
    return state;
  }
}

/**
 * PROJECTS — the graph resolves into a focused subgraph.
 *
 * No client-specific architecture is implied: emphasis is on the strata a
 * full-stack delivery touches, not on any project's real topology.
 */
export class ProjectsChapter extends StatelessChapter {
  readonly id = 'projects' as const;

  update(progress: number, input: SceneInput): ChapterState {
    const state = base();
    state.camera.z = lerp(13.0, 12.2, progress);
    state.camera.x = lerp(1.1, -0.7, progress) + input.pointer.x * 0.3;
    state.camera.y = 0.15;
    state.target.x = lerp(0.4, -0.2, progress);

    state.strata.set('client', 0.5);
    state.strata.set('application', 0.62);
    state.strata.set('services', 0.4);
    state.strata.set('data-cloud', 0.24);
    state.flow = 1.15;
    state.ambient = 0.9;
    return state;
  }
}

/** SKILLS — the layers separate and the DOM drives the highlight. */
export class SkillsChapter extends StatelessChapter {
  readonly id = 'skills' as const;

  update(progress: number, input: SceneInput): ChapterState {
    const state = base();
    state.camera.z = lerp(13.6, 12.8, progress);
    state.camera.y = 0.2 + input.pointer.y * 0.2;
    state.camera.x = input.pointer.x * 0.45;

    if (input.highlightedStratum) {
      // A DOM hover on a layer label lights that stratum and quiets the rest.
      for (const stratum of STRATA_ORDER) {
        state.strata.set(stratum, stratum === input.highlightedStratum ? 0.85 : 0.06);
      }
    } else {
      for (const stratum of STRATA_ORDER) state.strata.set(stratum, 0.2);
    }

    if (input.highlightedAnchor) {
      state.anchors.set(input.highlightedAnchor, 1);
    }

    state.flow = input.highlightedAnchor ? 1.25 : 0.85;
    return state;
  }
}

/** CONTACT — the system settles. Activity drops, composition centres. */
export class ContactChapter extends StatelessChapter {
  readonly id = 'contact' as const;

  update(progress: number, input: SceneInput): ChapterState {
    const state = base();
    state.camera.z = lerp(13.4, 16.2, progress);
    state.camera.y = lerp(0, 0.9, progress);
    state.camera.x = input.pointer.x * 0.2;
    // Flow winds down rather than stopping abruptly.
    state.flow = lerp(0.7, 0.12, progress);
    state.ambient = lerp(1, 0.5, progress);
    for (const stratum of STRATA_ORDER) state.strata.set(stratum, lerp(0.18, 0.05, progress));
    return state;
  }
}

export function createChapters(): SceneChapter[] {
  return [
    new HeroChapter(),
    new ExperienceChapter(),
    new ProjectsChapter(),
    new SkillsChapter(),
    new ContactChapter(),
  ];
}
