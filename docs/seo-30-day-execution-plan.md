# SEO 30-Day Execution Plan (Junior Developer Guide)

> ⚠️ **Status as of 2026-09-04 — this document no longer describes the live site.**
> The site went live on `v2badminton.com` and all 13 money pages are published and in `sitemap.xml`.
> Sources moved from `src/…` to `apps/web/src/…` in the workspace split (`d2797bd`), so every file path
> below is one level off. Weeks 1-4 of the code work shipped; what is unverified here is the operational
> follow-up (Search Console submission, Core Web Vitals review, coach bios). Treat this as a historical
> record of intent, not a to-do list — verify against production before acting on any item.
>

This plan turns the SEO audit findings into concrete, day-by-day work. Follow it top-to-bottom. Do not skip the verification steps — they catch the mistakes juniors most often make on this codebase.

**Owner:** assigned junior dev
**Reviewer:** senior dev or tech lead
**Estimated effort:** ~30 working hours across 4 weeks
**Branching:** one branch per week (`seo/week-1-crawl-hygiene`, `seo/week-2-content`, …), one PR per task or small group of tasks.

---

## How to use this document

1. Read the **Background** section once before starting.
2. Work through tasks in order. Each task has:
   - **Goal** — what changes
   - **Files** — exactly where to edit
   - **Steps** — numbered instructions
   - **Verify** — how to know it works
   - **Definition of done (DoD)** — checklist before opening the PR
3. After each PR, paste the "Verify" output as a comment so the reviewer doesn't re-run it.
4. If a step doesn't match the current code (someone refactored), **stop and ask** — don't improvise.

### Tools you will need every day

```powershell
npm run lint
npm run typecheck
npm run build
npm run dev        # for browser checks
```

On Windows PowerShell, `rg` may hit "access denied". Use `Select-String` or the project's `Grep` tool instead.

### Repository background (read once)

- Next.js 16 App Router. Site routes are under `src/app/(site)/`.
- SEO source of truth files:
  - [src/lib/site.ts](../src/lib/site.ts) — site URL, locale, phone, social
  - [src/lib/routes.ts](../src/lib/routes.ts) — `coreRoutes` and `buildMetadata()`
  - [src/lib/schema.ts](../src/lib/schema.ts) — all JSON-LD builders
  - [src/app/sitemap.ts](../src/app/sitemap.ts) — dynamic sitemap
  - [src/app/robots.ts](../src/app/robots.ts) — dynamic robots
  - [src/app/layout.tsx](../src/app/layout.tsx) — root metadata
- Indexing is gated by `NEXT_PUBLIC_ALLOW_INDEXING=true`. Don't touch this without coordinating with the senior.
- Money pages render real Sanity content if available, otherwise fall back to placeholder text from [src/lib/moneyPageFallback.ts](../src/lib/moneyPageFallback.ts).

---

## Week 1 — Crawl Hygiene

Goal: stop Google from indexing thin/duplicate content and clean up leaks. No content writing this week.

Branch: `seo/week-1-crawl-hygiene`

### Task 1.1 — Fix root layout description leak

**Why:** [src/app/layout.tsx:14](../src/app/layout.tsx:14) currently says *"Next.js migration workspace for the V2 Badminton website."* This leaks onto 404s and any page without its own `description`.

**Files:** `src/app/layout.tsx`

**Steps:**
1. Open `src/app/layout.tsx`.
2. Replace the `description` line with:
   ```ts
   description:
     "V2 Badminton — Lớp dạy cầu lông tại Bình Thạnh và Thủ Đức, TP.HCM. Nhóm nhỏ, HLV theo sát, lịch tối và cuối tuần.",
   ```
3. Save.

**Verify:**
```powershell
npm run typecheck
npm run dev
```
Visit `http://localhost:3000/some-page-that-does-not-exist/` and View Source. The `<meta name="description">` must show the new Vietnamese text, not "Next.js migration workspace".

**DoD:**
- [ ] Typecheck passes.
- [ ] 404 page shows new description in `<head>`.
- [ ] No other file references the old string (run: `Select-String -Path src -Recurse -Pattern "migration workspace"` — must return nothing).

---

### Task 1.2 — Gate money pages in the sitemap by Sanity publication

