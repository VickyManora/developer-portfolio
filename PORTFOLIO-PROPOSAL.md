# Vicky Manora — Portfolio Website: Product, Design & Architecture Proposal

**Prepared for:** Vicky Manora — Senior Full Stack Engineer, 8+ years, B.Tech MANIT/NIT Bhopal
**Stack mandate:** Angular 20 · TypeScript · Three.js · GSAP · SCSS · RxJS/Signals
**Status:** Design proposal — no implementation code written yet
**Date:** 2026-09-04

## Locked decisions (confirmed by Vicky)

| Decision | Choice |
|---|---|
| Colour direction | Blue → teal signal gradient + sparse warm amber |
| Project structure | Full case-study routes (`/work/:slug`), prerendered |
| Hosting | Vercel |
| Concept | **Pending approval** — see Section 1 |

## Content integrity rule observed throughout

Nothing in this document invents a company, job title, achievement, technology, metric, project or responsibility. Every gap is explicitly marked **PLACEHOLDER** and listed in the final section.

---

# 1. Recommended Overall Concept

## "The Living System" — the portfolio *is* a running distributed architecture

One persistent 3D scene: a layered, luminous system-architecture graph — client layer, application layer, service layer, data/cloud layer — with nodes, edges, and light packets flowing between them. It is alive from the first frame. As the visitor scrolls, the camera moves *through* that system, and each section of the site is a different vantage point on the **same** structure.

### Why this concept over the alternatives

| Concept | Verdict |
|---|---|
| Digital developer workspace (desk/monitors) | **Rejected.** Cliché, asset-heavy (10–30MB GLTF), reads as a Blender showreel, and says nothing about seniority. Every junior portfolio has one. |
| Interactive code environment | **Rejected.** Fake IDEs are the number-one gimmick tell. Low information density, hostile on mobile, ages badly. |
| Digital operating system / desktop metaphor | **Rejected outright.** Directly violates the 10–20 second recruiter rule — novel navigation is a tax on the exact person you most need to convert. |
| 3D technology constellation | **Weak.** Particle spheres of tech logos are the generic default. Decorative, not meaningful. |
| **Futuristic architecture / network visualization** | **Chosen.** |

**The deciding argument: in every other concept the 3D is decoration. In this one, the 3D is the résumé.**

Vicky is a *frontend architect* doing *enterprise application development*, *cloud-native* work, *reusable component architecture*, with stated strengths in *application security* and *performance optimization*. A layered system graph is the literal artifact of that work. When a CTO sees a client layer feeding an application layer feeding services feeding data — with a security perimeter pulsing around it — they don't think "cool animation." They think *"this person thinks in systems."* That is the highest-value signal transmittable in 10 seconds.

### Two structural decisions that make it premium rather than gimmicky

1. **One scene, not eight toys.** A single persistent WebGL context and scene graph; sections are camera choreography plus state changes on the same object. This is what separates a product from a demo reel — and it is simultaneously the performance strategy.
2. **The 3D is diegetic.** In the Projects section the graph reconfigures into that project's architecture. Hovering a skill chip in the DOM pulses the corresponding node in 3D. The visualization carries information, so it never feels like filler.

Codebase working name for the scene: **`system-core`**.

---

# 2. Visual Direction

**Mood:** an engineering instrument, not a sci-fi movie. Think Linear × Vercel × a Grafana dashboard designed by a Swiss typographer. Restraint is the luxury signal.

## Palette (dark-first) — CONFIRMED

| Token | Value | Use |
|---|---|---|
| `--bg-void` | `#08090C` | page ground (never pure black — kills depth) |
| `--bg-surface` | `#0E1015` | cards, panels |
| `--bg-raised` | `#14171E` | hover, elevated |
| `--line-hairline` | `rgba(255,255,255,0.07)` | 1px borders, grids |
| `--text-primary` | `#EDEFF3` | headings, body |
| `--text-secondary` | `#9AA1AE` | supporting copy |
| `--text-tertiary` | `#5E6673` | mono labels, metadata |
| `--accent` | `#4D8DFF` → `#5EE9D0` gradient | primary signal (blue → teal) |
| `--accent-warm` | `#FFB86B` | sparse — active state, "now", one highlight per view |
| `--state-*` | conventional | form validation only |

**The neon rule (this is what keeps it out of "gaming website" territory):** saturated accent is permitted only on elements smaller than ~24px or thinner than 2px — data pulses, node cores, focus rings, the active nav tick. Large surfaces receive accent at ≤12% opacity.

