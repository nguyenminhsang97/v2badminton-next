# V2 Badminton - Sprint 2 Team Review

> Consolidated team review after Sprint 2 planning
> Date: 2026-04-06
> Branch: `codex/sprint2-plan`

---

## Participants

- Main implementation lead
- SEO review pass
- Frontend/parity review pass
- Backend/ops review pass
- BA/product review pass

---

## Team verdict

**Sprint 2 is still a Go**, but only after syncing the docs around:

- homepage SEO-links block parity
- schedule tab model parity
- prefill-flow ownership and acceptance
- server-side duplicate policy
- lead delivery audit fields
- health endpoint semantics
- ops provisioning completeness

Those syncs are now reflected in:

- `SPRINT2_PLAN.md`
- `SPRINT2_TICKET_DETAILING.md`
- `TASKS.md`
- `SPRINT2_TECHNICAL_REVIEW.md`

---

## What each pass added

### Frontend/parity

Locked:

- `#seo-links` is a standalone homepage block and must not be merged into location cards
- schedule tabs should match production per-court model
- prefill parity includes:
  - open optional fields
  - preserve user-edited message
  - beginner-level prefill for basic-only slots
  - focus after scroll settles
- course-card behavior must preserve filtering/flow, not degrade into static cards

### Backend/ops

Locked:

- lead schema needs delivery-audit fields
- duplicate-submit policy must exist server-side
- `/api/health` must reflect DB health meaningfully
- monitoring acceptance must cover real lead-failure branches
- provisioning list must include ops alert destination and backup email target

### BA/product

Locked:

- Block C and Block D cannot be treated as independent done states
- homepage SEO-link behavior cannot quietly disappear behind Sprint 3
- homepage conversion-state ownership must be explicit
- Sprint 2 must define what is parity now vs what is deferred later

### SEO

Already folded into Sprint 2 docs:

- homepage metadata belongs to Sprint 2
- homepage JSON-LD belongs to Sprint 2
- exposed homepage internal SEO links must resolve `200`

---

## Final decisions after team review

1. Homepage metadata and homepage JSON-LD are Sprint 2 requirements.
2. The production `#seo-links` block must exist in Sprint 2.
3. Location cards remain maps-first, like production.
4. Schedule tabs stay `all + per-court`, not district tabs.
5. One homepage conversion controller owns prefill, business mode, scroll, and focus.
6. Contact section keeps direct contact-channel CTAs, not only the form.
7. Lead schema stores notify audit fields.
8. Duplicate-submit handling is a server-side requirement.
9. `/api/health` must be meaningful for alerting, not just pingable.
10. Sprint 2 docs are now aligned enough to start implementation safely.

