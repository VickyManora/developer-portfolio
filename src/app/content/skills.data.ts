import type { Skill, SkillGroup } from '../core/models/content.models';

/**
 * Source: the updated resume (2026-09-10), SKILLS block, verbatim.
 *
 * Groups mirror the resume's own categories so every entry is traceable to a
 * line in the source. `layer` is the architecture stratum the 3D graph uses;
 * `bucket` is the presentation grouping. Keeping them separate means the visual
 * arrangement can change without touching the scene mapping.
 *
 * CONTENT SAFETY
 * --------------
 * No proficiency percentages, ratings or years-per-technology: the resume
 * states none. `emphasis` is a presentation weighting — which technologies the
 * portfolio leads with — not a claim about ability.
 *
 * C, C++ and Data Structures & Algorithms were in the previous resume's skills
 * block and are absent from this one, so they are gone from here too. C# and
 * .NET remain only where the resume still lists them: in the BOSCH and Chevron
 * project stacks.
 */
const s = (id: string, name: string, emphasis: Skill['emphasis'], inGraph = false): Skill => ({
  id,
  name,
  emphasis,
  inGraph,
});

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
      s('bootstrap', 'Bootstrap', 'supporting'),
      s('jquery', 'jQuery', 'supporting'),
    ],
  },
  {
    layer: 'application',
    bucket: 'backend',
    depth: 2,
    label: 'Architecture',
    skills: [
      s('microfrontend', 'Microfrontend architecture', 'supporting', true),
      s('component-libraries', 'Component libraries', 'supporting', true),
      s('modular-architecture', 'Modular architecture', 'supporting'),
      s('clean-code', 'Clean code', 'supporting'),
    ],
  },
  {
    layer: 'services',
    bucket: 'backend',
    depth: 1,
    label: 'Backend & APIs',
    skills: [
      s('nodejs', 'Node.js', 'supporting', true),
      s('express', 'Express.js', 'supporting', true),
      s('python', 'Python', 'supporting', true),
      s('rest-apis', 'REST APIs', 'supporting', true),
      s('api-design', 'API design', 'supporting'),
      s('backend-services', 'Backend services', 'supporting'),
    ],
  },
  {
    layer: 'data-cloud',
    bucket: 'data',
    depth: 0,
    label: 'Data & databases',
    skills: [
      s('sql', 'SQL', 'supporting', true),
      s('mongodb', 'MongoDB', 'supporting', true),
      s('data-modeling', 'Data modeling', 'supporting'),
      s('database-design', 'Database design', 'supporting'),
    ],
  },
  {
    layer: 'data-cloud',
    bucket: 'cloud',
    depth: 0,
    label: 'Cloud & DevOps',
    skills: [
      s('aws', 'AWS', 'supporting', true),
      s('azure', 'Azure', 'supporting', true),
      s('azure-devops', 'Azure DevOps', 'supporting', true),
      s('jenkins', 'Jenkins', 'supporting', true),
      s('git', 'Git', 'supporting', true),
      s('cicd', 'CI/CD', 'supporting'),
    ],
  },
  {
    layer: 'delivery',
    bucket: 'tooling',
    depth: 2,
    label: 'Testing & quality',
    skills: [
      s('playwright', 'Playwright', 'supporting', true),
      s('karma-jasmine', 'Karma & Jasmine', 'supporting', true),
      s('unit-testing', 'Unit testing', 'supporting'),
      s('automation-testing', 'Automation testing', 'supporting'),
      s('app-security', 'Application security', 'supporting'),
    ],
  },
  {
    layer: 'delivery',
    bucket: 'tooling',
    depth: 2,
    label: 'AI',
    skills: [
      s('ai-assisted', 'AI-assisted development', 'supporting', true),
      s('agentic-apps', 'Agentic / AI applications', 'supporting'),
    ],
  },
  {
    layer: 'delivery',
    bucket: 'tooling',
    depth: 2,
    label: 'Observability',
    skills: [
      s('signoz', 'SigNoz', 'supporting', true),
      s('app-monitoring', 'Application monitoring', 'supporting'),
      s('observability-dashboards', 'Observability dashboards', 'supporting'),
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
