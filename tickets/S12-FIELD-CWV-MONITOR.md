## Context
Launch decisions were made against Lighthouse lab data, but Google ranking and user experience outcomes depend on field data. The homepage shipped with an accepted soft `LCP` miss in lab while money pages clustered in a pragmatic pass range. We need a lightweight monitoring loop so follow-up perf work is driven by real-user evidence rather than repeated synthetic guesswork.

## Related Commits
- `3ed861f` `A1 degraded-route CLS fix`
- `accc769` `perf server render pricing cards`
- `cd134ae` `perf: defer homepage below-the-fold hydration`
- `be9cf62` `perf: defer turnstile until contact intent`
- `98a90bf` `perf: lazy hydrate homepage sections`
- `e0606cf` `fix homepage smoke blockers`

## Success Criteria
- Google Search Console ownership is verified and sitemap submission is complete.
- Core Web Vitals are reviewed weekly during the first 28 days after launch.
- A post-28-day decision is recorded for whether `S10` and `S11` should move up in priority.

## Monitoring Plan
- Submit `sitemap.xml` in Search Console and confirm coverage starts populating.
- Review Search Console Core Web Vitals weekly for mobile URL-group trends.
- Capture CrUX or equivalent field metrics once enough production traffic accumulates.
- Compare field homepage `LCP` against the launch lab baseline before committing to another perf sprint.

## Notes
This ticket is intentionally operational rather than code-heavy. The goal is to create a reliable evidence loop for post-launch prioritization.
