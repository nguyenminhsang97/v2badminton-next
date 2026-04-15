# Sprint 5: Visual Overhaul — Figma Design

## Status

- Sprint 5 status: `PLANNING`
- Dependency: Sprint 4 `DONE_CODE_CUTOVER_DEFERRED`

## Decision

User reviewed Version A (static site), Version B (Figma), and Version C (current Next.js app) side-by-side. Conclusion: Version C currently looks like a wireframe — it has strong infrastructure but weak visual execution. **User chose to adopt Version B (Figma) as the target design.**

## Strategy

**Keep infrastructure, rewrite visual layer.**

Version C has ~35 hours of infrastructure that is fully working and should not be touched:
- Sanity CMS integration (queries, types, client, fallbacks, ISR)
- Route system (CoreRoutePath, coreRouteMap, phase 1/2 gates)
- Contact form (validation, Postgres, prefill, tracking)
- SEO (sitemap, JSON-LD structured data, canonical, metadata)
- Money page system (template, fallback, metadata builder)
- Analytics tracking (dataLayer, event system)

What changes: ~10-12 section components + globals.css. This is a rewrite-in-place — keep import/export contracts, replace render content.

## Design Source

**Primary:** Figma published site
- URL: `https://lemon-speck-28354326.figma.site`
- Local: `D:\V2\Badminton Academy Enrollment Screens`

**Adaptations from Figma:**
- Brand name: Eagle Badminton → V2 Badminton
- Content: use V2's real courses, pricing, locations, coaches
- Images: use existing `/public/images/` assets + upload more to Sanity
- Analytics: keep existing event names from tracking.ts

**What to follow exactly from Figma:**
- Layout patterns (hero 2-col, courses 4-col, coaches 3-col, schedule table, etc.)
- Component richness (cards with images, trust elements, credentials, quotes)
- Typography hierarchy (section kickers, headings, body, labels)
- Spacing rhythm (80px section padding, 24px card gap)
- Card treatment (rounded-2xl, shadows, image slots)
- Color system (dark green primary, orange CTAs, alternating section backgrounds)
- Footer (4-column with social + legal)
- Floating CTA (Zalo/Phone)

## Guardrails

Sprint 5 must preserve:
1. Version C architecture (App Router, Sanity-driven)
2. Sanity CMS component system (data from CMS, not hardcoded)
3. Conversion-first homepage structure
4. Existing form logic, SEO, routing, analytics
5. TypeScript types and contracts

Sprint 5 must not:
1. Rebuild infrastructure that already works
2. Hardcode content that should come from Sanity
3. Break existing money page or form functionality
4. Remove analytics events

## Track Order

### Track A: Design System + Core Sections (do first)

Foundation and highest-impact visual changes.

- `S5A-A1` Design system overhaul (CSS variables, typography, button system, card system)
- `S5A-A2` Hero section rewrite (2-col layout, background image, trust elements, 3 CTAs)
- `S5A-A3` Courses section rewrite (cards with images, badges, pricing inline, full CTA)
- `S5A-A4` Pricing section upgrade (featured card, feature lists, better layout)

### Track B: Trust + Content Sections

Sections that build credibility and provide information.

- `S5B-A1` Why section rewrite (2-col: features list + images, stat box)
- `S5B-A2` Coach section rewrite (large photos, credentials, quotes, ratings)
- `S5B-A3` Schedule section rewrite (table layout, level tags, time highlights)
- `S5B-A4` Testimonials upgrade (stars, rich cards, avatar + role)

### Track C: Navigation + Contact + Footer

Page frame and conversion elements.

- `S5C-A1` Nav upgrade (Figma-style, phone number, CTA button)
- `S5C-A2` Contact section rewrite (channels left + form right, split layout)
- `S5C-A3` Locations section upgrade (cards with images, phone, hours)
- `S5C-A4` Footer rewrite (4-column, social icons, legal links)
- `S5C-A5` Floating CTA (fixed Zalo/Phone buttons)

### Track D: Infrastructure (parallel)

Non-visual tickets that can run alongside visual work.

- `S5D-A1` Loading UX hardening (loading.tsx skeletons, not-found.tsx)
- `S5D-A2` Error UX hardening (error.tsx with reset)
- `S5D-A3` Focus indicators + contrast audit
- `S5D-A4` GTM/GA4 integration
- `S5D-A5` Breadcrumbs + page-kicker on money pages

### Track E: Content Expansion (after visual)

Only after visual overhaul is done.

- `S5E-A1` Blog queries + types
- `S5E-A2` Blog listing + detail pages (using new design system)
- `S5E-A3` Money pages batch (5 new pages)

## Execution Order

```
A (design system + hero + courses + pricing)
  → B (trust sections)
    → C (frame: nav, contact, footer)
      → E (content on new design)

D runs in parallel with A/B/C
```

## Effort Estimate

| Track | Estimated hours |
|-------|----------------|
| A: Design system + core sections | 6-8 |
| B: Trust + content sections | 4-5 |
| C: Nav + contact + footer | 3-4 |
| D: Infrastructure | 3-4 |
| E: Content expansion | 4-5 |
| **Total** | **20-26** |

## Done Criteria

1. Homepage visually matches Figma layout and richness
2. All sections have images where Figma shows images
3. Cards feel "fully designed" — not wireframe
4. Trust elements visible (ratings, student count, credentials)
5. Schedule is scannable (table or equivalent)
6. Footer is complete (4-column, social, legal)
7. Floating CTA works (Zalo/Phone)
8. Mobile responsive — all sections work on phone
9. `npm run build` passes
10. Existing form, SEO, analytics, routing still work
