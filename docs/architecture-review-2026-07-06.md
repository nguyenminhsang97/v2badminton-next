# V2 Badminton — Architecture, CMS & SEO Review

Date: 2026-07-06 · Scope: full repo (`apps/web`, `packages/schema-shared`, Sanity Studio, docs) · No code changes made.

---

## 1. What the project is doing well

**Caching and revalidation architecture is production-grade.** The combination of tag-based ISR (`sanityFetchWithStatus` with 300s revalidate + cache tags), a signed webhook endpoint (`/api/revalidate/sanity` with HMAC verification via `@sanity/webhook`), and a single-source-of-truth `revalidationMap.ts` that explicitly documents dereference traps (e.g. `faq` edits purging `sanity:money-pages` because money pages embed FAQs) is better than most agency-built CMS sites. The decision to disable Sanity CDN (`useCdn: false`) with a documented rationale (stale-null poisoning of the ISR data cache) shows real operational learning.

**SEO fundamentals are consistent and defensive.** Trailing-slash policy is enforced end to end (`trailingSlash: true`, `normalizeContentPath`, `canonicalUrl`, sitemap). Every page type sets a canonical. Unresolved catch-all routes return `robots: { index: false, follow: true }`. The blog index and coach page noindex themselves when empty. The sitemap only lists money pages that actually exist in Sanity, uses a stable relaunch-date fallback for `lastmod` (avoiding the "everything changed today" anti-pattern), and money pages that are missing content 404 (`moneyPageFailSafe.ts`) instead of rendering thin fallback pages while alerting Sentry. `NEXT_PUBLIC_ALLOW_INDEXING` acts as a global pre-cutover kill switch, verified by `verify-production-env.mjs`.

**AEO groundwork is real, not cosmetic.** `robots.ts` explicitly allows GPTBot, ChatGPT-User, ClaudeBot, and PerplexityBot. Content types carry `quickAnswer` fields with a dedicated Studio input. JSON-LD coverage (`lib/schema.ts`, 732 lines) spans Organization, WebSite, LocalBusiness with opening-hours derived from schedule blocks, Course with offers, FAQPage, BreadcrumbList, and SportsActivityLocation for courts — all built from CMS data.

**The content-platform route system is a solid foundation for scaling.** `fullPath`-based exact-match resolution in a single catch-all, global uniqueness validation across all routable types plus redirect sources (`findPathConflict`), reserved route prefixes (`/san-pham/`, `/dich-vu/`, `/blog/`, `/khuyen-mai/`), depth warnings, and per-id cache tags. This is exactly the shape needed for courts/rackets/shoes/news hubs later.

**Security posture is above average for a marketing site.** Env files are gitignored (verified: zero tracked env files). The read token lives server-only (`import "server-only"` in `client.ts`). The lead pipeline layers honeypot → signed JWT form token → Turnstile → Upstash rate limiting → dedupe, with Sentry capture and Telegram/email notifications degrading gracefully. Monitoring-test routes are double-gated (env flag AND non-production). Report-only CSP is deployed with a documented plan (W8-4) to narrow before enforcement.

**Studio UX shows genuine editor empathy.** Vietnamese-localized desk structure with four buckets and an "Khác" catch-all so new types never disappear, readiness badges (missing hero image / meta description), SERP preview input, full-path preview input, an ops dashboard tool, and an "open live page" action. Singleton enforcement for `site_settings` and `homepage_content` is correct.

---

## 2. The biggest risks

**R1 — No draft preview at all (highest CMS risk).** `openLivePageAction.tsx` states it plainly: "no preview system in this project." There is no draft mode route, no Presentation tool, no preview perspective. Editors publish blind into a production ISR cache. For a team of one or two careful operators this works; the moment a less-technical editor touches money pages, a broken publish goes straight to indexed production pages with up to instant propagation via webhook. This is the largest gap between the CMS investment and editorial safety.

**R2 — URL changes are unguarded (highest SEO risk).** `fullPath` is generated once when the editor clicks Generate. Nothing prevents editing a published document's slug/fullPath afterward; nothing cascades a parent hub/node rename to children (their stored `fullPath` silently goes stale, since resolution is exact-match on the stored value — children keep working on old URLs while the Studio displays a new parent slug); and nothing auto-creates a `route_redirect` when a path changes. A single hub rename can strand a subtree's URLs with no redirect, turning indexed pages into 404s. The `beforeFullPath` field exists in the webhook payload type but no automation consumes it to create redirects.

