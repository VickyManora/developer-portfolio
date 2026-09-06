/**
 * Single source of truth for all site content.
 *
 * Everything downstream — sections, case-study routes, SEO metadata, JSON-LD,
 * the future command palette and the 3D node mapping — reads from here, so one
 * content edit propagates everywhere with no template changes.
 */
export * from './profile.data';
export * from './experience.data';
export * from './projects.data';
export * from './skills.data';
export * from './strengths.data';
export * from './education.data';
export * from './case-studies.data';
export * from './seo.data';
