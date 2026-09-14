---
name: v2badminton-next
description: Working map and ground rules for the v2badminton.com monorepo (Next.js 16 web app + Sanity Studio). Use this skill for ANY code task in D:\V2\v2badminton-next — adding or changing a page, fixing UI or CSS, the lead/contact form, env vars, build/typecheck/test failures, Vercel deploys, proxy or redirects, or checking a change in the browser — even when the user only says "sửa giao diện", "thêm trang", "lỗi build", "deploy", or names a file without mentioning the project. Pair it with `seo`, `sanity-cms`, and `noi-dung-vi` when the task touches search, CMS data, or Vietnamese copy.
---

# V2 Badminton — project map and ground rules

v2badminton.com is the website of V2 Badminton, a badminton academy in TP.HCM. The repo owner, HLV Nguyễn Minh Sang, is a coach there and also builds the site. Two consequences:

- The owner's word on **business facts** (prices, schedules, courts, coaches, history, what may be claimed) is the source of truth. Surface conflicts in the data; don't resolve them by guessing.
- **Web, SEO, AEO and UX craft calls are delegated.** Recommend with a one-line reason, then do it. Save questions for business facts and irreversible actions.

## Read before writing code

1. `AGENTS.md` at the repo root. The Gate B rules are summarised below, but that file is the authority.
2. The relevant guide in `node_modules/next/dist/docs/` before touching framework code. This is Next **16.2.4**, and it differs from older training data in ways this repo already relies on:
   - Middleware is `apps/web/src/proxy.ts` exporting `proxy()` — there is no `middleware.ts`.
   - `params` is a `Promise` in pages and `generateMetadata`: `const { slug } = await params`.
   - `draftMode()` is async and throws outside a request scope.
   - `revalidateTag(tag, { expire: 0 })` takes a second argument.
   - `generateStaticParams` must return an array (even `[]`), or the route renders dynamically and is never cached.
3. Open the live file before recommending an edit. Many modules carry long comments that record *why* they look unusual (measured cache headers, past production incidents). Treat those comments as decisions, not clutter.

## Monorepo layout

| Path | Deployed as | Notes |
|---|---|---|
| `apps/web` | Vercel `v2badminton-next` → v2badminton.com | public site; `trailingSlash: true` |
| `apps/studio` | Vercel `v2badminton-studio` → cms.v2badminton.com | Sanity Studio at `basePath: "/"`; must NOT set `trailingSlash` |
| `packages/schema-shared` | — | Sanity-free route helpers + option lists used by both apps |

Boundaries that break the build or the Studio when crossed (details in `sanity-cms`):

- `apps/studio` never imports `@/…` from web — `@/*` there means `apps/studio/src/*`. Shared code goes through `@v2/schema-shared`.
- `apps/web` never depends on `next-sanity`, which drags the Studio in as a peer. Use `@sanity/client` + `groq`.
- The Studio no longer lives at `v2badminton.com/studio`, and nothing redirects there.

## `apps/web/src` map

| Area | Where |
|---|---|
| File-routed pages (money pages, legal, about, coaches) | `app/(site)/<slug>/page.tsx` |
| CMS content platform (hub / node / article / court) | `app/(site)/[...slug]/page.tsx` — required catch-all, resolved by `fullPath` |
| News feed | `app/(site)/tin-tuc/` (`/blog/` 308-redirects here) |
| Root + site shell | `app/layout.tsx`, `app/(site)/layout.tsx` |
| API routes | `app/api/{draft-mode,form-token,health,monitoring-test,revalidate/sanity}` |
| Lead form server action | `app/actions/submitLead.ts` |
| Proxy | `proxy.ts` — 308s `v2badminton-next.vercel.app` to the primary domain; marks draft-mode requests `noindex` + `no-store` |
| Components | `components/{home,money-page,content,blocks,layout,coaches,ui,analytics,providers}` |
| Sanity reads | `lib/sanity/` → see `sanity-cms` |
| SEO helpers | `lib/routes.ts`, `lib/site.ts`, `lib/schema.ts`, `lib/moneyPageMetadata.ts` → see `seo` |
| Lead pipeline | `lib/leadSubmission.ts`, `lib/leadPipeline.ts`, `lib/validation/lead.ts`, `lib/antispam.ts`, `lib/dedupe.ts`, `lib/rateLimit.ts`, `lib/db/`, `lib/notify/{email,telegram,ops}.ts` |
| Behaviour when Sanity data is missing | `lib/moneyPageFailSafe.ts`, `lib/moneyPageFallback.ts`, `lib/catalogFailSafe.ts` |
| Env validation | `lib/env.ts` (`REQUIRED_PRODUCTION_VARS` + optional warning groups) |
| Styles | `app/globals.css` → `styles/**`; tokens in `styles/tokens.css` |

