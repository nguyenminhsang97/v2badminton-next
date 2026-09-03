# CMS Migration Handoff Brief

> **Document type:** Handoff brief — decisions and pointers only. This is NOT the CMS migration plan. It does not contain implementation code, GROQ queries, or Sanity Studio configuration. Those belong in a separate CMS migration plan written by the migration team.
>
> **Produced by:** Week 4 (W4.1) of the [Unified SEO + AEO 30-Day Plan](./seo-aeo-30-day-unified-plan.md)
>
> **Approved source for blog strategy:** [Blog Route + Content Taxonomy Decision Memo](./blog-route-taxonomy-decision-memo.md) — all blog architecture decisions live there and are summarised here by reference.

---

## 1. Purpose and Scope

The CMS migration must deliver a new blog architecture (route structure, Sanity schema, editorial workflow) so that the post-CMS blog launch can proceed cleanly. It must do this **without undoing any of the Weeks 1–3 service-page, schema, or About-page work** from the 30-day SEO + AEO plan.

**What the CMS migration must deliver:**

- New Next.js route `src/app/(site)/blog/[category]/[slug]/page.tsx` at `/blog/<category>/<slug>/`
- New Sanity schema fields on the `post` document type (listed in §3)
- Category enum replacement: four old values → five new Vietnamese slug-based categories
- New static page `src/app/(site)/chinh-sach-danh-gia/page.tsx` at `/chinh-sach-danh-gia/`
- Legacy URL redirect strategy (decided by Q13 result in §4)

**What it does NOT cover:**

- Rewriting or modifying any Weeks 1–3 changes (hero, schema, money pages, About page, sitemap gate, noindex fallbacks, Vercel proxy, coach Person schema)
- Publishing blog posts — that happens after migration is complete (see §12 of the blog memo)
- Coach detail pages (`/huan-luyen-vien/<slug>/`) — deferred until ≥6 coaches with full bios

---

## 2. Decisions Already Made

All decisions below are final. The migration plan implements them; it does not re-derive them.

### Route structure

**Decision: `/blog/<category>/<slug>/`** (Option B from [memo §3](./blog-route-taxonomy-decision-memo.md)).

Vietnamese unaccented slugs, trailing slash enforced by `next.config.ts`. Rationale and trade-offs analysed in full in [memo §3–§4](./blog-route-taxonomy-decision-memo.md).

### Five-category taxonomy

**Decision:** Five intent-based categories, all with Vietnamese unaccented slugs. See [memo §5](./blog-route-taxonomy-decision-memo.md) for full definitions, indexing thresholds, launch timing, and per-category scope rules.

| Slug | Label | Primary intent |
|---|---|---|
| `nguoi-moi` | Người mới bắt đầu | Prospective students |
| `ky-thuat` | Kỹ thuật & luyện tập | Active students improving skills |
| `thiet-bi` | Vợt, giày & thiết bị | Equipment buyers |
| `san-tap` | Sân tập của V2 | Local search + court info |
| `tin-v2` | Tin tức & sự kiện V2 | Trust building, recency |

`tin-v2` launch is **explicitly delayed** — no posts until ≥2 posts/month sustained for 6+ months is real ([memo §5.5](./blog-route-taxonomy-decision-memo.md)).

### Category archive indexing

All archives stay `noindex` until three conditions are all met: ≥5 published posts, unique intro paragraph ≥80 words, and ≥1 post/month cadence sustained for 3+ months. `san-tap` threshold is ≥4 posts. Full rules at [memo §10](./blog-route-taxonomy-decision-memo.md).

### Controlled tag vocabulary (~30 tags, 8 axes)

Tags are CMS-internal only — no public tag URLs. New tags require business-owner approval. Launch vocabulary across 8 axes (`skill-level`, `body-focus`, `technique`, `equipment-type`, `equipment-brand`, `topic-modifier`, `location`, `audience`) fully defined at [memo §11.2](./blog-route-taxonomy-decision-memo.md).

### Affiliate disclosure model

Affiliate, sponsored, and gifted-product posts require a mandatory above-the-fold disclosure block and a link to `/chinh-sach-danh-gia/`. Auto-rendered based on `disclosureType` field — not optional. Disclosure block templates at [memo §6.3](./blog-route-taxonomy-decision-memo.md). Legal/compliance review recommended before the first affiliate or sponsored post goes live.

### AggregateRating disabled by default

