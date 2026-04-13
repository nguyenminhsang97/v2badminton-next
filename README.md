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

## Local development

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

For lead-pipeline and monitoring envs, use:

- `.env.example`
- `BLOCK_D_ENV_CHECKLIST.md`
- `BLOCK_D_QA_RUNBOOK.md`
- `BLOCK_E_MONITORING_RUNBOOK.md`

## Verification before cutover

```bash
npm run lint
npm run build
```

Then test:

- route parity
- form submit
- schedule prefill
- analytics events
- JSON-LD
- mobile UX
- performance budget

## Reference docs

- `MASTERPLAN.md`
- `NEXTJS_MIGRATION_PLAN.md`

These two files are the source-of-truth docs for roadmap, migration safety, conversion parity, and the longer-term SEO / lead strategy.
