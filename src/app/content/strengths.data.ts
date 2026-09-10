import type { Strength } from '../core/models/content.models';

/**
 * Source: PHASE-0-CONTENT-FINAL.md §8.
 *
 * Each `summary` derives strictly from the resume line quoted in `evidence`.
 * The evidence field is kept in the model deliberately: it is the audit trail
 * proving no claim was invented.
 *
 * Re-anchored against the updated resume (2026-09-10). Three entries cited
 * lines that changed or were dropped and now quote surviving ones. The eleven
 * names are unchanged.
 */
export const STRENGTHS: readonly Strength[] = [
  {
    id: 'full-stack',
    name: 'Full stack engineering',
    summary:
      'Delivery across the whole stack — Angular and React at the front, Node.js, Express and Python behind them.',
    evidence:
      'Summary "frontend architecture, backend services, APIs"; SKILLS "Backend: Node.js, Express.js, Python, REST APIs"',
  },
  {
    id: 'frontend-architecture',
    name: 'Frontend architecture',
    summary: 'Scalable frontend architecture built on Angular, React and microfrontend patterns.',
    evidence:
      '"Built and evolved scalable frontend architecture using Angular, React, TypeScript and microfrontend patterns"',
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
    summary: 'Application security carried as a standing concern of the platform work.',
    evidence:
      'SKILLS "Testing & Quality: … Application Security"; Krista stack "Security"; summary "application security"',
  },
  {
    id: 'performance',
    name: 'Performance optimization',
    summary: 'Performance tuning that reached 90+ Lighthouse scores across all four categories.',
    evidence:
      '"achieving 90+ Lighthouse scores across Performance, Accessibility, Best Practices and SEO"',
  },
  {
    id: 'seo',
    name: 'SEO',
    summary:
      'Technical SEO applied alongside performance work, reflected in those same Lighthouse scores.',
    evidence: '"Improved application performance and SEO, achieving 90+ Lighthouse scores"',
  },
  {
    id: 'component-architecture',
    name: 'Reusable component architecture',
    summary:
      'Reusable components and shared UI patterns — one library cut development time by 40%.',
    evidence:
      '"Designed reusable components and shared UI patterns"; Unitrax "reducing development time by 40%"',
  },
  {
    id: 'ui-ux',
    name: 'UI/UX modernization',
    summary: 'Interface work measured by the experience it produced, not by the redesign itself.',
    evidence:
      'Unitrax "improving user experience by 20%"; BOSCH "digital initiative enhancing user experience"; Western Union "enhancing functionality and user experience"',
  },
  {
    id: 'cloud-native',
    name: 'Cloud-native development',
    summary: 'Cloud-native delivery across AWS and Azure, with Azure DevOps and CI/CD.',
    evidence:
      'Summary "cloud-native applications on AWS and Azure"; SKILLS "Cloud & DevOps: AWS, Azure, Azure DevOps, Jenkins, Git, CI/CD"',
  },
  {
    id: 'ai-assisted',
    name: 'AI-assisted development',
    summary:
      'AI-assisted development used to deliver a framework migration without compromising code quality.',
    evidence:
      '"using AI-assisted development while maintaining architectural consistency and code quality"',
  },
  {
    id: 'ownership',
    name: 'Technical ownership',
    summary: 'Features owned from technical design through to production deployment.',
    evidence:
      '"Owned end-to-end development of platform features across frontend and backend, from technical design through production deployment"',
  },
];
