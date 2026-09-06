import type { Strength } from '../core/models/content.models';

/**
 * Source: PHASE-0-CONTENT-FINAL.md §8.
 *
 * Each `summary` is a draft derived strictly from the resume line quoted in
 * `evidence`, pending Vicky's edit. The evidence field is kept in the model
 * deliberately: it is the audit trail proving no claim was invented.
 */
export const STRENGTHS: readonly Strength[] = [
  {
    id: 'full-stack',
    name: 'Full stack engineering',
    summary:
      'Delivery across the whole stack — Angular and React at the front, Node.js, Express, Python and .NET behind them.',
    evidence: 'Resume header; Chevron "Full Stack Developer"; SKILLS block',
  },
  {
    id: 'frontend-architecture',
    name: 'Frontend architecture',
    summary: 'Microfrontend and modular architectures built for long-term scalability.',
    evidence: 'Krista stack "Microfrontend"; "modular architecture… long-term scalability"',
  },
  {
    id: 'enterprise',
    name: 'Enterprise application development',
    summary: 'Production systems for banking, energy, commodities and public-sector clients.',
    evidence: 'Unitrax (banking/finance); Chevron; EKA (commodities); Ministry of Tourism',
  },
  {
    id: 'security',
    name: 'Application security',
    summary:
      'Application-level security work hardening the Krista platform against common web vulnerabilities.',
    evidence: '"protection against common web vulnerabilities"',
  },
  {
    id: 'performance',
    name: 'Performance optimization',
    summary:
      'Frontend performance tuning that reached 90+ Google Lighthouse scores across all four categories.',
    evidence: '"90+ Google Lighthouse scores"',
  },
  {
    id: 'seo',
    name: 'SEO',
    summary:
      'Technical SEO applied alongside performance work, reflected in those same Lighthouse scores.',
    evidence: '"Improved application performance and SEO"',
  },
  {
    id: 'component-architecture',
    name: 'Reusable component architecture',
    summary: 'UI toolkits and component libraries — one cut development time by 40%.',
    evidence: 'Krista UI toolkit; Unitrax "reducing development time by 40%"',
  },
  {
    id: 'ui-ux',
    name: 'UI/UX modernization',
    summary: 'Full interface redesigns, including transforming the entire Krista application UI.',
    evidence: '"Redesigned and transformed the entire application UI"',
  },
  {
    id: 'cloud-native',
    name: 'Cloud-native development',
    summary: 'Cloud-native delivery across AWS and Azure, with Azure DevOps pipelines.',
    evidence:
      'Summary "cloud-native architectures (AWS & Azure)"; Azure DevOps in three project stacks',
  },
  {
    id: 'ai-assisted',
    name: 'AI-assisted development',
    summary:
      'Agentic AI-assisted development used to accelerate delivery without compromising code quality.',
    evidence:
      '"leveraging agentic AI–assisted development to accelerate delivery while maintaining code quality"',
  },
  {
    id: 'ownership',
    name: 'Technical ownership',
    summary: 'Driving projects from design through to production.',
    evidence: '"driving projects from design to production with technical ownership"',
  },
];
