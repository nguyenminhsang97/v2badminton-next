# V2 Badminton Next

Parallel Next.js rebuild for the V2 Badminton website.

This repo is the safe migration sandbox for the future Vercel version of the site. The current production HTML site stays separate and live while this app is rebuilt, tested, and compared route-by-route before any domain cutover.

## Goals

- Keep the current production URLs and SEO intent.
- Preserve the strongest conversion flow:
  - schedule card click
  - prefill location + time + message
  - scroll to form
  - focus the first empty field
- Preserve GA4 / GTM / Meta tracking semantics.
- Add a stronger lead backend with server-side fallback.
- Reach parity first, improve later.

## Current primary routes

- `/`
- `/hoc-cau-long-cho-nguoi-moi/`
- `/lop-cau-long-binh-thanh/`
- `/lop-cau-long-thu-duc/`

## Planned money pages

- `/hoc-cau-long-1-kem-1/`
- `/lop-cau-long-cuoi-tuan/`
- `/lop-cau-long-buoi-toi/`
- `/gia-hoc-cau-long-tphcm/`
- `/team-building-cau-long/`

## Non-negotiable acceptance criteria

- Preserve schedule-to-form prefill behavior.
- Preserve `cta_click`, `contact_click`, `map_click`, `form_start`, `generate_lead`, and `form_error`.
- Add server-side fallback for lead submission.
- Handle Zalo differently on mobile vs desktop.
- Keep sitemap, robots, metadata, canonicals, and schema parity.
- Add deep links from homepage location cards to local landing pages.

## Workspaces

This repo is an npm workspaces monorepo:

- `apps/web/` — the public Next.js website. Includes the Sanity Studio mount
  at `/studio` during Gate A (Studio moves to `apps/studio/` in Gate B).
- `packages/schema-shared/` — option enums + URL resolver shared between web
  and (eventually) Studio. Zero runtime deps.
- `apps/studio/` — does not exist yet; created in Gate B alongside the
  `cms.v2badminton.com` cutover.

Run any workspace script with `npm run -w <workspace> <script>`. Root scripts
fan out (e.g. `npm run dev` → `npm run -w apps/web dev`,
`npm run typecheck` → `npm run -w packages/schema-shared typecheck && npm run -w apps/web typecheck`).

## Local development

```bash
npm install
cp apps/web/.env.example apps/web/.env.local
npm run dev          # or: npm run -w apps/web dev
```

Open [http://localhost:3000](http://localhost:3000).

**Developer note on env files:** Next.js and `sanity.cli.ts` read env via
`loadEnvConfig(process.cwd())`. Because npm scripts run inside `apps/web/`,
your local `.env.local` and `.env.production.local` must live at
`apps/web/.env.local` and `apps/web/.env.production.local`. If you have
copies at the repo root from before the workspace split, move them into
`apps/web/`. These files are gitignored.

For lead-pipeline and monitoring envs, use:

- `apps/web/.env.example`
- `BLOCK_D_ENV_CHECKLIST.md`
- `BLOCK_D_QA_RUNBOOK.md`
- `BLOCK_E_MONITORING_RUNBOOK.md`

## Verification before cutover

```bash
npm run lint
npm run typecheck
npm run build
npm run test:mobile
npm run verify:production-env
```

Then test:

- route parity
- form submit
- schedule prefill
- analytics events
- JSON-LD
- mobile UX
- performance budget

`NEXT_PUBLIC_ALLOW_INDEXING` must be `true`, `NEXT_PUBLIC_SITE_URL` must be
`https://v2badminton.com`, and the production lead pipeline, anti-spam, rate-limit,
and Sentry variables must be configured before redeploying. `SENTRY_AUTH_TOKEN`
may be write-only in Vercel, so verify it through `vercel env ls production` and
the production build log.

## Reference docs

- `MASTERPLAN.md`
- `NEXTJS_MIGRATION_PLAN.md`

These two files are the source-of-truth docs for roadmap, migration safety, conversion parity, and the longer-term SEO / lead strategy.