The warm amber against cool blue is the deliberate differentiator: roughly 95% of developer portfolios are monochrome cyan. One warm accent instantly reads as *art-directed* rather than *templated*.

## Typography

- **Display / headings:** Geist Sans (alt: Satoshi) — geometric, engineered, not startup-generic
- **Body:** Inter — optical sizing, proven at small sizes
- **Mono:** Geist Mono (alt: JetBrains Mono) — section indices (`01 / EXPERIENCE`), dates, tech tags, coordinates, stat labels

The monospace microtype does enormous work: it communicates "engineer" without a single neon glow. Self-hosted, latin subset, **three weights total across all families**.

Scale: hero `clamp(2.8rem, 7vw, 6.5rem)`, tight tracking (`-0.03em`) on display, `1.7` line-height on body.

## Surface language

Frosted glass panels (`backdrop-filter: blur(20px)` + 1px hairline + inner top highlight), hairline grid overlays at 3% opacity, tick marks and corner brackets on cards, subtle vignette. Radius `12px` on cards, `6px` on chips — restrained, not pill-shaped.

## Optional (Phase 6): "Blueprint" light theme

Off-white paper, ink-blue lines, the same 3D graph rendered as a technical drawing. Shipping both themes from a single token swap is itself a craft signal. Not in the critical path.

---

# 3. Homepage Experience — the first 20 seconds

**Hard constraint: the `<h1>` is the LCP element and it paints before WebGL initializes.** The 3D fades in behind already-readable content. A recruiter on bad hotel wifi must receive the full message even if the canvas never loads.

## Load timeline

- **0–400ms** — Prerendered HTML paints: name, role, positioning line, proof chips, CTAs. A static gradient + grid backdrop stands in for the canvas.
- **400–1200ms** — Canvas fades in over 800ms as the system "comes online": nodes resolve out of darkness layer by layer (data → services → application → client), edges draw, first packets flow. Skippable, non-blocking, opacity/shader-driven only.
- **Steady state** — Slow orbital drift plus damped mouse parallax capped at 3°. Packets flow continuously.

## Hero content hierarchy

```
01 / SENIOR FULL STACK ENGINEER            ← mono eyebrow

Vicky Manora                                ← H1, display

[PLACEHOLDER: one-sentence positioning line — Vicky's own words]

[8+ YEARS] [ANGULAR · REACT · NODE] [AWS · AZURE]    ← proof chips

[ View Work ]   [ Download Résumé ]              ← primary + secondary CTA
GitHub  ·  LinkedIn                              ← visible, not buried in the footer
```

Who, what, how senior, proof of stack, and how to contact — all above the fold in a single glance. The 3D sits behind at roughly 35% visual weight and never competes.

A scroll affordance sits bottom-centre. A slim **"Reduce motion / Performance mode"** toggle sits in the header — visible craft, and a nod to the accessibility-aware reviewer.

---

# 4. 3D Concept — detailed specification

## The object

A volumetric graph of ~180–260 nodes (desktop) arranged in four horizontal strata:

| Stratum | Depth | Contents |
|---|---|---|
| **L3 · Client / Edge** | nearest, brightest | Angular, React, TypeScript, browser/UI nodes |
| **L2 · Application** | mid, densest | domain logic, reusable component clusters, API gateway |
| **L1 · Services** | mid-deep | Node/Express, Python, .NET, C/C++ workers, Jenkins, test runners |
| **L0 · Data / Cloud** | deepest, coolest | SQL, MongoDB, AWS, Azure, storage grid plane |

Connected by curved edges carrying directional light packets at varied speeds. A faint wireframe perimeter encloses the whole structure and pulses on a slow cycle — a quiet nod to *application security*. A ground grid fades into fog below L0 for depth.

Everything is **procedural geometry** — instanced octahedra/icosahedra for nodes, GPU-animated curves for edges. **Zero downloaded 3D models.** Total scene payload: geometry generated at runtime from a ~15KB baked JSON of node positions. This is why it can be simultaneously spectacular and fast.

## Camera choreography per section

