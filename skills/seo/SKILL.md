---
name: seo
description: SEO and AEO rules for v2badminton.com — page metadata, canonical URLs, JSON-LD, sitemap, robots, indexing control, Open Graph, redirects and URL changes, being cited in AI answers, and Core Web Vitals that affect ranking. Use it whenever a task touches how a page appears in Google or in AI answers — adding a page, changing a title or description, moving a URL, "trang không được index", schema or rich results, Search Console / GA4 / PageSpeed numbers — even if the user never says "SEO". Wording and badminton terminology are covered by `noi-dung-vi`.
---

# SEO & AEO — v2badminton.com

The site earns leads from Vietnamese searches ("học cầu lông Bình Thạnh", "giá học cầu lông tphcm") and, increasingly, from AI answers. Everything here serves two goals:

1. Every indexable page is unambiguous to crawlers: one canonical URL, a correct status, structured data that matches the page.
2. Every page's opening is quotable as a direct answer.

Paths are under `apps/web/` unless stated otherwise.

## Source-of-truth files

| Concern | File |
|---|---|
| Site identity (URL, locale `vi_VN`, phone, social) | `src/lib/site.ts` → `siteConfig` |
| File-routed page metadata + `coreRoutes` | `src/lib/routes.ts` → `buildMetadata()`, `canonicalUrl()` |
| Money-page metadata from Sanity | `src/lib/moneyPageMetadata.ts` |
| Route-specific OG images | `src/lib/generatedImages.ts`; default `public/og-image.jpg` |
| JSON-LD builders | `src/lib/schema.ts` |
| JSON-LD renderer | `src/components/ui/JsonLd.tsx` — `<JsonLd id="…" data={node or node[]} />` |
| Title template + site-wide indexing switch | `src/app/layout.tsx` — `template: "%s | V2 Badminton"`, `robots.index` from `NEXT_PUBLIC_ALLOW_INDEXING` |
| CMS content metadata | `src/app/(site)/[...slug]/page.tsx` → `generateMetadata` |
| Sitemap / robots | `src/app/sitemap.ts`, `src/app/robots.ts` |
| File-route redirects | `next.config.ts` → `FILE_ROUTE_REDIRECTS` |
| Paths the CMS may not claim | `apps/studio/src/sanity/schemaTypes/contentShared.ts` → `FILE_ROUTED_PATHS`, `CODE_RESERVED_PREFIXES` |

## Metadata

**File-routed pages** read the route table, so each title and description lives in one place:

```ts
export const metadata = buildMetadata("/lop-cau-long-tre-em/");

// Overrides merge into alternates / openGraph / twitter rather than replacing them.
export const metadata = buildMetadata("/gia-hoc-cau-long-tphcm/", {
  openGraph: { type: "website" },
});
```

`buildMetadata` sets `title.absolute`, the canonical, Open Graph (`vi_VN`, site name, image) and a `summary_large_image` Twitter card. Don't write a second title or description for a path that is already in `coreRoutes`.

**Pages with their own `generateMetadata`** (CMS static pages, the content platform) must set `alternates: { canonical: canonicalUrl(PATH) }` themselves, because nothing adds it for them.

**Titles and the brand suffix.** The root layout appends ` | V2 Badminton` to any non-absolute title, and `title.absolute` bypasses it. Which one a page uses decides who writes the brand:

| Where the title comes from | Uses | So the stored title… |
|---|---|---|
| CMS content (`content_hub`, `content_node`, `content_article`, `court`) `seoTitle` | the layout template | must **not** end in "— V2 Badminton" / "\| V2 Badminton"; the catch-all strips it with `stripBrandSuffix` if it does |
| `money_page.metaTitle` via `buildMoneyPageMetadata` | `title.absolute` | **must** include "\| V2 Badminton" itself, like the live money pages |
| `coreRoutes` titles via `buildMetadata` | `title.absolute` | already include the brand |

**Content platform** (`[...slug]`):

- `robots.index` comes from the document's `isIndexed`.
- `og:type` is `article` for articles and `website` for hubs, nodes and courts.
- The OG image falls back from the document's cover, to the CMS default image in site settings, to `public/og-image.jpg`.
- Unknown paths get `title: "Không tìm thấy trang"` + `noindex`. That noindex is load-bearing: the response status is 200.

