import type { CaseStudy } from '../core/models/content.models';

/**
 * Deep case-study content.
 *
 * CONTENT SAFETY
 * --------------
 * Every `groups[].bullets` entry is a VERBATIM resume line. Every `body` marked
 * `editorial` interprets that documented work — it says what the work
 * demonstrates — and introduces no new fact: no architecture, no APIs, no
 * services, no databases, no team sizes, no timelines, no metrics beyond the
 * approved set.
 *
 * Sections whose content genuinely does not exist yet are `needs-input`. They
 * render as an explicit marker, never as invented prose, and are isolated so
 * the narrative can be dropped in later without touching the layout.
 */

export const CASE_STUDIES: readonly CaseStudy[] = [
  // -------------------------------------------------------------------------
  {
    slug: 'krista',
    eyebrow: 'Case study',
    positioning:
      'End-to-end platform work across frontend and backend — a production framework migration, backend APIs in Node.js and Python, Playwright automation and SigNoz observability, on an enterprise agentic AI platform.',
    sections: [
      {
        id: 'overview',
        index: '01',
        title: 'Overview',
        confidence: 'editorial',
        body: 'Krista is an agentic platform aimed at the whole enterprise. My work spans both sides of it: platform features owned from technical design through production, a production surface moved from React to Angular, backend APIs behind it, and the testing and observability foundations the rest of the product relies on.',
        showStack: true,
      },
      {
        id: 'the-work',
        index: '02',
        title: 'The work',
        confidence: 'verified',
        groups: [
          {
            label: 'Ownership',
            bullets: [
              'Owned end-to-end development of platform features across frontend and backend, from technical design through production deployment.',
            ],
          },
          {
            label: 'Frontend architecture',
            bullets: [
              'Built and evolved scalable frontend architecture using Angular, React, TypeScript and microfrontend patterns.',
              'Designed reusable components and shared UI patterns, accelerating development across multiple projects and teams.',
            ],
          },
          {
            label: 'Backend',
            bullets: [
              'Developed and integrated backend APIs/services using Node.js and Python to support platform capabilities and application workflows.',
            ],
          },
          {
            label: 'Migration',
            bullets: [
              'Led migration of a production chatbot from React to Angular using AI-assisted development while maintaining architectural consistency and code quality.',
            ],
          },
          {
            label: 'Quality and observability',
            bullets: [
              'Implemented Playwright-based end-to-end automation testing for the Krista client application, strengthening regression coverage and release confidence.',
              'Implemented application observability using SigNoz and created dashboards to monitor application health and performance.',
            ],
          },
          {
            label: 'Performance and SEO',
            bullets: [
              'Improved application performance and SEO, achieving 90+ Lighthouse scores across Performance, Accessibility, Best Practices and SEO.',
            ],
          },
        ],
      },
      {
        id: 'impact',
        index: '03',
        title: 'Engineering impact',
        confidence: 'editorial',
        body: 'The measurable result is the Lighthouse score. The durable results are structural: shared components other teams build on, end-to-end automation covering regressions before release, and observability dashboards that make the running application legible.',
        metricLabels: ['Lighthouse, all four categories'],
      },
      {
        id: 'system',
        index: '04',
        title: 'Engineering system',
        confidence: 'editorial',
        body: 'A conceptual map of the capabilities this work drew on. It is not a production architecture diagram — the platform’s real topology is not documented here, and nothing below should be read as describing it.',
        conceptMap: [
          {
            label: 'Interface',
            items: ['Angular 20', 'React', 'TypeScript', 'Reusable components'],
          },
          { label: 'Architecture', items: ['Microfrontend', 'Modular architecture', 'Clean code'] },
          { label: 'Backend', items: ['Node.js', 'Python', 'REST APIs'] },
          { label: 'Quality', items: ['Playwright', 'Automation testing', 'Performance', 'SEO'] },
          { label: 'Observability', items: ['SigNoz', 'Monitoring dashboards'] },
          { label: 'Delivery', items: ['AI-assisted development'] },
        ],
      },
      {
        id: 'outcome',
        index: '05',
        title: 'Outcome',
        confidence: 'verified',
        metricLabels: ['Lighthouse, all four categories'],
        body: '90+ Google Lighthouse scores across Performance, Accessibility, Best Practices and SEO.',
      },
      {
        id: 'stack',
        index: '06',
        title: 'Stack',
        confidence: 'verified',
        showStack: true,
      },
      {
        id: 'takeaway',
        index: '07',
        title: 'Engineering takeaway',
        confidence: 'editorial',
        body: 'Migrating a live surface between frameworks without letting quality slip is a test of judgement more than of syntax. Doing it while also owning the APIs behind it, wiring up end-to-end automation and instrumenting the running system is the difference between shipping a feature and owning a platform.',
      },
      {
        id: 'narrative',
        index: '08',
        title: 'Context and challenge',
        confidence: 'needs-input',
        missing:
          'Business context, the problem this platform solves, and the specific challenge the migration addressed',
      },
    ],
  },

  // -------------------------------------------------------------------------
  {
    slug: 'unitrax',
    eyebrow: 'Case study',
    positioning:
      'Order management and dashboard work on a wealth and asset management platform, alongside a reusable component library that cut development time by 40%.',
    sections: [
      {
        id: 'overview',
        index: '01',
        title: 'Overview',
        confidence: 'editorial',
        body: 'An investment order management platform for wealth and asset management. My work covered the data-intensive Order Management application, a data-driven Wire Order dashboard, and a shared component library used across the product.',
        showStack: true,
      },
      {
        id: 'product',
        index: '02',
        title: 'The product',
        confidence: 'verified',
        groups: [
          {
            label: 'Order management',
            bullets: [
              'Optimized a data-intensive Order Management application, reducing processing errors by 30% and improving user experience by 20%.',
            ],
          },
          {
            label: 'Wire Order dashboard',
            bullets: [
              'Designed and developed a data-driven Wire Order dashboard, reducing processing time by 25% and increasing user satisfaction by 15%.',
            ],
          },
        ],
      },
      {
        id: 'engineering',
        index: '03',
        title: 'Engineering work',
        confidence: 'verified',
        groups: [
          {
            label: 'Reusable component architecture',
            bullets: [
              'Established a robust library of reusable components, reducing development time by 40% and promoting code reusability.',
            ],
          },
        ],
      },
      {
        id: 'measured-impact',
        index: '04',
        title: 'Measured impact',
        confidence: 'verified',
        metricLabels: [
          'reduction in processing errors',
          'reduction in processing time',
          'reduction in development time',
        ],
        body: 'Alongside the figures above, the work is recorded as a 20% improvement in user experience on Order Management and a 15% increase in user satisfaction on the Wire Order dashboard.',
      },
      {
        id: 'system',
        index: '05',
        title: 'System view',
        confidence: 'editorial',
        body: 'A conceptual map of the capabilities this work drew on. It is not a production architecture diagram: the platform’s services, data stores and infrastructure are not documented here and are not implied.',
        conceptMap: [
          { label: 'Interface', items: ['Angular 14', 'React', 'Angular Material', 'Bootstrap'] },
          { label: 'Shared UI', items: ['Reusable component library'] },
          { label: 'Workflows', items: ['Order management', 'Wire Order dashboard'] },
          { label: 'Delivery', items: ['Node.js', 'Jenkins'] },
        ],
      },
      {
        id: 'stack',
        index: '06',
        title: 'Stack',
        confidence: 'verified',
        showStack: true,
      },
      {
        id: 'takeaway',
        index: '07',
        title: 'Engineering takeaway',
        confidence: 'editorial',
        body: 'Three of the four recorded gains here are about throughput — fewer errors, faster processing, less development time. That is the shape of frontend work in a regulated domain: the interface is the operational surface, and making it faster and harder to get wrong is the product improvement.',
      },
      {
        id: 'narrative',
        index: '08',
        title: 'Context and challenge',
        confidence: 'needs-input',
        missing:
          'Business context, the operational problem being solved, and the specific challenge behind the Order Management optimisation',
      },
    ],
  },
];

export function caseStudyFor(slug: string): CaseStudy | undefined {
  return CASE_STUDIES.find((study) => study.slug === slug);
}