| Section | Camera / scene behaviour |
|---|---|
| **Hero** | Wide three-quarter establishing shot. Full system alive. Drift plus parallax. |
| **Intro** | Slow push-in; global emissive dims 40% so text dominates. |
| **Experience** | Camera tracks laterally along the system spine. Each role is a waypoint; arrival illuminates a cluster and its edges. Reads as a career traversal through increasingly complex systems — not a game level. |
| **Projects** | The money moment. Camera orbits to a subgraph; the graph **reconfigures** into that project's shape while non-relevant nodes desaturate to 15%. Each project literally displays its own architecture. |
| **Skills** | Layers separate vertically into a clean stacked diagram, now legible as a real architecture chart. **Two-way binding:** hovering a DOM skill chip pulses its 3D node; clicking a 3D node scrolls to and highlights the chip. |
| **Strengths** | Camera holds; strength cards light targeted regions (e.g. "Performance optimization" accelerates packet flow; "Application security" pulses the perimeter). One subtle effect each. |
| **Education** | Wide pull-back, system at rest, low intensity. A content-first moment. |
| **Contact** | Flow converges to a single bright node. On submit, one packet fires outward through the perimeter. One beat of delight, then done. |

## What the 3D deliberately does NOT do

No text rendered in WebGL. No 3D navigation. No scroll-hijacking. No mandatory loading screen. No physics playground. No sound. The DOM always owns content, focus order, and reading order.

---

# 5. Navigation Concept

**Structure:** a scroll narrative for the main page plus **real routes for case studies**. Case studies as routes (`/work/krista-agentic-platform`) rather than modals means shareable, indexable, prerenderable pages — a recruiter can be sent a direct link to one project. This outweighs the marginal smoothness of a modal. *(Confirmed.)*

Three coordinated layers:

1. **Top bar** — slim, glass, sticky. Node-glyph logomark · section links · `Résumé ↓` as the persistent CTA. Compresses on scroll. GitHub/LinkedIn icons always visible.
2. **Layer rail** (desktop, right edge) — vertical monospace list of sections with tick marks and a progress indicator, styled like instrument gauges. Provides spatial orientation in a long scroll, doubles as jump navigation, and reinforces the "system layers" metaphor.
3. **Command palette (⌘K)** — jump to section, open a project, download résumé, copy email, toggle motion/theme. Cheap to build, quietly delightful, speaks directly to the technical visitor. Fully keyboard-accessible and never the only way to do anything.

Router fragments sync with scroll position so URLs are deep-linkable and the back button behaves correctly. On mobile the top bar collapses to logo plus menu, the layer rail becomes a 2px top progress bar, and the menu opens as a full-screen sheet.

---

# 6. Section Structure

| # | Section | Purpose | Content status |
|---|---|---|---|
| 00 | **Hero** | Identity in 3 seconds | Positioning line = **PLACEHOLDER** |
| 01 | **Introduction** | 60–80 word professional summary, quick stats (8+ yrs · 4 companies · 6 flagship projects), résumé CTA | Summary = **PLACEHOLDER** |
| 02 | **Experience** | Krista AI, Larsen & Toubro, HCL Technologies, Vodafone Idea. Vertical timeline; cards expand to responsibilities and stack | Dates, locations, 2–4 bullets per role = **PLACEHOLDER** |
| 03 | **Featured Work** | 6 project cards linking to case-study routes. Card shows name, one-liner, domain tag, stack chips | One-liners, problem/role/stack/outcome = **PLACEHOLDER** |
| 04 | **Technical Skills** | 15 technologies grouped by architecture layer (Client / Application / Services / Data & Cloud / Delivery & Quality). Interactive with the 3D graph | ✅ Complete from provided list |
| 05 | **Engineering Strengths** | 11 strengths as a card grid, each with an icon and one clarifying sentence | Names ✅ / one-liners = **PLACEHOLDER** |
| 06 | **Education** | B.Tech, MANIT (NIT Bhopal) | Branch and years = **PLACEHOLDER** |
| 07 | **Contact** | Email CTA, optional form, GitHub, LinkedIn, location, availability | Email, URLs, location = **PLACEHOLDER** |
| — | **Footer** | Résumé download, socials, built-with note, back-to-top | — |
| — | **`/work/:slug`** | Case study: context → challenge → role → architecture → stack → outcome | All = **PLACEHOLDER** |

Skills are grouped by *architecture layer* rather than alphabetically or by frontend/backend split — this maps onto the 3D scene and demonstrates architectural thinking instead of presenting a laundry list.

### Confirmed technology list (verbatim, nothing added)

Angular 20 · React · TypeScript · JavaScript · Node.js · Express.js · Python · C/C++ · C#/.NET · AWS · Azure · SQL · MongoDB · Git · Jenkins · Karma/Jasmine

### Confirmed strengths list (verbatim, nothing added)

Full stack engineering · Frontend architecture · Enterprise application development · Application security · Performance optimization · SEO · Reusable component architecture · UI/UX modernization · Cloud-native development · AI-assisted development · Technical ownership