`AggregateRating` is excluded from the `schemaTypes` enum in Sanity. It must not be added until reviews are real, visible, and verifiable on a third-party platform. See [memo §11.6](./blog-route-taxonomy-decision-memo.md).

### Competitor content policy

No competitor court reviews, no competitor center comparisons, no competitor coach mentions. Applies to all blog templates without exception. [memo §1, §5.4, §6.2, §6.4, §6.8](./blog-route-taxonomy-decision-memo.md).

### Editorial review workflow

Every post requires sign-off from the business owner or a qualified coach (coach mandatory for technique tutorials, equipment reviews, court reviews) before publish. `reviewedBy` is a hard publish gate — no bypass. [memo §7](./blog-route-taxonomy-decision-memo.md).

### Migration mapping for old category enum

The existing `SanityPostCategory` enum (`tips | how-to | beginner | campaign`) has no external dependencies (confirmed: referenced in 5 internal files only). Replace during migration:

| Old | New |
|---|---|
| `tips` | `ky-thuat` (technique tips) or `thiet-bi` (equipment tips) — per-draft decision |
| `how-to` | `ky-thuat` |
| `beginner` | `nguoi-moi` |
| `campaign` | `tin-v2` |

Drop old enum values after migration is complete.

---

## 3. Required CMS Deliverables

These are the **what**, not the **how**. The migration plan writes the implementation.

### 3a. New Sanity fields on `post` document

Full field specifications at [memo §11](./blog-route-taxonomy-decision-memo.md). Summary for the migration plan author:

**Core identification fields** — `title`, `slug` (regex `^[a-z0-9-]+$`), `primaryCategory` (new enum), `secondaryTags` (array of tag document references).

**Editorial metadata** — `excerpt` (max 200 chars), `publishedAt`, `updatedAt` (auto), `lastReviewedAt` (manual), `status` (`draft | published | unlisted | archived`), `author` (coach ref), `reviewedBy` (coach or owner ref, hard publish gate), `reviewedAt` (auto-set).

**SEO fields** — `metaTitle`, `metaDescription` (max 160 chars), `canonicalUrl`, `noIndex`, `ogImage`.

**AEO fields** — `quickAnswer` (40–100 words, required before publish for `nguoi-moi`, `ky-thuat`, `thiet-bi`), `targetQuestion`, `faqs` (array of `{ question, answer, includeInSchema }`).

**Schema fields** — `schemaTypes` (allowed: `Article`, `HowTo`, `Product`, `Review`, `Event`; `AggregateRating` explicitly excluded). Conditional fields: `productRef`, `reviewRating`, `eventDetails`.

**Affiliate/disclosure fields** — `disclosureType` (`none | affiliate | sponsored | gifted_product`, required on every `thiet-bi` post), `affiliateLinks`, `sponsoredStatus`, `reviewPolicy` (reference to `/chinh-sach-danh-gia/` singleton), `productProvidedFreeBy`. Full field shapes at [memo §11.7](./blog-route-taxonomy-decision-memo.md).

**Relationship fields** — `relatedServices` (≥1 required for `nguoi-moi`, `ky-thuat`, `thiet-bi`), `relatedLocations`, `relatedCoaches`, `relatedProducts`, `featuredImage` (with `alt`, required), `inlineImages`.

**Migration support fields** — `legacyFlatSlug` (for legacy URL preservation if Q13 shows existing posts), `redirectsFrom`.

### 3b. Tag document type

New Sanity document type `tag` with fields `name`, `slug`, `axis`, `description`. Posts reference tags via array. Seed the ~30 launch tags from [memo §11.2](./blog-route-taxonomy-decision-memo.md) at migration time.

### 3c. New `/chinh-sach-danh-gia/` static page

A review policy page that:
- Lives at `src/app/(site)/chinh-sach-danh-gia/page.tsx` — **top-level URL, not under `/blog/`** (prevents route collision with `/blog/[category]/[slug]/` pattern)
- Explains V2's editorial standards, affiliate disclosure practices, and conflict-of-interest policy
- Added to the sitemap as a static legal route
- Linked from every disclosure block in equipment and sponsored posts

### 3d. Next.js route file restructure

| Action | Details |
|---|---|
| Add | `src/app/(site)/blog/[category]/[slug]/page.tsx` |
| Add | `src/app/(site)/blog/[category]/page.tsx` (category archive, starts as `noindex`) |
| Decision on existing `src/app/(site)/blog/[slug]/page.tsx` | Depends on Q13 (§4). If zero existing posts: retire at cutover. If existing posts: keep temporarily with per-URL redirect logic until all redirects confirmed. |
| Sitemap | Update `src/app/sitemap.ts` blog URL construction from `` /blog/${post.slug}/ `` to `` /blog/${post.primaryCategory}/${post.slug}/ `` |

