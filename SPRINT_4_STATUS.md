# Sprint 4 Status

Sprint 4 is complete for code and product scope as of `2026-04-14`.

Production cutover tasks are intentionally deferred and are no longer treated as Sprint 4 blockers.

## Completed

- Campaign schema translated and cleaned up
- `getActiveCampaign()` added
- Homepage hero campaign override path added
- Summer landing page Phase 1 added at `/lop-he-cau-long-tphcm/`
- Mobile contact-section overflow fixed locally
- Sprint 4 planning docs and ticket docs updated

## Verification

Local verification completed:

```powershell
npm run lint
npm run build
```

Result:

- `npm run lint` pass
- `npm run build` pass

Additional local QA:

- homepage mobile overflow fixed
- local money page mobile layout verified
- hero CTA and contact submit CTA remain comfortably tappable

## Deferred After Sprint 4

These items remain valid follow-up work, but they are outside Sprint 4 completion:

1. Production database setup
2. Production Telegram setup
3. Real-domain cutover for `v2badminton.com`
4. Publishing an active campaign document
5. Publishing summer page content and enabling Phase 2 exposure
6. Full production lead pipeline verification

## Final Call

Sprint 4 should be treated as:

- `DONE` for engineering and product scope
- `DEFERRED` for cutover and infra follow-up
