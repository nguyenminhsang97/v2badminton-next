# Sprint 3 Done

Sprint 3 is complete as of `2026-04-10`.

## Final State

- Homepage trust layer is now wired and production-capable at the code level
- New homepage sections added:
  - `CoachSection`
  - `TestimonialsSection`
- Contact flow copy has been polished to Vietnamese with full accents
- Shared presentational blocks extracted:
  - `PricingCards`
  - `LocationsGrid`
  - `FaqList`
- Shared money page template added:
  - `src/components/money-page/MoneyPageTemplate.tsx`
- Existing routes upgraded to Sanity-backed money-page rendering with safe fallback:
  - `/hoc-cau-long-cho-nguoi-moi/`
  - `/lop-cau-long-binh-thanh/`
  - `/lop-cau-long-thu-duc/`
- New routes added and now published in SEO:
  - `/lop-cau-long-tre-em/`
  - `/lop-cau-long-cho-nguoi-di-lam/`
  - `/cau-long-doanh-nghiep/`
- `coreRoutes`, homepage SEO links, and `sitemap.xml` now include all `6` money pages

## Delivered Tickets

- `S3A-A1` Contact copy polish and stale comment cleanup
- `S3A-B1` `getCoaches()` query and `SanityCoach` type
- `S3A-B2` `CoachSection` component and responsive styling
- `S3A-B3` Homepage wiring for `CoachSection`
- `S3A-C1` `getTestimonials()` query and `SanityTestimonial` type
- `S3A-C2` `TestimonialsSection` component and responsive styling
- `S3A-C3` Homepage wiring for `TestimonialsSection`
- `S3B-A1` Extract `PricingCards`
- `S3B-A2` Extract `LocationsGrid`
- `S3B-A3` Extract `FaqList`
- `S3B-B1` `getMoneyPage(slug)` query and `SanityMoneyPage` type
- `S3B-C1` `MoneyPageTemplate` and supporting metadata builder
- `S3B-D1` Convert 3 live routes with safe fallback behavior
- `S3B-D2` Create 3 new money-page routes with Sanity gating
- `S3B-E1` Publish-gate follow-through for the 3 new routes

## Content State

Sprint 3 is considered complete without requiring final editorial content.

Current Sanity content state:

- `2` coach starter documents were created and are active
- `6` money page documents were created and published
- `3` testimonial placeholder documents were created but intentionally remain inactive

Important behavior:

- `CoachSection` is visible on the homepage
- `TestimonialsSection` remains hidden because there are no active testimonials yet
- all `6` money pages render from Sanity content right now

Editorial truth is deferred:

- coach starter content should later be replaced with real HLV names/photos
- testimonial placeholders should later be replaced with real quotes and toggled `isActive=true`
- money page copy can be refined later without further code changes

## Sanity Runtime Note

The project dataset is currently private for frontend runtime reads.

Local development now requires a read token in `D:/V2/v2badminton-next/.env.local`:

- `SANITY_API_READ_TOKEN`

Why this mattered:

- without the token, the app fell back to static data and the new money pages stayed hidden
- after adding the local read token and restarting dev, the app correctly read the published dataset

This token remains local-only and was not committed.

## Verification

Final commands:

```powershell
npm run lint
npm run build
```

Final result:

- `npm run lint` pass
- `npm run build` pass

Browser/runtime verification completed against local dev:

- homepage loads and renders `CoachSection`
- homepage exposes links to all `6` money pages
- `/hoc-cau-long-cho-nguoi-moi/` renders `MoneyPageTemplate`
- `/lop-cau-long-binh-thanh/` renders `MoneyPageTemplate` with district filtering preserved
- `/lop-cau-long-thu-duc/` renders `MoneyPageTemplate` with district filtering preserved
- `/lop-cau-long-tre-em/` returns `200`
- `/lop-cau-long-cho-nguoi-di-lam/` returns `200`
- `/cau-long-doanh-nghiep/` returns `200`
- `sitemap.xml` now includes the 3 newly published routes

## Review Fixes Closed During Sprint 3

These issues were found and fixed before close-out:

- local money pages now re-apply district filtering on the Sanity path
- pricing CTA analytics now normalize pathname before classifying `seo_local` vs `seo_service`
- `getMoneyPage()` now applies active/slug safeguards when resolving referenced locations and pricing tiers

## Dataset Notes

One unrelated validation issue still exists in Sanity outside Sprint 3 scope:

- draft `schedule_block` document `drafts.09792de8-dd02-44d6-b7da-9ad3e7aafbe4` is missing required fields

This draft was not created by Sprint 3 work and does not block the published site.

## Retrospective

What went well:

- extracting presentational blocks before money-page templating prevented homepage regressions
- safe fallback for the 3 live routes avoided SEO regressions while the new Sanity documents were being created
- publish gating through `coreRoutes`, homepage SEO links, and sitemap stayed simple and easy to verify

What was trickier than expected:

- the Sanity dataset was effectively private for frontend runtime reads, even though CLI access was working
- browser automation could verify published output but was not a reliable way to inspect draft-only Studio state
- stale fetch cache made a bad first seed look persistent until the dev cache was cleared and the server was restarted cleanly

What changed because of verification:

- a local Sanity read token is now required during development
- starter Sanity documents were created so the Sprint 3 code path can be exercised end-to-end
- the 3 new money pages were moved from gated routes to published SEO routes

## After Sprint 3

Recommended next steps:

1. Replace coach starter content with real HLV details in Studio
2. Replace testimonial placeholders with real quotes and activate them
3. Review and refine published money-page copy for editorial quality
4. Decide whether the navigation should continue exposing all `6` SEO/money pages directly
5. Plan Sprint 4 work around lead-pipeline migration, dynamic metadata strategy, and future campaigns
