# Unified SEO + AEO 30-Day Execution Plan

> **Sources merged:** [seo-30-day-execution-plan.md](./seo-30-day-execution-plan.md) + [aeo-30-day-additions.md](./aeo-30-day-additions.md). When a task exists in only one source, the source is noted in parentheses. CMS migration is intentionally out of scope — see a separate plan when needed.

---

## 1. Executive Summary

**What this plan does:** consolidates the SEO and AEO 30-day plans into one ordered backlog a junior dev can execute week by week. Same Goal / Files / Steps / Verify / DoD structure as the source docs.

**Merged from the SEO plan:** crawl hygiene fixes (root description, sitemap gate, fallback noindex, Vercel redirect, nav gating), money page content production, hero trust claims handling, Organization/LocalBusiness schema enrichment, coach bios, sitemap freshness fix, homepage H1 locality keyword, Search Console submission.

**Merged from the AEO additions:** service area in body HTML, reusable `QuickAnswer` component, answer-first writing rules for Week 2, About page (`/gioi-thieu/`), `Person` schema builder, `Speakable` schema (now optional), AI search citation monitoring.

**Blog publishing tasks from the source plans are intentionally deferred to the post-CMS blog launch.** The original SEO Week 4 (3 blog posts) and AEO Week 4 (2 question-led blog posts) work is captured in the approved [Blog Route + Content Taxonomy Decision Memo](./blog-route-taxonomy-decision-memo.md) §12 (Post-CMS Launch Backlog) and handed off via Week 4 Task W4.1.

**Out of scope (do NOT do in this plan):** Sanity schema migrations (a separate CMS migration plan covers those), URL restructuring of existing blog posts, adding new Sanity document types, blog post production, full content audit beyond what's listed.

**Main execution principle:** *The audit's biggest finding was that **placeholder content is worse than missing content** — AI engines and Google both penalize "đang cập nhật" admissions in extractable HTML. Every Week 1 task either removes placeholder content from the index or builds the scaffolding for Week 2 real content to replace it.*

---

## 2. Execution Rules

These rules apply to every task. Re-read before each PR.

1. **No placeholder page is indexable.** If a money page falls back to `buildPublishedMoneyPageFallback()`, it must return `noindex` *and* be absent from the sitemap. Two layers, never one.
2. **Sitemap only includes published pages.** Always-index list: `/`, `/hoc-cau-long-cho-nguoi-moi/`, `/lop-cau-long-binh-thanh/`, `/lop-cau-long-thu-duc/`. Everything else is gated by Sanity publication.
3. **`QuickAnswer` only renders on published content.** Detect via `page.id.startsWith("fallback:")` and skip — we do not want AI extracting a generic answer for unfinished pages.
4. **Schema must match visible content.** If `Course` schema lists `offers`, those prices must appear on the page. If `Person` schema names a coach, the coach card must be visible. Never emit schema for data the user can't see.
5. **Unsupported proof claims must be sourced or softened.** "4.9", "1.200+ học viên", "đạt huy chương quốc gia" — either a visible citation/source on the same page, or remove the number entirely. Never add `AggregateRating` JSON-LD unless backed by a public, verifiable third-party platform.
6. **Existing URLs do not change without a redirect.** All current `/blog/<slug>/` and money page paths stay as-is. If a future redesign needs a new pattern, it ships with 308/301 redirects from the old URL — not silently.
7. **Do not add AI-only files.** `llms.txt`, `ai-sitemap.xml`, and `ai-content` meta tags are not real standards. AI engines crawl normal HTML — focus on content quality.
8. **Trailing slash everywhere.** `next.config.ts` enforces `trailingSlash: true`. Always use `canonicalUrl()` from [src/lib/routes.ts](../src/lib/routes.ts). Never concatenate `siteConfig.siteUrl + path` by hand.
9. **Indexing is env-gated.** `NEXT_PUBLIC_ALLOW_INDEXING=true` must be set in production. Do not commit code that overrides this with `index: true` — let the env var control it.
10. **Verify locally before requesting review.** Every task's "Verify" steps are mandatory, not optional. Paste output in the PR description.

---

## 3. Route + Indexing Strategy

**This table is target state at the end of the 30-day plan, not current state.** Where a column lists a schema or treatment that doesn't exist in code today, a "Gap → Task" pointer marks which week's task closes it.

| Route pattern | Purpose | Indexing | Sitemap | Canonical | Schema (target) | QuickAnswer? | Notes / risks / gap → task |
|---|---|---|---|---|---|---|---|
| `/` | Homepage entity anchor | Index | Always | `/` (self) | Organization, WebSite, LocalBusiness, FAQPage, Course; Speakable optional | Yes (service-area sentence) | Hero CLS is sensitive — preserve recent fixes. Org/LocalBusiness enrichment → W3.2 |
| `/hoc-cau-long-cho-nguoi-moi/` | Top SEO service page | Index | Always | self | BreadcrumbList, Course, FAQPage | Yes | Treat as template for other service pages |
| `/lop-cau-long-binh-thanh/`, `/lop-cau-long-thu-duc/` | Location pages | Index | Always | self | BreadcrumbList, LocalBusiness (per-location), FAQPage today; **Course is target state, not currently emitted** — gap → consider adding via W3.2 follow-up; `hasMap` → W3.5 | Yes | Current code at [lop-cau-long-binh-thanh/page.tsx:48-64](../src/app/(site)/lop-cau-long-binh-thanh/page.tsx:48) emits Breadcrumb + LocalBusiness + FAQ only. Course schema gap: leave deferred unless W3.2 has budget. |
| `/hoc-cau-long-1-kem-1/`, `/gia-hoc-cau-long-tphcm/`, `/lop-cau-long-buoi-toi/`, `/lop-cau-long-cuoi-tuan/`, `/team-building-cau-long/`, `/lop-he-cau-long-tphcm/`, `/lop-cau-long-tre-em/`, `/lop-cau-long-cho-nguoi-di-lam/`, `/cau-long-doanh-nghiep/` | Money pages | Gated: index only if Sanity returns non-draft `money_page` with non-empty body | Gated by W1.2 query (`count(body) > 0`) | self | BreadcrumbList, Course (with offers), FAQPage | Yes (only when published) | Fallback render → `noindex` + omit from sitemap (W1.2 + W1.3) |
| `/blog/` | Blog index | Index only if ≥1 post exists | Auto (already correct) | self | **Current: none emitted.** BreadcrumbList would be the target — gap deferred to post-CMS blog launch. | No | Current logic at [blog/page.tsx:82-92](../src/app/(site)/blog/page.tsx:82) already handles indexing. JSON-LD gap is acceptable for this 30-day plan since no posts are produced. |
| `/blog/?category=<slug>` | Category filter (query param) | `noindex` while empty | Never (query params) | `/blog/` (parent) | None | No | Tightening of the per-category threshold is deferred to post-CMS blog launch ([memo §10](./blog-route-taxonomy-decision-memo.md)) |
| `/blog/<slug>/` | Blog post | Index | Auto (already correct) | self | **Current: `Article` only** ([blog/[slug]/page.tsx:86-107](../src/app/(site)/blog/[slug]/page.tsx:86)). BreadcrumbList is target — deferred to post-CMS blog launch. | — | Existing route behavior only. No new blog posts are published or submitted for indexing during this 30-day plan. Post-CMS blog routes are governed by the approved [blog strategy memo](./blog-route-taxonomy-decision-memo.md). |
| `/huan-luyen-vien/` | Coach index | Index only if ≥1 coach exists | Auto (already correct) | self | **Current: none emitted.** Target: BreadcrumbList + **Person** (per coach, new) → W3.3 | No (people, not service) | Page is auto-noindex when empty — see [huan-luyen-vien/page.tsx:46-50](../src/app/(site)/huan-luyen-vien/page.tsx:46) |
| `/huan-luyen-vien/<slug>/` | Coach detail | **Out of scope for this 30-day plan.** Currently no per-coach route — listing only | — | — | — | — | Defer until ≥6 coaches published with full bios |
| `/gioi-thieu/` | About / entity page (new) | Index | Always (added in the W3.4 PR that creates the page — never earlier) | self | Organization, BreadcrumbList; Speakable optional → W3.4 | Yes | Static; CMS migration moves body to Sanity later |
| `/chinh-sach-bao-mat/` | Privacy policy | Index (or `noindex` if legal team prefers) | Always (legal) | self | None | No | Already in sitemap as legal route |
| `/chinh-sach-danh-gia/` (post-CMS) | Review policy page | Index | Always | self | None | No | Deferred to post-CMS blog launch — see [memo §11.11](./blog-route-taxonomy-decision-memo.md) |

