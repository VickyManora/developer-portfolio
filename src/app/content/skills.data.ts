import type { Skill, SkillGroup } from '../core/models/content.models';

/**
 * Source: PHASE-0-CONTENT-FINAL.md §7.
 *
 * A pure reorganization of the resume's confirmed technologies. Nothing added.
 * jQuery and LESS are confirmed resume skills but omitted from the site grid
 * per locked decision 12 — they remain in the résumé PDF.
 *
 * CONTENT SAFETY
 * --------------
 * There are no proficiency percentages, skill ratings or years-per-technology
 * here, because the resume states none. `emphasis` is a presentation weighting
 * — which technologies the portfolio leads with — not a claim about ability.
 * The grouping is editorial too, and the UI says so.
 *
 * `layer` stays as the architecture stratum the 3D graph uses; `bucket` is the
 * presentation grouping. Keeping them separate means the visual arrangement can
 * change without touching the scene mapping.
 */
const s = (
  id: string,
  name: string,
  emphasis: Skill['emphasis'],
  inGraph = false,
): Skill => ({ id, name, emphasis, inGraph });

export const SKILL_GROUPS: readonly SkillGroup[] = [
  {
    layer: 'client',
    bucket: 'frontend',
    depth: 3,
    label: 'Frontend',
    skills: [
      s('angular', 'Angular 20', 'primary', true),
      s('typescript', 'TypeScript', 'primary', true),
      s('rxjs', 'RxJS', 'primary', true),
      s('react', 'React', 'primary', true),
      s('javascript', 'JavaScript (OOJS)', 'primary'),
      s('html5', 'HTML5', 'primary'),
      s('scss', 'SCSS / CSS3', 'primary', true),
      s('microfrontend', 'Microfrontend', 'supporting', true),
      s('angular-material', 'Angular Material', 'supporting'),
      s('bootstrap', 'Bootstrap', 'supporting'),
    ],
  },
  {
    layer: 'application',
    bucket: 'backend',
    depth: 2,
    label: 'Application',
    skills: [
      s('nodejs', 'Node.js', 'supporting', true),
      s('express', 'Express.js', 'supporting', true),
      s('dsa', 'Data Structures & Algorithms', 'supporting'),
    ],
  },
  {
    layer: 'services',
    bucket: 'backend',
    depth: 1,
    label: 'Services & languages',
    skills: [
      s('python', 'Python', 'supporting', true),
      s('csharp', 'C#', 'supporting', true),
      s('dotnet', '.NET', 'supporting', true),
      s('cpp', 'C++', 'supporting', true),
      s('c', 'C', 'supporting'),
    ],
  },
  {
    layer: 'data-cloud',
    bucket: 'cloud',
    depth: 0,
    label: 'Cloud',
    skills: [s('aws', 'AWS', 'supporting', true), s('azure', 'Azure', 'supporting', true)],
  },
  {
    layer: 'data-cloud',
    bucket: 'data',
    depth: 0,
    label: 'Data',
    skills: [s('sql', 'SQL', 'supporting', true), s('mongodb', 'MongoDB', 'supporting', true)],
  },
  {
    layer: 'delivery',
    bucket: 'tooling',
    depth: 2,
    label: 'Delivery & quality',
    skills: [
      s('git', 'Git', 'supporting', true),
      s('jenkins', 'Jenkins', 'supporting', true),
      s('azure-devops', 'Azure DevOps', 'supporting', true),
      s('karma-jasmine', 'Karma & Jasmine', 'supporting', true),
      s('azure-boards', 'Azure Boards', 'supporting'),
      s('jira', 'JIRA', 'supporting'),
      s('figma', 'Figma', 'supporting'),
    ],
  },
];

export const ALL_SKILLS: readonly Skill[] = SKILL_GROUPS.flatMap((g) => g.skills);

/** The technologies the portfolio leads with. Emphasis, not a rating. */
export const PRIMARY_SKILLS: readonly Skill[] = ALL_SKILLS.filter(
  (skill) => skill.emphasis === 'primary',
);

/** The curated node set emphasised in the 3D architecture graph. */
export const GRAPH_SKILLS: readonly Skill[] = ALL_SKILLS.filter((skill) => skill.inGraph);
