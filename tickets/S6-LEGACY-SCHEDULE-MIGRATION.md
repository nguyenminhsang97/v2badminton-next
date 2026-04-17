# Legacy Schedule Compatibility Migration

## Why this still exists

Homepage schedule + contact form still need to translate Sanity schedule/location
data back into legacy `CourtId` / `TimeSlotId` values so the existing lead
pipeline, validation layer, and prefill UX keep working.

Current bridge:

- [D:\V2\v2badminton-next\src\components\home\compat\legacyScheduleCompatibility.ts](D:/V2/v2badminton-next/src/components/home/compat/legacyScheduleCompatibility.ts)

Current dependents:

- [D:\V2\v2badminton-next\src\components\home\sections\ScheduleSection.tsx](D:/V2/v2badminton-next/src/components/home/sections/ScheduleSection.tsx)
- [D:\V2\v2badminton-next\src\components\home\forms\ContactForm.tsx](D:/V2/v2badminton-next/src/components/home/forms/ContactForm.tsx)
- [D:\V2\v2badminton-next\src\lib\validation\lead.ts](D:/V2/v2badminton-next/src/lib/validation/lead.ts)
- [D:\V2\v2badminton-next\src\lib\leadPipeline.ts](D:/V2/v2badminton-next/src/lib/leadPipeline.ts)
- [D:\V2\v2badminton-next\src\lib\db\types.ts](D:/V2/v2badminton-next/src/lib/db/types.ts)

## Guard added in code

Homepage now runs a compatibility audit before render:

- [D:\V2\v2badminton-next\src\app\(site)\page.tsx](D:/V2/v2badminton-next/src/app/(site)/page.tsx)

Behavior:

- Local/dev/runtime: logs one warning if a location or schedule block can no
  longer be mapped.
- CI or strict mode: throws and fails the build when either of these appears:
  - an unmapped location/short name
  - an unsupported legacy `timeSlotId`

Strict mode triggers:

- `CI=true`
- `NEXT_STRICT_SCHEDULE_COMPAT=true`

## Migration target

Remove all homepage/runtime dependence on:

- `CourtId`
- `TimeSlotId`
- `LEGACY_COURT_TAB_ORDER`
- `LEGACY_COURT_ALIAS_MAP`
- `legacyScheduleCompatibility.ts`

And move the lead pipeline to canonical Sanity identifiers:

- `locationId` = Sanity location document `_id`
- `timeSlotId` = canonical schedule slot IDs from CMS

## Migration steps

### Phase 1 — Audit current Sanity data

1. Export current location docs and schedule block docs from Sanity.
2. Check every homepage location and schedule block against the compatibility
   guard output.
3. Fix any location whose `shortName` / `name` cannot be mapped to one of:
   - `green`
   - `hue_thien`
   - `phuc_loc`
   - `khang_sport`
4. Fix any schedule block whose `timeSlotId` is outside the supported set.

Exit criteria:

- Build passes with `NEXT_STRICT_SCHEDULE_COMPAT=true`

### Phase 2 — Move form + pipeline to canonical IDs

1. Add canonical location/time slot support to:
   - [D:\V2\v2badminton-next\src\lib\validation\lead.ts](D:/V2/v2badminton-next/src/lib/validation/lead.ts)
   - [D:\V2\v2badminton-next\src\lib\leadPipeline.ts](D:/V2/v2badminton-next/src/lib/leadPipeline.ts)
   - [D:\V2\v2badminton-next\src\lib\db\types.ts](D:/V2/v2badminton-next/src/lib/db/types.ts)
2. Update contact form option values to use canonical Sanity IDs instead of
   legacy aliases.
3. Update schedule prefill payloads to store canonical `locationId` +
   `timeSlotId`.

Exit criteria:

- Contact form submissions succeed without converting back to `CourtId`
- Schedule prefill still auto-fills and analytics remain intact

### Phase 3 — Remove bridge

1. Delete:
   - [D:\V2\v2badminton-next\src\components\home\compat\legacyScheduleCompatibility.ts](D:/V2/v2badminton-next/src/components/home/compat/legacyScheduleCompatibility.ts)
2. Remove legacy references from:
   - [D:\V2\v2badminton-next\src\lib\locations.ts](D:/V2/v2badminton-next/src/lib/locations.ts)
   - [D:\V2\v2badminton-next\src\lib\schedule.ts](D:/V2/v2badminton-next/src/lib/schedule.ts)
3. Replace any remaining `CourtId` / `TimeSlotId` usage in homepage code.

Exit criteria:

- No imports of `legacyScheduleCompatibility`
- No homepage dependency on `CourtId`
- CI stays green with strict compatibility mode enabled

## Non-goals for this batch

- No Sanity content migration is performed here.
- No lead database schema migration is performed here.
- No homepage behavior change is intended beyond surfacing bad legacy data
  sooner.
