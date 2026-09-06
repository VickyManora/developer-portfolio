# Vicky Manora — Portfolio

Premium, interactive 3D developer portfolio. Angular 20, zoneless, prerendered
to static HTML, deployed on Vercel.

**Concept:** "The Living System" — one persistent 3D system-architecture graph
the visitor travels through. See `PORTFOLIO-PROPOSAL.md`.

## Status

| Phase | Scope | State |
|---|---|---|
| 0 | Content audit and lock | ✅ complete — `PHASE-0-CONTENT-FINAL.md` |
| 1 | Angular foundation | ✅ complete |
| 2 | Content-complete premium visual design | ✅ complete |
| 3 | Motion layer (GSAP) | ✅ complete |
| 4 | Three.js engine — system-core | ✅ complete |
| 5 | Experience + project storytelling | ✅ complete |
| 6 | Tech arsenal, command palette, final UX | ✅ complete |
| 7 | Production hardening + launch readiness | ✅ complete |

## Commands

```bash
npm install          # install dependencies
npm start            # dev server on http://localhost:4200
npm run build        # production build + prerender + 404 + sitemap
npm run preview      # serve the production build on http://localhost:4300
npm run lint         # ESLint (TS + template accessibility + architecture boundary)
npm run typecheck    # tsc --noEmit
npm run format       # Prettier write
npm run lighthouse   # Lighthouse CI against the built output
npm run verify       # lint + typecheck + build
```

## Architecture rules

1. **`src/app/three/` contains zero Angular imports.** Enforced by an ESLint
   `no-restricted-imports` rule, not by convention. The only seam is
   `src/app/bridge/three-engine.service.ts`.
2. **`src/app/content/` is the single source of truth.** Sections, case-study
   routes, SEO metadata, JSON-LD and the future 3D node mapping all read from
   it. Content edits never touch templates.
3. **Content integrity.** Nothing in `content/` is invented. Gaps are
   `NEEDS_INPUT`, typed as `Pending<T>`, and render as a visible marker.
4. **Zoneless.** Required so the Phase 4 render loop cannot trigger change
   detection 60x/second.
5. **One scroll authority.** `MotionService` owns the only scroll-driven
   animation system. Nothing else may attach a scroll listener. The chain is
   `native scroll → ScrollTrigger → SceneStateService → SceneDirectorService →
   ThreeEngineService → engine`.
6. **The engine is lazy.** Three.js is dynamically imported and the mount is
   deferred past `load` + idle, so it never competes with the hero's paint.

## Theme

**Dark only.** The light ("Blueprint") tokens and `ThemeService` remain in the
codebase but are not exposed in the UI: the 3D palette, scrim gradients and
backdrop are tuned for dark, and shipping an untuned light mode would mean two
mediocre themes instead of one finished one. Re-enabling it is a header button
away once the light system is properly designed.

## Command palette

⌘K / Ctrl+K. Only the open/closed state and the key listener are in the initial
bundle; the command list and UI load on first open (3.4 KB gzip).

## Content confidence

Case-study sections carry a `confidence` field — `verified`, `editorial` or
`needs-input` — and the template renders each differently. Only `verified`
content states facts; `editorial` interprets documented work; `needs-input`
renders a visible marker and never prose.

## Deployment

Static output. No server runtime, no Express.

| | |
|---|---|
| Build command | `npm run build` |
| Install command | `npm ci` |
| Output directory | `dist/portfolio/browser` |
| Node | 20+ (built on 24) |
| Environment variables | none |
| Route handling | Every route is prerendered to its own `index.html`. **No SPA catch-all rewrite** — an unknown path must fall through to `404.html` so it returns a real 404. |
| Headers | `vercel.json` (`frame-ancestors`, HSTS, Referrer-Policy, Permissions-Policy, nosniff, COOP/CORP, caching) |
| CSP | Fetch directives are injected into every page by `tools/apply-csp.mjs` as a `<meta>` tag, because the inline-script hashes are computed from the built output. `frame-ancestors` is header-only. |
| Source maps | Not emitted in production (verified: 0 `.map` files). |
| Analytics | None. |

**To go live:** set `siteUrl` in `src/environments/environment.production.ts` and
flip `siteUrlIsPlaceholder` to `false`. That single change enables canonical
tags, `og:url`, absolute `og:image`, the JSON-LD `url` field, `sitemap.xml` and
the `Sitemap:` line in `robots.txt` — all of which are suppressed until then.

## Launch-gated placeholders

- B.Tech branch at MANIT
- BOSCH / Ministry of Tourism technology stack
- Final domain (`siteUrlIsPlaceholder` in `src/environments/`)
- Client public-naming decision (`publicNameCleared` per project)
- Case-study narrative for the two deep-tier projects