### Confirmed experience (verbatim, nothing added)

Krista AI — Senior Software Engineer · Larsen & Toubro — Senior Software Engineer · HCL Technologies — Lead Engineer · Vodafone Idea — Front-end Developer

### Confirmed projects (verbatim, nothing added)

Krista Agentic Platform · Unitrax banking/finance SaaS · BOSCH / Ministry of Tourism · Chevron Data Marketplace · EKA Analytics Platform · Western Union Money Transfer

---

# 7. Angular Architecture

**Angular 20, standalone-only, signals-first, zoneless.**

## The single most important architectural decision

**Zoneless change detection.** With Zone.js, a Three.js `requestAnimationFrame` loop triggers change detection on every frame — 60 CD cycles per second across the entire component tree, permanently. `provideZonelessChangeDetection()` eliminates this and lets the render loop run at full speed while Angular re-renders only on genuine signal changes. (Stability status to be confirmed against the installed v20 at scaffold time; the fallback is `ngZone.runOutsideAngular` around the loop.)

## Rendering and delivery

- **SSR with full prerendering (SSG)** via `@angular/ssr` — every route becomes static HTML at build time. Best possible SEO and LCP, no server required.
- **Incremental hydration** using `@defer (hydrate on viewport)` on below-fold sections — ships almost no JavaScript for content the visitor has not reached.
- The 3D layer is `@defer (on idle)` and browser-guarded, in its own lazy chunk. Three.js never touches the critical path.

## State

- **Signals** for all UI and scene state. A `SceneStateService` exposes `activeSection`, `scrollProgress`, `qualityTier`, `reducedMotion`, `hoveredSkill` as signals; the Three layer reads them each frame with zero subscriptions.
- **RxJS** only where it is genuinely the right tool: `fromEvent` scroll/resize/pointer streams, IntersectionObserver wrappers, debounce/throttle — then `toSignal()` at the boundary. Not for state.
- `computed` / `linkedSignal` for derived values such as quality tier from device capability plus user preference.

## Component design

- Every component `standalone`, `ChangeDetectionStrategy.OnPush`, signal-based `input()` / `output()`, `host` metadata rather than `@HostBinding`.
- **Content as typed data, never as markup.** `experience.data.ts`, `projects.data.ts`, `skills.data.ts` export typed const arrays; sections render from data. This is what allows SEO metadata, JSON-LD, the command palette, the 3D node mapping, and the HTML résumé to all derive from one source of truth — and it means content edits never touch templates.
- Cross-cutting behaviour lives in **directives**, not wrapper components: `[appReveal]`, `[appMagnetic]`, `[appTilt]`, `[appSceneAnchor]`.

## Core services

`ThreeEngineService` (lifecycle) · `SceneDirectorService` (scroll → camera/state mapping) · `ScrollService` · `DeviceCapabilityService` (GPU tier, memory, connection, touch) · `MotionPreferenceService` · `ThemeService` · `SeoService` (title/meta/OG/JSON-LD per route) · `AnalyticsService` (privacy-friendly — **PLACEHOLDER: analytics wanted?**)

## Boundary rule

The `three/` directory contains **zero Angular imports**. It is a framework-agnostic TypeScript engine, reachable only through `ThreeEngineService`. This keeps the 3D testable in isolation, prevents change-detection leakage, and means the engine could be lifted into any framework. Enforced by an ESLint import-boundary rule.

---

# 8. Three.js Architecture

```
ThreeEngineService        (Angular bridge — lifecycle only)
        │
   RenderLoop             single rAF, fixed-step clock, visibility-aware
        │
   SceneManager           renderer · camera · lights · fog · postFX
        │
   SystemGraph            NodeField · EdgeField · PacketField · Perimeter · GroundGrid
        │
   Chapters[]             Hero · Experience · Projects · Skills · Contact
        │
   QualityManager · AssetBudget · PointerRaycaster (throttled)
```

**Chapter interface** — each chapter implements `enter()`, `update(dt, state)`, `leave()`, `dispose()`. The director activates chapters from scroll progress and cross-fades their camera keyframes. Adding a section means adding a chapter, not modifying the engine.

## Performance-critical rendering decisions

