/**
 * The section index. Drives the editorial numbering, the top navigation, the
 * layer rail and the future camera choreography from one list.
 */
export interface SectionEntry {
  readonly id: string;
  /** Editorial index shown as "01 / INTRODUCTION". */
  readonly index: string;
  readonly label: string;
  /** Compact label for the desktop top bar, which cannot afford to wrap. */
  readonly navLabel: string;
  /** Shown in the layer rail; omitted for the hero. */
  readonly inRail: boolean;
}

export const SECTIONS: readonly SectionEntry[] = [
  { id: 'intro', index: '01', label: 'Introduction', navLabel: 'Introduction', inRail: true },
  { id: 'experience', index: '02', label: 'Experience', navLabel: 'Experience', inRail: true },
  { id: 'work', index: '03', label: 'Work', navLabel: 'Work', inRail: true },
  { id: 'skills', index: '04', label: 'Technical Skills', navLabel: 'Skills', inRail: true },
  {
    id: 'strengths',
    index: '05',
    label: 'Engineering Strengths',
    navLabel: 'Strengths',
    inRail: true,
  },
  { id: 'education', index: '06', label: 'Education', navLabel: 'Education', inRail: true },
  { id: 'contact', index: '07', label: 'Contact', navLabel: 'Contact', inRail: true },
];
