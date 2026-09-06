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
      'A production frontend migration, a reusable UI toolkit, application-level security work and a full interface redesign — delivered on an enterprise agentic AI platform.',
    sections: [
      {
        id: 'overview',
        index: '01',
        title: 'Overview',
        confidence: 'editorial',
        body: 'Krista is an agentic platform aimed at the whole enterprise. My work on it has centred on the frontend: moving a production surface from React to Angular, rebuilding the interface, and establishing the component and testing foundations the rest of the product builds on.',
        showStack: true,
      },
      {
        id: 'the-work',
        index: '02',
        title: 'The work',
        confidence: 'verified',
        groups: [
          {
            label: 'Migration',
            bullets: [
              'Led the migration of a production chatbot from React to Angular, leveraging agentic AI–assisted development to accelerate delivery while maintaining code quality and architectural consistency.',
            ],
          },
          {
            label: 'Interface',
            bullets: [
              'Redesigned and transformed the entire application UI, delivering a modern, scalable, and user-friendly interface aligned with UX best practices.',
              'Built a reusable UI toolkit / component library, enabling consistent design and faster development across multiple projects and teams.',
            ],
          },
          {
            label: 'Architecture and quality',
            bullets: [
              'Followed clean code principles, modular architecture, and unit testing practices, ensuring maintainability and long-term scalability of the codebase.',
            ],
          },
          {
            label: 'Performance and SEO',
            bullets: [
              'Improved application performance and SEO by applying modern frontend best practices, resulting in 90+ Google Lighthouse scores across Performance, Accessibility, Best Practices, and SEO.',
            ],
          },
          {
            label: 'Security',
            bullets: [
              'Designed and implemented application-level security enhancements for the Krista platform, improving protection against common web vulnerabilities and strengthening overall system reliability.',
            ],
          },
        ],
      },
      {
        id: 'impact',
        index: '03',
        title: 'Engineering impact',
        confidence: 'editorial',
        body: 'The measurable result is the Lighthouse score. The durable result is structural: a component library other teams build on, a modular codebase with unit testing in place, and application-level security work carried out on the platform itself rather than bolted on afterwards.',
        metricLabels: ['Lighthouse, all four categories'],
      },
      {
        id: 'system',
        index: '04',
        title: 'Engineering system',
        confidence: 'editorial',
        body: 'A conceptual map of the capabilities this work drew on. It is not a production architecture diagram — the platform’s real topology is not documented here, and nothing below should be read as describing it.',
        conceptMap: [
          { label: 'Interface', items: ['Angular', 'React', 'UI toolkit', 'Reusable components'] },
          { label: 'Architecture', items: ['Modular architecture', 'Clean code', 'Microfrontend'] },
          { label: 'Quality', items: ['Unit testing', 'Performance', 'SEO', 'Application security'] },
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
        body: 'Migrating a live surface between frameworks without letting quality slip is a test of judgement more than of syntax. Doing it while also raising the performance ceiling, hardening the application and leaving behind a component library other teams adopt is the difference between shipping a feature and owning a frontend.',
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
      'Order management and dashboard work on a banking and finance SaaS platform, alongside a reusable component library that cut development time by 40%.',
    sections: [
      {
        id: 'overview',
        index: '01',
        title: 'Overview',
        confidence: 'editorial',
        body: 'A SaaS platform serving the banking and finance industry. My work covered the Order Management application, a Wire Order dashboard, and a shared component library used across the product.',
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
              'Orchestrated optimization of the Order Management application, reducing processing errors by 30% and enhancing user experience by 20%.',
            ],
          },
          {
            label: 'Wire Order dashboard',
            bullets: [
              'Developed Wire Order Screen dashboard, resulting in a 25% reduction in processing time and 15% increase in user satisfaction.',
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