- **`InstancedMesh` for all nodes** — one draw call for 260 nodes. Per-instance colour, scale and emissive supplied as instanced attributes and animated in the vertex shader.
- **Edges as a single merged geometry** with a custom shader; flow packets are a GPU-driven point system animated along baked curve UVs. **No per-frame JavaScript position updates** — the CPU sends one uniform (elapsed time) per frame.
- **Budget: under 30 draw calls, under 60k triangles.** Phone-friendly, yet still looks expensive, because the beauty comes from shading and motion rather than polygon count.
- **Custom GLSL** for: node emissive pulse, edge flow with distance falloff, ground grid with logarithmic fade, perimeter fresnel, depth-based atmospheric tint.
- **Post-processing:** *selective* bloom on emissive nodes only, low strength, desktop tier only. This is the highest-risk "neon" element — if it reads as gamey in review it gets cut. Everything else is done in-shader.
- **Renderer config:** `antialias: false` plus SMAA (MSAA on capable GPUs), DPR clamped to `min(devicePixelRatio, 2)` and adaptive, ACES Filmic tonemapping, sRGB output, `powerPreference: 'high-performance'`.
- **Raycasting** throttled to ~15Hz, restricted to the skills chapter, tested against a coarse proxy — never per-frame against real geometry.
- **Loop pauses** on `visibilitychange` and when the canvas leaves the viewport.
- **Disposal discipline:** every geometry, material, texture and render target registered in a chapter-scoped disposal bag. No leaks across navigation.

## Labels

3D node labels are **DOM elements** positioned from projected world coordinates — crisp at any DPR, real selectable text, screen-reader-visible where meaningful. No `TextGeometry`, no SDF font atlases, no extra payload.

## Fallbacks

No WebGL2 → static prerendered poster image plus CSS gradient. Reduced motion → the scene renders exactly one composed frame, then freezes. Both paths preserve layout identically, so nothing shifts.

---

# 9. Animation Strategy

**One authority per domain — no overlapping systems.**

| Domain | Tool | Rationale |
|---|---|---|
| Scroll orchestration | **GSAP + ScrollTrigger** | Single source of scroll truth; publishes a normalized `progress` signal consumed by the 3D director. Prevents the classic bug of two scroll systems fighting. |
| DOM micro-interactions (hover, focus, press, chips) | **CSS transitions** | Cheapest possible; no JS on the hot path. |
| Section and list enter/exit | **GSAP timelines** via `[appReveal]` | Stagger control and replayability. |
| Continuous 3D | **Engine rAF** | Never GSAP-ticked. |

**Motion tokens:** durations `120 / 200 / 320 / 560 / 900ms`; easings — `expo.out` for entrances, `power2.inOut` for camera, a custom cubic for layer separation.

**Rules:**

- `transform` and `opacity` only. Nothing that triggers layout. `will-change` applied surgically and removed afterwards.
- **No scroll-jacking.** Native scroll always. Optional light smoothing (Lenis) only if it survives an INP check — otherwise dropped.
- Text reveals are **line-based clip masks**, not per-letter. Per-character animation appears exactly once, on the hero name, on first load. Overusing it is the fastest way to look like a template.
- Nothing bounces, wobbles, or overshoots by more than 4%. Overshoot reads as playful; this site should read as precise.
- Every entrance animation is `once: true` with a maximum 600ms duration, so scrolling back is never sluggish.

**Reduced motion is a genuinely different experience, not a degraded one:** content appears instantly at final state, the 3D freezes on a composed frame, parallax is off, nothing auto-animates. Tested as a first-class path.

---

# 10. Responsive / Mobile Strategy

Not "the same scene, smaller." Three explicit tiers, selected by `DeviceCapabilityService` at boot and adjustable at runtime:

| Tier | Trigger | 3D behaviour |
|---|---|---|
| **Full** | Desktop, WebGL2, GPU tier ≥2, ≥8 logical cores | ~260 nodes, selective bloom, SMAA, DPR ≤2, parallax, raycasting |
| **Lite** | Mobile/tablet, mid GPU, or measured FPS <45 for 2s | ~90 nodes, no post-processing, DPR ≤1.5, scroll-driven only (no gyro/parallax), simplified shaders, shorter camera moves |
| **Static** | No WebGL2, save-data, low-end device, or reduced-motion | Poster image plus CSS gradient. Three.js is never downloaded. |

Auto-downgrade is one-way within a session and remembered in `sessionStorage`, so it can never oscillate. The manual header toggle always wins.

**Layout:** breakpoints at `640 / 900 / 1200 / 1600`. Mobile is single-column with generous vertical rhythm; the layer rail becomes a top progress bar; the experience timeline gains a left spine; project cards stack full-width; the skills grid goes 2-up.