**Routes deliberately not included above:** `/monitoring-test/` (already production-gated via [env.ts:42-47](../src/lib/env.ts:42), 404s in prod), `/thank-you` and similar form confirmations (should be `noindex` if they exist — verify in Week 1).

---

## 4. Blog Route + Taxonomy Standard

**Status during this 30-day plan: blog publishing is deferred to a post-CMS-migration launch.** No blog posts are produced in Weeks 1-4. The current `/blog/` route stays conditionally `noindex` (already enforced in code at [blog/page.tsx:82-92](../src/app/(site)/blog/page.tsx:82) and [sitemap.ts:58](../src/app/sitemap.ts:58)).

The full blog strategy — route structure, taxonomy, post templates, writing rules, internal linking, archive indexing, controlled tag vocabulary, affiliate disclosure, post-CMS launch backlog — lives in a dedicated, approved memo:

→ **[docs/blog-route-taxonomy-decision-memo.md](./blog-route-taxonomy-decision-memo.md)**

### What this plan does for the blog

- **Nothing additive.** No new posts, no new routes, no category enum changes.
- **Preserves existing safety:** empty-blog noindex behavior and sitemap exclusion are already correct and remain untouched.
- **Prepares a CMS migration handoff brief** in Week 4 (see Task W4.1) so the post-CMS team can implement the memo's decisions without re-deriving them.

### Pre-cutover requirement (carry forward to CMS migration)

Per memo §14, before any blog route restructuring can ship at CMS migration time, the team must confirm **production Sanity post count**:

```groq
*[_type == "post" && status == "published"]{ slug, publishedAt }
```

Run in Sanity Vision. **Zero results** → clean cutover at `/blog/<category>/<slug>/` is safe. **Non-zero results** → each existing URL needs a per-post preservation/redirect decision before migration ships. This check is captured in this plan as **Q13 — Production Sanity Blog Post Check** in §10 and as a deliverable in Week 4 Task W4.1.

### What stays out of scope for this 30-day plan

- Migrating the route from `/blog/<slug>/` to `/blog/<category>/<slug>/`.
- Replacing the existing `SanityPostCategory` enum (`tips | how-to | beginner | campaign`) with the new 5-category taxonomy.
- Building the controlled tag vocabulary in Sanity.
- Producing the affiliate disclosure block, `/chinh-sach-danh-gia/` review policy page, or any of the AEO blog post templates.
- Publishing any blog posts from the post-CMS launch backlog (memo §12).

All of the above is owned by the CMS migration plan, which will be informed by the Week 4 handoff brief (W4.1).

---

## 5. Week 1 — Crawl Hygiene + AEO Foundation

Goal: stop indexing thin/duplicate content, clean up leaks, and ship the AEO scaffolding (QuickAnswer, service-area sentence) so Week 2 content has something to render into.

Branch: `seo-aeo/week-1-foundation`

---

### Task W1.1 — Fix root layout description leak

*(from SEO 1.1)*

**Goal:** Replace the "Next.js migration workspace…" fallback description on the root layout.

**Files:** [src/app/layout.tsx](../src/app/layout.tsx)

**Steps:**
1. Open `src/app/layout.tsx`, line 14.
2. Replace `description` with:
   ```ts
   description:
     "V2 Badminton — Lớp dạy cầu lông tại Bình Thạnh và Thủ Đức, TP.HCM. Nhóm nhỏ, HLV theo sát, lịch tối và cuối tuần.",
   ```

**Verify:** `npm run dev`, visit any nonexistent path (`/zzz/`), view source — `<meta name="description">` shows the new Vietnamese text. `Select-String -Path src -Recurse -Pattern "migration workspace"` returns nothing.

**DoD:**
- [ ] Typecheck passes.
- [ ] 404 description updated.
- [ ] Old string completely gone from `src/`.

---

### Task W1.2 — Gate money pages in the sitemap by Sanity content presence

*(from SEO 1.2 — single biggest crawl-hygiene lever)*

**Goal:** Stop submitting placeholder money pages to Google. Only `/`, the top SEO page, and the two location pages are unconditionally listed. Other money pages appear only when Sanity returns a non-draft `money_page` document with a complete body.

**Important — terminology clarification:** the [`money_page` Sanity schema](../src/sanity/schemaTypes/moneyPage.ts) **has no `status` field**. The current `PUBLISHED_ONLY_FILTER` in [GROQ queries](../src/lib/sanity/queries/shared.ts) excludes drafts but does **not** check whether the body has real content. So in this plan, "Sanity-gated" means *"non-draft `money_page` whose body is not empty"* — not *"document with status = published"*. A future CMS migration may add a proper `status` field; until then, this task enforces a content-completeness check in the sitemap query (steps below) rather than relying on a status field that doesn't exist.

**Files:** [src/app/sitemap.ts](../src/app/sitemap.ts) + [src/lib/sanity/queries/shared.ts](../src/lib/sanity/queries/shared.ts) (tighten `MONEY_PAGE_SITEMAP_QUERY`)

**Precondition — verify before merging this PR:**
The three "always include" money pages (`/hoc-cau-long-cho-nguoi-moi/`, `/lop-cau-long-binh-thanh/`, `/lop-cau-long-thu-duc/`) all call `notFoundForMissingMoneyPage()` at [moneyPageFailSafe.ts:31](../src/lib/moneyPageFailSafe.ts:31) when their Sanity `money_page` document is missing — they return HTTP 404, not a fallback render. See [hoc-cau-long-cho-nguoi-moi/page.tsx:33-35](../src/app/(site)/hoc-cau-long-cho-nguoi-moi/page.tsx:33) and the two location pages for the same pattern.

Before merging W1.2, **manually confirm in production Sanity** that the three required `money_page` documents exist with non-empty body:
```groq
*[_type == "money_page" && slug.current in ["hoc-cau-long-cho-nguoi-moi", "lop-cau-long-binh-thanh", "lop-cau-long-thu-duc"]]{ "slug": slug.current, "hasBody": count(body) > 0 }
```
Expected: 3 results, all with `hasBody = true`. If any of the three is missing or has an empty body, **stop** and either:
- (a) populate the missing Sanity content first, then merge W1.2; OR
- (b) temporarily move that path out of `ALWAYS_INDEX_PATHS` and let it be gated through `publishedMoneyPagePaths` like the other money pages until the Sanity content is ready.

The cost of skipping this check: the sitemap submits a 404 URL, which is one of the strongest crawl-quality penalties Google applies.

**Steps:**
1. Replace the unconditional `staticRoutes` mapping (around line 39) with:
   ```ts
   const ALWAYS_INDEX_PATHS = new Set<string>([
     "/",
     "/hoc-cau-long-cho-nguoi-moi/",
     "/lop-cau-long-binh-thanh/",
     "/lop-cau-long-thu-duc/",
   ]);
   // PRECONDITION (see step 0 of this task): all three money-page entries above
   // route through `notFoundForMissingMoneyPage()` when their Sanity money_page
   // is missing. Listing them in the sitemap unconditionally is only safe AFTER
   // the team has verified that the three required `money_page` documents
   // (slugs: hoc-cau-long-cho-nguoi-moi, lop-cau-long-binh-thanh, lop-cau-long-thu-duc)
   // exist in production Sanity with non-empty body. If any one is missing,
   // either (a) populate it in Sanity before merging, or (b) temporarily remove
   // it from this set and gate it via `publishedMoneyPagePaths` like the others.
   //
   // NOTE: do NOT add "/gioi-thieu/" here — it is added in W3.4 inside the same PR
   // that creates the page and verifies it returns 200. Listing a 404 in the sitemap
   // (even briefly) is bad practice.

   const publishedMoneyPagePaths = new Set(
     moneyPages.map((page) => `/${page.slug}/`),
   );

   const staticRoutes = coreRoutes
     .filter((route) =>
       ALWAYS_INDEX_PATHS.has(route.path) ||
       publishedMoneyPagePaths.has(route.path),
     )
     .map((route) => ({
       url: canonicalUrl(route.path),
       lastModified: resolveLastModified(
         moneyPageUpdatedAtByPath.get(route.path),
         generatedAt,
       ),
       changeFrequency: "weekly" as const,
       priority: route.path === "/" ? 1 : 0.8,
     }));
   ```
