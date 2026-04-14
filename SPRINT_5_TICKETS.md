# Sprint 5 Tickets

## Status

- Sprint 5 status: `PLANNED`
- Dependency: `Sprint 4 DONE_CODE_CUTOVER_DEFERRED`

## Design Priority

Every Sprint 5 ticket should respect this order:

1. `VERSION_C_BLUEPRINT.md` and `VERSION_C_IMPLEMENTATION_PLAN.md`
2. `D:\V2\landing-page`
3. `D:\V2\Badminton Academy Enrollment Screens`

Interpretation:

- Blueprint decides architecture.
- Static V2 decides business tone and proven conversion cues.
- Figma decides polish and hierarchy.

## Ticket List

| ID | Title | Goal |
|---|---|---|
| `S5A-A1` | Missing CSS audit & fix | Close missing/unstyled component gaps without changing architecture |
| `S5A-A2` | Loading UX hardening | Add branded route-level loading and empty-state behavior |
| `S5A-A3` | Focus indicators + contrast audit | Improve keyboard UX and accessibility clarity |
| `S5A-A4` | Next.js Image migration + heroImage rendering | Improve image quality and money-page hero presentation |
| `S5B-A1` | Error UX hardening | Replace generic framework error UI with branded safe fallbacks |
| `S5B-A2` | Breadcrumbs on money pages | Match static SEO-page expectations visually |
| `S5B-A3` | CTA/button consistency audit | Align hover, focus, and affordance quality across the site |
| `S5B-A4` | Summer page Phase 2 follow-through | Publish summer route only after content is verified |
| `S5D-A1` | GTM/GA4 integration | Connect the existing tracking layer to a real receiver |
| `S5D-A2` | Conversion tracking setup | Measure the funnel after UI polish lands |
| `S5C-A1` | Blog queries + types | Add the Sanity query layer for blog content |
| `S5C-A2` | Blog listing + detail pages | Add long-tail SEO content on top of the improved system |
| `S5C-A3` | Money pages batch | Expand service coverage using the improved page system |

## Execution Notes

### UI tickets

When implementing `S5A-*` and `S5B-*`, borrow:

- hero trust and CTA clarity from `D:\V2\landing-page\index.html`
- SEO-page rhythm from `D:\V2\landing-page\seo-common.css`
- stronger card composition from `D:\V2\Badminton Academy Enrollment Screens\src\app\pages\HomePage.tsx`

Do not:

- replace the homepage with a wizard
- replace the V2 dark + lime identity
- break the Version C section architecture

### Analytics tickets

When implementing `S5D-*`, preserve continuity with the current V2 event model
from `D:\V2\landing-page\tracking.js` wherever reasonable:

- `cta_click`
- `contact_click`
- `map_click`
- `form_start`

### Content tickets

Blog pages and new money pages must inherit the shared system built in Tracks A/B.
They should not become a separate visual family.

## Done Criteria

Sprint 5 should be considered done when:

1. shared UI gaps are closed
2. homepage and money pages feel more intentional and conversion-ready
3. loading and error UX are branded
4. GTM/GA4 receives real events
5. blog and new money pages can reuse the improved UI cleanly
