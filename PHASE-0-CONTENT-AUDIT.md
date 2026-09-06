# PHASE 0 — Content Audit & Content Matrix

**Source of truth:** `Vicky Manora Full Stack Developer.pdf` (2 pages)
**Located at:** `~/Downloads/paris bites/Vicky Manora Full Stack Developer.pdf` (identical copies also in `~/Downloads/`)
**Extracted:** 2026-09-04 via macOS PDFKit
**Audit date:** 2026-09-04

## Legend

| Tag | Meaning |
|---|---|
| ✅ **[CONFIRMED FROM RESUME]** | Present verbatim in the resume. Used as-is. |
| ❓ **[NEEDS INPUT]** | Not in the resume. Will not be invented. |
| ⚪ **[OPTIONAL]** | Not required for content-completeness; improves the site. |
| ⚠️ **[CONFLICT]** | The resume contains contradictory or stale data requiring a decision. |

**Integrity statement:** every ✅ item below traces to a literal line in the resume. Nothing has been inferred, rounded, embellished, or filled in. Inferences that *look* obvious (such as which company each project belongs to) are deliberately tagged ❓ rather than ✅.

---

# 1. PROFILE

| Field | Status | Value |
|---|---|---|
| Full name | ✅ | Vicky Manora |
| Resume header title | ✅ | FULL STACK DEVELOPER |
| Summary-line title | ✅ | Senior Full Stack Engineer |
| Site-facing role title | ⚠️ **[CONFLICT]** | Resume uses two different titles. Recommend **Senior Full Stack Engineer** (matches your brief and current seniority). Needs your confirmation. |
| Years of experience | ⚠️ **[CONFLICT]** | Resume states "8+ years". Earliest employment is Jun 2017; as of Sep 2026 that is **9 years 3 months**. "8+" now understates you. Recommend **9+ years**, or auto-compute from Jun 2017 so it never goes stale. |
| Location | ✅ | Pune |
| Alumnus positioning | ✅ | "NIT Bhopal alumnus" |
| Professional photo | ❓ ⚪ | Not in resume. Type-only is a valid premium choice. |
| Pronouns | ⚪ | Not needed; site copy will avoid the issue. |
| Availability status | ❓ | Not in resume. E.g. "Open to opportunities" / "Not looking" / omit. |

---

# 2. HERO

| Field | Status | Notes |
|---|---|---|
| Name | ✅ | Vicky Manora |
| Eyebrow / role | ✅ (pending title decision) | SENIOR FULL STACK ENGINEER |
| Positioning line | ❓ | Not in resume as a single line. **I can derive three options purely by compressing your existing resume summary** — no new claims — for you to pick or edit. See "Derived copy for approval" below. |
| Proof chip 1 — experience | ✅ (pending years decision) | `9+ YEARS` |
| Proof chip 2 — core stack | ✅ | `ANGULAR · REACT · NODE.JS` |
| Proof chip 3 — cloud | ✅ | `AWS · AZURE` |
| Proof chip 4 — education | ✅ | `NIT BHOPAL` |
| Primary CTA | ✅ | View Work |
| Secondary CTA | ✅ | Download Résumé (file exists) |
| GitHub link | ✅ | `https://github.com/VickyManora` (resume URL carries a `?tab=repositories` query string — will be normalized) |
| LinkedIn link | ✅ | `https://www.linkedin.com/in/vicky-manora-165638ba/` |

### Derived copy for approval (NOT marked confirmed — your sign-off required)

All three are recombinations of sentences already in your resume summary. Pick one, edit it, or write your own.

- **A.** "I build secure, high-performance web applications — from frontend architecture to cloud-native delivery."
- **B.** "Senior full stack engineer specializing in secure, high-performance web applications across Angular, React, Node.js, AWS and Azure."
- **C.** "I take enterprise applications from design to production — with security, performance and technical ownership."

---

# 3. PROFESSIONAL SUMMARY

**Status: ✅ [CONFIRMED FROM RESUME] — usable verbatim, ~57 words, ideal length.**

> Senior Full Stack Engineer (8+ years), NIT Bhopal alumnus, specializing in secure, high-performance web applications. Strong background in Angular, React, Node.js, and cloud-native architectures (AWS & Azure). Known for improving application security, optimizing delivery timelines using AI-driven development, and driving projects from design to production with technical ownership.

Only change proposed: `8+` → `9+` (or auto-computed). Everything else stands as written.