**Why:** [src/app/sitemap.ts:39-47](../src/app/sitemap.ts:39) adds **all 14** money page routes unconditionally. Most of them render fallback placeholder content. Submitting placeholder pages to Google looks like doorway content.

The fix: only include a money page in the sitemap if Sanity has actually published it. Homepage and the two local pages (`/lop-cau-long-binh-thanh/`, `/lop-cau-long-thu-duc/`) should remain unconditional — they render rich content from the homepage data, not from `getMoneyPage()`.

**Files:** `src/app/sitemap.ts`

**Steps:**
1. Open `src/app/sitemap.ts`.
2. Find the `staticRoutes` block (around line 39).
3. Build a set of "always include" paths and a set of "Sanity-gated" paths. Replace the existing `staticRoutes` with:

   ```ts
   const ALWAYS_INDEX_PATHS = new Set<string>([
     "/",
     "/hoc-cau-long-cho-nguoi-moi/",
     "/lop-cau-long-binh-thanh/",
     "/lop-cau-long-thu-duc/",
   ]);

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

4. Leave `legalRoutes`, `blogRoutes`, `coachRoutes` untouched — they already gate themselves correctly.

**Verify:**
```powershell
npm run build
npm run start
```
Visit `http://localhost:3000/sitemap.xml`. Count `<url>` entries. With an empty Sanity dataset, you should see only:
- `/` + `/hoc-cau-long-cho-nguoi-moi/` + `/lop-cau-long-binh-thanh/` + `/lop-cau-long-thu-duc/` (4 always-on)
- `/chinh-sach-bao-mat/` (legal)

Total: **5 URLs**. Before your change it would have been 15.

**DoD:**
- [ ] `npm run build` succeeds.
- [ ] `/sitemap.xml` excludes unpublished money pages locally.
- [ ] You did not change the lastModified/priority logic for routes that are still included.
- [ ] Add a comment above `ALWAYS_INDEX_PATHS` explaining: *"These pages render rich content from sources other than `getMoneyPage()`, so they don't need Sanity gating."*

---

### Task 1.3 — Add fallback `noindex` to money page metadata

**Why:** Belt-and-braces for 1.2. If someone manually visits an unpublished money page (e.g. a Google crawler followed an old backlink), the page itself should also say "don't index me".

**Files:** `src/components/money-page/publishedMoneyPageRoute.tsx`

**Steps:**
1. Open `src/components/money-page/publishedMoneyPageRoute.tsx`.
2. Find `generatePublishedMoneyPageMetadata` (around line 31).
3. In the fallback branch (when `moneyPage` is null and `degradedMetadataMode !== "route"`), spread a `robots: { index: false, follow: true }` override into the returned metadata:

   ```ts
   return {
     ...buildMoneyPageMetadata(
       config.path,
       buildPublishedMoneyPageFallback(config.path),
     ),
     robots: {
       index: false,
       follow: true,
     },
   };
   ```

4. The `degraded` branch (when Sanity is temporarily down but a real page exists) stays indexable — don't touch it.

**Verify:**
```powershell
npm run dev
```
Visit `http://localhost:3000/hoc-cau-long-1-kem-1/` (assuming Sanity has no entry for it). View Source. The `<meta name="robots">` must include `noindex`. Visit `/lop-cau-long-binh-thanh/` and confirm it remains `index, follow`.

**DoD:**
- [ ] Unpublished money page returns `noindex` in HTML head.
- [ ] Published money page (any one in Sanity) returns `index`.
- [ ] No TypeScript errors.

---

### Task 1.4 — Redirect the Vercel preview alias to the primary domain

**Why:** `https://v2badminton-next.vercel.app/` is publicly reachable and returns 200. The canonical tag points to `v2badminton.com` but Google can still split signals. A 308 redirect is the clean fix.

**Files:** create `src/middleware.ts` (new file)

**Steps:**
1. Create a new file at `src/middleware.ts` with:

   ```ts
   import { NextResponse, type NextRequest } from "next/server";

   const PRIMARY_HOST = "v2badminton.com";

   export function middleware(request: NextRequest) {
     const host = request.headers.get("host") ?? "";

     // Only redirect the Vercel production alias. Preview deployments
     // use unique hashes (e.g. v2badminton-next-git-feat-xyz.vercel.app)
     // and should remain reachable for review.
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
     matcher: [
       // Run on every path except Next internals and static assets.
       "/((?!_next/|api/|.*\\..*).*)",
     ],
   };
   ```

