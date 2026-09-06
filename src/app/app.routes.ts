import type { Routes } from '@angular/router';

/**
 * Only two content routes exist today. `/work/:slug` is lazy so the case-study
 * component never enters the homepage bundle, even though both are prerendered.
 */
export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./features/home/home').then((m) => m.Home),
  },
  {
    path: 'work/:slug',
    loadComponent: () => import('./features/case-study/case-study').then((m) => m.CaseStudy),
  },
  {
    path: '**',
    loadComponent: () => import('./features/not-found/not-found').then((m) => m.NotFound),
  },
];
