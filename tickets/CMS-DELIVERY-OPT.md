# CMS-DELIVERY-OPT — Sanity CDN delivery transforms

## Context

The site stores images in the Sanity Asset Store and renders them through
`next/image`, which means Vercel's image optimizer downloads the original from
`cdn.sanity.io` once per uncached responsive variant and re-encodes it at the
edge. Sanity's own CDN already supports on-the-fly transforms
(`?w=&h=&auto=format&q=`) that emit WebP/AVIF directly, so the current setup
is a missed-leverage problem rather than a correctness bug: it costs first-byte
LCP on cold variants and uses Vercel image-optimizer minutes for work the
Sanity CDN would do for free.

This ticket is filed as a follow-up to CMS-IBI (inline article body images,
shipped in `feat(cms): inline body images for content_article`). CMS-IBI
deliberately kept the existing delivery pattern; this ticket addresses the
delivery layer separately.

## Goal

Decide and implement a single, consistent image-delivery strategy that avoids
**double optimization** (Sanity CDN transforms feeding into Vercel image
optimization, or vice versa). The strategy applies across all image fields:
`coverImage`, `gallery`, `bodyImage`, homepage hero, etc.

## Strategy decision — required before implementation

Pick one of the two paths and document the choice in this ticket before
writing code:

**Path A — Sanity CDN does the work; bypass Vercel optimizer.**
- Add `@sanity/image-url` and build URLs with `auto=format&q=75` and a width.
- Render with `<img>` directly **or** with `next/image` using an `unoptimized`
  prop on Sanity-sourced images so Vercel passes the URL straight through.
- Pros: lower cold LCP, no Vercel image-optimizer minutes for these, simpler
  cache story (one CDN, not two).
- Cons: lose Vercel's edge caching of optimized variants in front of Sanity's
  CDN; lose `next/image`'s automatic LQIP wiring (we'd reuse Sanity's `lqip`
  field directly, which CMS-IBI already projects).

**Path B — Vercel optimizer continues, but pre-shrunk by Sanity.**
- Build URLs with `?w=2400&auto=format` (a sane upper bound) and let Vercel
  request from that pre-resized source.
- Pros: keep `next/image` ergonomics, edge caching, blur placeholders.
- Cons: still double-encodes on cold path; benefit is mostly bandwidth from
  Sanity to Vercel, not LCP.

**Recommendation**: Path A for body images and gallery (lazy-loaded,
non-LCP), Path B for `coverImage` (the LCP element where Vercel's edge cache
matters most). Document any deviation here before implementing.

## Out of scope

- Upload-time resizing or re-encoding (see [CMS-IMG-OPT](CMS-IMG-OPT.md)).
- Schema changes — this is delivery-only.
- New image sources beyond `cdn.sanity.io`.

## Files likely to change

- `src/lib/sanity/image.ts` *(new)* — `urlForImage(source).width(w).auto("format").quality(75).url()` helper.
- `src/lib/sanity/queries/shared.ts` — drop `asset->url` in favor of returning
  the asset reference (or pre-computed width-variants) so the renderer can
  build URLs.
- `src/components/content/ArticleView.tsx` — body image renderer uses helper.
- `src/components/content/CourtView.tsx` — gallery + cover via helper.
- Other call sites of cover-image rendering (search `coverImageUrl`).
- `next.config.ts` — `images.remotePatterns` may need to stay (still used for
  the `coverImage` LCP path under Path B).
- `package.json` — add `@sanity/image-url`.

## Success criteria

- Single helper owns all Sanity image URLs; no raw `asset->url` in renderers.
- Lighthouse on a body-image-heavy article shows cold LCP at parity or
  better than pre-change.
- DevTools network panel confirms responsive variants come from
  `cdn.sanity.io` (Path A) or from `/_next/image?url=cdn.sanity.io/...&w=2400`
  (Path B). No request fetches the original full-size asset.
- Vercel "Image Optimization" usage for body-image variants drops measurably
  (Path A) or stays flat at lower source size (Path B).
- No visual regression on existing articles, courts, money pages, or
  homepage.

## Open questions

1. Path A or Path B? Default recommendation above; owner confirms.
2. Single strategy for all images, or split by role (LCP cover vs.
   lazy-loaded body/gallery)?
3. Should LQIP placeholders continue working under Path A's `unoptimized`
   path? (Yes — `placeholder="blur"` works on `unoptimized` images.)

## Caution carried over from CMS-IBI review

**Avoid accidental double optimization.** A common footgun is leaving
`next/image` enabled while also adding Sanity CDN transforms — Vercel then
downloads a pre-transformed asset, re-transforms it, and serves it. Both
encodes cost time and add subtle quality loss. Pick one CDN per image source
and stick to it.