### 3e. Legacy URL redirect rule (Next.js 16 Proxy)

The file `src/proxy.ts` already exists (added in W1.4 of the 30-day plan) handling the Vercel alias redirect. **Do not overwrite it** — add the legacy blog redirect rule inside the existing `proxy` function. Next.js 16 uses `src/proxy.ts` + `export function proxy` (not `middleware.ts`). Pattern: 308 from `/blog/<old-slug>/` → `/blog/<new-category>/<new-slug>/`. Only needed if Q13 (§4) shows existing published posts.

---

## 4. Pre-Cutover Hard Gate — Q13: Production Sanity Blog Post Check

**This is a blocker. The CMS migration cannot ship the new route until this check is complete.**

Open Sanity Studio Vision and run:

```groq
*[_type == "post" && status == "published"]{ "slug": slug.current, publishedAt }
```

Capture all results in the table below before starting migration implementation.

| slug | publishedAt | GSC 28-day impressions | Decision |
|---|---|---|---|
| *(fill in at migration kickoff)* | | | |

**If the query returns zero results:** clean cutover is safe. Retire `src/app/(site)/blog/[slug]/page.tsx` at migration time. No legacy redirect rules needed.

**If the query returns non-zero results:** for each post, check 28-day impressions in Google Search Console. Default action for every post regardless of traffic: 308 redirect from old `/blog/<old-slug>/` to new `/blog/<new-category>/<new-slug>/` in `src/proxy.ts`. Use 410 (Gone) only for posts being intentionally deleted with no replacement content. See [memo §4](./blog-route-taxonomy-decision-memo.md) for full rationale on redirecting even zero-traffic posts.

**Note:** the repo inspection in May 2026 found zero blog posts checked in to the repository. The production Sanity dataset may differ — this must be verified independently against the live Sanity instance.

---

## 5. What the CMS Migration Plan Must Additionally Produce

The following items are **not deliverables of this brief** — they are explicitly out of scope here and belong in the migration plan itself.

- Full GROQ queries for the new post shape and category archive queries
- Sanity Studio schema definitions (all new `post` fields and the `tag` document type)
- Sanity Studio dropdown/select configs for `primaryCategory`, `schemaTypes`, `disclosureType`, `axis`
- Studio editor UX for the affiliate disclosure block (ideally auto-populated from `disclosureType` selection)
- `reviewedBy` + `reviewedAt` workflow automation in Studio
- Route handler implementations for `blog/[category]/[slug]/page.tsx` and `blog/[category]/page.tsx`
- Redirect Proxy code additions to `src/proxy.ts` (if Q13 shows existing posts)
- Validation rule implementations from [memo §11.10](./blog-route-taxonomy-decision-memo.md)
- Seed data scripts for the ~30 controlled tag vocabulary entries
- Migration script for existing draft posts: old category enum → new `primaryCategory` value
- Test plan: schema validation, redirect verification, sitemap audit, GSC re-submission after cutover

---

## 6. Open Questions for the CMS Migration Team

| # | Question | Why it matters |
|---|---|---|
| Q13 | **Production Sanity blog post count** — run the GROQ query in §4 and fill the table before migration kickoff | Determines clean-cutover vs. legacy redirect path |
| Q14 | Which Sanity user/role will own the `reviewedBy` publish gate workflow? | Needed for Studio workflow config |
| Q15 | Will the affiliate disclosure block be enforced in Studio UI, or at the Next.js render layer? | Affects implementation approach — Studio validation vs. component guard |
| Q16 | Is there a timeline commitment for `tin-v2` launch cadence? | Without ≥2 posts/month for 6+ months, `tin-v2` archives stay permanently `noindex` |
| Q17 | Will the `/chinh-sach-danh-gia/` review policy page require legal review before going live? | Equipment/affiliate posts link to it — it must be published before any `thiet-bi` post launches |
| Q18 | `/huan-luyen-vien/<slug>/` detail pages — target date? | Not in this migration scope, but coach bios from W3.3 (once published) feed this route |

---

*End of brief. The CMS migration plan should open with a reference to this document and confirm Q13 is resolved before any implementation begins.*