2. **Important:** do not add `/gioi-thieu/` to `ALWAYS_INDEX_PATHS` in this task. The page is created in W3.4, and listing it earlier would expose a 404 in the sitemap. Adding `/gioi-thieu/` belongs to W3.4 in the same PR that creates the page and verifies it returns 200.

3. **Tighten `MONEY_PAGE_SITEMAP_QUERY`** in [src/lib/sanity/queries/shared.ts](../src/lib/sanity/queries/shared.ts) to require a non-empty body. The current query is:
   ```groq
   *[
     _type == "money_page" &&
     defined(slug.current) &&
     ${PUBLISHED_ONLY_FILTER}
   ]{ ... }
   ```
   Add a body-completeness check:
   ```groq
   *[
     _type == "money_page" &&
     defined(slug.current) &&
     count(body) > 0 &&
     defined(metaTitle) &&
     defined(metaDescription) &&
     ${PUBLISHED_ONLY_FILTER}
   ]{ ... }
   ```
   This ensures `getMoneyPageSitemapEntries()` only returns documents with the minimum content required to render meaningfully — closing the gap left by the missing `status` field.

**Verify:**
1. **Production-Sanity precondition check** above returns all 3 required slugs with `hasBody = true`. If not, stop.
2. **End-to-end no-404 check (deployed preview):** for each entry in `/sitemap.xml`, run `curl -I <url>` and confirm 200. Zero 404s allowed in the sitemap.
3. **Local test (empty Sanity):** with no money_page documents locally, `/sitemap.xml` should show ONLY `/` + `/chinh-sach-bao-mat/` (because the three "always include" money pages would 404 with empty Sanity — they are valid for the sitemap only when their Sanity content exists, which the precondition guarantees in production). **Confirm `/gioi-thieu/` is NOT present** until W3.4 ships.
4. **Empty-body test:** with a `money_page` document that has only metadata but empty body, confirm it does **not** appear in the sitemap.

**DoD:**
- [ ] Production-Sanity precondition check passed and screenshot/output captured in PR.
- [ ] Deployed-preview sitemap audited — every URL returns 200.
- [ ] Build passes.
- [ ] Sitemap excludes money_page documents with empty body.
- [ ] Comment above `ALWAYS_INDEX_PATHS` explains the precondition.
- [ ] `MONEY_PAGE_SITEMAP_QUERY` content-completeness check added.

**Known limitation (flag for CMS migration handoff brief, W4.1):** the `money_page` schema has no `status` field today. The body-length gate is a proxy for editorial completeness, not a true publish workflow. A future CMS migration should add an explicit `status` (`draft | review | published | archived`) field with validation, so the sitemap query can become `status == "published"` instead of relying on body-length.

---

### Task W1.3 — Add fallback `noindex` to unpublished money pages (all fallback branches)

*(from SEO 1.3 — defense in depth for W1.2)*

**Goal:** If someone hits a money page whose body renders `buildPublishedMoneyPageFallback()` content, the page must return `noindex` — regardless of which metadata branch produced the metadata.

**Why this is stricter than the original draft:** the code at [publishedMoneyPageRoute.tsx:40-58](../src/components/money-page/publishedMoneyPageRoute.tsx:40) has three metadata branches but the body always renders fallback content when `moneyPage` is null:

1. `moneyPage` exists → real metadata + real body (indexable, correct).
2. `moneyPage` is null AND `degradedMetadataMode === "route"` AND `degraded` is true → returns route-level `buildMetadata(config.path)` (currently **indexable**), but body still renders the same fallback placeholder copy. **This is the bug:** indexable metadata + placeholder body content.
3. `moneyPage` is null otherwise → returns fallback metadata (was indexable; we make it noindex here).

The plan therefore makes both fallback metadata branches return `noindex`. The trade-off: during a transient Sanity outage on a real page, the page temporarily becomes noindex. Sanity outages are rare and short; the alternative (indexable placeholder body content) is materially worse for SEO and AEO.

**A longer-term fix** would be a last-known-good content cache so the body renders real content during outages. That is **out of scope for this 30-day plan** — flag it as a CMS-migration follow-up.

**Files:** [src/components/money-page/publishedMoneyPageRoute.tsx](../src/components/money-page/publishedMoneyPageRoute.tsx)

**Steps:**
1. In `generatePublishedMoneyPageMetadata`, update **both fallback branches** to spread `robots: { index: false, follow: true }` into the returned metadata:
   - The `degradedMetadataMode === "route"` branch — currently returns `buildMetadata(config.path)` indexable; make it `noindex` until a content cache exists.
   - The default fallback branch — currently returns `buildMoneyPageMetadata(config.path, buildPublishedMoneyPageFallback(config.path))` which already builds noindex-friendly metadata, but make it explicit via the same `robots` override.
2. Only the real-content branch (line 36: `if (moneyPage)`) stays indexable.

**Verify:**
- Money page Sanity has not published → `<meta name="robots" content="noindex, follow">`.
- Money page Sanity has published → `<meta name="robots" content="index, follow">`.
- Simulated Sanity outage on a real page (force `degraded=true` in dev) → `noindex` (acceptable temporary state).

**DoD:**
- [ ] Both fallback branches return `noindex`.
- [ ] Real-content branch stays `index`.
- [ ] Typecheck passes.
- [ ] Last-known-good content cache flagged for the CMS migration handoff brief (W4.1).

---

### Task W1.4 — Redirect Vercel alias to primary domain

*(from SEO 1.4)*

**Goal:** Stop `https://v2badminton-next.vercel.app/` from acting as a duplicate host.

**Files:** new `src/proxy.ts`

**Important — Next.js 16 convention:** what older Next versions called *Middleware* is renamed to *Proxy* in Next 16. The convention is `proxy.ts` with `export function proxy` (not `middleware.ts` / `export function middleware`). See [node_modules/next/dist/docs/01-app/01-getting-started/16-proxy.md](../node_modules/next/dist/docs/01-app/01-getting-started/16-proxy.md). Only one `proxy.ts` file is supported per project.

**Steps:**
1. Create `src/proxy.ts` with the 308 redirect logic:
   ```ts
   import { NextResponse, type NextRequest } from "next/server";

   const PRIMARY_HOST = "v2badminton.com";

   export function proxy(request: NextRequest) {
     const host = request.headers.get("host") ?? "";
     if (host === "v2badminton-next.vercel.app") {
       const url = new URL(
         request.nextUrl.pathname + request.nextUrl.search,
         `https://${PRIMARY_HOST}`,
       );
       return NextResponse.redirect(url, 308);
     }
     return NextResponse.next();
   }

   export const config = {
     // Match every path except Next internals and image/font/script/style assets.
     // Crucially, DO match `/robots.txt` and `/sitemap.xml` — these are crawl-critical
     // and must redirect off the Vercel alias to the primary domain. The earlier
     // `.*\..*` exclusion was over-broad and silently let those two files through.
     matcher: [
       "/((?!_next/|api/|.*\\.(?:js|css|map|png|jpg|jpeg|webp|gif|svg|ico|woff|woff2|ttf|otf|eot)$).*)",
     ],
   };
   ```
2. Keep this file minimal — no other proxy logic.
3. **Verify the matcher does not exclude `.xml` / `.txt`** — paste the regex into a tester and confirm `/robots.txt` and `/sitemap.xml` match (so they redirect), while `/_next/static/foo.js` and `/og-image.jpg` do not (so the proxy doesn't churn through static assets).

**Verify (post-merge, once `v2badminton-next.vercel.app` alias picks up the merged code):**

> **Why post-merge only:** the proxy checks `host === "v2badminton-next.vercel.app"`. PR preview deployments use a different host (e.g. `v2badminton-next-<hash>-….vercel.app`), so the redirect never fires on the preview URL. `200 OK` responses on the production alias before merge are expected — they mean the alias still serves old code, not that the proxy is broken. Do NOT block the PR on this check.

- `curl -I https://v2badminton-next.vercel.app/` → 308 to `https://v2badminton.com/`
- `curl -I https://v2badminton-next.vercel.app/robots.txt` → 308 to `https://v2badminton.com/robots.txt` *(this is the bug Codex caught — the older matcher excluded any dotted path)*
- `curl -I https://v2badminton-next.vercel.app/sitemap.xml` → 308 to `https://v2badminton.com/sitemap.xml`
- `curl -I https://v2badminton-next.vercel.app/_next/static/<some-real-asset>.js` → 200 (no redirect, asset still served)

