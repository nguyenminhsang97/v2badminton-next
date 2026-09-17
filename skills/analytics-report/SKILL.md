---
name: analytics-report
description: How to answer questions about v2badminton.com's real numbers — Search Console impressions, clicks and indexing, GA4 events and leads, PageSpeed/Core Web Vitals lab scores — using the connected MCP tools instead of guessing. Use it whenever the task is "trang nào đang có traffic", "có ai bấm nút không", "tuần này ra bao nhiêu lead", "site chạy nhanh chậm thế nào", "Google đã index chưa", or any request for a report, a trend, or a before/after comparison on the live site. Also use it before claiming that an event, a page or a query has no data, because several events on this site are deliberately unwired.
---

# Analytics & reporting — v2badminton.com

The owner asks for numbers to make decisions with. The failure mode that matters here is not a missing chart, it is a confident number that is wrong — or a "nobody clicks this" conclusion drawn from an event that was never wired up.

Two rules sit above everything else:

- **Never state a number you did not fetch this session.** Quote the metric, the property, and the date window with it.
- **Absence of data is not evidence of absence.** On this site several events are deliberately not wired and one analytics path is deliberately off. Check the tables below before concluding that nothing is happening.

## What is actually wired

Verified against the code and the local analytics status note; re-check the code if the answer matters.

| Path | State | Detail |
|---|---|---|
| GA4 direct (`gtag.js`) | **on** — the authoritative path | `apps/web/src/components/analytics/GoogleAnalytics.tsx`, id from `NEXT_PUBLIC_GA_MEASUREMENT_ID` (set in Vercel, not in the repo) |
| Google Tag Manager | **off on purpose** | `GoogleTagManager.tsx` renders null because `NEXT_PUBLIC_GTM_ID` is absent from Vercel. The container still exists in tagmanager.google.com. Do not "fix" this by setting the variable — it was removed deliberately to avoid double-counting |
| Meta Pixel | **off on purpose** | Tags live inside the GTM container, so they do not fire while GTM is off. No Facebook Ads planned |
| Sentry | on | Errors, not analytics. `@sentry/nextjs` in `apps/web` |
| Internal traffic filter | intentionally skipped | Owner traffic is not excluded from GA4. Small numbers may include the owner's own visits |

## Where the numbers come from

- **Search Console** — MCP tools `mcp__google-search-console__*`. The only property is **`sc-domain:v2badminton.com`** (siteOwner). Use `list_properties` first if a tool needs the exact string. Useful: `get_search_analytics` / `get_search_by_page_query` for queries and pages, `inspect_url_enhanced` for one URL's index state, `check_indexing_issues`, `compare_search_periods` for before/after. Search Console data lags a couple of days — never read the last 48 hours as a trend.
- **GA4** — MCP tools `mcp__google-analytics__*`. Call `get_account_summaries` to get the property before any report; do not hardcode a property id. **This connection expires**: a `503 … invalid_grant: Token has been expired or revoked` means the Google account needs re-authorising (claude.ai connector settings, or `/mcp` in an interactive session). Say so plainly and stop — do not substitute GSC numbers for GA4 ones, they measure different things.
- **PageSpeed Insights** — `PAGESPEED_API_KEY` in the repo-root `.env.local`. Keyless calls are rate-limited into uselessness, so always send the key. The site has **no CrUX field data** (too little traffic), so only lab numbers exist; report them as lab, not as what users experience. Lab TBT swings a lot — take the **median of at least 3 runs** before quoting it or comparing two deploys.
- **Vercel / Sentry MCP** need authorisation before use; if they are unauthenticated this session, say the capability is unavailable rather than guessing at deploys or error rates.

## Events you can actually report on

All events go through `trackEvent()` in `apps/web/src/lib/tracking.ts`, which pushes to `window.dataLayer` *and* calls `window.gtag` directly. The union of valid events is `TrackingEvent` in that file — read it rather than assuming an event exists.

Currently fired: `cta_click`, `contact_click`, `form_start`, `form_field_focus`, `form_abandon`, `form_error`, `time_to_submit`, `generate_lead`, `cms_article_cta_click`. `generate_lead` is the GA4 Key Event (a submitted contact form).

**Known blind spots — check these before reading a zero as a real zero:**

- `map_click` exists as an event type but is **not wired** to the map links in `LocationsGrid.tsx`.
- The bottom CTA buttons in `MoneyPageTemplate.tsx` are **not tracked**, so bottom-of-page intent is invisible.
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