## Canonical URLs and trailing slashes

- `trailingSlash: true` means every page path ends in `/`. Build absolute URLs with `canonicalUrl(path)`: it adds the slash, leaves asset paths (`/og-image.jpg`) alone, and prefixes `siteConfig.siteUrl`. Don't concatenate or hardcode the domain.
- `src/proxy.ts` 308-redirects `v2badminton-next.vercel.app` to the primary domain, including `/robots.txt` and `/sitemap.xml`.
- A canonical never points at a redirect source or another domain.

## Changing or retiring a URL

Follow `docs/cms/url-rename-runbook.md`. In short:

- **Measure before judging the cost.** Check the URL in Search Console first (indexed or not, impressions, clicks) and state the trade-off with those numbers, not with a generic warning.
- **CMS content** (hub, node, article, court): publish a `route_redirect` (`fromPath` → `toPath`, permanent) *before* renaming `fullPath`.
- **File-routed pages**: add an entry to `FILE_ROUTE_REDIRECTS` in `next.config.ts`. CMS redirects can't catch these, because filesystem routes match first.
- **Money pages are file-routed and also fetch their `money_page` by slug**, and the sitemap builds their paths from that slug. So the Sanity slug has to move too, and the two changes can't land at the same instant. Design the transition so the live page is never 404, noindex or missing from the sitemap in between — for example let the new route read the old slug as a fallback until the slug change is published, then remove the fallback.
- Under `trailingSlash`, one wildcard rule (`/:slug*`) produces a two-hop redirect chain. Use one rule for the index and a second with `:slug+` for children, as the `/blog/` → `/tin-tuc/` entries do.
- Keep the old path in `FILE_ROUTED_PATHS` once it becomes a redirect source, so no CMS document can claim it.
- Then verify: the old URL returns 308, the new URL 200, the canonical and sitemap show only the new URL, and internal links are updated.

## Adding a public page

1. The page and its metadata (above).
2. If file-routed: add the path to `coreRoutes` in `src/lib/routes.ts` **and** to `FILE_ROUTED_PATHS` in the Studio's `contentShared.ts`, so no CMS document can claim the same URL.
3. Decide which sitemap group it belongs to (table below). Don't list a page until its content exists.
4. JSON-LD suited to the page type.
5. At least one internal link from a hub or money page. Orphan pages index slowly.

## Sitemap (`src/app/sitemap.ts`)

The sitemap lists only pages that have real content, so most groups are conditional:

| Group | Included when | priority / changeFrequency |
|---|---|---|
| `/` + money pages in `ALWAYS_INDEX_PATHS` | always | `/` 1.0, others 0.8 / weekly |
| Other `coreRoutes` money pages | a published `money_page` document exists for the slug | 0.8 / weekly |
| `/gioi-thieu/` | always | 0.7 / monthly |
| `/chinh-sach-bao-mat/` | always | 0.3 / yearly |
| `/tin-tuc/` + posts | at least one published post | feed 0.7 weekly; posts 0.6 monthly |
| `/huan-luyen-vien/` | at least one coach | 0.6 / monthly |
| CMS content | returned by `getContentSitemapEntries()` | hub 0.8, node and article 0.7, court 0.6 / weekly |

- `lastModified` falls back to the fixed `SITE_RELAUNCH_DATE` so lastmod doesn't change on every request. Don't replace it with `new Date()`.
- An `ALWAYS_INDEX_PATHS` page returns 404 if its `money_page` document disappears. Read the PRECONDITION comment in the file before adding to that set.

## Robots and indexing

- `robots.ts` disallows only `/api/`. It **explicitly allows** GPTBot, ChatGPT-User, ClaudeBot and PerplexityBot, because being cited in AI answers is a goal. Don't block them "to be safe".
- Site-wide indexing is `NEXT_PUBLIC_ALLOW_INDEXING === "true"` (read in `app/layout.tsx`); `lib/env.ts` flags any other value in production. Before investigating "Google isn't indexing", check the Vercel production env, not a local file.
- Per-page `noindex` is for pages that genuinely shouldn't be found (not-found, test routes) and CMS documents with `isIndexed: false`. Never put it on a money page.
- Draft-preview responses carry `X-Robots-Tag: noindex, nofollow` and `no-store`, set by both `proxy.ts` and the draft-mode route. Keep both if you touch that flow.

