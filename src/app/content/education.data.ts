import { NEEDS_INPUT, type Education } from '../core/models/content.models';

/**
 * Source: PHASE-0-CONTENT-FINAL.md §9.
 *
 * The two school entries in the resume are omitted from the site per locked
 * decision 13; they remain in the résumé PDF.
 */
export const EDUCATION: readonly Education[] = [
  {
    institution: 'Maulana Azad National Institute of Technology (MANIT), Bhopal',
    degree: 'B.Tech',
    // Not stated anywhere in the resume. Launch-gated.
    branch: NEEDS_INPUT,
    start: '2013-06',
    end: '2017-04',
    grade: '7.7 CGPA',
  },
];