**DoD:**
- [ ] Build clean.
- [ ] All four `curl` checks above pass **after merge** when the alias deploys the new code.
- [ ] PR comment captures the curl output (add post-merge).

**Risk:** Preview deployment URLs (e.g. `v2badminton-next-git-feat-x-…vercel.app`) must remain reachable for QA — the matcher above only catches the exact production alias.

---

### Task W1.5 — Hide nav AND footer links to empty `/blog/` and `/huan-luyen-vien/`

*(from SEO 1.5; **expanded** to cover Footer too — see [Footer.tsx:30-31](../src/components/layout/Footer.tsx:30) which currently hardcodes both links)*

**Goal:** Stop linking site chrome (nav + footer) to noindex empty pages.

**Files:** [src/components/layout/Nav.tsx](../src/components/layout/Nav.tsx), [src/components/layout/Footer.tsx](../src/components/layout/Footer.tsx), [src/app/(site)/layout.tsx](../src/app/(site)/layout.tsx)

**Steps:**
1. In [`(site)/layout.tsx`](../src/app/(site)/layout.tsx), fetch `getPublishedPosts()` and `getCoaches()` (or read existing data if already fetched) once and derive:
   ```ts
   const showBlogLink = posts.length > 0;
   const showCoachesLink = coaches.length > 0;
   ```
2. **Nav.** Extend `NavProps` with `showBlogLink` and `showCoachesLink`, pass both in from the layout, filter `primaryLinks` before mapping.
3. **Footer.** Extend `FooterProps` with the same two booleans. In [Footer.tsx](../src/components/layout/Footer.tsx), the `academyLinks` array currently hardcodes `/huan-luyen-vien/` and `/blog/` at lines 30-31. Filter them out conditionally before rendering, same logic as Nav.
4. **CMS-fetch-failure handling.** `getPublishedPosts()` and `getCoaches()` already use `sanityFetchOrFallback` and return `[]` on failure. That means a transient Sanity outage will hide both links — which is the safer behavior (don't link to a page we can't verify has content). Document this in a code comment so a future dev doesn't "fix" it the wrong way.

**Verify:** With empty Sanity, desktop nav AND footer show no Blog / no HLV. With content, both reappear in both chrome elements. Simulated Sanity fetch failure → links hidden (acceptable degraded state).

**DoD:**
- [ ] Lint/typecheck/build all pass.
- [ ] Both links hidden in Nav when empty.
- [ ] Both links hidden in Footer when empty.
- [ ] Both links visible in both when content exists.
- [ ] Comment in layout explaining the Sanity-failure-hides-links behavior.
- [ ] No console errors.

---

### Task W1.6 — Add service area to homepage body HTML

*(from AEO A.1 — pulled into Week 1 because the H1 update in W1.7 references the same elements)*

**Goal:** Put concrete court names + districts in the homepage body, not just the logo subtitle.

**Files:** [src/components/home/sections/HeroSection.tsx](../src/components/home/sections/HeroSection.tsx)

**Steps:**
1. Add a paragraph right after `HeroCtas`, before the `hero__proof` block (around line 110):
   ```tsx
   <p className="hero__service-area">
     V2 Badminton dạy cầu lông tại Bình Thạnh (sân Green) và Thủ Đức
     (Huệ Thiên, Khang Sport, Phúc Lộc), TP.HCM.
   </p>
   ```
2. Add minimal CSS in the matching hero stylesheet — text-only, no layout impact.
3. Court names must match the real `location` documents in Sanity. **Verify with business lead** that all four courts are still operational before merging.

**Verify:** `curl http://localhost:3000/ | Select-String "Bình Thạnh"` must include this sentence in body HTML.

**DoD:**
- [ ] Sentence in initial HTML.
- [ ] Court names verified accurate.
- [ ] No CLS regression (Lighthouse mobile + desktop ≥98/98/100/100).

---

### Task W1.7 — Update homepage H1 to include locality keyword

*(from SEO 4.3, **moved earlier**: it touches the same hero block as W1.6, so doing both in one PR avoids a second design review)*

**Goal:** Add "TP.HCM" to the homepage H1 for an explicit geo signal.

**Files:** [src/components/home/sections/HeroSection.tsx:95-103](../src/components/home/sections/HeroSection.tsx:95)

**Steps:**
1. Update the non-campaign H1 branch:
   ```tsx
   <h1 className="hero__heading">
     <span className="hero__heading-line hero__heading-line--one">
       Hành trình chinh phục
     </span>
     <span className="hero__heading-line hero__heading-line--two">
       <span className="hero__heading-accent">cầu lông tại TP.HCM</span>{" "}
       bắt đầu từ đây
     </span>
   </h1>
   ```
2. Check desktop (1440px) and mobile (375px) renders for awkward wraps. If broken, escalate to design before merging.

**Verify:** Visual at both breakpoints. Lighthouse scores unchanged.

**DoD:**
- [ ] H1 contains "TP.HCM".
- [ ] No CLS regression.
- [ ] Design sign-off if line-wrap differs.

**Business approval needed:** content lead should confirm wording — this is the most-seen line on the site.

---

### Task W1.8 — Build a reusable `QuickAnswer` component for money pages

*(from AEO A.2 — Week 1 to scaffold; activated by Week 2 content)*

**Goal:** Ship a 2-3 sentence "Tóm tắt nhanh" block above the body of every *published* money page, generated automatically from existing Sanity fields. Skips fallback pages so AI never extracts a generic answer.

**Files:** new `src/components/money-page/QuickAnswer.tsx` + edit [MoneyPageTemplate.tsx](../src/components/money-page/MoneyPageTemplate.tsx)

**Steps:** see AEO Task A.2 in the original — create the component, render it after the intro div in `MoneyPageTemplate`, gate on `!page.id.startsWith("fallback:")`. Match existing CSS pattern in `src/styles/`.

**Verify:** Visit a published money page locally — QuickAnswer renders above body. Visit an unpublished one — QuickAnswer absent. View source — sentence is plain HTML.

**DoD:**
- [ ] Component typed.
- [ ] Renders only on published pages.
- [ ] Concrete location + price strings, not placeholders.
- [ ] No layout shift.

**Note:** the component will render fully only after Week 2 publishes Sanity content with `relatedLocations` and `relatedPricing` populated. That's expected — Week 1 ships the wiring.

---

### Task W1.9 — Verify canonical + trailing-slash hygiene across new code

*(new — added because W1.4 introduces a Proxy that can affect canonical URLs)*

**Goal:** Ensure no task in Week 1 introduces a path without a trailing slash or a hardcoded `https://v2badminton.com` string.

**Files:** all PRs in Week 1.

**Steps:**
1. Run `Select-String -Path src -Recurse -Pattern "v2badminton.com"` — every match must be inside `siteConfig.siteUrl` resolution, not a hardcoded URL.
2. Run `Select-String -Path src -Recurse -Pattern "canonicalUrl\("` — every absolute URL constructed in new code must go through this helper.
3. For any new route or link added in W1.1-W1.8, confirm trailing slash is preserved.

**Verify:** Output of both `Select-String` commands reviewed. PR description includes the cleaned grep output.

**DoD:**
- [ ] No hardcoded primary-domain strings.
- [ ] No paths added without trailing slash.

---

### Week 1 wrap

Before requesting review: `npm run lint && npm run typecheck && npm run build && npm run test:mobile` — all four must pass. Paste output in PR description.