**Touch:** nothing important lives behind hover. Skill chips are tappable to expand. Touch targets ≥44px. The 3D canvas never captures touch events on mobile — the page must scroll under a finger anywhere on screen, always.

**Mobile acceptance bar:** sustained 60fps on an iPhone 12 / mid-range Android, and full content usability with the canvas disabled entirely.

---

# 11. Performance Strategy

## Budgets (enforced in CI, not aspirational)

| Metric | Target |
|---|---|
| App JS, initial (excluding Three) | < 180KB gzip |
| Three.js chunk (tree-shaken, lazy) | < 150KB gzip |
| Total first-load transfer | < 350KB gzip |
| LCP (4G, mid-range mobile) | < 2.0s |
| INP | < 200ms |
| CLS | < 0.02 |
| Lighthouse Performance | ≥ 95 desktop / ≥ 90 mobile |
| Frame time | < 16.6ms on Full and Lite tiers |

## How the budgets are met

- **Prerendered static HTML** for every route — first paint is server-quality with no JavaScript.
- **Three.js is never in the initial bundle.** Lazy chunk loaded on idle after the hero paints. Individual module imports only; no barrel imports, no unnecessary `examples/jsm`.
- **No 3D model files.** Procedural geometry from a ~15KB baked position JSON. This alone saves 10–30MB versus a workspace-scene concept.
- **`@defer` per section** with viewport triggers, plus incremental hydration, so untouched sections ship no JavaScript.
- **Fonts:** self-hosted WOFF2, latin subset, three weights total, `font-display: swap`, `<link rel="preload">` for the two used above the fold.
- **Images:** AVIF with WebP fallback, explicit `width`/`height` (CLS = 0), lazy below the fold, responsive `srcset`.
- **CSS:** SCSS compiled to a small critical bundle; component styles scoped and lazy-loaded with their chunks.
- **Node graph layout precomputed at build time** and baked — never solved in the browser.
- **Instrumentation:** `web-vitals` reporting, a `?debug` overlay showing FPS / draw calls / triangles / memory, and Lighthouse CI in the deploy pipeline that **fails the build** on budget regression. Budgets that are not enforced are decoration.

**Core insight:** this concept is *cheaper* than a conventional 3D portfolio, not more expensive — because its impact comes from shaders and choreography rather than from downloaded assets.

---

# 12. Accessibility Strategy — WCAG 2.2 AA

- **The canvas is decorative.** `aria-hidden="true"`, not focusable, never the sole carrier of information. Everything meaningful in the 3D also exists in the DOM.
- **Contrast is the number-one risk** with glass panels over a moving scene. Non-negotiable mitigation: body text never sits directly over animated 3D. Every text block receives a scrim panel with a guaranteed minimum opacity. All text verified at ≥4.5:1 (≥3:1 for large display) against its *actual composited* backdrop, not against the token colour.
- **Keyboard:** full traversal, DOM order matching visual order, skip-to-content link, visible 2px accent focus ring with offset (never `outline: none`), correct focus trapping in the command palette and mobile menu, `Esc` closes everything.
- **Motion:** `prefers-reduced-motion` respected everywhere, *plus* a manual toggle — many users on shared or managed machines never set the OS flag. Nothing flashes more than three times per second.
- **Semantics:** one `<h1>` per route, correct heading nesting, `<nav>` / `<main>` / `<section aria-labelledby>` / `<footer>` landmarks, `aria-current` on the active nav item, real `<time>` elements for dates.
- **Interactive 3D nodes** in the skills section have DOM-equivalent controls; the graph is a progressive enhancement over an already-complete chip grid.
- **Forms:** persistent visible labels, `aria-describedby` error text, errors announced via a polite live region, no placeholder-as-label.
- **Testing:** axe-core in CI, manual passes with VoiceOver plus keyboard-only, 200% zoom, and forced-colors mode.

Building this properly is itself a hiring signal — an engineering manager who tabs through the site and finds clean focus management has already learned something about how Vicky works.

---

# 13. SEO Strategy

- **Static prerendering** of every route (home, one page per case study, and an HTML `/resume` page). Full content present in the HTML source, with no reliance on crawler JavaScript execution.
- **Per-route metadata** from `SeoService`, driven by the same typed content data: unique `<title>`, meta description, canonical URL, Open Graph and Twitter card tags, and a **generated OG image per case study** (built at build time from the design system, so a shared LinkedIn link looks designed rather than default).
- **Structured data (JSON-LD):**
  - `Person` — name, jobTitle, `alumniOf` (MANIT / NIT Bhopal), `knowsAbout` (the technology list), `worksFor`, `sameAs` [GitHub, LinkedIn]
  - `WebSite` and `BreadcrumbList`
  - `CreativeWork` per case study
  - This is what makes a Google knowledge panel on his own name achievable — high ROI for a personal site.
