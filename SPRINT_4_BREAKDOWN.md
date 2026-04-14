# Sprint 4: Campaign Layer + Cutover Prep

## Status

- Sprint 4 status: `DONE_CODE_CUTOVER_DEFERRED`
- Dependency: `Sprint 3 DONE`
- Codebase state: `main` already includes Sprint 2 + Sprint 3

## Summary

Sprint 4 is complete for product and engineering scope.

The sprint delivered:

1. Campaign layer groundwork for homepage hero overrides
2. Summer landing page Phase 1 at `/lop-he-cau-long-tphcm/`
3. Mobile UX triage and local CSS fix
4. Production cutover preparation and environment audit

Sprint 4 does **not** include final production cutover anymore. That work is now explicitly deferred to post-sprint ops.

## Delivered In Sprint 4

### Campaign layer

- Campaign schema translated and clarified in Studio
- `getActiveCampaign()` added to the Sanity query layer
- Homepage hero now supports optional campaign badge, title, description, and CTA override
- CTA fallback chain implemented:
  - `primaryCtaUrl`
  - `/${linkedPageSlug}/`
  - `#lien-he`

### Summer landing page

- Added route file for `/lop-he-cau-long-tphcm/`
- Added fallback config in `src/lib/moneyPageFallback.ts`
- Added metadata + structured data support for the route
- Kept route out of `coreRoutes` and `PREVIEW_READY_ROUTES`
- Summer page remains intentionally in `Phase 1`

### Mobile UX

- Reviewed homepage and money page behavior on narrow mobile viewport
- Fixed horizontal overflow in the contact section
- Re-verified local mobile layout after the CSS patch

### Production prep

- Audited production environment variables on Vercel
- Confirmed Sanity runtime variables are present in production
- Documented missing infra variables and domain mismatch for later ops follow-up

## What Is Deferred

These items are no longer Sprint 4 blockers:

1. Final production DB setup
2. Final Telegram credential setup
3. Real-domain cutover for `v2badminton.com`
4. Publishing an active campaign document
5. Publishing the summer `money_page` document and enabling Phase 2 route exposure
6. End-to-end live production lead verification after infra is ready

## Definition Of Done

Sprint 4 is considered done when:

- campaign schema polish is shipped
- active campaign query exists
- homepage hero campaign override path exists without regressing default hero
- summer landing page Phase 1 exists and compiles safely
- mobile UX issues found in local QA are triaged and small code fixes are applied
- production cutover requirements are documented clearly for later ops work
- `npm run lint` passes
- `npm run build` passes

## Final Outcome

Sprint 4 outcome:

- engineering: complete
- product scope: complete
- production cutover: deferred

This means Sprint 4 can be closed without waiting for infra or publishing decisions.
