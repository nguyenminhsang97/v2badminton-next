## Context
Finding 3 in [S9-PERF-FIXES](./S9-PERF-FIXES.md) identified browser-side Sentry as a large shared first-load cost. The perf audit attributed roughly `~200 KiB` of shared baseline JS to `@sentry/nextjs` plus additional runtime glue, with eager initialization coming from `src/instrumentation-client.ts`. This did not block launch, but it remains one of the few sitewide bundle costs with meaningful upside.

## Related Commits
- `e0606cf` `fix homepage smoke blockers`
- `98a90bf` `perf: lazy hydrate homepage sections`
- `be9cf62` `perf: defer turnstile until contact intent`

## Primary File References
- `src/instrumentation-client.ts`
- `src/app/(site)/layout.tsx`
- `tickets/S9-PERF-FIXES.md`

## Success Criteria
- Browser Sentry-related bundle cost is below `80 KiB`, or Sentry init is deferred until after LCP.
- No loss of launch-critical error reporting for production crashes.
- No regression in tracing or release tagging that the team depends on operationally.

## Candidate Approaches
- Disable Replay or other heavyweight integrations if they are not needed for launch-stage monitoring.
- Lazy-load browser Sentry after the `load` event or another post-LCP trigger.
- Compare `@sentry/nextjs` against a slimmer `@sentry/react`-style browser setup if Next.js package overhead remains too high.
- Verify whether layout-level client chrome can avoid pulling Sentry into every landing route immediately.

## Notes
Treat this as a measured optimization task, not a blind library swap. Preserve the minimum production observability needed to support a live site.