**Quick stats strip** — all ✅ derived by counting resume entries:
`9+ YEARS` · `4 COMPANIES` · `6 FLAGSHIP PROJECTS` · `NIT BHOPAL`

---

# 4. EXPERIENCE

## 4.1 Companies, titles and dates — ✅ all confirmed

| # | Company | Title | Dates | Duration | Location |
|---|---|---|---|---|---|
| 1 | Krista AI | Senior Software Engineer | Aug 2024 – Present | 2 yr 1 mo | ❓ |
| 2 | Larsen and Toubro Ltd. | Senior Software Engineer | Sep 2021 – Aug 2024 | 2 yr 11 mo | ❓ |
| 3 | HCL Technologies | Lead Engineer | Apr 2020 – Jul 2021 | 1 yr 3 mo | ❓ |
| 4 | Vodafone Idea Ltd. | Front-end Developer | Jun 2017 – Apr 2020 | 2 yr 10 mo | ✅ Pune |

Company names, titles and all dates are verbatim. Durations are arithmetic on those dates, not claims.

## 4.2 ⚠️ CONFLICT 1 — Per-project titles contradict company titles

Your resume's PROJECTS section assigns a *different* job title to each project, and several contradict the company title for the same period:

| Project | Project-level title | Company title for that period |
|---|---|---|
| Unitrax (Sep 2023 – Aug 2024) | "Front end Developer" | L&T — **Senior Software Engineer** |
| BOSCH (Sep 2022 – Sep 2023) | "Front-end Developer" | L&T — **Senior Software Engineer** |
| Chevron (Apr 2022 – Jul 2022) | "Full Stack Developer" | L&T — **Senior Software Engineer** |
| EKA (Sep 2021 – Mar 2022) | "Front-end developer" | L&T — **Senior Software Engineer** |
| Western Union (Apr 2020 – Apr 2021) | "Front-end developer" | HCL — **Lead Engineer** |

On a resume this passes unnoticed. On a portfolio where experience and projects sit on the same scrolling page, a recruiter sees "Senior Software Engineer" and "Front-end Developer" for the same months and it reads as inconsistent — actively undercutting your seniority.

**Recommendation:** show only the **company-level title** on the Experience timeline, and label projects with a neutral scope descriptor (e.g. "Frontend lead", "Full stack") or no title at all. Needs your decision.

## 4.3 ⚠️ CONFLICT 2 — Project-to-company attribution is not stated

The resume never says which project belongs to which employer. The dates make it strongly inferable, but **inference is not confirmation**, so this is tagged ❓:

| Project | Date range | Falls inside | Status |
|---|---|---|---|
| Krista Agentic Platform | Aug 2024 – Present | Krista AI | ❓ confirm |
| Unitrax | Sep 2023 – Aug 2024 | L&T | ❓ confirm |
| BOSCH / Ministry of Tourism | Sep 2022 – Sep 2023 | L&T | ❓ confirm |
| Chevron Market Dataplace | Apr 2022 – Jul 2022 | L&T | ❓ confirm |
| EKA Analytic Platform | Sep 2021 – Mar 2022 | L&T | ❓ confirm |
| Western Union Money Transfer | Apr 2020 – Apr 2021 | HCL | ❓ confirm |

One yes/no from you converts all six to ✅.

## 4.4 ❓ GAP — Vodafone Idea has no content at all

Jun 2017 – Apr 2020 is **2 years 10 months — 31% of your career** — with zero bullets, zero projects and zero technologies in the resume. In a timeline UI this renders as a visibly empty card at the foundation of your story.

**Needs input:** 2–3 bullets and the technologies used. If you'd rather not expand it, we design the card as deliberately minimal (role, dates, one line) rather than leaving it looking unfinished.

## 4.5 ❓ Per-company responsibility bullets

The resume attaches all bullets to *projects*, not to *companies*. The Experience timeline therefore has project links but no role-level narrative. Two options:

- **(a)** Experience cards show role + dates + the projects delivered there (no new content needed) — **recommended, zero writing for you**
- **(b)** You write 2–3 role-level bullets per company

## 4.6 ❓ Company locations

Only Vodafone Idea has a location (Pune) in the resume. Krista AI, L&T and HCL locations are ❓ — or we omit locations entirely for consistency.

---

# 5. PROJECTS

All six projects are ✅ confirmed by name, date, technology stack and achievement bullets. Full extraction below.

