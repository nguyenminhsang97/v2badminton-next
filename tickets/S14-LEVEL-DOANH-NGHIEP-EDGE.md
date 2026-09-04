## Status

`DONE` — fixed 2026-09-03. Root cause confirmed, second defect found and fixed in the same pass.

## Context
Regression testing around `eccd801` surfaced a pre-existing edge case on the homepage contact form. If a user enters business mode first and then clicks a schedule row, the prefill correctly updates `court`, `time_slot`, and `message`, but it does not reliably clear `level=doanh_nghiep`. That can leave the form in a mixed state where business intent and schedule intent are partially combined.

## Related Commits
- `eccd801` `fix: defer schedule message tracking to contact effects`
- `e0606cf` `fix homepage smoke blockers`

## Primary File References
- `apps/web/src/components/home/forms/useContactFormEffects.ts`
- `apps/web/src/components/home/forms/contactForm.shared.ts`
- `apps/web/src/components/home/conversion/HomepageConversionProvider.tsx`
- `apps/web/src/components/home/sections/ScheduleSection.tsx`

## Root cause (confirmed)

### Defect 1 — `level` is never overwritten by a schedule prefill
`applySelectedSchedulePrefill` only wrote `level` under `if (prev.level === "" && levelHint)`. After
`applyBusinessMode` set `level = "doanh_nghiep"`, that guard never passed, so the value stayed.

The provider was **not** at fault: `setPrefill()` already calls `setBusinessMode(false)`.

Impact was not cosmetic. `buildLeadType(values.level, businessMode)` returns `"corporate"` purely from
`level`, so a schedule-row lead was tagged corporate in the `generate_lead` analytics event, in the
`leads` DB row (`submitLead.ts` → `lib/db`), and in the notification payload (`lib/leadPipeline.ts`).

The guard was also too narrow in general: any level that contradicted the clicked row stayed stuck
(e.g. `nang_cao` selected, then a `co_ban`-only row clicked).

### Defect 2 — re-clicking the same schedule row after business mode did nothing
`lastAppliedPrefillKeyRef` de-duplicates identical prefills, but `applyBusinessMode` cleared
`court`/`time_slot` without resetting that ref. Sequence *row A → business CTA → row A again* hit the
duplicate-key early return, so nothing was applied and the form silently stayed in the business state
with empty court/time slot.

## Fix shipped

Compatibility-based resolution — the clicked schedule row is the source of truth for `level`:

1. `SchedulePrefill` now carries `levels` (the row's supported levels) alongside `levelHint`.
2. `buildSchedulePrefill` fills `levels` and generalises `levelHint` to any single-level row (previously
   `co_ban`-only), so a `doanh_nghiep`-only row now sets the level correctly instead of clearing it.
3. New pure helper `resolveSchedulePrefillLevel(previousLevel, prefill)` in `contactForm.shared.ts`:
   keep the previous level when the row supports it, otherwise take `levelHint ?? ""`.
4. `applyBusinessMode` resets `lastAppliedPrefillKeyRef` (defect 2).

## Success Criteria — all met
- [x] Switching from business mode to a schedule-row prefill produces a consistent non-business form state.
- [x] `level`, `court`, `time_slot`, and `message` remain logically aligned after any intent-switch sequence.
- [x] No regression in business CTA behavior or schedule-row quick-fill behavior.
- [x] Explicit regression test added.

## Verification
- `apps/web/src/components/home/forms/__tests__/contactForm.shared.test.ts` — 10 cases covering the
  bug sequence, compatible/incompatible level pairs, and the `buildLeadType` contract. Runs in CI via
  `npm test`.
- `npm run lint`, `npm run typecheck`, `npm test` (63 passed), `npm run build` — all green.
- Scripted browser run against the production build:

  | Step | Result |
  |---|---|
  | Enterprise CTA | `level=doanh_nghiep`, court/time slot hidden |
  | Click schedule row (multi-level) | `level=""`, `court=hue_thien`, `time_slot=sang-07-09`, schedule message |
  | Enterprise CTA again → re-click the **same** row | prefill re-applied (defect 2 fixed) |
  | Schedule row → enterprise CTA | `level=doanh_nghiep`, court/time slot cleared |
  | Click `co_ban`-only row | `level=co_ban` auto-filled |

## Notes
This was not a launch blocker, but it is exactly the kind of edge that can confuse high-intent leads if
left untracked. The blast radius reached the database and the notification payload, not just the UI.

**Production impact was potential, not realised.** Checked against the Neon `leads` table on
2026-09-04: 27 leads since 2026-04-07, **zero** rows with `level = 'doanh_nghiep'`. Five leads carry a
level plus court and time slot (the schedule-prefill path), the other 22 left the optional block empty.
So no stored lead was ever mis-tagged corporate — the fix closes the hole before it cost a real lead
rather than repairing damage already done.
