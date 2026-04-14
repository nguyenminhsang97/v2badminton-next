# Sprint 4 Tickets

## Status

- Sprint 4 status: `DONE_CODE_CUTOVER_DEFERRED`
- Dependency: `Sprint 3 DONE`

## Ticket Result

| ID | Title | Result |
|---|---|---|
| `S4A-A1` | Campaign schema polish | Done |
| `S4A-A2` | `getActiveCampaign()` query + type | Done |
| `S4A-A3` | Homepage campaign integration | Done |
| `S4A-A4` | Summer landing page | Done for `Phase 1` |
| `S4B-A2` | Production env audit | Done |
| `S4B-A1` | Production lead pipeline verification | Deferred after audit |
| `S4C-A1` | Mobile UX review | Done |

## Notes By Ticket

### `S4A-A1`

- Completed in `src/sanity/schemaTypes/campaign.ts`
- Studio preview now maps status values to readable labels

### `S4A-A2`

- Completed in `src/lib/sanity/queries.ts`
- Vietnam date handling is implemented with `UTC+7` logic

### `S4A-A3`

- Homepage hero now accepts an optional active campaign prop
- Default hero still renders unchanged when no campaign exists

### `S4A-A4`

- Phase 1 is complete
- Route file exists at `src/app/(site)/lop-he-cau-long-tphcm/page.tsx`
- Route is intentionally not published into `coreRoutes` yet
- Phase 2 is deferred until content exists and publishing is desired

### `S4B-A2`

- Production audit was completed
- Sanity vars are present
- DB and Telegram vars are still missing
- Findings are now treated as deferred ops follow-up, not sprint blockers

### `S4B-A1`

- Full production cutover verification is deferred
- Reason: user explicitly does not need cutover in Sprint 4
- The verification plan remains documented for future use

### `S4C-A1`

- Mobile horizontal overflow was found and fixed locally
- Local follow-up verification passed after the CSS patch

## Deferred Ops Follow-up

These are not part of Sprint 4 completion anymore:

1. Add production DB credentials
2. Add production Telegram credentials
3. Connect `v2badminton.com` to the Vercel project that serves the current app
4. Publish an active campaign document
5. Publish summer `money_page` content and enable `S4A-A4` Phase 2
6. Run live production lead pipeline verification after infra is ready