## 5.1 Krista — Agentic Platform for Your Entire Enterprise

| Field | Status | Value |
|---|---|---|
| Name | ✅ | Krista - Agentic Platform for Your Entire Enterprise |
| Dates | ✅ | Aug 2024 – Present |
| Stack | ✅ | Angular, React, Node.js, Microfrontend, AWS, Azure, Security, AI-assisted Development |
| Achievements | ✅ | 6 bullets (below) |
| Client/company attribution | ❓ | Presumed Krista AI |
| Problem/context statement | ❓ | |
| Architecture description | ❓ | |
| Screenshots / visuals | ❓ | |
| Public URL | ❓ | |
| Team size / your scope | ⚪ | |

Confirmed bullets, verbatim:
1. Led the migration of a production chatbot from React to Angular, leveraging agentic AI–assisted development to accelerate delivery while maintaining code quality and architectural consistency.
2. Improved application performance and SEO by applying modern frontend best practices, resulting in **90+ Google Lighthouse scores** across Performance, Accessibility, Best Practices, and SEO.
3. Designed and implemented application-level security enhancements for the Krista platform, improving protection against common web vulnerabilities and strengthening overall system reliability.
4. Redesigned and transformed the entire application UI, delivering a modern, scalable, and user-friendly interface aligned with UX best practices.
5. Built a reusable UI toolkit / component library, enabling consistent design and faster development across multiple projects and teams.
6. Followed clean code principles, modular architecture, and unit testing practices, ensuring maintainability and long-term scalability of the codebase.

## 5.2 Unitrax — SaaS Solution for Banking and Finance Industry

| Field | Status | Value |
|---|---|---|
| Dates | ✅ | Sep 2023 – Aug 2024 |
| Stack | ✅ | Angular 14, React, HTML, CSS, JavaScript, TypeScript, Angular Material, Bootstrap, NodeJS, Jenkins |
| Achievements | ✅ | 3 bullets, all with metrics |
| Context / architecture / visuals / URL | ❓ | |

Confirmed bullets, verbatim:
1. Orchestrated optimization of the Order Management application, reducing processing errors by **30%** and enhancing user experience by **20%**.
2. Developed Wire Order Screen dashboard, resulting in a **25% reduction in processing time** and **15% increase in user satisfaction**.
3. Established a robust library of reusable components, reducing development time by **40%** and promoting code reusability.

## 5.3 BOSCH — Ministry of Tourism

| Field | Status | Value |
|---|---|---|
| Dates | ✅ | Sep 2022 – Sep 2023 |
| Stack | ⚠️ **not listed in resume** | ❓ NEEDS INPUT — this is the only project with no technology list |
| Achievements | ✅ | 3 bullets, all with metrics |
| Client detail | ✅ | Ministry of Tourism (Saudi) |
| Context / architecture / visuals / URL | ❓ | |

Confirmed bullets, verbatim:
1. Led a digital initiative enhancing user experience, resulting in a **25% increase in online bookings** and **20% rise in user engagement**.
2. Conceptualized and launched **three e-services**, revolutionizing the tourism landscape.
3. Engineered vital administrative tools, including an admin page, dashboard, and summary page for the Ministry of Tourism (Saudi), resulting in a **40% reduction in administrative workload** and a **25% improvement in user satisfaction**.

## 5.4 Chevron — Market Dataplace

| Field | Status | Value |
|---|---|---|
| Dates | ✅ | Apr 2022 – Jul 2022 |
| Stack | ✅ | Angular 13, C#, .NET, SQL, JavaScript, TypeScript, HTML5, CSS3, Git, Azure DevOps |
| Achievements | ✅ | 3 bullets (no metrics) |
| Context / architecture / visuals / URL | ❓ | |

Confirmed bullets, verbatim:
1. Spearheaded the development of Data MarketPlace, facilitating seamless transactions between data producers and consumers.
2. Independently crafted and deployed the home page for the marketplace, featuring innovative design elements and enhanced functionality.
3. Utilized a robust tech stack including Angular 13, C#, DotNET, SQL, JavaScript, TypeScript, HTML5, CSS3, Git, and Azure DevOps.

## 5.5 EKA Analytic Platform