**R3 — Redirects only cover the content platform.** `getContentRedirect` runs inside the catch-all only. File-routed pages (13 money-page folders, `/blog/`, `/gioi-thieu/`, legal pages) can never be redirected via CMS: a file route matches before the catch-all, and a removed file route falls into the catch-all only if the path isn't reserved (`/blog/*` is reserved → hard 404, redirect table never consulted). There is no `next.config.ts` `redirects()` block and no `vercel.json`. Renaming or consolidating any money page today requires a code change; forgetting it costs indexed URLs.

**R4 — Dual source of truth: ~800 lines of hardcoded fallback content.** `lib/faqs.ts` (216), `lib/pricing.ts` (194), `lib/schedule.ts` (204), `lib/locations.ts` (123), `content/homepage-*` (77) mirror CMS data. Empty-array CMS results silently fall back to these (`getPricingTiers`, `getScheduleBlocks`, `getLocations`, `getFaqs`). If CMS data and fallbacks drift, an outage or a misfired query serves **wrong prices and schedules**, not just stale ones — a business-correctness risk invisible to monitoring because it's "successful" rendering. The `degraded` flag exists for money pages but the catalog getters don't distinguish "CMS empty on purpose" from "CMS unreachable."

**R5 — Test coverage doesn't match the site's SEO stakes.** Four unit test files (webhook route, revalidation map, image loader, body image validation) plus one Playwright mobile smoke spec, for a 212-file app whose value is metadata, sitemap, structured data, and route resolution. None of those SEO-critical outputs have a single test. A refactor of `shared.ts` (949-line GROQ monolith) or `schema.ts` could silently break canonical tags or JSON-LD with no CI signal.

**R6 — Institutional knowledge lives in a gitignored directory.** Dozens of code comments cite locked specs and tickets under `.claude/CMS/*.md` (`v2badminton-cms-phase-1-locked-spec.md`, cache-revalidation-plan, CSP tickets), but `.claude/` is gitignored — zero of those files are tracked. On a new machine or for a new contributor, the authoritative specs the code explicitly defers to do not exist. `docs/` and `tickets/` hold some material, but not the referenced specs.

**R7 — Full production secrets sit on this workstation.** `.env.production.local` contains real values for `POSTGRES_URL`, `RESEND_API_KEY`, `SENTRY_AUTH_TOKEN`, `TURNSTILE_SECRET_KEY`, Upstash tokens, and the Sanity read token. It is correctly gitignored, so this is a device-hygiene issue, not a repo leak — but it means a lost/compromised laptop is a full production credential incident. Worth a rotation plan and pulling only what's needed locally.

---

## 3. The most important technical debt

**D1 — 13 near-identical money-page route folders.** Each `(site)/lop-cau-long-*/page.tsx` repeats the same fetch → failsafe → JSON-LD → `MoneyPageTemplate` pattern with a hardcoded PATH/SLUG pair, plus a parallel metadata entry in `lib/routes.ts` (title/description/OG duplicated between `routes.ts` fallback and Sanity `metaTitle`/`metaDescription`). Adding a money page today = code deploy + Sanity doc + sitemap set edit + routes.ts entry. This is the main obstacle to "100% CMS."

**D2 — Monolith files.** `queries/shared.ts` (949 lines) mixes GROQ, fallback mappers, and projections for every domain; `lib/schema.ts` (732 lines) holds all JSON-LD builders. Both are well-written but are becoming merge-conflict magnets and will get worse with each new hub vertical.

**D3 — Sitemap special-casing.** `sitemap.ts` hand-maintains `ALWAYS_INDEX_PATHS`, a long precondition comment, separate `aboutRoute`/`legalRoutes` arrays, and omits `/chinh-sach-bien-tap/` (present as a route, absent from the sitemap — verify whether intentional). Every new static page requires remembering this file.

