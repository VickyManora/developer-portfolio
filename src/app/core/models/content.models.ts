/**
 * Content model for the portfolio.
 *
 * CONTENT INTEGRITY CONTRACT
 * --------------------------
 * Every value in `src/app/content/` traces to a literal line in the locked
 * specification (PHASE-0-CONTENT-FINAL.md), which in turn traces to the resume
 * PDF. Nothing is inferred, rounded or embellished.
 *
 * Where the resume has no answer, the value is `NEEDS_INPUT` rather than a
 * plausible guess. `Pending<T>` makes that visible in the type system, so a
 * template cannot silently render a placeholder as if it were real content.
 */

export const NEEDS_INPUT = '[NEEDS INPUT]' as const;
export type NeedsInput = typeof NEEDS_INPUT;

/** A value that is either confirmed, or explicitly awaiting input. */
export type Pending<T> = T | NeedsInput;

export function isPending<T>(value: Pending<T>): value is NeedsInput {
  return value === NEEDS_INPUT;
}

export function isResolved<T>(value: Pending<T>): value is T {
  return value !== NEEDS_INPUT;
}

// ---------------------------------------------------------------------------
// Profile
// ---------------------------------------------------------------------------

export interface Profile {
  readonly name: string;
  readonly role: string;
  /** ISO month the career started. Years of experience derive from this. */
  readonly careerStart: string;
  readonly location: string;
  readonly timezone: string;
  readonly educationSignal: string;
  readonly heroLine: string;
  readonly summary: string;
  readonly proofChips: readonly string[];
  readonly availability: Pending<string>;
  readonly photo: Pending<string>;
}

// ---------------------------------------------------------------------------
// Experience
// ---------------------------------------------------------------------------

export interface Role {
  readonly id: string;
  readonly company: string;
  readonly title: string;
  /** ISO month, inclusive. */
  readonly start: string;
  /** ISO month, inclusive. `null` means present. */
  readonly end: string | null;
  readonly location: Pending<string>;
  /** Slugs of projects delivered in this role. Renders instead of new bullets. */
  readonly projectSlugs: readonly string[];
  /**
   * True for roles the locked spec marks "minimal-by-design": the resume has
   * no content, so the card is deliberately sparse rather than padded out.
   */
  readonly minimalByDesign: boolean;
}

// ---------------------------------------------------------------------------
// Content confidence
// ---------------------------------------------------------------------------

/**
 * How much weight a piece of content carries.
 *
 * `verified`    — traceable to a literal line in the resume. May state facts.
 * `editorial`   — interprets documented work ("what this demonstrates").
 *                 May not introduce a new fact.
 * `needs-input` — absent from the source. Renders as an explicit marker,
 *                 never as prose.
 *
 * The classification is part of the data, not a comment, so a template cannot
 * accidentally present an interpretation as a fact.
 */
export type Confidence = 'verified' | 'editorial' | 'needs-input';

export interface CaseStudySection {
  readonly id: string;
  /** Editorial index, e.g. "01". */
  readonly index: string;
  readonly title: string;
  readonly confidence: Confidence;
  /** Prose. Present for `verified` and `editorial` sections. */
  readonly body?: string;
  /** Named groups of verbatim resume bullets. Never paraphrased. */
  readonly groups?: readonly CaseStudyGroup[];
  /** Metric ids to feature, resolved against the project's own metrics. */
  readonly metricLabels?: readonly string[];
  /** Field description shown when `confidence` is `needs-input`. */
  readonly missing?: string;
  /** Renders the conceptual capability map instead of prose. */
  readonly conceptMap?: readonly ConceptGroup[];
  /** Renders the project's stack chips. */
  readonly showStack?: boolean;
}

export interface CaseStudyGroup {
  readonly label: string;
  /** Verbatim resume bullets. */
  readonly bullets: readonly string[];
}

/**
 * A conceptual grouping of capabilities.
 *
 * Deliberately NOT an architecture diagram: it connects technologies and
 * practices that the resume documents, and the UI labels it as conceptual so it
 * can never be read as a production topology.
 */
export interface ConceptGroup {
  readonly label: string;
  readonly items: readonly string[];
}

export interface CaseStudy {
  readonly slug: string;
  readonly eyebrow: string;
  /** One-line positioning. Editorial, derived from documented work. */
  readonly positioning: string;
  readonly sections: readonly CaseStudySection[];
}

// ---------------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------------