| Field | Status | Value |
|---|---|---|
| Dates | ✅ | Sep 2021 – Mar 2022 |
| Stack | ✅ | Angular, JavaScript, TypeScript, HTML5, CSS3, Bootstrap, Git Bash, Node.js, Azure DevOps, Azure Boards |
| Achievements | ✅ | 3 bullets (no metrics) |
| Context / architecture / visuals / URL | ❓ | |

Confirmed bullets, verbatim:
1. Developed an advanced analytical tool tailored for market and commodities analysis.
2. Established a scalable and efficient reusable component architecture.
3. Leveraged a diverse tech stack (as listed above).

## 5.6 Western Union — Money Transfer App

| Field | Status | Value |
|---|---|---|
| Dates | ✅ | Apr 2020 – Apr 2021 |
| Stack | ✅ | Angular, Figma, JavaScript, TypeScript, HTML5, CSS3, Bootstrap, Git Bash, JIRA, Node.js, Aptimise, Karma & Jasmine, Azure DevOps, Azure Boards, Jenkins |
| Achievements | ✅ | 2 bullets (no metrics) |
| Context / architecture / visuals / URL | ❓ | |

Confirmed bullets, verbatim:
1. Played a pivotal role in enhancing functionality and user experience for international money transfers.
2. Led the implementation efforts for key features, contributing significantly to app innovation and user engagement.

## 5.7 ❓ Cross-cutting project question — client anonymization

BOSCH, Chevron, Western Union, Unitrax and the Saudi Ministry of Tourism are named clients on enterprise engagements. Publishing named client work on a public site can breach NDA or client-confidentiality terms even when the resume names them (resumes are private documents; a website is not).

**Needs input:** are all six clear to name publicly, or should any be anonymized ("a global energy major", "a national tourism ministry")?

---

# 6. SKILLS

**Status: ✅ [CONFIRMED FROM RESUME] — verbatim, grouped as the resume groups them.**

| Resume group | Technologies |
|---|---|
| Frontend Technologies | Angular 20, ReactJS, RxJS, HTML5, CSS3 (SCSS/LESS), Bootstrap, Object-Oriented JavaScript, TypeScript, jQuery |
| Backend Technologies | Node.js, Express.js, Python, C, C++, C#, .NET, Data Structures and Algorithms |
| Cloud Platforms | AWS, Azure |
| Database | SQL, MongoDB |
| DevOps | Git, Jenkins |
| Testing | Karma & Jasmine |

Additional technologies confirmed from project stacks (not in the SKILLS block): Microfrontend, Angular Material, Azure DevOps, Azure Boards, JIRA, Figma, Git Bash, Aptimise.

## 6.1 Two decisions required

**(a) ⚠️ Curation for seniority.** `jQuery` and `LESS` are confirmed skills but read as legacy in 2026 and can subtly date a senior profile. Recommend keeping them in the résumé but **omitting from the site's skill grid**, or placing them in a collapsed "Also worked with" row. Your call — nothing is removed without your approval.

**(b) Regrouping for the 3D architecture layers.** The proposal groups skills by architecture layer rather than by the resume's categories, so the grid maps onto the 3D graph. Proposed mapping — a pure reorganization, zero additions:

| Layer | Technologies |
|---|---|
| **L3 Client** | Angular 20, React, TypeScript, JavaScript (OOJS), RxJS, HTML5, SCSS/CSS3, Bootstrap, Angular Material, Microfrontend |
| **L2 Application** | Node.js, Express.js, Data Structures & Algorithms, reusable component architecture |
| **L1 Services** | Python, C, C++, C#, .NET |
| **L0 Data & Cloud** | SQL, MongoDB, AWS, Azure |
| **Delivery & Quality** | Git, Jenkins, Azure DevOps, Azure Boards, JIRA, Karma & Jasmine, Figma |

**Note for the 3D scene:** the graph should carry ~20 curated nodes, not all ~32 technologies — beyond roughly 20 labelled nodes the visualization becomes noise rather than signal.

---

# 7. ENGINEERING STRENGTHS

All 11 strengths from your brief are **evidence-backed by the resume** — none is an unsupported claim:

