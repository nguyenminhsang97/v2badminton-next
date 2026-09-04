## Status

`CLOSED` — post-28-day decision recorded 2026-09-04. The monitoring loop this
ticket describes **never ran**; see the root cause below. The decision it was
supposed to gate is made here on direct production measurement instead, because
that evidence is obtainable today and the field evidence is not.

## Post-28-day decision (2026-09-04)

Launch was `cutover-2026-05-11`. The 28-day window therefore closed **2026-06-08**,
and this decision is ~3 months late. `S10` and `S11` sat unprioritized that whole
time because the decision that ranks them was never written.

### Verdict

| Ticket | Verdict | Basis |
|---|---|---|
| `S11` Sentry slim | **CLOSE — already satisfied** | Its criterion is *"below 80 KiB **or** Sentry init deferred until after LCP"*. Both halves hold on production today. |
| `S10` Homepage HTML size | **RAISE — the only metric that moved backwards** | 194.7 KiB decoded in production vs the 143.8 KiB recorded when the ticket was filed, against an 80 KiB target. |
| `S13` Money-page LCP variance | Leave as filed | One new data point recorded below; no re-ranking. |

### Why the monitoring loop produced no evidence

The plan depended on field metrics that were never collected:

- **The app has no Web Vitals reporting at all.** No `useReportWebVitals`, no
  `web-vitals` package, no `onLCP`/`onCLS`/`onINP` anywhere in `apps/web/src` or
  `packages/`. GA4 is installed and firing (`G-ME9V2DXWJX`), but nothing feeds it
  vitals, so "capture CrUX or equivalent field metrics" had no implementation
  behind it.
- **CrUX could not be read.** The PageSpeed Insights API returns HTTP 429 on the
  keyless anonymous quota. A site at this traffic level may also sit under CrUX's
  reporting threshold entirely — unconfirmed either way.
- **The weekly reviews left no record.** Nothing in the repo logs a single one.

So this ticket did not merely slip. It asked for a review cadence on data the
product never produced. Any future perf sprint decided this way would be equally
blind, which is why the follow-up below matters more than either S10 or S11.

### Success criteria, settled

1. **Search Console ownership verified** — ☑ Verified by DNS TXT on the apex:
   `google-site-verification=7BcGGmV7qDDFGFDX-B1F2a5h0BuduXktf9UA23kxnQ4`.
   (There is no `google-site-verification` meta tag in the HTML; DNS is the
   stronger method and is present, so the criterion is met.)
2. **Sitemap submission complete** — ☑ partial, and the rest is owner-only.
   `https://v2badminton.com/sitemap.xml` returns `200`, is well-formed, and lists
   **24 URLs**. `robots.txt` references it and sets `Host: https://v2badminton.com`.
   *Confirming coverage is populating requires a Search Console login and cannot be
   verified from the repo — that step stays with the owner.*
3. **Weekly CWV review during the first 28 days** — ☒ **not met and not
   retroactively meetable.** Recorded as a miss rather than papered over.
4. **Post-28-day S10/S11 decision recorded** — ☑ this section.

### Evidence (measured 2026-09-04 against production)

Decoded HTML, fetched with `accept-encoding: gzip` and a mobile UA:

| Route | Wire | Decoded | Vercel cache |
|---|---|---|---|
| `/` | 30.0 KiB | **194.7 KiB** | HIT (age ~22 h) |
| `/hoc-cau-long-cho-nguoi-moi/` | 18.6 KiB | 102.2 KiB | HIT |
| `/lop-cau-long-cho-nguoi-di-lam/` | 16.5 KiB | 90.1 KiB | HIT |
| `/gia-hoc-cau-long-tphcm/` | 15.9 KiB | 87.0 KiB | PRERENDER |
| `/lop-cau-long-cuoi-tuan/` | 15.1 KiB | 82.1 KiB | HIT |
| `/lop-cau-long-tre-em/` | 14.4 KiB | 76.9 KiB | HIT |

Initial JS on `/`: 16 script chunks, **240.5 KiB wire / 757.3 KiB uncompressed**.
Sentry-attributable share of that, after separating real SDK code from the
`_sentryDebugIds` stamp the build plugin writes into every chunk: **~24.7 KiB wire
/ ~69 KiB uncompressed**, against the ~253 KiB (`200.2` + `52.9`) S9 Finding 3
attributed to Sentry.

### Follow-up this decision depends on

**Wire Web Vitals into the GA4 property that already exists** before committing to
another perf sprint. `useReportWebVitals` → `G-ME9V2DXWJX` is a small change and it
is the precondition for ever closing an S10-shaped ticket on evidence rather than
on a synthetic re-measure. Not filed as a ticket here — raise it with the owner.

---

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
