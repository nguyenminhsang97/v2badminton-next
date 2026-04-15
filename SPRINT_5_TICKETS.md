# Sprint 5 Tickets - Visual Overhaul theo Figma

## Status

- Sprint 5 status: `ACTIVE_PLAN`
- Design target: `https://lemon-speck-28354326.figma.site`
- Ticket set status: `CANONICAL`

## Source of Truth

1. `SPRINT_5_BREAKDOWN.md` defines scope and track order
2. `SPRINT_5_UI_RULES.md` defines design rules
3. Files in `/tickets/` define implementation detail

There is no longer an "old Sprint 5 ticket set". The files in `/tickets/`
below are the active Sprint 5 plan.

## Ticket List

### Track A - Design System + Core

| ID | Title | Est |
| --- | --- | --- |
| `S5A-A1` | Design system overhaul (tokens, buttons, cards, typography) | 2h |
| `S5A-A2` | Hero section rewrite (2-col, trust strip, 3 CTAs) | 2h |
| `S5A-A3` | Courses section rewrite (image cards, badges, price inline, CTA) | 2h |
| `S5A-A4` | Pricing section upgrade (featured card, feature list, tag badges) | 1h |

### Track B - Trust Sections

| ID | Title | Est |
| --- | --- | --- |
| `S5B-A1` | Why section rewrite (2-col, images, stat box) | 1.5h |
| `S5B-A2` | Coach section rewrite (large photos, credentials, quotes, rating) | 1.5h |
| `S5B-A3` | Schedule section rewrite (table layout, colored level tags) | 1.5h |
| `S5B-A4` | Testimonials upgrade (stars, quote, avatar + role) | 1h |

### Track C - Frame

| ID | Title | Est |
| --- | --- | --- |
| `S5C-A1` | Nav upgrade (Figma-style, dark green, orange CTA) | 1h |
| `S5C-A2` | Contact + FAQ + Business cluster rewrite | 1h |
| `S5C-A3` | Locations section upgrade (images, phone, hours) | 0.5h |
| `S5C-A4` | Footer rewrite + floating CTA | 1.25h |
| `S5C-A5` | SeoLinksBlock redesign | 0.5h |

### Track D - Infrastructure

| ID | Title | Est |
| --- | --- | --- |
| `S5D-A1` | Loading UX (loading.tsx, not-found.tsx) | 1h |
| `S5D-A2` | Error UX (error.tsx with reset) | 0.5h |
| `S5D-A3` | Focus indicators + contrast audit | 0.5h |
| `S5D-A4` | GTM / GA4 integration | 1h |
| `S5D-A5` | Breadcrumbs + page-kicker on money pages | 0.5h |

### Track E - Content Expansion

| ID | Title | Est |
| --- | --- | --- |
| `S5E-A1` | Blog queries + types | 1h |
| `S5E-A2` | Blog listing + detail pages on new design system | 1.5h |
| `S5E-A3` | Money pages batch (5 pages) | 1.5h |

## Execution Order

```text
S5A-A1 must land first.

Track A -> Track B -> Track C -> Track E

Track D can run in parallel where it does not block visual work.
```

## Homepage Section Order

```text
Hero
-> Courses
-> Why
-> Coaches
-> Pricing
-> Schedule
-> Testimonials
-> Locations
-> FAQ
-> Contact
-> Business
-> SeoLinks
```

Notes:

- FAQ / Contact / Business are bottom-funnel support sections
- SeoLinksBlock is a discovery / SEO support block and should remain late in the page
- Why section should surface 4 visible differentiators only

## Done Criteria

1. Homepage follows Figma visual direction end-to-end
2. Track A/B/C visual system is coherent across desktop and mobile
3. Track D hardening is in place
4. Blog and 5 new money pages use the same design system
5. Support sections (`Faq`, `Business`, `SeoLinks`) are also redesigned
6. Why section shows 4 visible differentiators
7. Existing Sanity, routing, SEO, forms, analytics, and fallbacks still work
8. `npm run lint` and `npm run build` pass