| Strength | Status | Resume evidence |
|---|---|---|
| Full stack engineering | ✅ | "Full Stack Developer" (Chevron); resume header |
| Frontend architecture | ✅ | Microfrontend; "scalable reusable component architecture" (EKA) |
| Enterprise application development | ✅ | "Agentic Platform for Your Entire Enterprise"; banking/finance SaaS |
| Application security | ✅ | "application-level security enhancements… protection against common web vulnerabilities" |
| Performance optimization | ✅ | "90+ Google Lighthouse scores"; "Improved application performance" |
| SEO | ✅ | "Improved application performance and SEO" |
| Reusable component architecture | ✅ | Krista UI toolkit; Unitrax component library (40%); EKA architecture |
| UI/UX modernization | ✅ | "Redesigned and transformed the entire application UI" |
| Cloud-native development | ✅ | "cloud-native architectures (AWS & Azure)" |
| AI-assisted development | ✅ | "agentic AI–assisted development"; "AI-driven development" |
| Technical ownership | ✅ | "driving projects from design to production with technical ownership" |

| Field | Status |
|---|---|
| Strength names | ✅ |
| One-sentence explanation per strength | ❓ **[NEEDS INPUT]** — 11 sentences. **I can draft all 11 using only resume evidence for your review/edit**, which reduces your effort to approving or correcting text. |
| Icon per strength | ⚪ Design decision, no input needed |

---

# 8. EDUCATION

| Field | Status | Value |
|---|---|---|
| Institution | ✅ | Maulana Azad National Institute of Technology (MANIT), Bhopal |
| Degree | ✅ | B.Tech |
| Dates | ✅ | Jun 2013 – Apr 2017 |
| Grade | ✅ | 7.7 CGPA |
| **Branch / discipline** | ❓ **[NEEDS INPUT]** | **Not stated anywhere in the resume.** Required — "B.Tech" with no branch looks incomplete on a portfolio. |
| Senior Secondary | ✅ ⚪ | Success Higher Secondary School, Shamgarh (MP Board), Apr 2011 – Apr 2012, 91.2% |
| Higher Secondary | ✅ ⚪ | Govt. High Secondary School, Babulda (MP Board), Apr 2009 – Apr 2010, 87.5% |

**Recommendation:** omit both school entries from the website. For a 9-year senior engineer they add no signal to a CTO or recruiter and dilute an otherwise strong NIT credential. They stay in the résumé PDF. Your call.

| Also | Status |
|---|---|
| Certifications | ❓ ⚪ none in resume |
| Publications / talks / open source | ❓ ⚪ none in resume |

---

# 9. CONTACT

| Field | Status | Value |
|---|---|---|
| Email | ✅ | vickymanora@gmail.com |
| Phone | ✅ (⚠️ privacy) | +91 8989942017 |
| Location | ✅ | Pune |
| LinkedIn | ✅ | https://www.linkedin.com/in/vicky-manora-165638ba/ |
| GitHub | ✅ | https://github.com/VickyManora |
| Résumé PDF | ✅ | File located; will be renamed `Vicky-Manora-Senior-Full-Stack-Engineer.pdf` for download |
| Contact form vs. mailto | ❓ | Form needs an endpoint (Vercel serverless / Formspree) — your preference |
| Availability status | ❓ | |
| Preferred work mode | ❓ ⚪ | Remote / hybrid / onsite / relocation |
| Timezone display | ⚪ | IST — derivable from Pune |

**⚠️ Privacy recommendation:** do **not** publish the phone number. A public portfolio is scraped continuously; a personal Indian mobile on a public page attracts recruiter spam and robocalls indefinitely, and it cannot be un-published once indexed. Email + LinkedIn is the standard senior-engineer contact set. Your call — it's your number.

**Note:** your Claude account email is a `@kristasoft.com` work address. The site will use the personal Gmail from the résumé for public contact, which is correct — confirm if you'd prefer otherwise.

---

# 10. SEO

| Field | Status | Value |
|---|---|---|
| Primary entity name | ✅ | Vicky Manora |
| Job title for `Person` schema | ✅ | Senior Full Stack Engineer |
| `alumniOf` | ✅ | Maulana Azad National Institute of Technology (MANIT), Bhopal |
| `knowsAbout` | ✅ | Full confirmed technology list |
| `worksFor` | ✅ | Krista AI |
| `sameAs` | ✅ | GitHub + LinkedIn URLs |
| `address` / locality | ✅ | Pune, India |
| **Domain name** | ❓ **[NEEDS INPUT]** | Blocks deployment configuration, canonical URLs, sitemap and OG tags |
| Meta description | ❓ | Derivable from the confirmed summary — needs approval |
| OG image design | ⚪ | Generated from the design system |
| Target keywords beyond name | ⚪ | e.g. "Angular developer Pune", "senior full stack engineer India" |
| Analytics | ❓ | Yes/no, and which (privacy-friendly Plausible recommended) |
| `/writing` route reserved | ⚪ | Recommend reserving even if empty |