---

## 6. Week 2 — Money Page Content Depth + Answer-First Writing

Goal: publish real Sanity content for the 9 placeholder money pages, written following AEO answer-first rules so the Week 1 QuickAnswer + sitemap gate flip those pages from `noindex` → indexed automatically.

Branch: `seo-aeo/week-2-content` (most work is in Sanity Studio; small code touches only if rules below require it).

### Content order (priority — SEO Week 2 list, retained)

1. `/hoc-cau-long-1-kem-1/`
2. `/gia-hoc-cau-long-tphcm/`
3. `/lop-cau-long-buoi-toi/`
4. `/lop-cau-long-cuoi-tuan/`
5. `/team-building-cau-long/`
6. `/lop-he-cau-long-tphcm/`
7. `/lop-cau-long-tre-em/`
8. `/lop-cau-long-cho-nguoi-di-lam/`
9. `/cau-long-doanh-nghiep/`

### Task W2.1 — Sanity content template (apply to every page)

**Goal:** Each money page renders rich Sanity data so QuickAnswer, FAQ schema, and Course schema all populate.

**CMS areas:** money page documents in Sanity Studio. **No code changes** unless rule W2.2 requires it.

**Steps for each page:**
1. Fill required fields with original, V2-specific content:
   - `metaTitle` (50-60 chars, includes target keyword + TP.HCM)
   - `metaDescription` (140-160 chars, includes 1 differentiator)
   - `h1` (full Vietnamese phrase with geo keyword)
   - `intro` (Portable Text, 2-3 sentence answer-first paragraph)
   - `body` (Portable Text, ≥400 words, structured per rule W2.3)
   - `relatedLocations` (≥1; link to existing Bình Thạnh / Thủ Đức `location` docs)
   - `relatedPricing` (≥1; link to applicable `pricingTier` docs so `Course` schema gets `offers`)
   - `relatedFaqs` (≥5; each with `includeInSchema: true`)
   - `ctaLabel` (action-oriented Vietnamese phrase)
2. Publish.

