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
