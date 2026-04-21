## Context
Regression testing around `eccd801` surfaced a pre-existing edge case on the homepage contact form. If a user enters business mode first and then clicks a schedule row, the prefill correctly updates `court`, `time_slot`, and `message`, but it does not reliably clear `level=doanh_nghiep`. That can leave the form in a mixed state where business intent and schedule intent are partially combined.

## Related Commits
- `eccd801` `fix: defer schedule message tracking to contact effects`
- `e0606cf` `fix homepage smoke blockers`

## Primary File References
- `src/components/home/forms/useContactFormEffects.ts`
- `src/components/home/conversion/HomepageConversionProvider.tsx`

## Root-Cause Hypothesis
`applySelectedSchedulePrefill` updates `court`, `time_slot`, and sometimes `level`, but it only sets `level` when the previous value is empty and a `levelHint` exists. After business mode, the previous value is already `doanh_nghiep`, so the schedule prefill path never resets it back to a schedule-compatible level.

## Success Criteria
- Switching from business mode to a schedule-row prefill produces a consistent non-business form state.
- `level`, `court`, `time_slot`, and `message` remain logically aligned after any intent-switch sequence.
- No regression in business CTA behavior or schedule-row quick-fill behavior.

## Fix Directions
- Reset `level` inside `applySelectedSchedulePrefill` when the previous state came from business mode.
- Alternatively, clear business mode when schedule prefill is applied so the form state machine has a single active intent.
- Add an explicit regression test or scripted browser check for the business-to-schedule sequence.

## Notes
This is not a launch blocker, but it is exactly the kind of edge that can confuse high-intent leads if left untracked.
