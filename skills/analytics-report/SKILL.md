---
name: analytics-report
description: How to answer questions about v2badminton.com's real numbers — Search Console impressions, clicks and indexing, GA4 events and leads, PageSpeed/Core Web Vitals lab scores — using the connected MCP tools instead of guessing. Use it whenever the task is "trang nào đang có traffic", "có ai bấm nút không", "tuần này ra bao nhiêu lead", "site chạy nhanh chậm thế nào", "Google đã index chưa", or any request for a report, a trend, or a before/after comparison on the live site. Also use it before claiming that an event, a page or a query has no data, because several events on this site are deliberately unwired.
---

# Analytics & reporting — v2badminton.com

The owner asks for numbers to make decisions with. The failure mode that matters here is not a missing chart, it is a confident number that is wrong — or a "nobody clicks this" conclusion drawn from an event that was never wired up.

Two rules sit above everything else:

- **Never state a number you did not fetch this session.** Quote the metric, the property, and the date window with it. Name the property by the **id you fetched**, not only its display name — a name can match several properties, an id cannot.
- **Absence of data is not evidence of absence.** On this site several events are deliberately not wired and one analytics path is deliberately off. Check the tables below before concluding that nothing is happening.

## What is actually wired

Verified against the code, the local analytics status note and live GA4 (2026-09-17); re-check the code if the answer matters.

| Path | State | Detail |
|---|---|---|
| GA4 direct (`gtag.js`) | **on** — the authoritative path | `apps/web/src/components/analytics/GoogleAnalytics.tsx`, id from `NEXT_PUBLIC_GA_MEASUREMENT_ID` (set in Vercel, not in the repo) |
| Google Tag Manager | **off on purpose** | `GoogleTagManager.tsx` renders null because `NEXT_PUBLIC_GTM_ID` is absent from Vercel. The container still exists in tagmanager.google.com. Do not "fix" this by setting the variable — it was removed deliberately to avoid double-counting |
| Meta Pixel | **off on purpose** | Tags live inside the GTM container, so they do not fire while GTM is off. No Facebook Ads planned |
| Sentry | on | Errors, not analytics. `@sentry/nextjs` in `apps/web` |
| Internal traffic filter | intentionally skipped | Owner traffic is not excluded from GA4. Small numbers may include the owner's own visits |

## Where the numbers come from