**Verify per page:**
- View source: `<meta name="robots">` is `index, follow` (auto-flipped by Task W1.3).
- `/sitemap.xml` includes the URL (auto-added by Task W1.2).
- QuickAnswer renders above body with concrete location + price.
- [Rich Results Test](https://search.google.com/test/rich-results) passes on `Course`, `BreadcrumbList`, `FAQPage`.

**DoD per page:**
- [ ] All Sanity fields filled.
- [ ] Page indexable.
- [ ] In sitemap.
- [ ] Rich Results test green.

---

### Task W2.2 — Replace vague "facts pills" with concrete entity names

*(from AEO observation that `"3 sân có thể chọn"` is useless to AI)*

**Goal:** `MoneyPageTemplate.buildMoneyPageFacts()` currently outputs counts. Replace with concrete names from `relatedLocations` and `relatedPricing`.

**Files:** [MoneyPageTemplate.tsx:33-53](../src/components/money-page/MoneyPageTemplate.tsx:33)

**Steps:**
1. Update `buildMoneyPageFacts` to produce e.g. `"Sân Green (Bình Thạnh)"`, `"Học phí từ X VNĐ/tháng"`, `"Lịch tối T2-T6"` instead of counts.
2. Keep the same pill UI — only the strings change.

**Verify:** A published money page's pills show real names, not numbers.

**DoD:**
- [ ] No numeric-only pills remain when Sanity data is present.
- [ ] Fallback pill ("Tư vấn theo lịch học thực tế") kept for safety.

---

### Task W2.3 — Apply answer-first writing rules to every money page

*(from AEO Week 2 rules)*

**Rules (applied while filling the Sanity content in W2.1):**

1. **Answer in the first paragraph** — `intro` must directly answer the page's primary question. No marketing fluff. Bad: *"V2 Badminton tự hào…"*. Good: *"Học cầu lông 1 kèm 1 tại V2 Badminton phù hợp với học viên muốn HLV theo sát… Mỗi buổi tập trung vào một mục tiêu cụ thể: cầm vợt, di chuyển, phát cầu, hoặc nâng trình. Lớp diễn ra tại sân Green (Bình Thạnh) và Huệ Thiên (Thủ Đức), TP.HCM."*
2. **Question-shaped H2s** — *"Học 1 kèm 1 phù hợp với ai?"* not *"Đối tượng phù hợp"*.
3. **Concrete entity data in every section** — court names, district labels, prices in VNĐ, durations in minutes.
4. **Add a comparison block** in `/hoc-cau-long-1-kem-1/` and `/gia-hoc-cau-long-tphcm/`. Use Portable Text table (or styled grid) — group vs. 1:1, with quy mô / học phí / phù hợp / tốc độ tiến bộ.
5. **≥5 FAQs** with `includeInSchema: true`.

**Verify:** Reviewer reads first paragraph of each page out loud and answers "what is this page about, who is it for, where, how much?" If they cannot, the intro fails.

**DoD per page:**
- [ ] First paragraph answers the primary question.
- [ ] H2s are questions.
- [ ] 5+ FAQs.
- [ ] No vague language ("nhiều", "linh hoạt", "phù hợp") unless paired with a concrete example.

---

### Week 2 wrap

At minimum pages 1-5 published. Pages 6-9 can extend into Week 3 if business content lead is bottlenecked — but flag that in the PR.

---

## 7. Week 3 — Trust, Local SEO, Schema, About, Coaches

Branch: `seo-aeo/week-3-trust-and-entity`

### Task W3.1 — Replace or substantiate hero trust claims

*(from SEO 3.1 + AEO recommendation)*

**Goal:** "4.9" rating and "1.200+ học viên" in [HeroSection.tsx:119-129](../src/components/home/sections/HeroSection.tsx:119) need a visible source or must be softened.

**Files:** `src/components/home/sections/HeroSection.tsx` + content imports

**Steps:**
1. **Business approval needed.** Ask lead: do we have a public source for "4.9"? (Google Business Profile, Facebook reviews count.) If yes, add a small caption — *"Theo Google Business Profile"* — under the rating with a link.
2. Do we have a verifiable count for "1.200+"? If no, change to a non-numeric statement like *"Học viên đang tập tại Bình Thạnh và Thủ Đức"*.
3. **Do NOT** add `AggregateRating` JSON-LD until reviews are first-party verifiable on a third-party platform.

**Verify:** Reviewer signs off on wording. `Select-String -Path src -Recurse -Pattern "aggregateRating"` returns nothing.

**DoD:**
- [ ] Wording approved.
- [ ] No invalid schema introduced.

**Business approval needed: YES.**

---

### Task W3.2 — Enrich Organization + LocalBusiness schema

*(from SEO 3.2; Speakable consolidated here but **optional / deferred** — see step 4)*

**Goal:** Strengthen entity signals for Google Knowledge Panel and AI engines. Priority: Organization, LocalBusiness, BreadcrumbList, Course/Service, FAQPage, Person.

**Files:** [src/lib/schema.ts](../src/lib/schema.ts), [src/lib/site.ts](../src/lib/site.ts)

**Steps (in priority order — do not start step 4 until 1-3 are green):**
1. Add `logoPath` to `siteConfig`. If no dedicated logo asset exists, **business approval needed** for which file in `public/` to use (or schedule design to deliver one).
2. Extend `buildOrganizationSchema()` with `logo`, `contactPoint[]` (telephone + areaServed `"VN"` + `availableLanguage: ["Vietnamese"]`).
3. Extend `buildHomepageLocalBusinessSchema()` with `areaServed: [Bình Thạnh, Thủ Đức, Thành phố Hồ Chí Minh]` as AdministrativeArea entries.
4. **Optional — Speakable schema, review-before-implementation.** Speakable has limited cross-engine support and is not part of the priority schema list. **Do not block Week 3 on this step.** Skip if any of the following: (a) steps 1-3 have unresolved validator errors, (b) W3.3 Person schema still needs work, (c) the homepage's `.hero__heading` / `.hero__service-area` selectors are still in flux. If you do add it: `WebPage` + `SpeakableSpecification` on the homepage referencing those selectors. Get senior review of the JSON-LD shape first.

**Verify:** Paste each shipped JSON-LD block into [Schema.org Validator](https://validator.schema.org/) — zero errors. Logo URL resolves. If Speakable is shipped, its selectors match real DOM elements.

**DoD (required):**
- [ ] Organization, LocalBusiness, contactPoint, areaServed all validate.
- [ ] No duplicate `@id` collisions.
- [ ] Logo asset resolves.

**DoD (optional — only if step 4 was attempted):**
- [ ] Speakable selectors match real DOM elements (verified in dev tools).
- [ ] Senior-reviewed JSON-LD shape.

**Business approval needed:** logo asset choice.

---

### Task W3.3 — Publish real coach bios and add Person schema

*(from SEO 3.3 + AEO A.4 — combined because Person schema is meaningless without real bios)*

**Goal:** `/huan-luyen-vien/` auto-un-noindexes once ≥1 coach is published; add `Person` schema to surface coach expertise.

**Files:** Sanity coach documents + [src/lib/schema.ts](../src/lib/schema.ts) + [src/app/(site)/huan-luyen-vien/page.tsx](../src/app/(site)/huan-luyen-vien/page.tsx)

**Steps:**
1. **Content side (business lead + content lead):** publish ≥3 coach docs in Sanity with photo, real full name, years coaching, classes handled, 50-100 word bio, credentials.
2. **Code side:** add `buildPersonSchema(coach)` to `src/lib/schema.ts`:
   ```ts
   export function buildPersonSchema(coach: HomepageCoach): JsonLdNode {
     return {
       "@context": "https://schema.org",
       "@type": "Person",
       name: coach.name?.trim() ?? "HLV V2 Badminton",
       ...(coach.photoUrl ? { image: canonicalUrl(coach.photoUrl) } : {}),
       ...(coach.roleBadge ? { jobTitle: coach.roleBadge } : {}),
       worksFor: { "@type": "Organization", "@id": `${siteConfig.siteUrl}/#organization` },
       ...(coach.credentialTags.length > 0 ? { hasCredential: coach.credentialTags } : {}),
     };
   }
   ```
3. In `huan-luyen-vien/page.tsx`, when coaches exist, render `<JsonLd data={coaches.filter(hasRealName).map(buildPersonSchema)} />`. Filter out placeholder-named coaches before mapping.

**Verify:** Visit `/huan-luyen-vien/` — `<meta name="robots">` flips to `index, follow`. Rich Results Test shows valid `Person` entries. Nav link reappears (auto, from W1.5).

**DoD:**
- [ ] ≥3 coach docs live.
- [ ] All three have photo + bio + credentials.
- [ ] Person schema emits only for real names.
- [ ] Schema validates.

**Business approval needed:** coach photos + credential text (legal/PR review).

---

### Task W3.4 — Create `/gioi-thieu/` (About page)

*(from AEO A.3)*

**Goal:** Add the entity-anchor page AI engines need to disambiguate V2 Badminton from generic badminton businesses.

**Files:** new `src/app/(site)/gioi-thieu/page.tsx` + content source

**Steps:**
1. **Content source decision:** start as **static page** with copy approved by business lead. This 30-day plan does not introduce new Sanity document types — when CMS migration happens later, content can be moved into Sanity without changing the URL.
2. Create the route file. Use the scaffold in [aeo-30-day-additions.md Task A.3](./aeo-30-day-additions.md) — sections: V2 Badminton là ai? / Chúng tôi dạy ai? / Đội ngũ HLV / Sân tập / Cách liên hệ.
3. Render Organization + BreadcrumbList JSON-LD (use existing builders).
4. **Add `/gioi-thieu/` to `ALWAYS_INDEX_PATHS` in [sitemap.ts](../src/app/sitemap.ts) in the same PR as the page itself.** This is the first PR in which the page returns 200 — sitemap and route ship together to avoid any window where the sitemap points at a 404. Do not split into two PRs.
5. Add a footer link.
6. **Optional — Speakable schema for the H1 + first paragraph.** This is a low-priority addition (limited support across engines). Only add if time allows after items 1-5 + W3.2's required schemas are green. See W3.2 notes on Speakable optionality.

**Verify:** Page loads at `/gioi-thieu/` (200). Schema validates. Footer link works. `/sitemap.xml` includes the URL only after this PR merges.

**DoD:**
- [ ] Real content (not Lorem).
- [ ] Page indexable.
- [ ] In sitemap.
- [ ] Linked from footer.
- [ ] Schema clean.

**Business approval needed:** all body copy (business identity content).

---

### Task W3.5 — Add `hasMap` to LocalBusiness on local pages

*(from AEO Section F — `/lop-cau-long-binh-thanh/` schema note)*

**Goal:** Help local-pack indexing by attaching a `hasMap` URL (Google Maps link to the court) on each location page's LocalBusiness schema.

**Files:** [src/lib/schema.ts](../src/lib/schema.ts) `buildLocalPageBusinessSchema()` (line 463)

**Steps:**
1. Add `hasMap` field reading from the Sanity `location.mapsUrl` field (see [types.ts:92](../src/lib/sanity/types.ts:92)), or build a Google Maps URL from `geoLat`/`geoLng` when `mapsUrl` is empty.
2. **Business approval needed** if Sanity location docs don't yet have map URLs — they may need to be added.

**Verify:** Local page JSON-LD includes `hasMap`. Click the URL in browser — opens the right court on Maps.

**DoD:**
- [ ] `hasMap` populated for both local pages.
- [ ] Map URL points to the correct address.

**Business approval needed:** verify map pin accuracy with court partners.

---

## 8. Week 4 — CMS Migration Handoff, Sitemap Freshness, Monitoring

Branch: `seo-aeo/week-4-handoff-and-telemetry`

> **Scope shift from earlier drafts:** Week 4 no longer publishes blog posts. Per the approved [Blog Route + Content Taxonomy Decision Memo](./blog-route-taxonomy-decision-memo.md), all blog work is deferred to a post-CMS-migration launch. Week 4 instead prepares the **CMS migration handoff brief** so the next team can ship the new blog architecture cleanly.

### Task W4.1 — Prepare CMS migration handoff brief

*(replaces the deleted blog-post-publishing task; this is a handoff/brief, **not** the full CMS migration plan)*

**Goal:** Produce a short, decision-ready handoff document that captures every CMS-related decision already made in this 30-day plan + the approved blog memo, so a separate CMS migration plan can be written without re-deriving anything. **Length target: 4-8 pages.** Do not write the full implementation plan — just the brief.

**Files:** new `docs/cms-migration-handoff-brief.md`

**Required sections of the handoff brief:**

1. **Purpose & scope.** One paragraph: what the CMS migration must deliver, and what it explicitly does not cover (no rewriting Weeks 1-3 work).
2. **Decisions already made** — point to specific sources, do not re-explain:
   - Route pattern: `/blog/<category>/<slug>/` → [memo §4](./blog-route-taxonomy-decision-memo.md)
   - 5-category taxonomy → [memo §5](./blog-route-taxonomy-decision-memo.md)
   - Controlled tag vocabulary (~30 tags / 8 axes) → [memo §11.2](./blog-route-taxonomy-decision-memo.md)
   - Affiliate disclosure model → [memo §6.3, §11.7](./blog-route-taxonomy-decision-memo.md)
   - `AggregateRating` disabled by default → [memo §11.6](./blog-route-taxonomy-decision-memo.md)
   - No competitor content / V2-only court reviews → [memo §5.4, §6.4, §6.8](./blog-route-taxonomy-decision-memo.md)
   - Editorial review workflow → [memo §7](./blog-route-taxonomy-decision-memo.md)
   - Category archive `noindex` thresholds → [memo §10](./blog-route-taxonomy-decision-memo.md)
3. **Required CMS deliverables (handoff list, not implementation):**
   - New Sanity schema fields enumerated by memo §11 (core ID, tags, editorial metadata, SEO fields, AEO fields, schema fields, affiliate/disclosure fields, relationship fields, migration support fields).
   - Migration mapping for the old enum: `tips → ky-thuat | thiet-bi (per post)`, `how-to → ky-thuat`, `beginner → nguoi-moi`, `campaign → tin-v2`.
   - New static page: `/chinh-sach-danh-gia/` review policy (top-level — **not** under `/blog/` to avoid colliding with the future `/blog/[category]/[slug]/` route pattern; see [memo §11.11](./blog-route-taxonomy-decision-memo.md)).
   - Next.js route file restructure: add `src/app/(site)/blog/[category]/[slug]/page.tsx`. Decide whether to retire the existing `src/app/(site)/blog/[slug]/page.tsx` at cutover — depends on Q13 (below).
   - `src/proxy.ts` redirect rule shape — Next.js 16 Proxy convention, not legacy Middleware (308 from any legacy `/blog/<slug>/` to its new nested URL — only needed if Q13 returns non-zero).
4. **Pre-cutover requirement — Q13: Production Sanity Blog Post Check.** This is the hard gate. The brief states:
   ```groq
   *[_type == "post" && status == "published"]{ slug, publishedAt }
   ```
   Run in Sanity Vision. Capture results in the brief as a table. **Zero results** → clean cutover at `/blog/<category>/<slug>/` is safe. **Non-zero results** → list each URL with its 28-day GSC impressions count and a per-post decision (preserve URL with 308 OR migrate URL without preservation). The CMS migration plan cannot ship without this table filled in.
5. **What the CMS migration plan must additionally produce** (not deliverables of this brief, just a pointer list): full GROQ queries for new post shape, Sanity Studio dropdown configs, route handler implementations, redirect Proxy code (Next.js 16 `src/proxy.ts`), validation rule implementations, Studio editor UX for affiliate disclosure, seed data for the controlled tag vocabulary.
6. **Open questions for the CMS migration team** — anything still unresolved that this 30-day plan did not answer.

**Deliberately NOT in the brief:**
- Code for new Sanity schemas (that's the CMS migration plan's job).
- Migration scripts.
- Sanity Studio configuration code.
- Route handler implementations.
- Test plans.

**Verify:** Reviewer opens the brief, walks each section, confirms every decision in the [memo](./blog-route-taxonomy-decision-memo.md) is reflected. Pre-cutover Sanity check (item 4) has results filled in OR is explicitly marked as a blocker for migration kickoff.

**DoD:**
- [ ] `docs/cms-migration-handoff-brief.md` exists.
- [ ] All 6 required sections present.
- [ ] Production Sanity post-count query run, results captured.
- [ ] No implementation code in the brief — pointers only.
- [ ] Linked from the [memo](./blog-route-taxonomy-decision-memo.md) and from §11 of this plan.

**Business approval needed:** the brief is signed off by the business owner before being handed to whoever writes the CMS migration plan.

---

### Task W4.2 — Stabilize sitemap `lastModified`

*(from SEO 4.2)*

**Goal:** Stop using `new Date()` as the fallback `lastModified` — Google distrusts lastmod that always says "now".

**Files:** [src/app/sitemap.ts](../src/app/sitemap.ts)

**Steps:**
1. Replace the fallback:
   ```ts
   const SITE_RELAUNCH_DATE = new Date("2026-04-01T00:00:00Z");

   export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
     const generatedAt = SITE_RELAUNCH_DATE;
     // ... rest unchanged
   }
   ```
2. Replace the explicit `generatedAt.toISOString()` on `legalRoutes` with `SITE_RELAUNCH_DATE.toISOString()`.
3. Sanity-backed routes keep using real `_updatedAt` — do not touch that path.

**Verify:** Fetch `/sitemap.xml` twice 10 minutes apart — homepage `<lastmod>` identical.

**DoD:**
- [ ] Constant added.
- [ ] All `generatedAt` references reviewed.
- [ ] Lastmod stable across requests.

---

### Task W4.3 — Submit to Google Search Console + request indexing

*(from SEO 4.4; **scope tightened**: money pages + About only, no blog URLs)*

**Goal:** Force Google to recrawl the cleaned-up sitemap and the pages newly populated in Weeks 2-3.

**Steps:**
1. Submit `https://v2badminton.com/sitemap.xml` in GSC → Sitemaps.
2. URL Inspection → Request indexing for:
   - Each Week 2 money page (the ones that flipped from fallback to published Sanity content).
   - The Week 3 About page `/gioi-thieu/`.
   - The homepage if §W1.6 / W1.7 hero changes shipped.
