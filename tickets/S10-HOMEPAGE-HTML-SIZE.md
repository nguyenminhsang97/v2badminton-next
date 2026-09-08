## Status

`OPEN — RAISED` by the `S12` post-28-day review on 2026-09-04. This is the only
tracked perf metric that has moved **backwards** since the ticket was filed, and
it is now the top remaining perf ticket.

| | Homepage decoded HTML |
|---|---|
| Recorded when this ticket was filed | 143.8 KiB |
| **Production, measured 2026-09-04** | **194.7 KiB** |
| Success criterion | < 80 KiB |

That is +50.9 KiB (+35 %) against a target that is now 2.4× away.

### Update 2026-09-08 — option 3 shipped, target still not met

Option 3 (dedupe location nodes to `@id` references) is implemented in
`49b8607`. Measured on a production build against live production:

| | Homepage decoded HTML |
|---|---|
| Production, 2026-09-04 | 194.7 KiB |
| **Production build, 2026-09-08** | **187.1 KiB** |
| Success criterion | < 80 KiB |

−7,771 B (−3.9 %). `homepage-course-schema` went 17,411 → 13,291 B and
`streetAddress` from 42 occurrences to 10. Four money pages that carry a Course
schema each dropped ~2.0 KiB; `/gia-hoc-cau-long-tphcm/` — business block, no
Course schema — gained 390 B, the `@id` strings with nothing to offset them.

This is the size of win option 3 was estimated at, and it confirms the rest of
the analysis below: **the ticket's own conclusion stands, the 80 KiB target is
still unreachable without option 2.** The remaining decision is unchanged —
re-set the target on evidence, or do the architectural work.

### Measured non-actions, so nobody re-derives them

Two adjacent ideas were evaluated on 2026-09-08 and deliberately **not** taken.

**Deduping `courseSchedule` the same way — rejected.** It is the larger half:
9,296 B across the 4 homepage Courses versus 5,084 B for locations, because each
Course repeats all 14 `Schedule` nodes. But a `Schedule` has no defining block
anywhere on the page, so referencing one by `@id` would mean defining it inside
the first Course and pointing the other three at it. If Google evaluates a Course
independently of its siblings, those three lose their schedule entirely. That is
the same dangling-reference failure option 3 was carefully designed to avoid,
traded for 4.6 % of the page. Not worth it.

**`experimental.inlineCss` — rejected, and it would make this ticket worse.** The
18.1 KiB stylesheet is render-blocking and PSI estimates 130–330 ms from
inlining it. But the flag's own documentation states styles are then emitted
"once within `<style>` tags for SSR and once in the RSC payload" — the exact
doubling this ticket is about, so it would add roughly 36 KiB to every page. It
is also global (no per-page opt-in), experimental, and aimed at atomic CSS like
Tailwind, which this project does not use. Hand-extracted critical CSS for the
hero and nav remains viable and is a separate piece of work.

### New evidence for the stated hypothesis

The hypothesis in this ticket — that Sanity-backed sections serialize too much
into the initial server HTML — is supported by a build comparison rather than left
as a guess. A local production build made **without Sanity credentials** (the env
files sit at the repo root, where npm scripts do not read them, so the build
renders fallback content) prerenders the homepage at **136.1 KiB**, versus
194.7 KiB live. Roughly **~59 KiB of the live homepage is CMS-sourced content and
its serialization.**

The same pattern is larger on money pages: `/hoc-cau-long-cho-nguoi-moi/` is
34.9 KiB from that CMS-less build and **102.2 KiB** in production.

The practical consequence: this cost **scales with published CMS content**, so it
grows as editors publish and will not self-correct. That is what moves this ticket
up rather than leaving it as generic post-launch polish.

### Caveat on the comparison — superseded, read the investigation below

The CMS-less local build is not a clean before/after: it isolates "with CMS
content" vs "without", not drift over time.

**Superseded on the same day.** Once the env files are placed where npm scripts
actually read them, a local build reproduces production to within 0.4 KiB
(194.3 vs 194.7), so the 136.1 KiB figure above is a *misconfigured* build, not a
meaningful CMS-less baseline. The `~59 KiB` inference still points the right way,
but the byte-level breakdown in the next section replaces it with direct
measurement — and reaches a different conclusion about what to do.

---

## Investigation 2026-09-04 — where the bytes actually are

Profiled the live homepage byte by byte. **Two of this ticket's four hypotheses
are dead, the real cost is elsewhere, and the 80 KiB target is not reachable by
any of the approaches listed below.** Read this before starting work.

### Byte breakdown of the 194.7 KiB page

| Part | Size | Share |
|---|---|---|
| **RSC flight payload** (`self.__next_f.push`) | **106.3 KiB** | **54.6 %** |
| JSON-LD in `<script>` markup | 23.3 KiB | 12.0 % |
| All other markup (head, attrs, visible DOM) | 65.1 KiB | 33.4 % |
| — of which every top-level `<section>` combined | 49.5 KiB | 25.4 % |

### Hypotheses this kills

- **"Reduce repeated string duplication or verbose markup"** — measurable, and
  small. Every long string appearing more than once in the RSC payload wastes
  **5.5 KiB total**. Not worth a sprint.
- **"Profile decoded HTML contribution per section"** — done. All top-level
  sections *combined* are 49.5 KiB. Even deleting every section outright leaves
  145 KiB. Section markup is not the problem.

### The real cost: everything server-rendered is emitted twice