- **Search Console** — MCP tools `mcp__google-search-console__*`. The only property is **`sc-domain:v2badminton.com`** (siteOwner). Use `list_properties` first if a tool needs the exact string. Useful: `get_search_analytics` / `get_search_by_page_query` for queries and pages, `inspect_url_enhanced` for one URL's index state, `check_indexing_issues`, `compare_search_periods` for before/after. Search Console data lags a couple of days — never read the last 48 hours as a trend.
- **GA4** — MCP tools `mcp__google-analytics__*`. Call `get_account_summaries` to get the property before any report; do not hardcode a property id. **This connection expires.** A `503 … invalid_grant: Token has been expired or revoked` means the refresh token inside the credentials file is dead. It does not mean the MCP configuration is wrong, so re-adding or reconnecting the server does not help. Say so plainly and stop — do not substitute GSC numbers for GA4 ones, they measure different things. What the owner has to do:
  - The server reads an `authorized_user` credentials file named by `GOOGLE_APPLICATION_CREDENTIALS` in its MCP config (on the owner's machine, `.claude/google_adc.json`, untracked).
  - To prove the token is dead without the MCP, POST its `refresh_token` to `https://oauth2.googleapis.com/token` with `grant_type=refresh_token`: 400 `invalid_grant` is dead, 200 is alive. Report the status only — never print the secret, the refresh token or an access token.
  - The owner signs in again with the local script `.claude/refresh_ga_token.py`. Prefer it over `refresh_ga_auth.py`, which can silently write a `null` refresh token.
  - Then **restart the agent**. A running MCP process keeps the dead token in memory and keeps failing after the file is fixed.
- **PageSpeed Insights** — `PAGESPEED_API_KEY` in the repo-root `.env.local`. Keyless calls are rate-limited into uselessness, so always send the key. The site has **no CrUX field data** (too little traffic), so only lab numbers exist; report them as lab, not as what users experience. Lab TBT swings a lot — take the **median of at least 3 runs** before quoting it or comparing two deploys.
- **Vercel / Sentry MCP** need authorisation before use; if they are unauthenticated this session, say the capability is unavailable rather than guessing at deploys or error rates.

## Events you can actually report on

Custom events go through `trackEvent()` in `apps/web/src/lib/tracking.ts`, which pushes to `window.dataLayer` *and* calls `window.gtag` directly. The union of valid events is `TrackingEvent` in that file — read it rather than assuming an event exists.

Custom events with at least one call site: `cta_click`, `contact_click`, `form_start`, `form_field_focus`, `form_abandon`, `form_error`, `time_to_submit`, `generate_lead`, `cms_article_cta_click`, `cms_court_cta_click`, `web_vitals`. `generate_lead` is the GA4 Key Event (a submitted contact form). `web_vitals` comes from `apps/web/src/components/analytics/WebVitals.tsx`, one event per measured metric, so it is usually the largest event by count — leave it out before comparing event totals or naming the "most common" event.

GA4 also records events by itself, with no code in this repo: `page_view`, `session_start`, `first_visit`, `user_engagement`, `scroll`, and `click`. In GA4, `click` means an **outbound link click** — a link to another domain — not every click. Break it down with the `linkUrl` or `linkDomain` dimension.

**Known blind spots — check these before reading a zero as a real zero, and check the automatic events before calling something unmeasured:**

- **Map-link clicks are measured, just not by `map_click`.** `map_click` is declared in `tracking.ts` and never called. The map links in `apps/web/src/components/blocks/LocationsGrid.tsx` and `apps/web/src/components/content/CourtView.tsx` are external `<a target="_blank">` links, so GA4 records them as outbound `click`. Count them by filtering `click` on `linkUrl` against each court's `mapsUrl` **as stored in Sanity** (`location.mapsUrl`). Do not filter on `linkDomain = maps.app.goo.gl`: Phúc Lộc's link is a `share.google` URL, and the hardcoded `mapsUrl` values in `apps/web/src/lib/locations.ts` do not all match Sanity. What `map_click` would add is the `map_location` dimension; without it, the court comes from matching the URL.
- **One tap on the floating Zalo button is three events**: `cta_click`, `contact_click`, and an outbound `click` to `zalo.me` (`apps/web/src/components/layout/FloatingCta.tsx`). Other Zalo and Facebook links also produce an outbound `click`. Never add these together as if they were separate people or separate intents.
- The bottom CTA buttons in `MoneyPageTemplate.tsx` are **not tracked**: they are internal `<Link>`s with no `trackEvent`, and internal links are not outbound clicks, so bottom-of-page intent is invisible.
- `contact_click` may still not be marked as a GA4 Key Event, so it will not appear in conversion reports even when it fires.
- Event names are closed sets in TypeScript (`CtaName`, `CtaLocation`, `ContactMethod`, `MapLocation`, `FormFieldName`). Adding a new CTA or court to tracking is a **code change**, not a GA4 setting.

Event-scoped custom dimensions registered in GA4 — these are what you can segment by: `cta_name`, `cta_location`, `page_type`, `page_path`, `contact_method`, `map_location`, `form_field_name`, `lead_type`, `has_court_preference`, `has_time_preference`, `submission_method`, `time_to_submit_ms`, `article_slug`, `article_hub`, `target_money_page`.

## Reading the numbers honestly

- This is a small site. A page with single-digit impressions is noise, not a trend; say so instead of computing a percentage change on it.
- A money page that is "Crawled – currently not indexed" with zero impressions is not underperforming, it is not competing yet. Check index state before diagnosing content.
- GA4 counts the owner's own visits (no internal filter). Treat tiny session counts with that in mind.
- Web Vitals reported by `WebVitals.tsx` are field measurements from real visitors and are not the same as PageSpeed lab numbers. Do not mix them in one comparison.
- When a number contradicts what the owner expects, check whether the event is wired and whether the date window matches before concluding the business changed.

## Shape of a useful report

Lead with the answer, then the evidence:

1. The question in one line, with the window and property ("28 ngày gần nhất, `sc-domain:v2badminton.com`").
2. The numbers that answer it — few, with the unit.
3. What changed and the most plausible reason, separating what you measured from what you infer.
4. What you could not measure and why (unauthorised connector, unwired event, no field data).
5. One recommended action, if any.

Write it in Vietnamese for the owner. Terminology and tone follow `noi-dung-vi`; anything that becomes page copy goes through that skill.

## Related

- `seo` — metadata, indexing control and the AEO rules the Search Console numbers reflect.
- `v2badminton-next` — the runtime rule that a claim about the live system needs a command you actually ran.
- The local note `.claude/analytics-status.md` holds the decision history (why GTM and Pixel are off) and the deferred-work list. It is untracked and dated, so treat it as background, not as current state.
