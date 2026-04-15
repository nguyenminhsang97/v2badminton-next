# Sprint 5 - Visual Overhaul theo Figma

## Status

- Sprint 5 status: `READY_FOR_IMPLEMENTATION`
- Dependency: Sprint 4 `DONE_CODE_CUTOVER_DEFERRED`
- Design source of truth: `https://lemon-speck-28354326.figma.site`

## Decision

Sprint 5 khong con la "UI polish hybrid". User da chot:

1. Figma la source of truth cho visual design
2. `v2badminton-next` la target implementation
3. `VERSION_C_BLUEPRINT.md` giu vai tro source of truth cho structure, conversion flow, SEO, routing, va CMS architecture
4. Sanity, forms, analytics, money-page architecture, routing, structured data, va fallback system phai duoc giu nguyen

## Strategy

**Giu infrastructure, rewrite visual layer.**

Nhung gi khong duoc rebuild:
- Sanity queries, types, client, fallback behavior
- App Router structure
- Form validation + submission flow
- Tracking event model
- Metadata, sitemap, canonical, JSON-LD
- Money page architecture

Nhung gi duoc rewrite:
- `globals.css`
- Homepage section render layer
- Nav / footer / contact presentation
- Money page presentation layer
- Blog presentation layer

## Design Source

### Primary

- Published Figma site: `https://lemon-speck-28354326.figma.site`
- Local code export: `D:\V2\Badminton Academy Enrollment Screens`

### Replacement Rules

Figma dung placeholder brand/content. Khi implement vao V2:

- `Eagle Badminton Academy` -> `V2 Badminton`
- dung pricing, schedule, location, coach, testimonial, CTA copy cua V2
- khong dua lai item khong lien quan nhu `Shop`
- giu event names va business flow cua app hien tai

## Visual Direction

Sprint 5 follow Figma cho:

- light-forward design system
- green + orange palette
- rounded buttons
- white cards + soft shadows
- rich trust presentation
- image-led sections
- alternating dark/light section backgrounds
- full footer
- floating CTA

Sprint 5 khong giu:

- clip-path diagonal CTA system cua V2 static site
- dark-heavy card treatment lam default
- "wireframe-first" section density cua current homepage

## Guardrails

Sprint 5 must preserve:

1. App Router + Sanity architecture
2. Current data contracts
3. Conversion-first homepage structure
4. Existing forms, SEO, analytics, and routing behavior
5. TypeScript compile safety

Sprint 5 must not:

1. Hardcode content dang co trong Sanity
2. Break money page routing/fallback logic
3. Remove analytics events
4. Rebuild backend/infrastructure under the name of visual work

## Track Order

### Track A - Design System + Core Sections

- `S5A-A1` Design system overhaul
- `S5A-A2` Hero section rewrite
- `S5A-A3` Courses section rewrite
- `S5A-A4` Pricing section upgrade

### Track B - Trust Sections

- `S5B-A1` Why section rewrite
- `S5B-A2` Coach section rewrite
- `S5B-A3` Schedule section rewrite
- `S5B-A4` Testimonials upgrade

### Track C - Frame

- `S5C-A1` Nav upgrade
- `S5C-A2` Contact + FAQ + Business cluster rewrite
- `S5C-A3` Locations section upgrade
- `S5C-A4` Footer rewrite + floating CTA
- `S5C-A5` SeoLinksBlock redesign

### Track D - Infrastructure

- `S5D-A1` Loading UX
- `S5D-A2` Error UX
- `S5D-A3` Focus indicators + contrast audit
- `S5D-A4` GTM/GA4 integration
- `S5D-A5` Breadcrumbs + page-kicker on money pages

### Track E - Content Expansion

- `S5E-A1` Blog queries + types
- `S5E-A2` Blog listing + detail pages
- `S5E-A3` Money pages batch (5 pages)

## Execution Order

```text
Track A -> Track B -> Track C -> Track E

Track D runs in parallel where safe
```

## Homepage Section Order

Sprint 5 homepage order should move to:

1. Hero
2. Courses
3. Why
4. Coaches
5. Pricing
6. Schedule
7. Testimonials
8. Locations
9. FAQ
10. Contact
11. Business
12. SeoLinks

Rationale:

- parent/kids-friendly narrative should lead with fit and trust before pricing detail
- FAQ should handle objections before the main form
- Business is a secondary audience block
- SeoLinksBlock is discovery / SEO support and belongs near the end

## Effort Estimate

| Track | Estimated hours |
| --- | --- |
| A - Design system + core sections | 6-8 |
| B - Trust sections | 4-5 |
| C - Frame | 3-4 |
| D - Infrastructure | 3-4 |
| E - Content expansion | 4-5 |
| Total | 20-26 |

## Done Criteria

1. Homepage visual direction matches Figma, not the old dark-heavy V2 theme
2. All major sections have image support where Figma shows imagery
3. Buttons use rounded Figma system, not old clip-path CTA system
4. Cards are fully designed: white surface, shadow, spacing, hierarchy
5. Trust elements are visible: ratings, student count, credentials, quotes
6. Schedule is table-first on desktop and usable on mobile
7. Footer is complete: 4-column, social, legal
8. Floating CTA works on mobile and desktop
9. `SeoLinksBlock`, `FaqSection`, and `BusinessSection` are also in the new design system
10. Why section shows 4 visible differentiators, not 6
11. Blog and new money pages inherit the new design system
12. `npm run build` passes
13. Existing form, SEO, analytics, routing, and CMS behavior still work
