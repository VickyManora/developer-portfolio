import type { Education } from '../core/models/content.models';

/**
 * Source: PHASE-0-CONTENT-FINAL.md §9.
 *
 * The two school entries were omitted from the site per locked decision 13,
 * and the updated resume (2026-09-10) drops them as well.
 */
export const EDUCATION: readonly Education[] = [
  {
    institution: 'Maulana Azad National Institute of Technology (MANIT), Bhopal',
    degree: 'B.Tech',
    // Supplied by Vicky, 2026-09-10. The resume states the degree but not the
    // discipline.
    branch: 'Electronics & Communication Engineering',
    start: '2013-06',
    end: '2017-04',
    grade: '7.7 CGPA',
  },
];