3. **Do NOT request indexing for any `/blog/` URL** — blog work is deferred per §4. The blog index continues to auto-noindex while empty.
4. Open Coverage report — previously-fallback money page URLs should no longer appear as "Crawled — currently not indexed".
5. Open Enhancements: Breadcrumbs / FAQ / LocalBusiness / Person reports — zero new errors after 48h.

**Verify:** Screenshot of GSC submission status added to PR.

**DoD:**
- [ ] Sitemap resubmitted.
- [ ] Indexing requested only for money pages + About + homepage.
- [ ] No new schema errors after 48h.

---

### Task W4.4 — Set up AI / search visibility monitoring

*(from AEO A.7; **scope tightened**: service-page queries only, no blog-specific queries)*

**Goal:** A repeatable manual check so the team learns which queries V2's service pages start winning. Blog-specific query monitoring is deferred until after CMS migration + blog launch.

**Steps:**
1. Create a tracking spreadsheet with columns: `date | query | engine | citation Y/N | page cited | rank/position`.
2. Weekly check (every Monday for 4 weeks post-launch). Test queries for **money/service pages only**:
   - `học cầu lông tphcm`
   - `học cầu lông 1 kèm 1 sài gòn`
   - `lớp cầu lông cho người mới TP.HCM`
   - `lớp cầu lông bình thạnh`
   - `lớp cầu lông thủ đức`
   - `team building cầu lông`
   - `học cầu lông trẻ em tphcm`
   - `giá học cầu lông tphcm`
3. For each query, check **Google AI Overviews, ChatGPT Search, Perplexity, Bing Copilot.**
4. **GSC Performance report:** filter to last 7 days, sort by impressions — note top 20 queries and CTR.
5. After 2 weeks, identify which money pages are getting cited. Apply their patterns (QuickAnswer style, intro structure, FAQ phrasing) to weaker money pages.

**Deferred to post-CMS launch:** blog-specific queries (`học cầu lông bao lâu`, `lớp cầu lông nhóm vs 1 kèm 1`, equipment-review queries, court-review queries). Add these to the spreadsheet template now so they're ready, but do not run them yet — there are no blog answer pages to be cited.

**Verify:** Spreadsheet exists with ≥1 week of data by end of Week 4. Blog-query rows present but blank, tagged "post-CMS-launch".

**DoD:**
- [ ] Tracking sheet running.
- [ ] One full week of money-page data captured.
- [ ] Blog query rows present but explicitly blank.

---

## 9. Unified Tracking Checklist

Paste into PR descriptions, week by week.

```
Week 1 — Crawl Hygiene + AEO Foundation
- [ ] W1.1 Root description fixed
- [ ] W1.2 Sitemap gates by Sanity publication
- [ ] W1.3 Money page fallback returns noindex
- [ ] W1.4 Vercel alias 308 redirect (verified on deployed URL)
- [ ] W1.5 Nav hides empty blog/coach links
- [ ] W1.6 Service area sentence in homepage body
- [ ] W1.7 Homepage H1 includes "TP.HCM"
- [ ] W1.8 QuickAnswer component scaffolded
- [ ] W1.9 Canonical/trailing-slash audit clean

Week 2 — Money Page Content
- [ ] Pages 1-5 published with full content (1:1, giá, buổi tối, cuối tuần, team building)
- [ ] Pages 6-9 published or scheduled into Week 3
- [ ] W2.2 Facts pills show concrete names
- [ ] W2.3 Answer-first writing rules applied
- [ ] Each page has 5+ FAQs with includeInSchema
- [ ] Rich Results Test green on each page

Week 3 — Trust + Entity
- [ ] W3.1 Hero trust claims sourced or softened (business sign-off)
- [ ] W3.2 Org + LocalBusiness schema enriched (Speakable optional, not required)
- [ ] W3.3 ≥3 coach bios live, Person schema rendering
- [ ] W3.4 /gioi-thieu/ page live with real copy
- [ ] W3.5 hasMap on local pages

Week 4 — CMS Handoff + Monitoring
- [ ] W4.1 CMS migration handoff brief delivered (docs/cms-migration-handoff-brief.md)
- [ ] W4.1 Production Sanity post-count check captured in the brief
- [ ] W4.2 Sitemap lastModified stabilized
- [ ] W4.3 Sitemap resubmitted, indexing requested for money pages + About + homepage (no blog URLs)
- [ ] W4.4 AI search citation tracking running on money-page queries; blog rows present-but-blank
```

