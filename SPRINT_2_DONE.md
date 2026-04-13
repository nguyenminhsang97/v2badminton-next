# Sprint 2 Done

Sprint 2 is complete as of `2026-04-09`.

## Final State

- Sanity project: `w58s0f53`
- Dataset: `production`
- Frontend runtime reads are now wired through `src/lib/sanity/`
- Homepage now reads:
  - site settings
  - pricing tiers
  - schedule blocks
  - locations
  - homepage FAQs
- Existing routes now read from Sanity:
  - `/hoc-cau-long-cho-nguoi-moi/`
  - `/lop-cau-long-binh-thanh/`
  - `/lop-cau-long-thu-duc/`
- JSON-LD builders in `src/lib/schema.ts` are now pure data builders
- `siteConfig.siteUrl` now reads `NEXT_PUBLIC_SITE_URL`

## Delivered Tickets

- `S2-A1` Sanity client, env wiring, ISR strategy, null-safe fetch wrapper
- `S2-A2` typed GROQ query layer with barrel exports
- `S2-B1` `Nav` and `Footer` wired from Sanity site settings
- `S2-B2` homepage data fetch and prop distribution
- `S2-B3` homepage section internals wired to Sanity-backed props
- `S2-B4` `ContactSection` and `ContactForm` wired to Sanity-backed props
- `S2-C1` 3 existing pages wired to Sanity-backed runtime content
- `S2-C2` JSON-LD builders decoupled from static libs and call sites updated
- `S2-D1` smoke verification, fallback verification, ISR config confirmation, deprecation notes

## Revalidation Strategy

- Runtime strategy: time-based ISR via `next.revalidate`
- Source of truth: `src/lib/sanity/client.ts`
- Env var: `SANITY_REVALIDATE_SECONDS`
- Default: `300` seconds
- Cache tags are attached per request for future on-demand invalidation work

Operator expectation:

- In production, published Sanity changes may take up to `5` minutes to appear
- In `next dev`, content is effectively fresh on reload
- If Sanity env vars are missing or Content Lake is unavailable, frontend routes fall back to static reference data instead of crashing

## Verification

Final commands:

```powershell
npm run lint
npm run build
```

Final result:

- `npm run lint` pass
- `npm run build` pass

Smoke verification completed against a local dev server.

Verified runtime behavior:

- homepage renders pricing, schedule, locations, FAQs, contact section, and form controls
- homepage JSON-LD includes `Organization`, `WebSite`, `FAQPage`, `LocalBusiness`, and `Course`
- `/hoc-cau-long-cho-nguoi-moi/` renders FAQ + pricing content from Sanity-backed queries
- `/lop-cau-long-binh-thanh/` renders district-filtered locations + FAQs
- `/lop-cau-long-thu-duc/` renders district-filtered locations + FAQs
- no Next.js error overlay detected during route checks
- no application `pageerror` detected during browser smoke verification

Fallback verification completed:

- temporarily blanking `NEXT_PUBLIC_SANITY_PROJECT_ID` no longer breaks the site
- homepage still renders via static fallback data
- Studio route now degrades gracefully instead of crashing the whole app when Sanity env is missing

ISR configuration confirmed in code:

- `sanityFetchOrFallback()` passes:
  - `next: { revalidate: SANITY_REVALIDATE_SECONDS, tags: [...] }`
- `SANITY_REVALIDATE_SECONDS` reads from env and defaults to `300`

## Notes

- Static libs in `src/lib/` were not removed in Sprint 2
- `faqs.ts` and `pricing.ts` are now fallback-only sources
- `locations.ts` and `schedule.ts` remain partially active because legacy ID types still power the lead pipeline and homepage conversion flow
- `ContactForm` UI copy is intentionally still rough and will be polished in Sprint 3 alongside real content/UI work
- `buildFaqPageSchema([])` still emits an empty `FAQPage`; this is acceptable for Sprint 2 and can be hardened later if desired

## Deprecation Status

Files annotated in Sprint 2:

- `src/lib/faqs.ts`
- `src/lib/pricing.ts`
- `src/lib/locations.ts`
- `src/lib/schedule.ts`

Important clarification:

- these files are not dead code yet
- they remain required for fallback data and legacy type compatibility
- full removal is blocked until Sanity-native IDs replace legacy `CourtId` and `TimeSlotId` usage deeper in the lead pipeline

## Retrospective

What went well:

- query-layer-first wiring kept component changes relatively clean
- fallback-at-data-layer prevented homepage and local routes from going blank while the published dataset was incomplete
- separating JSON-LD refactor into `S2-C2` avoided two competing sources of truth by the end of the sprint

What was harder than expected:

- the homepage form and conversion flow still depend on legacy court and time-slot IDs
- fallback testing exposed a hidden coupling in `sanity.config.ts` that could crash the whole app when env was missing
- static data could not be fully deprecated because the lead pipeline still depends on old IDs and enums

What changed because of verification:

- `sanity.config.ts` now avoids throwing on missing env during app boot
- `/studio` now shows an unavailable state when Sanity env is missing instead of taking down frontend routes

## Sprint 3 Scope

Recommended Sprint 3 focus:

1. Polish visible content and UI for homepage sections, especially `ContactSection` and `ContactForm`
2. Replace ASCII-only placeholder copy with final Vietnamese content
3. Decide whether empty FAQ schema should return `null` and skip `<JsonLd>` output
4. Start moving schema/business/contact metadata off static `siteConfig` and onto Sanity-backed settings where appropriate
5. Prepare deeper migration away from legacy `CourtId` / `TimeSlotId` in the lead pipeline
6. Verify ISR behavior on deployed Vercel environments with real Sanity publish events

Suggested Sprint 3 definition of done:

- homepage content is editorially polished
- contact flow copy and UX are production-ready
- deployed ISR behavior is verified against real Sanity edits
- remaining hard dependencies on static site metadata are reduced further
