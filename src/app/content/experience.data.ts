import { NEEDS_INPUT, type Role } from '../core/models/content.models';

/**
 * Source: PHASE-0-CONTENT-FINAL.md §5.
 *
 * Company-level titles only (locked decision 8). The per-project job titles in
 * the resume are deliberately not modelled: they contradict the company titles
 * for the same months. No content is altered — the resume PDF is unchanged.
 */
export const ROLES: readonly Role[] = [
  {
    id: 'krista-ai',
    company: 'Krista AI',
    title: 'Senior Software Engineer',
    start: '2024-08',
    end: null,
    location: NEEDS_INPUT,
    projectSlugs: ['krista'],
    minimalByDesign: false,
  },
  {
    id: 'larsen-toubro',
    company: 'Larsen and Toubro Ltd.',
    title: 'Senior Software Engineer',
    start: '2021-09',
    end: '2024-08',
    location: NEEDS_INPUT,
    projectSlugs: [
      'unitrax',
      'bosch-ministry-of-tourism',
      'chevron-market-dataplace',
      'eka-analytic-platform',
    ],
    minimalByDesign: false,
  },
  {
    id: 'hcl-technologies',
    company: 'HCL Technologies',
    title: 'Lead Engineer',
    start: '2020-04',
    end: '2021-07',
    location: NEEDS_INPUT,
    projectSlugs: ['western-union-money-transfer'],
    minimalByDesign: false,
  },
  {
    id: 'vodafone-idea',
    company: 'Vodafone Idea Ltd.',
    title: 'Front-end Developer',
    start: '2017-06',
    end: '2020-04',
    location: 'Pune',
    projectSlugs: [],
    // The resume carries no bullets, projects or technologies for this role.
    // Rendered as deliberate editorial restraint rather than padded out.
    minimalByDesign: true,
  },
];