- **An HTML résumé page, not only a PDF.** PDFs index poorly; recruiters and ATS-adjacent tooling search text. Generated from the same data source as the PDF, so the two can never diverge.
- **Technical hygiene:** `sitemap.xml`, `robots.txt`, semantic HTML, descriptive `alt` text, real `<a href>` anchors for all navigation (never click handlers on divs), clean lowercase slugs.
- **Core Web Vitals** are a ranking input, so Section 11 is also part of the SEO strategy.
- **PLACEHOLDER:** domain name, any target keywords beyond the personal name, and whether to reserve a `/writing` route for later. Recommendation: reserve the route now even if empty — long-form writing is the strongest long-term SEO asset a personal site can have.

---

# 14. Suggested Folder Structure

```
portfolio/
├── public/
│   ├── fonts/                          # self-hosted woff2 subsets
│   ├── images/{projects,og}/
│   ├── scene/graph-layout.json         # baked node positions (~15KB)
│   ├── scene/poster-{dark,light}.avif  # static fallback
│   ├── vicky-manora-resume.pdf
│   ├── robots.txt
│   └── sitemap.xml
│
├── src/
│   ├── app/
│   │   ├── app.config.ts               # zoneless, router, hydration, providers
│   │   ├── app.routes.ts
│   │   ├── app.component.{ts,html,scss}
│   │   │
│   │   ├── core/
│   │   │   ├── services/               # scene-state, scroll, device-capability,
│   │   │   │                           # motion-preference, theme, seo, analytics
│   │   │   ├── tokens/                 # WINDOW, DOCUMENT, IS_BROWSER
│   │   │   └── models/                 # Experience, Project, Skill, Strength, SeoMeta
│   │   │
│   │   ├── shared/
│   │   │   ├── ui/                     # button, chip, card, panel, section-header,
│   │   │   │                           # stat, tag, icon, dialog, command-palette
│   │   │   ├── directives/             # reveal, magnetic, tilt, scene-anchor, in-view
│   │   │   └── pipes/
│   │   │
│   │   ├── layout/
│   │   │   ├── header/
│   │   │   ├── footer/
│   │   │   ├── layer-rail/
│   │   │   └── mobile-menu/
│   │   │
│   │   ├── features/
│   │   │   ├── hero/
│   │   │   ├── intro/
│   │   │   ├── experience/
│   │   │   ├── work/                   # list + case-study/ route component
│   │   │   ├── skills/
│   │   │   ├── strengths/
│   │   │   ├── education/
│   │   │   ├── contact/
│   │   │   └── resume/
│   │   │
│   │   ├── three/                      # ⚠ ZERO Angular imports (ESLint-enforced)
│   │   │   ├── engine/                 # render-loop, scene-manager, quality-manager,
│   │   │   │                           # disposal-bag, pointer-raycaster
│   │   │   ├── director/               # scene-director, camera-keyframes, chapter.ts
│   │   │   ├── chapters/               # hero, experience, projects, skills, contact
│   │   │   ├── objects/                # node-field, edge-field, packet-field,
│   │   │   │                           # perimeter, ground-grid
│   │   │   ├── shaders/                # *.vert.glsl, *.frag.glsl
│   │   │   └── config/                 # palette, budgets, quality-presets
│   │   │
│   │   ├── content/                    # ★ single source of truth
│   │   │   ├── profile.data.ts
│   │   │   ├── experience.data.ts
│   │   │   ├── projects.data.ts
│   │   │   ├── skills.data.ts
│   │   │   ├── strengths.data.ts
│   │   │   ├── education.data.ts
│   │   │   └── seo.data.ts
│   │   │
│   │   └── bridge/
│   │       └── three-engine.service.ts # the only Angular ↔ Three seam
│   │
│   ├── styles/
│   │   ├── _tokens.scss
│   │   ├── _typography.scss
│   │   ├── _mixins.scss
│   │   ├── _reset.scss
│   │   ├── _themes.scss
│   │   ├── _motion.scss
│   │   └── styles.scss
│   │
│   ├── index.html
│   ├── main.ts
│   ├── main.server.ts
│   └── server.ts
│
├── tools/                              # build-time: graph layout gen, OG images, sitemap
├── e2e/                                # Playwright (visual + accessibility regression)
├── lighthouserc.json
├── angular.json
├── tsconfig.json
└── package.json
```

