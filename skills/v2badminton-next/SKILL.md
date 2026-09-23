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
| Court list still in code | `lib/locations.ts`, `components/home/compat/legacyScheduleCompatibility.ts` |
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
- **The four courts are not only Sanity data.** `CourtId` and `courtLocations` in `lib/locations.ts` are also used by lead validation and by the homepage schedule bridge in `components/home/compat/legacyScheduleCompatibility.ts`. A new court or schedule block activated in Sanity needs a matching code change first: `assertLegacyScheduleCompatibility` (called from the homepage) throws when `CI=true` — as on GitHub Actions — or `NEXT_STRICT_SCHEDULE_COMPAT=true`. Plan the code change before telling the owner to switch a new location on.
- **Production gets read-only requests.** While investigating, send only GETs to v2badminton.com and cms.v2badminton.com and only read queries to Sanity. Never POST to an API route such as `/api/revalidate/sanity/` or `/api/form-token`, even as a probe you expect to fail.

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
npm run check:fallback # hardcoded court/schedule fallbacks vs live Sanity (needs the read token)
```

CI (`.github/workflows/ci.yml`) runs lint → typecheck → build → test. It cannot run `check:fallback`, which needs a Sanity token CI does not have — run it after touching `apps/web/src/lib/locations.ts` or `schedule.ts`, and after any schedule or court change in Sanity. `lighthouse.yml` collects mobile and desktop Lighthouse reports.

For a UI change, look at it yourself rather than asking the owner to check. Start the dev server in the Browser pane (`preview_start` with `.claude/launch.json`), check the affected route at ~390px and 1440px, and scan for horizontal overflow:

```js
document.documentElement.dataset.audit = "1"; // lifts the global overflow-x: clip
document.documentElement.scrollWidth > window.innerWidth;
```

Unknown URLs return the not-found page with **HTTP 200 + noindex**, not a 404 status, because streaming has already begun. Before concluding anything from a "should 404" check, compare it with a made-up path.

## Shipping a change

These conventions only existed in git history, so agents kept re-deriving them. Read `docs/tasks-in-progress.md` first — it also says how to claim a task.

- **Branch from `origin/main`, never `git checkout main`.** Another worktree holds `main`, so checking it out here fails or moves theirs.
- **Claim the task in the first commit** on the branch: set its `Trạng thái` line in `docs/tasks-in-progress.md` to `đang làm — <branch>`, and to `xong — #<PR>` in the same PR when it lands. Never delete a task entry.
- **Write the commit message about *why*.** What changed is in the diff; the reason, the measurement behind it, and what you deliberately left alone are not. Same for the PR body: lead with the evidence you measured, not a file list.
- **Squash merge, and title the merge with `(#<PR>)`**: `gh pr merge <n> --squash --match-head-commit <sha> --delete-branch`. `--match-head-commit` is the point — it refuses if anything landed after the commit CI passed on.
- **Merge `main` into a long-running branch, don't rebase it.** Rebasing a pushed branch breaks the `--match-head-commit` sha and anyone reading the PR.
- **Wait for CI**, all of it: lint/typecheck/build, tests, Lighthouse, the skill-path guard, and both Vercel deploys. A Vercel check reading "Skipped - Not affected" means that project had no relevant changes, not that it built.
- **An empty commit will not rebuild a Vercel preview** — the monorepo skips unaffected projects. To pick up a changed environment variable, redeploy the existing preview from the Vercel UI instead.
- **Content lives in Sanity, not in the PR.** A change that needs both ships the code and leaves the wording to the owner; see `sanity-cms`, "Writing content".
- **Two documents describe the present, and your PR keeps them true.** `docs/cms/gate-b-completion-2026-09-10.md` (§1 topology, §4 what is still open) and `docs/cms/url-rename-runbook.md` assert how things are right now; if your change makes one of their sentences false, fix it in the same PR, the way you already move a task's `Trạng thái` line. Everything else in `docs/cms/` is dated history behind an EXECUTED banner — leave it alone, including the pre-split paths it cites on purpose. Nothing checks this mechanically: a CI path guard over those files would flag the history as broken, which is why there isn't one.

## Windows workspace traps

- The Bash tool is Git Bash, and **`cd` persists between calls**. Use absolute paths (`/d/V2/v2badminton-next/...`).
- `git grep` patterns containing a literal `"` get their quotes stripped, so a search can silently match nothing. Positive-control every "expect no output" check: first prove the pattern finds a string you know exists.
- Prefer the Grep tool to shelling out to `rg`.
- Don't write file content through a Bash heredoc: apostrophes can break parsing, and `\\` is collapsed to `\`, which silently corrupts regexes. Use the Write tool.

## Monitoring, and the MCP servers that reach it

- **Sentry is the only place a degraded request shows up.** `apps/web/src/lib/rateLimit.ts` fails
  *open*: when Upstash is unreachable it returns `{ allowed: true, skipped: true }`, reports to
  Sentry and calls `notifyOpsTelegram`. So the form still submits and no lead is lost — only the
  anti-spam layer is gone. But `TELEGRAM_BOT_TOKEN` / `TELEGRAM_OPS_CHAT_ID` are not set in
  production, so `notifyOpsTelegram` skips and that alert reaches nobody. Worked example: issue
  `JAVASCRIPT-NEXTJS-H`, `getaddrinfo ENOTFOUND vast-dassie-94458.upstash.io` under
  `serverAction/submitLead`, 9 times between 2026-05-12 and 2026-09-12, tagged `area: rate_limit`.
  Read a Sentry error before assuming it cost the owner anything: `handled: yes` on this one means
  the code already dealt with it.
- **MCP servers are configured in `.mcp.json` at the repo root, which is gitignored** (#142) because
  it holds tokens. Sentry org `nguyen-minh-sang-rk`, project `javascript-nextjs`.
- **Prefer a stdio server with a token to a remote OAuth one.** The `cloudflare` and `vercel`
  servers authorize one client interactively, so any other AI client sees them as unauthorized and
  there is nothing to hand over. A stdio server reads its token from `env`, so every client that
  reads `.mcp.json` gets the same access:

  ```json
  "sentry": {
    "command": "npx", "args": ["-y", "@sentry/mcp-server@latest"],
    "env": { "SENTRY_ACCESS_TOKEN": "…" }
  }
  ```

  The token is a **Personal Token** (Sentry → Settings → Developer Settings → Personal Tokens —
  there is no "Auth Tokens" page any more), with read scopes only; nothing here writes to Sentry.
  Vercel was left on OAuth deliberately: its API tokens are full-account, with no read-only option.
- **First start looks broken.** `npx` downloads the package on first run and the client gives up
  waiting, so the server reports as failed once. Pre-warm it (`npx -y @sentry/mcp-server@latest --help`), then restart the client fully — a fresh session in the same process keeps the old
  server list.

## Where the history lives

- `docs/cms/gate-b-completion-2026-09-10.md` — current web/Studio topology and what is still open.
- `docs/cms/url-rename-runbook.md` — read before changing any published URL.
- `docs/ui-conventions.md`, `docs/ui-review-fixes.md` — UI decisions.
- `.claude/CMS/` — locked CMS specs and tickets (local only, gitignored).
