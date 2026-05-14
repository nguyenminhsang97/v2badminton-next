---
name: seo
description: Use when auditing, adding, or fixing SEO on any page in the v2badminton-next project — metadata, structured data, sitemap, robots, canonical URLs, Open Graph, or Core Web Vitals that affect crawling and indexing.
---

# SEO Skill — V2 Badminton Next.js

Use this skill whenever the task involves search visibility: metadata, structured data, sitemap/robots, social cards, indexing control, or CWV regressions that affect ranking.

## Read First

1. Read `AGENTS.md` and `src/lib/site.ts` for canonical site config.
2. Check `src/lib/routes.ts` — `buildMetadata()` and `coreRoutes` are the single source of truth for page metadata. Never hand-write duplicate `title`/`description` values outside this file for money pages.
3. Confirm the `NEXT_PUBLIC_ALLOW_INDEXING` env var is `"true"` in `.env.production` before any indexing discussion.

## Project SEO Architecture

| Concern | File(s) |
|---|---|
| Site-wide config (URL, locale, social) | `src/lib/site.ts` |
| Route metadata factory + `coreRoutes` | `src/lib/routes.ts` |
| Money-page Sanity-driven metadata | `src/lib/moneyPageMetadata.ts` |
| OG image fallback map | `src/lib/generatedImages.ts` |
| JSON-LD schema builders | `src/lib/schema.ts` |
| JSON-LD renderer component | `src/components/ui/JsonLd.tsx` |
| Root layout metadata + viewport | `src/app/layout.tsx` |
| Sitemap (dynamic) | `src/app/sitemap.ts` |
| Robots (dynamic) | `src/app/robots.ts` |
| Default OG image | `public/og-image.jpg` |

## Metadata Patterns

### Static pages
```ts
// src/app/(site)/some-page/page.tsx
export const metadata = buildMetadata("/some-page/");
```

### Dynamic pages (Sanity-driven)
```ts
export async function generateMetadata({ params }): Promise<Metadata> {
  const data = await fetchPageData(params.slug);
  return buildMoneyPageMetadata(data) ?? buildMetadata("/fallback-route/");
}
```

### Blog posts
Use `generateMetadata` with `openGraph.type: "article"`, `publishedTime`, and `authors`. Keep the Article JSON-LD in sync with the OG `publishedTime`.

## JSON-LD Rules

- Use schema builders from `src/lib/schema.ts`; do not inline raw schema objects in page files.
- Add new schema types as named builder functions in `schema.ts`, not ad-hoc in pages.
- Pass an array to `<JsonLd />` when a page needs multiple schemas.
- Schemas to check per page type:
  - **Homepage**: Organization, Website, LocalBusiness (homepage variant), FAQPage, Course
  - **Money/location page**: LocalBusiness (location variant), Course, FAQPage, BreadcrumbList
  - **Blog post**: Article (via OG metadata + JsonLd if needed)
  - **Coach directory**: Person or ProfilePage schemas (not yet implemented — add if tasked)

## Sitemap Rules

- `src/app/sitemap.ts` must include every indexable route.
- Priority guidelines: homepage `1.0`, money pages `0.9`, blog posts `0.7`, legal `0.3`.
- `changeFrequency`: money pages `"monthly"`, blog `"weekly"`, legal `"yearly"`.
- When adding a new public route, add it to both `coreRoutes` in `src/lib/routes.ts` AND `sitemap.ts`.

## Robots Rules

- `src/app/robots.ts` disallows `/api/` and blocks AI crawlers (GPTBot, ClaudeBot, PerplexityBot).
- Do not disallow any money page or blog route.
- Sitemap URL in robots must match `siteConfig.siteUrl` from `src/lib/site.ts`.

## Canonical & Trailing Slash

- `next.config.ts` sets `trailingSlash: true` — all canonical paths must end with `/`.
- Always use `canonicalUrl(path)` from `src/lib/routes.ts` to build absolute URLs; never concatenate `siteConfig.siteUrl` manually.
- Never add a `canonical` that points to a different domain or a redirect target.

## Open Graph & Twitter Cards

- Every page must have `openGraph.images` — use `generatedImages` map for route-specific images, fall back to `public/og-image.jpg`.
- `locale: "vi_VN"` must be set on all Vietnamese pages (it is the default in `buildMetadata`).
- `twitter.card` must be `"summary_large_image"`.

## Indexing Control

- Production indexing is gated by `NEXT_PUBLIC_ALLOW_INDEXING=true`. Verify this env var exists in Vercel production env before a launch.
- Per-page `robots` override: only use `{ index: false }` for truly private pages (e.g., `/thank-you`, `/test-*`). Never set it on money or blog pages.

## Core Web Vitals Checklist (SEO-affecting)

When a change touches hero images, fonts, or above-the-fold layout:

- Confirm hero `<img>` has `fetchpriority="high"` and `loading="eager"`.
- Confirm fonts use `font-display: swap` or `optional`.
- Check that no layout shift is introduced (min-height using `max()` guard for svh/vh as per existing pattern in hero CSS).
- Run `npm run build` and check the build output for any new large JS chunks that would increase LCP.

## Verification Steps

```bash
npm run lint          # catches metadata type errors
npm run typecheck     # full TS check including schema types
npm run build         # confirms sitemap/robots handlers compile
```

After building, manually verify:
- `/sitemap.xml` — all money pages and recent blog posts appear
- `/robots.txt` — sitemap URL is correct, AI bots are blocked
- A money page and the homepage in browser DevTools → Elements → `<head>` for correct title, canonical, OG tags
- Google Rich Results Test on homepage URL for JSON-LD validity (use production or preview URL)

## Common Mistakes to Avoid

- Adding a money page to `sitemap.ts` but forgetting `coreRoutes` (or vice versa) — they must stay in sync.
- Hardcoding `https://v2badminton.com` in metadata instead of using `siteConfig.siteUrl`.
- Setting `robots: { index: false }` at the root layout level during staging and forgetting to remove it before launch.
- Omitting `alternates.canonical` on `generateMetadata` dynamic pages — always include it explicitly.
- Duplicate `<JsonLd />` renders of the same schema type on one page.