Two structural rules worth highlighting: **`content/` is the single source of truth** for site copy, SEO metadata, JSON-LD, the résumé page, the command palette and the 3D node mapping — one edit propagates everywhere. And **`three/` is Angular-free**, enforced by lint rather than convention.

---

# 15. Phase-by-Phase Implementation Plan

| Phase | Deliverable | Notes |
|---|---|---|
| **0 · Content lock** | Fill every PLACEHOLDER; commit typed `content/*.data.ts` | Joint effort. Design built on placeholder copy always gets rebuilt. Cheapest phase to do properly. |
| **1 · Foundation** | Angular 20 scaffold, zoneless, SSR/prerender, routing, SCSS token system, typography, theme service, ESLint/Prettier/Husky, CI plus Lighthouse budgets, Vercel project | No visuals yet. Guardrails first — budgets added at the end are always ignored. |
| **2 · Content-complete site, zero 3D** | Every section fully built, responsive, accessible, semantic, prerendered, with the static poster backdrop | **Critical milestone.** The site must be genuinely impressive and 100% functional *before* any WebGL exists. This guarantees the fallback is a real experience and that the 3D is enhancement, never dependency. |
| **3 · Motion layer** | GSAP + ScrollTrigger, reveal/stagger system, magnetic and tilt directives, page transitions, reduced-motion path | The site now feels premium on its own. |
| **4 · The 3D system** | Three engine, render loop, `SystemGraph` objects, custom shaders, quality manager, hero chapter | First WOW. Ships behind `@defer`, measured against budgets from day one. |
| **5 · Scene choreography** | All chapters, camera keyframes, scroll↔scene binding, project subgraph reconfiguration, skills↔DOM two-way interaction, contact pulse | The concept fully realized. |
| **6 · Depth and polish** | Case-study routes, command palette, HTML résumé plus PDF, OG image generation, JSON-LD, sitemap, optional Blueprint light theme, micro-copy pass | Where "good portfolio" becomes "memorable portfolio". |
| **7 · Hardening and launch** | Cross-browser and real-device matrix, Lite/Static tier verification, axe + VoiceOver + keyboard audit, Lighthouse mobile and desktop, throttled 3G test, analytics, custom domain, Vercel production deploy | — |

**Phase 2 is the discipline that makes this work.** Most 3D portfolios build the spectacle first and bolt content on afterwards — which is precisely why they end up slow, inaccessible, and forgettable to the recruiter who bounced at four seconds. This plan inverts that order.

---

# Content required from Vicky (all currently PLACEHOLDER)

Nothing below is invented. These are gaps deliberately left unfilled.

## Essential — blocks Phase 0

1. **Hero positioning line** — one sentence, own words, on what he builds
2. **Professional summary** — 60–80 words
3. **Per role** (Krista AI, Larsen & Toubro, HCL Technologies, Vodafone Idea): dates, location, and 2–4 bullets each
4. **Per project** (Krista Agentic Platform, Unitrax, BOSCH / Ministry of Tourism, Chevron Data Marketplace, EKA Analytics Platform, Western Union Money Transfer): one-line description, specific role, tech stack, and — only if comfortable and genuinely real — outcomes
5. **Education:** branch and years at MANIT
6. **Contact:** public email, GitHub URL, LinkedIn URL, city/country
7. **Résumé PDF**
8. **Domain name**

## Optional — improves the site

9. One sentence for each of the 11 engineering strengths
10. Professional photo (or type-only, which can read more premium)
11. Availability status ("Open to opportunities" / "Not looking")
12. Project screenshots — or abstract generated architecture visuals where NDAs apply
13. Whether any client requires anonymization (e.g. "a global energy company" instead of "Chevron")
14. Whether analytics are wanted (privacy-friendly, e.g. Plausible)

---

## Open question for review

**Does the "Living System" concept get approved as the direction?** Three options were presented:

1. **Approved as specified** — layered system-architecture graph, camera choreography per section, diegetic project subgraphs, DOM↔3D skill interaction.
2. **Approved with simpler 3D** — same visual concept, but the 3D remains an ambient backdrop only, with no per-section reconfiguration or DOM↔3D interaction. Faster to build, lower risk, less memorable.
3. **Develop an alternative concept** to the same depth before deciding.

Colour direction, case-study routing, and Vercel hosting are already confirmed.
