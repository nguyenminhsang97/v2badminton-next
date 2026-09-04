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

### Caveat on the comparison

The CMS-less local build is not a clean before/after — it isolates "with CMS
content" vs "without", not drift over time. It bounds where the bytes come from;
it does not prove when they arrived. A dated re-measure of production is the only
honest trend line, and this entry is the first one.

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
