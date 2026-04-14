# Sprint 5: UI Polish + Analytics Foundation

## Status

- Sprint 5 status: `PLANNED`
- Dependency: `Sprint 4 DONE_CODE_CUTOVER_DEFERRED`

## Summary

Sprint 5 is not a pure content-expansion sprint.

The current app already has the right data, CMS, routing, and SEO foundations,
but the UI still has visible polish gaps. If we add blog pages and more money
pages too early, we will multiply that unfinished surface area.

So Sprint 5 should improve the shared interface first, then measure it, and only
after that expand content.

## Source Of Truth By Area

Sprint 5 should balance three inputs.

### 1. Blueprint owns structure

Files:

- `VERSION_C_BLUEPRINT.md`
- `VERSION_C_IMPLEMENTATION_PLAN.md`

Use blueprint for:

- section order
- conversion logic
- page architecture
- what belongs on homepage vs money pages

### 2. Static V2 owns business tone

Reference workspace:

- `D:\V2\landing-page`

Key files:

- `D:\V2\landing-page\index.html`
- `D:\V2\landing-page\seo-common.css`
- `D:\V2\landing-page\tracking.js`
- `D:\V2\landing-page\hoc-cau-long-cho-nguoi-moi\index.html`

Use static V2 for:

- CTA wording and hierarchy
- SEO-page rhythm
- breadcrumb and page-kicker feel
- trust-strip and quick-link thinking
- analytics event naming continuity

### 3. Figma export owns polish

Reference workspace:

- `D:\V2\Badminton Academy Enrollment Screens`

Key files:

- `D:\V2\Badminton Academy Enrollment Screens\src\app\pages\HomePage.tsx`
- `D:\V2\Badminton Academy Enrollment Screens\src\app\pages\EnrollmentPage.tsx`
- `D:\V2\Badminton Academy Enrollment Screens\src\styles\theme.css`

Use Figma for:

- visual hierarchy
- spacing rhythm
- richer card treatment
- stronger trust-layer presentation
- more intentional CTA emphasis

## Guardrails

Sprint 5 must preserve:

1. the Version C architecture
2. the current dark + lime V2 brand direction
3. the Sanity-driven component system
4. the conversion-first nature of the homepage
5. the lightweight landing-page nature of money pages

Sprint 5 must not:

1. copy the Eagle Academy brand from the Figma demo
2. turn the homepage into a wizard flow
3. abandon the existing component system for one-off static layouts
4. add blog and new money pages before the shared UI feels cleaner

## Track Order

### Track A: CSS & Component Fixes

- `S5A-A1` Missing CSS audit & fix
- `S5A-A2` Loading UX hardening
- `S5A-A3` Focus indicators + contrast audit
- `S5A-A4` Next.js Image migration + heroImage rendering

### Track B: UX Improvements

- `S5B-A1` Error UX hardening
- `S5B-A2` Breadcrumbs on money pages
- `S5B-A3` CTA/button consistency audit
- `S5B-A4` Summer page Phase 2 follow-through

### Track D: Analytics Foundation

- `S5D-A1` GTM/GA4 integration
- `S5D-A2` Conversion tracking setup

### Track C: Content Expansion

- `S5C-A1` Blog queries + types
- `S5C-A2` Blog listing + detail pages
- `S5C-A3` Money pages batch

## Final Order

Sprint 5 execution order:

`A -> B -> D -> C`

That order is intentional:

- A/B close the shared visual gaps
- D measures the improved UX
- C expands content on top of a stronger system

## Expected Outcome

At the end of Sprint 5, the site should feel closer to:

- the structure of Version C
- the business confidence of static V2
- the polish of the Figma reference

without becoming a literal copy of any one source.