2. Save. Do not add other middleware logic in this file — keep the scope minimal.

**Verify:**
- Locally this won't trigger (host is `localhost`). After merge, a senior will check on the deployed preview:
  ```bash
  curl -I https://v2badminton-next.vercel.app/
  # Expect: HTTP/2 308, Location: https://v2badminton.com/
  ```
- Confirm `curl -I https://v2badminton.com/` still returns 200.

**DoD:**
- [ ] File compiles (`npm run typecheck`).
- [ ] `npm run build` succeeds with no middleware warnings.
- [ ] Leave a PR comment asking the reviewer to verify the curl behavior on the deployed Vercel alias.

---

### Task 1.5 — Hide nav links to empty `/blog/` and `/huan-luyen-vien/`

**Why:** [src/components/layout/Nav.tsx:24,43](../src/components/layout/Nav.tsx:24) links to both pages from the global nav. Both pages return `noindex` when empty, so users follow a nav link and land on a page that says "Chưa có bài viết / Đội ngũ đang được cập nhật". Bad UX and weak trust signal.

We will pass through the published counts from the layout (which already fetches them) and hide the links conditionally.

**Files:**
- `src/components/layout/Nav.tsx`
- `src/app/(site)/layout.tsx` (find the Nav usage)
- `src/components/layout/siteSettings.ts` (likely needs a new prop)

**Steps:**
1. Open `src/app/(site)/layout.tsx`. Find where `<Nav />` is rendered and where it reads site settings.
2. Add data fetching there (or read existing data if `getPublishedPosts` / `getCoaches` is already being called):
   ```ts
   const [posts, coaches] = await Promise.all([
     getPublishedPosts(),
     getCoaches(),
   ]);
   const showBlogLink = posts.length > 0;
   const showCoachesLink = coaches.length > 0;
   ```
3. Pass them into the Nav:
   ```tsx
   <Nav
     siteSettings={…}
     showBlogLink={showBlogLink}
     showCoachesLink={showCoachesLink}
   />
   ```
4. In `src/components/layout/Nav.tsx`, extend `NavProps`:
   ```ts
   type NavProps = {
     siteSettings: Pick<SiteChromeSettings, "siteName" | "phoneDisplay" | "phoneE164">;
     showBlogLink: boolean;
     showCoachesLink: boolean;
   };
   ```
5. Filter `primaryLinks` before mapping:
   ```ts
   const visiblePrimaryLinks = primaryLinks.filter((link) => {
     if (link.href === "/blog/") return showBlogLink;
     if (link.href === "/huan-luyen-vien/") return showCoachesLink;
     return true;
   });
   ```
6. Use `visiblePrimaryLinks` everywhere `primaryLinks` was previously used.

**Verify:**
```powershell
npm run dev
```
With empty Sanity (default local), the desktop nav must show **6 items** (no Blog, no HLV). Open the mobile menu — same count. With Sanity populated, both links return.

**DoD:**
- [ ] Both links hidden when respective collections are empty.
- [ ] Both links visible when collections have entries (have your reviewer toggle a Sanity entry to test).
- [ ] `npm run lint && npm run typecheck && npm run build` all pass.
- [ ] No console errors in dev tools.

---

### Week 1 wrap-up

Open a single tracking PR or 5 small PRs (your call — coordinate with reviewer). Before requesting review:

```powershell
npm run lint
npm run typecheck
npm run build
npm run test:mobile     # if it exists locally
```

All four must pass. Paste the output in the PR description.

---

## Week 2 — Content Depth (Money Pages)

Goal: publish real Sanity content for the 9 placeholder money pages so they un-noindex automatically and start ranking.

Branch: `seo/week-2-content` (only if code changes needed; most work is in Sanity Studio)

You will **mostly work in Sanity Studio, not the codebase**. The senior or content lead may pair with you on copywriting.

### Content order (priority)

