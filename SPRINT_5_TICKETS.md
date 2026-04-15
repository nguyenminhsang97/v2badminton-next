# Sprint 5 Tickets — Visual Overhaul (Figma Design)

## Status

- Sprint 5 status: `REPLANNED`
- Previous Sprint 5 code: `SUPERSEDED` — old tickets replaced by visual overhaul
- Design target: Figma (`https://lemon-speck-28354326.figma.site`)

## Design Source

**Figma owns everything** — layout, color, typography, component richness.

Adaptations:
- Brand: Eagle Badminton → V2 Badminton
- Content: V2's real data (pricing, locations, coaches)
- Infrastructure: keep existing Sanity/routing/form/analytics

## Ticket List

### Track A — Design System + Core Sections

| ID | Title | Est |
|---|---|---|
| `S5A-A1` | Design system overhaul (CSS vars, buttons, cards, typography) | 2h |
| `S5A-A2` | Hero section rewrite (2-col, photo, trust strip, 3 CTAs) | 2h |
| `S5A-A3` | Courses section rewrite (image cards, badges, pricing, CTA) | 2h |
| `S5A-A4` | Pricing section upgrade (featured card, feature lists) | 1h |

### Track B — Trust + Content Sections

| ID | Title | Est |
|---|---|---|
| `S5B-A1` | Why section rewrite (2-col: features + images, stat box) | 1.5h |
| `S5B-A2` | Coach section rewrite (large photos, credentials, quotes) | 1.5h |
| `S5B-A3` | Schedule section rewrite (table layout, level tags) | 1.5h |
| `S5B-A4` | Testimonials upgrade (stars, rich cards, avatars) | 1h |

### Track C — Navigation + Contact + Footer

| ID | Title | Est |
|---|---|---|
| `S5C-A1` | Nav upgrade (Figma-style, phone, orange CTA) | 1h |
| `S5C-A2` | Contact section rewrite (channels + form split) | 1h |
| `S5C-A3` | Locations section upgrade (images, phone, hours) | 0.5h |
| `S5C-A4` | Footer rewrite (4-column, social, legal) | 1h |
| `S5C-A5` | Floating CTA (Zalo/Phone fixed buttons) | 0.5h |

### Track D — Infrastructure (parallel)

| ID | Title | Est |
|---|---|---|
| `S5D-A1` | Loading UX (skeleton loading.tsx, not-found.tsx) | 1h |
| `S5D-A2` | Error UX (error.tsx with reset) | 0.5h |
| `S5D-A3` | Focus indicators + contrast audit | 0.5h |
| `S5D-A4` | GTM/GA4 integration | 1h |
| `S5D-A5` | Breadcrumbs + page-kicker on money pages | 0.5h |

### Track E — Content Expansion (after visual)

| ID | Title | Est |
|---|---|---|
| `S5E-A1` | Blog queries + types | 1h |
| `S5E-A2` | Blog listing + detail pages (new design system) | 1.5h |
| `S5E-A3` | Money pages batch (5 pages) | 1.5h |

## Execution Order

```
S5A-A1 (design system) — must be first
  ↓
S5A-A2 → S5A-A3 → S5A-A4 (core sections)
S5B-A1 → S5B-A2 → S5B-A3 → S5B-A4 (trust sections)
  ↓
S5C-A1 → S5C-A2 → S5C-A3 → S5C-A4 → S5C-A5 (frame)
  ↓
S5E-A1 → S5E-A2 → S5E-A3 (content)

S5D-A1 through S5D-A5 run in parallel with any track
```

## Done Criteria

1. Homepage matches Figma's layout and visual richness
2. All cards have images where Figma shows images
3. Trust elements visible (rating, student count, credentials, quotes)
4. Schedule is scannable table layout
5. Footer is 4-column with social + legal
6. Floating CTA works
7. Mobile responsive
8. `npm run build` passes
9. Existing form, SEO, analytics, routing still work
10. Blog and money pages use new design system

## Old Tickets

Previous 13 Sprint 5 tickets (S5A-A1 through S5C-A3) are **superseded**.
Old ticket files in `/tickets/` kept for reference only.