## UI and styling

House rules are in `docs/ui-conventions.md`. The ones that matter most:

- Plain global CSS with BEM-ish classes (`course-card__cta--primary`). No Tailwind, shadcn/ui, CSS Modules, or utility classes unless the owner asks for a migration.
- Component CSS goes in `apps/web/src/styles/components/<name>.css`. Use tokens (`--width-content`, `--section-pad-y`, `--radius-card-*`, `--touch-target-min`) instead of magic numbers.
- Most existing CSS is desktop `min-width` blocks with `max-width: 959px` mobile overrides. Match the file you are in rather than imposing mobile-first.
- Forms use `noValidate` + the custom validation pipeline, with `aria-invalid` + `aria-describedby` on errors. Touch targets are ≥ 44px.
- Keep a narrow fix narrow. A broad visual refactor inside a bug fix makes the change impossible to review.

## Data and runtime

- **Business facts come from data, never from memory.** Prices, schedules, court addresses, coach names, class sizes, certificates, years of experience: read them from Sanity (authenticated) or ask the owner. People act on a money page — a wrong price or time costs a real lead and the academy's credibility.
- Sanity reads go through the `lib/sanity` helpers, with cache tags, so the publish webhook can purge them.
- Lead handling (validation → anti-spam → dedupe → DB write → notifications) stays in the existing service path. Don't shortcut it from a component.
- Construct new external clients (DB, Redis, email) lazily, not at module scope, so builds and tests run without credentials.

## Env

- Env files live at the **repo root**. `apps/web/next.config.ts` calls `loadEnvConfig` on the root with `forceReload`, because `next dev` inside a workspace only reads its own directory.
- A missing `SANITY_API_READ_TOKEN` is not a loud failure: anonymous reads return a *subset* of the dataset (no pricing tiers, no locations, fewer FAQs). A local page that "looks fine" can still differ from production, so confirm the token is loaded before judging CMS-driven UI.
- Production-required variables are listed in `lib/env.ts`. `npm run verify:production-env` checks them.
- A claim about the runtime (a variable exists, an endpoint works, data is missing) needs a command you actually ran and its result. Grepping config files is not evidence.

## Verify

From the repo root:

```bash
npm run lint          # web + studio
npm run typecheck     # schema-shared + web + studio
npm run build         # all three, same as CI
npm test              # vitest: apps/web/src/**/*.test.ts
npm run test:e2e      # playwright: apps/web/tests (desktop-chrome, mobile-chrome, mobile-safari)
```

CI (`.github/workflows/ci.yml`) runs lint → typecheck → build → test. `lighthouse.yml` collects mobile and desktop Lighthouse reports.

For a UI change, look at it yourself rather than asking the owner to check. Start the dev server in the Browser pane (`preview_start` with `.claude/launch.json`), check the affected route at ~390px and 1440px, and scan for horizontal overflow:

```js
document.documentElement.dataset.audit = "1"; // lifts the global overflow-x: clip
document.documentElement.scrollWidth > window.innerWidth;
```

Unknown URLs return the not-found page with **HTTP 200 + noindex**, not a 404 status, because streaming has already begun. Before concluding anything from a "should 404" check, compare it with a made-up path.

## Windows workspace traps

- The Bash tool is Git Bash, and **`cd` persists between calls**. Use absolute paths (`/d/V2/v2badminton-next/...`).
- `git grep` patterns containing a literal `"` get their quotes stripped, so a search can silently match nothing. Positive-control every "expect no output" check: first prove the pattern finds a string you know exists.
- Prefer the Grep tool to shelling out to `rg`.
- Don't write file content through a Bash heredoc: apostrophes can break parsing, and `\\` is collapsed to `\`, which silently corrupts regexes. Use the Write tool.

## Where the history lives

- `docs/cms/gate-b-completion-2026-09-10.md` — current web/Studio topology and what is still open.
- `docs/cms/url-rename-runbook.md` — read before changing any published URL.
- `docs/ui-conventions.md`, `docs/ui-review-fixes.md` — UI decisions.
- `.claude/CMS/` — locked CMS specs and tickets (local only, gitignored).