| # | URL | Target keyword | Why this order |
|---|---|---|---|
| 1 | `/hoc-cau-long-1-kem-1/` | học cầu lông 1 kèm 1 tphcm | Highest-intent, easiest to convert |
| 2 | `/gia-hoc-cau-long-tphcm/` | giá học cầu lông tphcm | Commercial intent, gateway to all services |
| 3 | `/lop-cau-long-buoi-toi/` | lớp cầu lông buổi tối tphcm | Strong working-adult intent |
| 4 | `/lop-cau-long-cuoi-tuan/` | lớp cầu lông cuối tuần tphcm | Pairs with #3 |
| 5 | `/team-building-cau-long/` | team building cầu lông tphcm | B2B, high ticket |
| 6 | `/lop-he-cau-long-tphcm/` | lớp hè cầu lông tphcm | Seasonal but worth ranking before summer |
| 7 | `/lop-cau-long-tre-em/` | lớp cầu lông trẻ em tphcm | Already has decent fallback, lower priority |
| 8 | `/lop-cau-long-cho-nguoi-di-lam/` | lớp cầu lông người đi làm | Overlaps with #3, #4 |
| 9 | `/cau-long-doanh-nghiep/` | cầu lông doanh nghiệp tphcm | Overlaps with #5 |

### Content template (use this for every page)

Each page needs these Sanity fields filled with **original, specific, V2-Badminton-only content** — no generic AI filler:

1. **metaTitle** — 50-60 chars, keyword + brand. Use the audit's recommendations as starting points (see `/docs/seo-30-day-execution-plan.md` references below).
2. **metaDescription** — 140-160 chars, must mention TP.HCM and one differentiator (HLV theo sát, lớp nhỏ, lịch linh hoạt, sân Bình Thạnh & Thủ Đức).
3. **h1** — full Vietnamese phrase that matches search intent, contains the geo keyword.
4. **intro** — 2-3 sentences, who it's for + what the visitor gets.
5. **body** (Portable Text) — at least 400 words, structured as:
   - Lộ trình / nội dung buổi học
   - Đối tượng phù hợp
   - Sân tập và lịch
   - Học phí (link to `/gia-hoc-cau-long-tphcm/`)
   - FAQ (at least 3 in `relatedFaqs`)
6. **relatedFaqs** — minimum 3 entries with `includeInSchema: true`.
7. **relatedLocations** — link to existing Bình Thạnh and Thủ Đức location docs.
8. **relatedPricing** — link to applicable pricing tier(s) so `Course` schema gets `offers`.
9. **ctaLabel** — action-oriented, e.g. "Đăng ký buổi học thử miễn phí".

### Per-page editorial outlines

For each URL below, the section list is the minimum scaffold. Expand each with V2-specific detail.

#### `/hoc-cau-long-1-kem-1/`
- Khi nào nên chọn 1 kèm 1?
- Quy trình đánh giá đầu vào
- Cách HLV cá nhân hóa giáo án
- Học phí và lịch linh hoạt
- Sân tập tại Bình Thạnh, Thủ Đức
- FAQ: 1 buổi bao lâu? Có thể đổi HLV không? Có thử buổi đầu không?

#### `/gia-hoc-cau-long-tphcm/`
- Bảng giá tổng quan (lớp nhóm, 1:1, doanh nghiệp)
- Bao gồm những gì trong học phí
- Chính sách thử buổi, hoàn phí, bảo lưu
- So sánh nhanh giúp chọn gói
- FAQ: Có giảm giá cho học lâu dài không? Học phí bao gồm cầu/vợt không?

#### `/lop-cau-long-buoi-toi/` & `/lop-cau-long-cuoi-tuan/`
- Lịch chi tiết theo từng sân
- Tại sao khung giờ này phù hợp người đi làm/sinh viên
- Quy mô lớp, HLV phụ trách
- Sân tập kèm hình ảnh
- FAQ: Lỡ buổi có học bù không? Cần mang theo gì?

#### `/team-building-cau-long/`
- Các format chương trình (mini game, giải nội bộ, workshop)
- Quy mô đoàn phù hợp
- Quy trình từ tư vấn → triển khai
- Báo giá và ngân sách tham khảo
- Case studies (start with 1-2 real ones if available)