---

# 11. CASE STUDY CONTENT

The proposed case-study template is: **Context → Challenge → Your Role → Architecture → Stack → Outcome**. Mapping what exists against what each section needs:

| Template section | Krista | Unitrax | BOSCH | Chevron | EKA | Western Union |
|---|---|---|---|---|---|---|
| Project name | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Dates | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Context / business problem** | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ |
| **Challenge** | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ |
| Your role / scope | Partial ✅ | ❓ | ❓ | Partial ✅ | ❓ | ❓ |
| **Architecture** | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ |
| Stack | ✅ | ✅ | ❓ **missing** | ✅ | ✅ | ✅ |
| Outcome / metrics | ✅ | ✅ strong | ✅ strong | ❓ none | ❓ none | ❓ none |
| Visuals | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ |
| Public URL | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ |
| Team size / duration detail | ⚪ | ⚪ | ⚪ | ⚪ | ⚪ | ⚪ |

**Honest read:** the resume supplies roughly **40% of a full case study** for Krista, Unitrax and BOSCH, and roughly **25%** for Chevron, EKA and Western Union. Six full case-study routes built on this content would render as thin pages — which damages credibility more than having fewer, deeper pages. See Architecture Reconsideration #1.

---

# ARCHITECTURE RECONSIDERATIONS

Six things the resume content changes about the approved plan. None affects the core concept.

## R1 — Two-tier project depth instead of six equal case studies ⚠️ **most important**

**Approved:** full case-study routes for all six projects.
**Problem:** only Krista has current, rich, metric-backed content. Chevron (3 months), EKA and Western Union have 2–3 bullets and no metrics. Six thin pages read worse than two strong ones.

**Recommendation — revise to two tiers:**
- **Tier 1, full case-study routes (2):** Krista Agentic Platform + one of Unitrax or BOSCH (both have strong metrics). Prerendered, indexable, shareable — the SEO and depth benefit is preserved.
- **Tier 2, rich expandable cards (4):** Chevron, EKA, Western Union, and whichever of Unitrax/BOSCH isn't promoted. All resume content shown, no separate page.
- Tier 2 projects can be promoted to Tier 1 later with no rework — the data model is identical.

**Impact:** less writing required from you, a stronger Work section, no architectural change.

## R2 — Project subgraphs become stack-derived, not architecture-derived ✅ **improvement**

**Approved:** the 3D graph reconfigures into each project's architecture.
**Problem:** the resume gives technology stacks, not architectures. Rendering an invented architecture would violate content integrity.

**Recommendation:** the subgraph lights up **exactly the technologies confirmed for that project**, across the four layers. Selecting "Chevron" illuminates Angular 13 → C#/.NET → SQL → Azure DevOps and dims everything else.

This is strictly better: it's factual, data-driven from confirmed stacks, requires zero input from you, and it visibly demonstrates stack range across projects — which is exactly what a CTO scans for. The diegetic effect is fully preserved.

## R3 — Skill node curation

The resume yields ~32 technologies; a legible 3D graph carries ~20 labelled nodes. Needs a curated primary set (with the rest listed in the DOM grid only). Ties to the jQuery/LESS decision in §6.1.

## R4 — Experience timeline must handle a 2yr 10mo empty block

Vodafone Idea has no content. Either you supply bullets, or the card is designed as intentionally minimal so the gap reads as editorial restraint rather than an unfinished section. Needs a decision before the Experience component is designed, not after.

## R5 — Metric presentation strategy

You have ten metrics. They split into two credibility classes:

- **Hard / verifiable:** 90+ Lighthouse scores, 40% reduction in development time, 30% reduction in processing errors, 25% reduction in processing time, three e-services launched
- **Soft / self-reported:** "enhancing user experience by 20%", "15% increase in user satisfaction", "25% improvement in user satisfaction", "20% rise in user engagement"

Senior technical reviewers discount soft satisfaction percentages, and a cluster of them can make the hard numbers look inflated by association. **Recommendation:** feature the hard metrics as prominent stat components; keep the soft ones as inline body text rather than headline figures. No number is changed or removed — only its visual weight.

## R6 — "8+ years" must be computed, not hardcoded