**D4 — Fresh monorepo split still settling.** Recent commits show the `apps/web` + `packages/schema-shared` split with CI workarounds (rolldown native deps) and the `transpilePackages` + tsconfig-paths source-consumption pattern. `packages/schema-shared` currently holds only path-resolution helpers; the boundary between it and `src/sanity/lib/resolvePath.ts` should be watched for drift.

**D5 — Repo hygiene.** Root-level sprint markdowns (SPRINT_1…5, VERSION_C_*) and screenshot PNGs (some tracked under `tickets/`, plus untracked `w1-h1-*.png` at root) belong in `docs/archive/` or out of the repo. `public/images/V2 logo.png` (with a space) sits beside `v2-logo.png` — one is dead weight.

**D6 — CSP still report-only and intentionally broad** (`'unsafe-inline'`, `'unsafe-eval'`, three Sentry regional wildcards). The narrowing plan (W8-4) exists but is unshipped; report-only mode protects nothing.

---

## 4. What should be improved first

**Slug-change safety (addresses R2 + R3).** Cheapest effective version: make `fullPath` read-only after first publish in Studio (custom input already exists — extend `FullPathPreviewInput`), and require path changes to go through a documented "rename runbook": create `route_redirect` first (validation already prevents collisions), then regenerate. Better version: a document action "Đổi đường dẫn" that atomically regenerates the subtree's fullPaths and creates redirects. Also add a `redirects()` block in `next.config.ts` (or a build-time fetch of `route_redirect` docs) so file-routed pages get redirect coverage.

**Draft preview (addresses R1).** Wire Sanity's Presentation tool / next-sanity draft mode: a `/api/draft-mode/enable` route validating a preview secret, `perspective: "drafts"` reads gated strictly behind `draftMode().isEnabled`, and preview URLs noindexed. Keep the published-only public path exactly as is. This is a bounded, well-trodden integration and removes the "publish blind" workflow.

**SEO regression tests (addresses R5).** A small vitest/Playwright suite that snapshots: sitemap entries for a seeded dataset, canonical + robots meta for each page type (money page present/missing, unindexed content doc, empty blog), and JSON-LD validity (parse + required fields) for homepage, money page, article, court. This converts your strongest asset — disciplined SEO behavior — into something a refactor can't silently break.

**Fallback drift control (addresses R4).** Pick one: (a) generate the fallback modules from a committed Sanity export snapshot (script + CI check that they match production), or (b) retire content fallbacks for pricing/schedule and fail closed (hide section + Sentry alert) the way money pages already do. Wrong prices are worse than a hidden section.

**Commit the specs (addresses R6).** Move the `.claude/CMS/*.md` locked specs and plans referenced by code comments into `docs/cms/` and update the comment paths. One-hour job, permanent payoff.

Then: CSP enforcement (W8-4), sitemap consolidation (derive static entries from a single registry), and money-page templating (D1) — see priority order below.

---

## 5. What should NOT be changed

- **URL structure, trailing-slash policy, and canonical format.** These are consistent everywhere and indexed. Any "cleanup" here is pure downside.
- **The ISR + tag + signed-webhook revalidation design**, including `useCdn: false` and the `revalidationMap` dereference entries. The comments encode hard-won incident knowledge (the W4 stale-null poisoning). Don't "simplify" to time-only or CDN-cached reads.
- **Fail-safe 404 behavior for missing money pages and the published-only sitemap gating.** Rendering fallback marketing copy on a money page instead of 404ing would create thin-content pages Google has never seen; the current behavior is correct.
- **The stable `SITE_RELAUNCH_DATE` lastmod fallback.** Replacing it with `new Date()` would make every sitemap fetch look like a full-site change.
- **`robots: index:false, follow:true` defaults for unresolved/unindexed content routes**, and the AI-bot allowances in `robots.ts`.
- **`PUBLISHED_ONLY_FILTER` and `perspective: "published"` on the public read path.** When preview is added, it must be an isolated parallel path, never a change to these defaults.
- **The `(site)` layout's hide-links-when-empty behavior** for blog/coaches — it's deliberate and documented.
- **File-based money-page routes themselves (for now).** They rank; migrating them into the catch-all is a routing migration with redirect risk and should only happen, if ever, as a deliberate project with 1:1 URL preservation — not as opportunistic refactoring.