(For the remaining four, follow the same structure.)

### After each page is published

1. Run `npm run build` locally.
2. Visit the page in your local build. Confirm:
   - The page no longer shows "Nội dung chi tiết đang được cập nhật."
   - `<meta name="robots">` is `index, follow` (Task 1.3 flips it automatically once Sanity returns data).
   - The page appears in `/sitemap.xml` (Task 1.2's gate adds it automatically once `getMoneyPageSitemapEntries()` returns it).
3. Run Google's [Rich Results Test](https://search.google.com/test/rich-results) against a deployed preview URL. Expect no errors on `Course`, `BreadcrumbList`, `FAQPage`.

### DoD for Week 2

- [ ] At least pages 1-5 published with full content.
- [ ] Each has unique title, description, H1.
- [ ] Each has minimum 400 words of body content and 3+ FAQs.
- [ ] Sitemap reflects the new pages.
- [ ] Rich Results Test passes for each.

---

## Week 3 — Trust, Local SEO, Schema Hardening

Goal: prove the business is legitimate and strengthen LocalBusiness/Course schema with the data Google's algorithms actually use.

Branch: `seo/week-3-trust-local`

### Task 3.1 — Replace or substantiate hero trust claims

**Why:** [src/components/home/sections/HeroSection.tsx:119-129](../src/components/home/sections/HeroSection.tsx:119) hardcodes `4.9` rating and `1.200+ học viên`. Both are uncited. If V2 has no public review source, this is risky.

**Steps (talk to senior/business lead before editing):**
1. Ask: do we have a public source for "4.9"? (Google Business Profile, Facebook reviews, etc.) If yes, link it (small "Theo Google" caption under the rating).
2. Ask: do we have a count we can verify for "1.200+"? If no, soften to e.g. "Học viên đang tập tại Bình Thạnh và Thủ Đức" without the number.
3. Do **NOT** add `AggregateRating` JSON-LD schema unless reviews are first-party verifiable via a third-party platform.

**Verify:**
- Reviewer signs off on whichever wording is used.
- No `aggregateRating` field in any JSON-LD output (`Select-String -Path src -Recurse -Pattern aggregateRating` must be empty).

**DoD:**
- [ ] Wording approved by senior.
- [ ] No invalid schema added.

---

### Task 3.2 — Enrich `Organization` and homepage `LocalBusiness` schema

**Why:** [src/lib/schema.ts:360-369](../src/lib/schema.ts:360) Organization is minimal: name/url/telephone/sameAs. Adding `logo` and `contactPoint` is low-effort and helps Google build the Knowledge Panel.

**Files:** `src/lib/schema.ts`, possibly `src/lib/site.ts`

**Steps:**
1. In `src/lib/site.ts`, add a logo path constant:
   ```ts
   logoPath: "/og-image.jpg",   // or a dedicated /logo.png once design provides one
   ```
   If a real logo asset exists in `public/`, prefer its path. Ask the senior which file to use.
2. In `src/lib/schema.ts`, update `buildOrganizationSchema`:
   ```ts
   export function buildOrganizationSchema(): JsonLdNode {
     return {
       "@context": "https://schema.org",
       "@type": "Organization",
       "@id": `${siteConfig.siteUrl}/#organization`,
       name: siteConfig.name,
       url: siteConfig.siteUrl,
       logo: canonicalUrl(siteConfig.logoPath),
       telephone: siteConfig.phoneE164,
       contactPoint: [
         {
           "@type": "ContactPoint",
           telephone: siteConfig.phoneE164,
           contactType: "customer service",
           areaServed: "VN",
           availableLanguage: ["Vietnamese"],
         },
       ],
       sameAs: siteFacebook,
     };
   }
   ```
3. In `buildHomepageLocalBusinessSchema` (around line 427), add:
   ```ts
   areaServed: [
     { "@type": "AdministrativeArea", name: "Bình Thạnh" },
     { "@type": "AdministrativeArea", name: "Thủ Đức" },
     { "@type": "AdministrativeArea", name: "Thành phố Hồ Chí Minh" },
   ],
   ```
   right next to the existing `sameAs` line.

**Verify:**
1. `npm run build && npm run start`.
2. View page source of homepage. Find the `<script type="application/ld+json">` containing `"@type":"Organization"`. Copy its JSON content.
3. Paste into [Schema.org Validator](https://validator.schema.org/) — must pass with zero errors.
4. Do the same for `LocalBusiness`.

**DoD:**
- [ ] Schema validates clean.
- [ ] `logo` URL resolves to a real image (open it in a browser tab).
- [ ] No duplicate `@id` collisions.

---

### Task 3.3 — Ship real coach bios (un-noindex `/huan-luyen-vien/`)

**Why:** [src/app/(site)/huan-luyen-vien/page.tsx:40](../src/app/(site)/huan-luyen-vien/page.tsx:40) auto-noindexes when no coaches exist. Once 3+ coach docs are published in Sanity, the page indexes itself.

**Steps:**
1. With business lead, collect for each coach: photo, full name, years coaching, classes they handle, short bio (50-100 words), credentials.
2. Publish coach documents in Sanity Studio.
3. After publishing:
   - The page automatically un-noindexes.
   - The nav link (from Task 1.5) automatically reappears.
   - The sitemap (from Task 1.2's untouched coach branch) automatically lists `/huan-luyen-vien/`.

**Verify:** Visit `/huan-luyen-vien/`. Inspect `<meta name="robots">` — should be `index, follow`. Nav shows "HLV". Sitemap includes the URL.

**DoD:**
- [ ] Minimum 3 coach profiles live.
- [ ] All three have photo + bio + credentials.
- [ ] Page indexable.

---

## Week 4 — Topical Authority + Telemetry

Goal: start producing content that links *into* the money pages and verify Google sees everything.

Branch: `seo/week-4-blog-and-telemetry`

### Task 4.1 — Publish 3 blog posts

**Why:** Blog posts are top-of-funnel. Every guide should link to one money page and one local page using descriptive anchor text. This is how internal linking builds topical authority.

**Suggested titles (start here, refine with content lead):**
1. *Cách chọn lớp cầu lông cho người mới ở TP.HCM* → links to `/hoc-cau-long-cho-nguoi-moi/` + `/lop-cau-long-binh-thanh/`
2. *Học cầu lông buổi tối ở TP.HCM nên tập mấy buổi/tuần?* → links to `/lop-cau-long-buoi-toi/` + `/gia-hoc-cau-long-tphcm/`
3. *Trẻ em mấy tuổi học cầu lông được? Lộ trình đề xuất* → links to `/lop-cau-long-tre-em/` + `/huan-luyen-vien/`

### Per-post structure

- 800-1200 words.
- H1 = post title (set in Sanity).
- 4-6 H2 sections.
- 2 internal links to money pages with descriptive anchor (not "click here").
- 1 image with descriptive `alt`.
- Excerpt: 1-2 sentence summary (used in OG/Twitter).

**DoD:**
- [ ] 3 posts live.
- [ ] Each has 2+ outgoing internal links to money/local pages.
- [ ] `/blog/` returns `index, follow` (auto, from Task 1.5's gate flipping).

---

### Task 4.2 — Fix sitemap `lastModified` to avoid lying about freshness

**Why:** [src/app/sitemap.ts:30](../src/app/sitemap.ts:30) uses `generatedAt = new Date()` as the fallback `lastModified`. Every sitemap fetch shows "modified today" for pages that weren't actually modified. Google eventually distrusts this and ignores the lastmod signal.

**Files:** `src/app/sitemap.ts`

**Steps:**
1. Replace the `new Date()` fallback with a fixed reference date (e.g. site relaunch date):
   ```ts
   const SITE_RELAUNCH_DATE = new Date("2026-04-01T00:00:00Z");

   export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
     const generatedAt = SITE_RELAUNCH_DATE;
     // ... rest unchanged
   }
   ```
2. Replace the explicit `generatedAt.toISOString()` on `legalRoutes` with `SITE_RELAUNCH_DATE.toISOString()`.
3. Sanity-backed routes still use the real `_updatedAt` — that's correct.

**Verify:** Fetch `/sitemap.xml` twice 10 minutes apart. `<lastmod>` for the homepage must be identical, **not** "now()".

**DoD:**
- [ ] Constant added.
- [ ] All `generatedAt` references reviewed.
- [ ] Sitemap lastmod stable across requests.

---

### Task 4.3 — Update homepage H1 to include locality keyword

**Why:** [src/components/home/sections/HeroSection.tsx:95-103](../src/components/home/sections/HeroSection.tsx:95) renders `Hành trình chinh phục cầu lông bắt đầu từ đây`. Adding "tại TP.HCM" gives Google an explicit geo signal on the most important page.

**Steps:**
1. Open `src/components/home/sections/HeroSection.tsx`.
2. Find the non-campaign H1 (the `else` branch around line 95).
3. Update to (one option — coordinate with design about line wrapping):
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
4. Check the desktop and mobile renders for awkward line breaks. If layout breaks, escalate to design before merging.

**Verify:**
- Visual check at 1440px and 375px viewports.
- `npm run test:mobile` if available.
- No CLS regression in Lighthouse (this project is sensitive to hero CLS — see commits `bde0b14`, `82ca83d`).

**DoD:**
- [ ] H1 includes "TP.HCM".
- [ ] Desktop layout unchanged.
- [ ] Mobile layout unchanged.
- [ ] Lighthouse mobile + desktop scores still ≥98/100/100/100.

---

### Task 4.4 — Submit to Search Console + sanity check

**Why:** Google won't recrawl on its own quickly. After all the above lands in production, force a recrawl.

**Steps (do these in Google Search Console):**
1. Submit the updated sitemap URL: `https://v2badminton.com/sitemap.xml`.
2. For each newly populated money page from Week 2, run **URL Inspection** → **Request indexing**.
3. Open **Coverage** report. Confirm previously-fallback URLs are no longer flagged "Crawled — currently not indexed".
4. Open **Enhancements → Breadcrumbs / FAQ / LocalBusiness** reports. Confirm no new errors.

