# Sprint 4 Status

Sprint 4 is not fully closed yet. As of `2026-04-13`, the code work is largely complete, but production cutover is blocked by infrastructure and publishing decisions outside this repository.

## Completed

- `S4A-A1` Campaign schema translated to Vietnamese in `src/sanity/schemaTypes/campaign.ts`
- `S4A-A2` `getActiveCampaign()` added to `src/lib/sanity/queries.ts`
- `S4A-A3` Homepage hero now supports optional campaign badge/title/description/CTA override
- `S4A-A4` Phase 1 complete:
  - `CoreRoutePath` widened for `/lop-he-cau-long-tphcm/`
  - fallback metadata/content added in `src/lib/moneyPageFallback.ts`
  - route file created at `src/app/(site)/lop-he-cau-long-tphcm/page.tsx`
- `S4C-A1` mobile triage completed:
  - local contact-section overflow fixed in `src/app/globals.css`
  - local/mobile verification no longer shows horizontal overflow

## Verification Completed

Local verification:

```powershell
npm run lint
npm run build
```

Result:

- `npm run lint` pass
- `npm run build` pass

Mobile verification on current local branch:

- homepage at `390px` width has no horizontal overflow
- money page `/lop-cau-long-tre-em/` has no horizontal overflow
- hero primary CTA height is `52px`
- contact submit button height is `52px`

Production/Vercel verification:

- `https://v2badminton-next.vercel.app/` loads
- `https://v2badminton-next.vercel.app/lop-cau-long-tre-em/` loads
- `https://v2badminton-next.vercel.app/lop-he-cau-long-tphcm/` is available through Phase 1 code path once deployed
- production env audit confirmed Sanity envs are now present

## Production Blockers

### 1. Database is not configured on production

Observed result:

- `GET /api/health` on production returns:
  - status `503`
  - body `{ "status": "degraded", "error": "db_not_configured" }`

Missing runtime vars:

- `POSTGRES_URL`
- `POSTGRES_URL_NON_POOLING`

Impact:

- `S4B-A1` cannot verify lead insert into Postgres
- production lead pipeline cannot be considered cut over

### 2. Telegram production credentials are missing

Missing vars:

- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID`

Impact:

- Telegram delivery cannot be verified on production
- notification leg of the conversion pipeline remains incomplete

### 3. Public custom domain is not connected to this Vercel project

Observed facts:

- `vercel domains ls` for the current Vercel team returns `0 domains`
- `https://v2badminton.com/` is still serving an older sitemap and does not expose the newer money-page routes
- `https://v2badminton-next.vercel.app/` is ahead of `https://v2badminton.com/`

Impact:

- production cutover on the real public domain is not complete
- mobile QA on the real domain cannot be considered final until DNS/domain routing is corrected

### 4. Summer page publish gate is intentionally not complete

Current Sanity state:

- no published `money_page` with slug `lop-he-cau-long-tphcm`

Impact:

- `S4A-A4` remains at `Phase 1`
- `coreRoutes` and `PREVIEW_READY_ROUTES` were intentionally left unchanged
- sitemap/nav/SEO links should not publish the summer route yet

### 5. Active campaign content is not published

Current Sanity state:

- no published active `campaign` document

Impact:

- campaign code path is implemented but not verified against live CMS data

## What Needs To Happen Next

To fully close Sprint 4:

1. Add production DB credentials (`POSTGRES_URL` or `POSTGRES_URL_NON_POOLING`) to the Vercel project
2. Add production Telegram credentials (`TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`)
3. Connect `v2badminton.com` to the same Vercel project or update DNS so the real domain serves the current deployment
4. Publish an active `campaign` document if the homepage hero override should be exercised
5. Publish the summer `money_page` document if `/lop-he-cau-long-tphcm/` should move to `Phase 2`

## Recommendation

Treat Sprint 4 as:

- engineering/code work: substantially complete
- production cutover: blocked on infrastructure and publishing decisions

Do not mark Sprint 4 `DONE` until the blockers above are resolved.