Auto-derive from Jun 2017 so the site never goes stale. Same for the Krista AI "Present" duration.

---

# THE MINIMUM QUESTION SET

Everything above condensed. **Blocking items are 1–8.**

## Must have before content-complete

1. **Education branch** — which B.Tech discipline at MANIT?
2. **Domain name** — what should we register/point at Vercel?
3. **BOSCH technology stack** — the only project with no tech list in the resume.
4. **Project → company attribution** — confirm the six mappings in §4.3 as inferred?
5. **Client naming** — are BOSCH, Chevron, Western Union, Unitrax and Ministry of Tourism (Saudi) all safe to name publicly, or does any need anonymizing?
6. **Vodafone Idea** — 2–3 bullets + technologies, or design the card as deliberately minimal?
7. **Case-study depth** — approve the two-tier revision (R1)? If yes, which project joins Krista as Tier 1: Unitrax or BOSCH?
8. **Per-project titles** — drop them and show only company titles (recommended), or keep them?

## Decisions with a recommended default (say "use your recommendation" to skip)

9. Role title → **Senior Full Stack Engineer**
10. Years → **9+ years, auto-computed**
11. Phone number → **omit from the public site**
12. jQuery / LESS → **omit from the site skill grid, keep in résumé**
13. School education entries → **omit from the site**
14. Hero positioning line → **pick A, B or C from §2, or write your own**
15. Strength one-liners → **I draft all 11 from resume evidence, you edit**
16. Experience bullets → **option (a): show projects under each role, no new writing**

## Optional — improves the site, not required

17. Professional photo, or type-only
18. Availability status
19. Project screenshots / visuals (or abstract architecture graphics where NDA applies)
20. Contact form endpoint vs. plain mailto link
21. Analytics yes/no
22. Company locations for Krista AI, L&T, HCL
23. Public URLs for any of the six projects
24. Reserve a `/writing` route for future articles

---

**Phase 0 is not complete until items 1–8 are answered. No Angular project will be created and Phase 1 will not begin until you approve.**

---

# DECISIONS LOG — 2026-09-04

## Approved by Vicky

| # | Decision | Resolution |
|---|---|---|
| 7 | Case-study depth | **Two-tier approved.** Tier 1 full routes: **Krista Agentic Platform** + **Unitrax**. Tier 2 rich expandable cards: BOSCH, Chevron, EKA, Western Union. |
| 8 | Job titles | **Company-level titles only.** Experience timeline shows Senior Software Engineer (Krista AI), Senior Software Engineer (L&T), Lead Engineer (HCL), Front-end Developer (Vodafone Idea). Projects carry no job title — name, dates, stack, outcomes only. Per-project titles from the resume are dropped as a presentation decision (no content is altered; the résumé PDF is unchanged). |
| 6 | Vodafone Idea | **Minimal-by-design card.** Role, dates, duration and one derived line, styled as deliberate editorial restraint. No content required from Vicky. |
| 5 | Client naming | **DEFERRED — Vicky is checking contracts.** |

## Resulting architecture requirement — client-name toggle

Because client naming is unresolved, the project data model must support per-project name switching from day one, so no rework is needed when contracts are checked:

- each project carries a public display name, an anonymized fallback (sector-only, e.g. "a global energy major"), and a cleared/not-cleared flag
- the flag drives the project card, the case-study route, the route slug, the page title, the meta description, the OG image and the JSON-LD simultaneously
- flipping one boolean re-renders every surface consistently at build time

**Launch gate:** this must be resolved before production deploy, since anonymized-then-renamed slugs would break already-indexed URLs.

## Consequences for the Work section

- Tier 1 (Krista, Unitrax) → prerendered routes at `/work/:slug`, full Context → Challenge → Role → Architecture → Stack → Outcome template
- Tier 2 (BOSCH, Chevron, EKA, Western Union) → expandable cards on the homepage showing all confirmed resume content, no separate route
- Data model is identical across tiers; promoting a Tier 2 project later requires only a flag change plus the additional written sections

## Still blocking Phase 0 completion

1. **B.Tech branch at MANIT** — absent from resume
2. **Domain name** — blocks canonical URLs, sitemap, OG tags, Vercel config
3. **BOSCH technology stack** — the only project with no tech list
4. **Project → company attribution** — confirm the six mappings in §4.3
5. **Client naming** — deferred, resolve before launch (see toggle above)