---

## 6. Suggested priority order

1. **Lock/automate `fullPath` changes + redirect creation; add `next.config.ts` redirects for file routes** — protects existing rankings; small effort, highest SEO downside avoided.
2. **Commit the `.claude/CMS` specs into `docs/`** — trivial effort, unblocks everything else being maintainable.
3. **SEO regression test suite** (sitemap, canonicals, robots meta, JSON-LD) — makes all later refactors safe.
4. **Draft preview / Presentation tool** — biggest editorial-workflow upgrade; do it after tests exist so the public path is provably unchanged.
5. **Fallback data strategy** (generate-from-snapshot or fail-closed) — eliminates the wrong-prices failure mode.
6. **CSP enforcement (W8-4)** — the bake window has data by now; narrow and enforce.
7. **Money-page consolidation for scale**: single data-driven route file or shared factory (`createMoneyPage(slug, path)`), metadata sourced from Sanity-first with `routes.ts` reduced to nav labels; sitemap derived from one registry. This is the gateway to adding future money pages without deploys.
8. **New hub verticals (courts done; rackets/shoes/accessories/news)** — ride the existing content platform (`content_hub`/`content_node`/`content_article` + a new typed doc like `court`). Add each type to `revalidationMap`, `ROUTE_RESOLUTION_QUERY`, sitemap priority map, and Studio buckets — the pattern is already proven by `court`.
9. **Split `shared.ts` and `schema.ts` monoliths** along domain lines — do this opportunistically as verticals are added, protected by the test suite.
10. **Repo hygiene** (sprint docs → archive, stray PNGs, dup logo) — anytime, zero risk.

---

## 7. Files/areas needing deeper review

- **`src/lib/sanity/queries/shared.ts` (949 lines)** — the hub/node queries run multiple correlated subqueries (`directNodes`, `directArticles`, related FAQs). Fine at current scale; worth GROQ profiling before the content platform grows to hundreds of docs, and before adding more verticals to `ROUTE_RESOLUTION_QUERY`.
- **`src/lib/schema.ts` (732 lines)** — validate emitted JSON-LD against Google's Rich Results test for each type (Course with offers and LocalBusiness opening-hours derivation are the most intricate and most likely to drift from schema.org expectations).
- **Next 16 caching semantics** — the code targets Next 16.2 (`revalidateTag(tag, { expire: 0 })`, fetch-level `next.revalidate` + tags inside `next-sanity`). I did not verify against the bundled Next 16 docs (`node_modules/next/dist/docs/`) per `AGENTS.md`; confirm the client's fetch options actually reach the data cache as assumed, since next-sanity major versions have changed this wiring before.
- **`MoneyPageTemplate` and the homepage section tree** (`components/home/**`, `money-page/**`, ~30 components) — not reviewed component-by-component; worth a client/server boundary and bundle-size pass (deferred sections suggest this was already considered).
- **`src/sanity/tools/ContentOpsTable.tsx` + `dashboardQueries.ts`** — dashboard queries run in every editor session; check for unbounded fetches.
- **`packages/schema-shared` vs `src/sanity/lib/resolvePath.ts`** — confirm one canonical path resolver; drift here breaks the "open live page" action silently.
- **Court schema (`court.ts`, 684 lines)** — largest schema; review field usage before cloning the pattern for rackets/shoes.
- **`/chinh-sach-bien-tap/` sitemap omission** — confirm intentional.
- **Studio `/studio` exposure** — noindexed via `next-sanity/studio` metadata and auth-gated by Sanity, but consider `disallow: /studio/` in `robots.ts` for tidiness.
- **`.env.production.local` on this machine** — schedule a secrets rotation and slim the local pull to dev-needed vars.

---

### Bottom line

This is an unusually disciplined codebase for its size: the caching, fail-safe, and SEO decisions are documented where they live, and the content platform is the right chassis for scaling into more hubs. The gaps are concentrated in **change safety**, not current behavior: URL renames, blind publishes, fallback drift, and missing SEO tests are all "nothing is broken today, but one routine edit could break production SEO" risks. Fix the guardrails first; only then invest in new verticals.