## JSON-LD

Build structured data with the functions in `src/lib/schema.ts`. Add a new type there as a named `build…Schema` function, not as an inline object in a page. Existing builders:

`buildOrganizationSchema`, `buildWebsiteSchema`, `buildPersonSchema` (with `hasRealCoachName`), `buildFaqPageSchema`, `buildBreadcrumbSchema`, `buildSportsLocationSchema`, `buildHomepageLocalBusinessSchema`, `buildLocalPageBusinessSchema`, `buildCourseSchemas`, `buildCoursePageSchema`, `buildCourtSportsActivityLocationSchema`.

Structured data must describe what is actually on the page. Fabricated trust signals are worse than missing ones: they risk manual actions and mislead the people deciding whether to enrol.

- FAQPage only for FAQs rendered on that page. FAQ documents carry an `includeInSchema` flag.
- Person only for a real, active coach with a real name — `hasRealCoachName` exists to keep placeholders out.
- No `AggregateRating` or review stars without a real, verifiable review source. A decorative star strip in the UI (`coach.showStars`) or a default testimonial rating is not a review source.
- An article's `author` is the organisation ("Đội ngũ V2 Badminton") unless a specific coach actually wrote it. `reviewedBy` / `dateReviewed` appear only when a real review happened.
- Content articles emit **Article** JSON-LD whatever their `contentFormat` (`components/content/ContentStructuredData.tsx`). There is no HowTo markup, because the body has no structured steps — don't promise a HowTo rich result.
- Don't emit the same schema type twice on one page (for example, both a layout and a page adding Organization).

## AEO — being the quoted answer

- **Answer first.** The opening paragraph says what the page is, who it is for, where, and — on money pages — how much.
- **H2s are questions** ("Học 1 kèm 1 phù hợp với ai?"), matching how people ask.
- **Concrete entities in every section**: court name, district, VND amount, time window.
- `quickAnswer` (hub, node, article) is 40–70 words and starts with the subject. The Studio input counts the words.
- Aim for 5 schema-eligible FAQs on a money page, as most live money pages have. Check the page's current `relatedFaqs` first: some pages link fewer, and some link FAQs borrowed from other pages.

## Measuring

- **Search Console** and **GA4** are available as MCP tools (`mcp__google-search-console__*`, `mcp__google-analytics__*`). Use them for index status (`inspect_url_enhanced`, `check_indexing_issues`), queries by page (`get_search_by_page_query`, `compare_search_periods`) and traffic, rather than guessing.
- **PageSpeed Insights**: use `PAGESPEED_API_KEY` from the root `.env.local`; keyless calls are rate-limited to uselessness. The site has no CrUX field data, so only lab numbers exist. Take the median of 3+ runs for TBT.
- The `webperf` skill audits Core Web Vitals anti-patterns. CI's `lighthouse.yml` produces Lighthouse reports.
- For hero and above-the-fold changes: the LCP image loads eagerly with high priority, fonts don't block text, and nothing shifts layout while loading.

## Verify

```bash
npm run typecheck && npm run build
```

Then, against a running build (`npm run start` locally, or a preview URL):

- `/sitemap.xml` — expected URLs present; no redirecting or noindexed URLs.
- `/robots.txt` — the sitemap URL uses the primary domain.
- `curl -sI <url>` — status, `x-robots-tag`, and any redirect resolves in one hop.
- The page `<head>` — one title, one canonical ending in `/`, OG tags, JSON-LD that parses.
- Google's Rich Results Test on a production or preview URL for any new schema.

## Traps recorded in the code

- A CMS `seoTitle` ending in the brand, combined with the layout template, doubles the suffix.
- A single wildcard redirect under `trailingSlash` creates a two-hop chain.
- Listing a money page in the sitemap before its Sanity document exists sends crawlers to a 404.
- Anonymous Sanity reads return a subset of the data, so a page can look empty locally while production is fine.
