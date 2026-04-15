# Sprint 5 Done

## Result

Sprint 5 completed the Figma-first visual overhaul on top of the existing V2 Badminton architecture.

The sprint shipped:

- Homepage visual redesign aligned to the public Figma direction:
  - light-forward hero
  - rounded button system
  - white cards + shadow treatment
  - redesigned course, pricing, why, coach, testimonial, schedule, contact, footer, nav, and support sections
- Money pages brought onto the same presentation system:
  - breadcrumb + kicker rhythm
  - white-card hero layout
  - CTA / pricing / FAQ / location sections matching the homepage system
  - copy-only hero fallback when Sanity has no hero image, without empty visual columns
- Blog foundation and routes:
  - `/blog/`
  - `/blog/[slug]`
  - listing and article layouts updated to the same Figma-first card and typography system
- 5 new money pages in Phase 1:
  - `/hoc-cau-long-1-kem-1/`
  - `/lop-cau-long-cuoi-tuan/`
  - `/lop-cau-long-buoi-toi/`
  - `/gia-hoc-cau-long-tphcm/`
  - `/team-building-cau-long/`
- GTM/GA4 code-paths and floating CTA support
- Loading / not-found / error UX hardening already covered by Sprint 5 code
- SEO / CWV guardrails preserved during the redesign:
  - semantic section/article/heading structure retained
  - only one above-the-fold priority image per page
  - no hidden core content on mobile for homepage, blog articles, or money-page body copy
  - every rendered `Image` keeps a non-empty alt path

## Verification

- `npm run lint`
- `npm run build`
- Local browser verification on:
  - `/`
  - `/blog/`
  - `/hoc-cau-long-cho-nguoi-moi/`
  - representative money pages with and without Sanity hero imagery

## Deferred Follow-up

These items are intentionally not treated as Sprint 5 blockers:

1. Summer page Phase 2 publish gate
   - Wait for published `money_page` with slug `lop-he-cau-long-tphcm`
   - Then add route activation in `coreRoutes` and `PREVIEW_READY_ROUTES`

2. GTM / GA4 live activation
   - Requires `NEXT_PUBLIC_GTM_ID`
   - Requires container and conversion setup outside the repo

## Notes

- Sprint 5 used the Figma site as visual source of truth.
- Existing routing, Sanity models, lead flow, analytics event model, and SEO architecture were preserved.
