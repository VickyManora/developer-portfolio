import { BUILD_INFO } from '../../../environments/build-info';

/**
 * All duration arithmetic runs against the frozen build timestamp so the
 * prerendered HTML and the hydrated client agree exactly.
 */

function toMonths(isoMonth: string): number {
  const [year, month] = isoMonth.split('-').map(Number);
  return year * 12 + (month - 1);
}

/** Whole years between an ISO month and the build date. */
export function yearsSince(isoMonth: string): number {
  return Math.floor((toMonths(BUILD_INFO.builtMonth) - toMonths(isoMonth)) / 12);
}

/** "9+ years", computed from the career start so it can never go stale. */
export function yearsOfExperience(careerStart: string): string {
  return `${yearsSince(careerStart)}+ years`;
}

/** Inclusive month span, e.g. "2 yr 11 mo". */
export function monthSpan(start: string, end: string | null): string {
  const total = toMonths(end ?? BUILD_INFO.builtMonth) - toMonths(start);
  const years = Math.floor(total / 12);
  const months = total % 12;
  const parts: string[] = [];
  if (years > 0) parts.push(`${years} yr`);
  if (months > 0) parts.push(`${months} mo`);
  return parts.length > 0 ? parts.join(' ') : '< 1 mo';
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** "Aug 2024" */
export function formatMonth(isoMonth: string): string {
  const [year, month] = isoMonth.split('-').map(Number);
  return `${MONTHS[month - 1]} ${year}`;
}

/** "Aug 2024 – Present" */
export function formatRange(start: string, end: string | null): string {
  return `${formatMonth(start)} – ${end ? formatMonth(end) : 'Present'}`;
}
