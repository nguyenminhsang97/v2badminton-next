## Status

`FIXED — awaiting production verification.` Found 2026-09-08 while answering
whether CMS work affects performance. The fix is one export; the finding is that
**every CMS-authored page has been served uncached since Phase 1 shipped**.

## Symptom

Production, three consecutive requests to the same article:

```
/ky-thuat-cau-long/cach-cam-vot-cau-long/   x-vercel-cache: MISS, MISS, MISS
```

Not a cold cache. Compare across route kinds on production:

| Route | Kind | x-vercel-cache | Cache-Control |
|---|---|---|---|
| `/` | file | HIT (age 3653s) | `public, max-age=0, must-revalidate` |
| `/gia-hoc-cau-long-tphcm/` | file | PRERENDER | `public, max-age=0, must-revalidate` |
| `/ky-thuat-cau-long/` | CMS `[...slug]` | **MISS** | `private, no-cache, no-store` |
| `/ky-thuat-cau-long/cach-cam-vot-cau-long/` | CMS `[...slug]` | **MISS** | `private, no-cache, no-store` |
| `/tin-v2/` | CMS `[...slug]` | **MISS** | `private, no-cache, no-store` |

`no-store` forbids the CDN *and* the browser from keeping the response. Every
view of every article, hub and node runs a serverless function and re-renders.

## Cause

`app/(site)/[...slug]/page.tsx` declared `export const dynamicParams = true` but
never declared `generateStaticParams`. The Next docs are explicit:

> You must always return an array from `generateStaticParams`, even if it's
> empty. Otherwise, the route will be dynamically rendered.
>
> — `node_modules/next/dist/docs/01-app/03-api-reference/04-functions/generate-static-params.md`

`dynamicParams` does not stand in for it. It only decides what happens to paths
`generateStaticParams` did *not* return, so on its own it decides nothing.

This is why the route reads `ƒ (Dynamic)` in the build table while every
file-routed page reads `○ (Static)` with a 5m revalidate — the 5m the money pages
inherit comes from `next.revalidate` on the Sanity fetches, and a dynamically
rendered route cannot use it.

Ruled out along the way, so nobody re-checks them:

- **`(site)/loading.tsx`** — applies to the whole route group, and `/` is static.
- **Dynamic APIs** — the only `headers()` in the app is in `app/actions/submitLead.ts`;
  the route reads `params` and no `searchParams`.
- **Data-layer caching** — already correct. `lib/sanity/client.ts:88` sets
  `next.revalidate` and cache tags on every fetch.

## Fix and measurement

Added `generateStaticParams` returning the paths already used to build the
sitemap. One production build before, one after, same machine, same `next start`:

| Route | Before | After |
|---|---|---|
| `/` | `s-maxage=300, swr` · HIT | unchanged |
| `/ky-thuat-cau-long/` | `private, no-cache, no-store` | **`s-maxage=300, swr` · HIT** |
| `/ky-thuat-cau-long/cach-cam-vot-cau-long/` | `private, no-cache, no-store` | **`s-maxage=300, swr` · HIT** |

Build table: `ƒ /[...slug]` → `● /[...slug]  5m  1y`, with 9 content paths
prerendered at build in 3.8s.

Article output verified byte-identical in substance: title, `h1`, 6 JSON-LD
blocks, `noindex` absent.

## What this does not fix

`/khong-ton-tai-abc/` still returns **HTTP 200** on the probe build. The soft-404
documented in `[...slug]/page.tsx` is caused by streaming, not by dynamic
rendering, and is unchanged here. Do not expect this to close that.

## Why it matters more from here than it did until now

The cost scales with CMS traffic, and Phase 2 is about to add the highest-traffic
surface the site has planned. `/san-cau-long/` is aimed at "sân cầu lông gần đây"
queries and runs through this same catch-all. Fixing it before courts are seeded
costs one export; fixing it after means doing it while the traffic is live.

## Risks accepted

- **Build time** grows with published content — 9 paths, 3.8s today. If the
  directory grows large, return a subset and let `dynamicParams` cover the rest.
- **Sanity down at build** — `getContentSitemapEntries` falls back to `[]`. That
  prerenders nothing but still satisfies the "must return an array" rule, so the
  route stays cacheable instead of failing the build.
- **Freshness** — unchanged in theory: all four content types map to
  `sanity:content` (`lib/sanity/revalidationMap.ts:54-59`) and the webhook calls
  `revalidateTag(tag, { expire: 0 })`. **Verify on production** that publishing an
  article still appears without waiting out the 5m window; that is the one claim
  this ticket has not measured end to end.
