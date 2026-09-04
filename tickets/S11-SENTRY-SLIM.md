## Status

`DONE` — closed 2026-09-04 by the `S12` post-28-day review. **The work landed on
2026-05-12, the day after launch; only the ticket stayed open.**

Commit `c8a7f9e` (`perf: mobile quick wins`, #40) rewrote
`instrumentation-client.ts` from an eager module-scope `Sentry.init(...)` — the
exact shape `S9` Finding 3 flagged — into a lazy initializer behind
`requestIdleCallback` (3 s timeout, `setTimeout(1500)` fallback for Safari < 16),
with `onRouterTransitionStart` delegating through a handle that stays `undefined`
until the SDK loads.

This ticket's criterion was *"below 80 KiB, **or** Sentry init is deferred until
after LCP"*. Both halves now hold:

- **Deferred:** initialization waits for browser idle, so it cannot compete with
  LCP. The documented tradeoff is that router transitions in the first ~1–2 s go
  uncaptured — accepted in the code comment, and it does not affect crash
  reporting, which was the launch-critical requirement.
- **Under budget:** measured on production 2026-09-04, Sentry-attributable code in
  the 16 initial script chunks is **~24.7 KiB wire / ~69 KiB uncompressed**, down
  from the ~253 KiB (`200.2` + `52.9`) `S9` Finding 3 attributed to it.

Measurement note: three initial chunks match a naive `/sentry/i` grep, but the
build plugin stamps `_sentryDebugIds` into every chunk it processes. Probing for
real SDK internals (`getCurrentScope`, `captureException`, `makeFetchTransport`,
`browserTracingIntegration`) separates them — one chunk is our own lazy-init
wrapper with no SDK in it, and the figure above counts only the chunks carrying
actual SDK code.

No further work. Reopen only if the deferral is removed or a heavyweight
integration (Replay, browser tracing) is added.

---

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