---

## 10. Conflicts, Risks, and Open Questions

### Conflicts resolved during the merge

| Conflict | Source A | Source B | Resolution |
|---|---|---|---|
| Homepage H1 update timing | SEO put it in Week 4 (4.3) | AEO suggested moving earlier | **Moved to Week 1 (W1.7)** because it touches the same hero block as W1.6 (service area). One design review instead of two. |
| Coach Person schema timing | Not in SEO | AEO Week 3 (A.4) | **Merged with SEO 3.3 into single Week 3 task W3.3** — schema only emits if real bios exist, so combining the work is safer. |
| About page (`/gioi-thieu/`) listing in sitemap | Not in SEO Week 1 | AEO Week 3 | **NOT added to `ALWAYS_INDEX_PATHS` in W1.2** — that would expose a 404 in the sitemap before W3.4 ships the page. Sitemap entry and page creation ship together in the W3.4 PR. |
| Speakable schema | Not in SEO | AEO A.5 (standalone Week 3 task) | **Folded into W3.2 as optional step 4** — limited cross-engine support, not on the priority schema list. Does not block Week 3. |
| Blog post count | SEO Week 4: 3 posts | AEO Week 4: 2 additional | **Both removed — blog publishing deferred to post-CMS launch per [approved memo](./blog-route-taxonomy-decision-memo.md).** Week 4 task slot reused for CMS migration handoff brief (W4.1). |
| Monitoring | SEO 4.4: GSC submission | AEO A.7: AI citation tracking | **Merged into W4.3 + W4.4** — GSC scoped to money pages + About; AI citation tracking scoped to service-page queries only, blog queries deferred. |
| Blog category archive indexing | Was planned as W4.5 with a code change | Deferred to CMS migration | **W4.5 removed.** Existing code already auto-noindexes when empty, which is correct for the duration of this 30-day plan. Category archive logic ships with the new `/blog/<category>/<slug>/` route at CMS migration. |

### Risks

1. **W1.2 + W3.4 ordering** — resolved by design: `/gioi-thieu/` is NOT added to `ALWAYS_INDEX_PATHS` in W1.2. Both the page creation and the sitemap addition ship in the same W3.4 PR, eliminating any window where the sitemap points at a 404.
2. **W2.1 content volume** — 9 money pages × ≥400 words × original = ~4,000 words of writing in a week. If content lead is part-time, slip pages 6-9 into Week 3 without rescheduling other tasks.
3. **W3.3 photo rights** — coach photos need release approval. Block point for the entire Week 3 task. Start collecting photos in Week 1.
4. **W4.1 handoff brief drift** — if the brief expands into the full CMS migration plan, Week 4 will overrun. Hard scope cap: 4-8 pages, decisions + pointers only, no implementation code. If a section requires more than that, it belongs in the future CMS migration plan, not the brief.
5. **Production Sanity post count unknown** — until Q13 (Production Sanity Blog Post Check) in §10 is answered, the post-CMS route cutover strategy cannot be finalized. This is a blocker for CMS migration kickoff, not for this 30-day plan.

### Open questions (need answers before/during execution)

| # | Question | Asked of | When needed |
|---|---|---|---|
| 1 | Is there a public source for "4.9" rating? | Business lead | Before W3.1 |
| 2 | Confirmed accurate student count, if any? | Business lead | Before W3.1 |
| 3 | Logo asset for `Organization.logo` schema | Design / business lead | Before W3.2 |
| 4 | Map URLs / accurate coordinates for each court | Business lead + court partners | Before W3.5 |
| 5 | All four courts (Green, Huệ Thiên, Khang Sport, Phúc Lộc) still operational? | Business lead | Before W1.6 |
| 6 | Resolved by W1.2 step 3 — `money_page` has no `status` field; W1.2 adds a body-length + metaTitle + metaDescription completeness check to `MONEY_PAGE_SITEMAP_QUERY` instead. Adding a real `status` field is flagged for the CMS migration handoff brief. | n/a (resolved) | n/a |
| 7 | Coach credential text — anything that requires legal review? | Business lead | Before W3.3 |
| 8 | Confirm `/gioi-thieu/` body copy with business identity | Business lead | Before W3.4 |
| **Q13** | **Q13 — Production Sanity Blog Post Check (Hard Gate)** — run `*[_type == "post" && status == "published"]{ slug, publishedAt }` in Sanity Vision and capture results | Business / Sanity admin | **Required before final blog route cutover at CMS migration time.** Captured in W4.1 handoff brief. Zero results → clean cutover safe; non-zero → per-post 308 preservation plan needed. |

### Missing implementation details

- **W1.6 CSS** — exact stylesheet for `.hero__service-area` not specified; match existing hero block patterns in `src/styles/`.
- **W1.8 styling** — `QuickAnswer` callout styling not specified; match pricing-card or callout patterns already in the project.
- **W3.4 footer link** — exact footer slot for the About link not specified; coordinate with `Footer.tsx` owner.

---

## 11. Final Recommendation

**Do first (this week, non-negotiable):**
- W1.1 (root description leak — 10 min, prevents brand-damaging snippet on errors)
- W1.2 + W1.3 (sitemap gate + fallback noindex — the single biggest crawl-quality lever)
- W1.4 (Vercel alias redirect — duplicate host risk)

**Must not delay past Week 1:**
- W1.6 + W1.7 + W1.8 — these three are a single hero/homepage PR; doing them in one shot avoids re-review of the same block.

**Can wait for the CMS migration plan (do NOT attempt in this 30 days):**
- Moving `coreRoutes.title/description` from code → Sanity (duplicates `metaTitle/metaDescription` today).
- Migrating hero copy / trust claims / About body to Sanity fields.
- Adding new Sanity document types and fields for the new blog architecture (per [memo §11](./blog-route-taxonomy-decision-memo.md)).
- Restructuring blog URLs to `/blog/<category>/<slug>/` — requires Q13 (Production Sanity Blog Post Check) first.
- Producing blog posts from the post-CMS launch backlog ([memo §12](./blog-route-taxonomy-decision-memo.md)).
- Building `/chinh-sach-danh-gia/` review policy page.
- Affiliate disclosure render logic.
- Controlled tag vocabulary in Sanity Studio.

Week 4 Task W4.1 produces the **handoff brief** that captures all of the above as decisions ready for a CMS migration plan to implement — but is not itself the migration plan.

**Must remain noindex until content is complete:**
- All money pages without published Sanity content (auto-handled by W1.2 + W1.3).
- `/blog/` and category filters with no posts (auto-handled by existing logic — no Week 4 code change needed).
- `/huan-luyen-vien/` with no coaches (auto-handled).

**Must be verified in Search Console (Week 4 + ongoing):**
- Sitemap submission success.
- Per-URL indexing status for the 9 money pages and `/gioi-thieu/`.
- Schema enhancements report (Breadcrumbs / FAQ / LocalBusiness / Person).
- Performance report queries — track which AEO-rewritten intros start winning impressions.
- **No blog URLs requested for indexing** during this 30-day plan.

**Hard pre-cutover gate (carried forward to CMS migration kickoff):**
- **Q13 — Production Sanity Blog Post Check (Hard Gate)** in §10 must be answered and captured in the [CMS Migration Handoff Brief](./cms-migration-handoff-brief.md) §4 before any blog route restructuring or content migration can ship.

**One sentence summary for the junior:**
*Week 1 stops the bleeding (placeholder content out of the index), Week 2 fills the holes (real content into the published money pages), Week 3 builds trust (entity + coaches + About), Week 4 sets up monitoring AND hands off the blog architecture decisions to the CMS migration team via a short brief. Do them in order — every later week depends on earlier weeks shipping cleanly. No blog posts produced in this 30 days; that's deliberate.*