**DoD:**
- [ ] Sitemap resubmitted.
- [ ] Money pages requested for indexing.
- [ ] No new schema errors in Search Console after 48h.

---

## Common pitfalls (read before each PR)

1. **Don't add `index: true` overrides explicitly.** The default is already index, and adding it suppresses the global `NEXT_PUBLIC_ALLOW_INDEXING` gate.
2. **Don't break trailing slashes.** `next.config.ts` has `trailingSlash: true`. Always use `canonicalUrl()` from `src/lib/routes.ts` — never concatenate URLs manually.
3. **Don't put metadata in `<head>` via JSX.** Use the `metadata` export or `generateMetadata`. The App Router will not pick up `<head>` JSX correctly.
4. **Don't add new JSON-LD inline in pages.** Add a builder to `src/lib/schema.ts` and render via `<JsonLd />`.
5. **Don't commit changes to `NEXT_PUBLIC_ALLOW_INDEXING`.** It is environment-controlled.
6. **Verify on the deployed preview, not localhost.** Some checks (Vercel alias redirect, Search Console) only meaningfully run on the deployed URL.

## Escalation

Stop and ask if any of these happen:
- A file referenced above has moved or its shape has changed (someone refactored).
- `npm run build` introduces a new warning that wasn't there before your change.
- Search Console reports a sudden coverage drop after your changes.
- Sanity Studio is unavailable / you can't publish content in Week 2.

## Tracking checklist (copy into your weekly PR description)

```
Week 1
- [ ] 1.1 Root description fixed
- [ ] 1.2 Sitemap gates by Sanity publication
- [ ] 1.3 Money page fallback returns noindex
- [ ] 1.4 Vercel alias 308 redirect
- [ ] 1.5 Nav hides empty blog/coach links

Week 2
- [ ] 9 money pages published with full Sanity content
- [ ] Rich Results Test passes on each

Week 3
- [ ] 3.1 Hero trust claims sourced or softened
- [ ] 3.2 Org + LocalBusiness schema enriched
- [ ] 3.3 Coach bios live, page un-noindexed

Week 4
- [ ] 4.1 3 blog posts live with internal links
- [ ] 4.2 Sitemap lastModified stable
- [ ] 4.3 Homepage H1 includes "TP.HCM"
- [ ] 4.4 Sitemap resubmitted, indexing requested
```