export type ProjectTier = 'deep' | 'card';

/** Hard metrics are featured as stat components; soft ones stay inline. */
export type MetricWeight = 'hard' | 'soft';

export interface Metric {
  readonly value: string;
  readonly label: string;
  readonly weight: MetricWeight;
}

/**
 * Client naming is gated on Vicky's contract review. Every surface (card,
 * route slug, page title, meta description, OG image, JSON-LD) reads through
 * `resolveClientName`, so flipping `publicNameCleared` changes all of them at
 * once with no other edit.
 */
export interface ClientNaming {
  readonly name: string;
  readonly anonymized: string;
  readonly publicNameCleared: boolean;
}

export interface Project {
  readonly slug: string;
  readonly tier: ProjectTier;
  readonly client: ClientNaming;
  /** Project name as written in the resume. */
  readonly name: string;
  /** Name to use when the client is not cleared for public naming. */
  readonly anonymizedName: string;
  readonly start: string;
  readonly end: string | null;
  readonly roleId: string;
  readonly domain: string;
  /** Short editorial description. Interprets, never asserts new facts. */
  readonly summary: string;
  /** Employment the work sat under. The title belongs to the role, not here. */
  readonly roleContext: string;
  readonly stack: Pending<readonly string[]>;
  /** Verbatim resume bullets. Never paraphrased. */
  readonly achievements: readonly string[];
  readonly metrics: readonly Metric[];

  // Case-study narrative — written content, not in the resume.
  readonly context: Pending<string>;
  readonly challenge: Pending<string>;
  readonly architecture: Pending<string>;
  readonly outcome: Pending<string>;
  readonly publicUrl: Pending<string>;
}

export function resolveProjectName(project: Project): string {
  return project.client.publicNameCleared ? project.name : project.anonymizedName;
}

export function resolveClientName(project: Project): string {
  return project.client.publicNameCleared ? project.client.name : project.client.anonymized;
}

// ---------------------------------------------------------------------------
// Skills
// ---------------------------------------------------------------------------

export type SkillLayer = 'client' | 'application' | 'services' | 'data-cloud' | 'delivery';

export interface SkillGroup {
  readonly layer: SkillLayer;
  /** Presentation bucket. Editorial grouping, not a formal classification. */
  readonly bucket: 'frontend' | 'backend' | 'cloud' | 'data' | 'tooling';
  /** Layer index used by the future 3D scene: 3 = nearest, 0 = deepest. */
  readonly depth: number;
  readonly label: string;
  readonly skills: readonly Skill[];
}

/**
 * Presentation emphasis, not a proficiency rating.
 *
 * `primary` marks the frontend core the portfolio leads with; `supporting`
 * marks everything else. There are deliberately no percentages, no star
 * ratings and no years-per-technology anywhere in this model — the resume
 * states none of those, so neither does the site.
 */
export type SkillEmphasis = 'primary' | 'supporting';

export interface Skill {
  readonly id: string;
  readonly name: string;
  readonly emphasis: SkillEmphasis;
  /**
   * True for the 20 curated nodes rendered in the 3D graph. The full set stays
   * in the DOM; beyond ~20 labelled nodes the visualization becomes noise.
   */
  readonly inGraph: boolean;
}

// ---------------------------------------------------------------------------
// Strengths / Education
// ---------------------------------------------------------------------------

export interface Strength {
  readonly id: string;
  readonly name: string;
  /** Drafted from resume evidence, pending Vicky's edit. */
  readonly summary: string;
  /** The resume line this claim rests on. Kept in the model as an audit trail. */
  readonly evidence: string;
}

export interface Education {
  readonly institution: string;
  readonly degree: string;
  readonly branch: Pending<string>;
  readonly start: string;
  readonly end: string;
  readonly grade: string;
}

// ---------------------------------------------------------------------------
// Contact / SEO
// ---------------------------------------------------------------------------

export interface ContactDetails {
  readonly email: string;
  readonly location: string;
  readonly timezone: string;
  readonly linkedin: string;
  readonly github: string;
  readonly resumeFile: string;
  /** Omitted from the public site by decision; kept out of the model entirely. */
  readonly phone?: never;
}

export interface SeoMeta {
  readonly title: string;
  readonly description: string;
  readonly path: string;
  readonly ogImage?: string;
  readonly type?: 'website' | 'article' | 'profile';
  readonly noIndex?: boolean;
}