App Router ships the rendered HTML **and** the RSC flight payload that
reproduces it for hydration and client navigation. Anything a server component
renders is paid for in both. That is inherent to the architecture, not a defect
here — but it means the flight payload sets a floor no markup trimming can go
below.

**Structured data is the clearest case.** Verified by counting occurrences across
the whole document: `streetAddress` appears **42 times** — 21 in the flight
payload, 21 in the markup. Same 2× for `hasCourseInstance` (8 = 4 + 4) and
`FAQPage` (2 = 1 + 1). Total JSON-LD cost: **46.0 KiB, 23.6 % of the page**.

Inside that, the same **~4 distinct venues** are serialized as full
`SportsActivityLocation` nodes (name + `PostalAddress` + `GeoCoordinates` +
image) **34 times** across both copies — 16.3 KiB — because
`buildCourseInstances` inlines `locations.map(buildEmbeddedSportsLocation)` into
every one of the 4 `Course` blocks, on top of the `LocalBusiness` block that
already lists them all.

FAQ answers land in the document **4 times each**: visible markup, `FAQPage`
JSON-LD, and both of those again inside the flight payload.

### The target is unreachable as written

| Scenario | Resulting page | vs 80 KiB target |
|---|---|---|
| Today | 194.7 KiB | +114.7 |
| Dedupe the 34 location nodes to `@id` refs | ~181.7 KiB | +101.7 |
| **Delete 100 % of structured data** | **148.7 KiB** | **+68.7** |

Deleting all structured data — which we obviously will not do — still misses the
target by 68.7 KiB. **No combination of the four approaches in this ticket
reaches 80 KiB.** Either the page stops server-rendering this much in the initial
payload, or the number changes.

### Options, ranked, with the risk attached to each

1. **Re-set the target on evidence** (recommended first step). 80 KiB was chosen
   when the page measured 143.8 KiB, against money pages at ~38.4 KiB. Those
   money pages now measure 76.9–102.2 KiB themselves, so the comparison the
   target rested on no longer holds. Decide what number matters — and consider
   whether total HTML is even the right metric versus above-the-fold payload.
2. **Architectural: keep below-the-fold sections out of the initial payload** —
   the only lever large enough to matter. This ticket already names it ("moving
   schedule content to a lightweight route-handler fetch with a reserved-height
   shell"). Suspense boundaries or post-mount fetches for schedule, testimonials
   and FAQ. Real work, real CLS risk, needs reserved heights.
3. **Dedupe location nodes to `@id` references** — ~13 KiB, ~6.7 %, doubled
   because it lands in both copies. **Not free of risk:** `buildCourseInstances`
   is shared with money pages via `buildCoursePageSchema`, and not every money
   page emits a `LocalBusiness` block defining those nodes. Emitting a bare
   `@id` on a page that never defines the node produces a **dangling reference** —
   worse for SEO than the duplication. Any implementation must be page-aware, or
   restricted to the homepage where `buildHomepageLocalBusinessSchema` is
   guaranteed to define them.
4. ~~**Check a correctness question found in passing**~~ — **SETTLED 2026-09-04,
   no action needed.** `buildCourseInstances` filters *schedule blocks* by
   location (`filterScheduleBlocksForLocations`) but emits **all** locations
   unfiltered, which would be a false claim if any course did not run at every
   venue. **The owner confirms all four courses genuinely run at all four
   venues**, so the emitted schema is factually correct as-is. Recorded here so
   nobody re-opens it — but note this also means the duplication in option 3 is
   real data, not a bug, and removing it is purely a size decision.

### Reproducing these measurements

A local production build now reproduces production almost exactly — **194.3 KiB
local vs 194.7 KiB live** — but only when the env files are where npm scripts
read them. They currently sit at the **repo root**, where the build silently
ignores them and renders fallback content (that build produces a misleading
136.1 KiB). Copy `.env.local` and `.env.production.local` into `apps/web/` before
measuring, as `docs/cutover-guide.md` already says.

---

## Context
Homepage HTML measured about `143.8 KiB` decoded during the launch perf pass, versus about `38.4 KiB` on representative money pages. The extra `~105 KiB` is now the clearest remaining homepage-specific cost after C1/C2 removed the major client-hydration bottlenecks. This aligns with Finding H5 from `tickets/S9-HOMEPAGE-INVESTIGATION.md`: the homepage likely serializes too much section data into the initial server HTML.

## Related Commits
- `cd134ae` `perf: defer homepage below-the-fold hydration`
- `be9cf62` `perf: defer turnstile until contact intent`
- `98a90bf` `perf: lazy hydrate homepage sections`
- `e0606cf` `fix homepage smoke blockers`

## Hypothesis
Sanity-backed schedule, testimonials, course, or other homepage sections are sending more inline HTML and serialized payload than we need for the first render. The content may be duplicated across server markup, hydration payload, or repeated strings in section rendering.

## Success Criteria
- Homepage decoded HTML is below `80 KiB` in production.
- Homepage lab `LCP` is below `3.0s` on the current mobile Lighthouse profile.
- No regression in homepage SEO content, schema output, or CLS.

## Investigation / Approach Options
- Profile decoded HTML contribution per homepage section and identify the largest payload owners.
- Test moving schedule content to a lightweight route-handler fetch with a reserved-height shell.
- Trim Sanity projections so sections only receive fields required for first render.
- Reduce repeated string duplication or verbose markup in schedule/testimonial/course output.

## Notes
This is post-launch work because the site already shipped with acceptable soft-miss performance, but it is the highest-leverage remaining homepage perf ticket.
