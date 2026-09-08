# Blog vs Content Platform Addendum

Status: **APPROVED by the owner, 2026-09-08.** Implemented the same day; see
"Decision record" at the foot of this document for what shipped and why the
timing mattered.

This addendum exists because the approved blog taxonomy memo was written before
the content platform shipped. The newer content platform now owns stronger SEO
machinery for evergreen content: hierarchical `fullPath` URLs, hub/node/article
structure, court documents, E-E-A-T fields, related money-page edges, and
per-document indexing controls.

## Decision

Use the content platform as the single home for evergreen informational, local,
equipment, and decision-support content.

Keep the `post`/blog system only for time-stamped V2 news, announcements,
campaign updates, event recaps, and similar recency content.

Do not implement the old `/blog/<category>/<slug>/` evergreen plan unless this
addendum is explicitly rejected.

## Category Mapping

| Old blog category from memo | New home |
|---|---|
| `nguoi-moi` | Content-platform articles under the most relevant beginner or service-support hub. |
| `ky-thuat` | Content-platform articles under the existing `ky-thuat-cau-long` hub. |
| `thiet-bi` | Future equipment hub plus typed product/review content. |
| `san-tap` | `court` documents, courts hub pages, and supporting content-platform articles. |
| `tin-v2` | Blog `post` documents under `/blog/`, because these are chronological news items. |

## Blog Route Policy

- ~~Keep `/blog/` as the news feed while the public route already exists.~~
  **Superseded 2026-09-08: the feed is `/tin-tuc/`, with `/blog/:slug*`
  permanently redirecting to it. See the decision record below.**
- Keep individual news posts on the simplest stable route the current code
  supports unless a separate approved ticket changes it.
- Do not add category archives for evergreen categories.
- Keep `/blog/` and blog post indexing gated by real published content and
  cadence. Empty or thin news archives should stay out of the index.
- If the owner wants `/tin-tuc/` instead of `/blog/`, decide before launch.
  After indexing, this becomes a redirect project and should not be renamed for
  preference alone.

## Handoff Changes

Treat these older handoff deliverables as superseded:

- New route `src/app/(site)/blog/[category]/[slug]/page.tsx`
- Public blog category archive routes
- Five-category blog taxonomy as a publishing destination
- Blog ownership of court, technique, beginner, and equipment evergreen content

Keep these parts of the original memo:

- No competitor-comparison content
- Redirect hygiene for any published URL move
- Archive indexing thresholds
- Affiliate/sponsored disclosure rules for any future equipment content
- Editorial review requirements
- No `AggregateRating` unless reviews are real, visible, and verifiable

## Pre-Launch Gate

Before any blog route change, run the production Sanity check:

```groq
*[_type == "post" && status == "published"]{
  "slug": slug.current,
  publishedAt,
  title
}
```

If published posts exist, record their current URLs and create redirects before
any route migration. If there are no published posts, keep the route surface
small and launch blog only when a real news cadence exists.

## Approval Checklist

- [x] Owner confirms blog is news-only. *(2026-09-08)*
- [x] Owner confirms evergreen content belongs in content-platform docs. *(2026-09-08)*
- [x] Owner confirms whether the public news feed remains `/blog/` or moves to
      `/tin-tuc/` before launch. **→ `/tin-tuc/`, shipped 2026-09-08.**
- [ ] CMS handoff brief is updated after approval to remove superseded blog
      migration deliverables. *(still open — separate pass)*

---

## Decision record — 2026-09-08

**The feed moved to `/tin-tuc/`. The window to do it for free was open, and it
is now closed.**

### Why it was free on this date

Verified against live production before touching anything:

| Check | Result |
|---|---|
| `/blog/` HTTP status | 200 |
| `robots` meta | **`noindex, follow`** |
| Published posts | **0** — `blog/page.tsx` sets `noindex` when the list is empty |
| `/blog/` in `sitemap.xml` | **absent** |

Nothing was indexed, so there was no ranking, no backlink and no redirect
project at stake. This document's own pre-launch gate — *"If published posts
exist, record their current URLs and create redirects before any route
migration"* — did not trigger, because the precondition was not met.

The owner confirmed the intent to publish news regularly. That is what made the
decision urgent rather than optional: the same rename after the first post is
indexed becomes a redirect project with real risk.

### Why `/tin-tuc/` and not `/blog/`

Two reasons, neither of them a ranking claim — URL wording is a very weak
signal and nobody should expect traffic from this change:

1. **The name now matches the content.** This addendum narrowed the feed to
   time-stamped news; evergreen technique, beginner and court content moved to
   the content platform. "Blog" described a format the feed no longer has.
2. **`/blog/` was the only English segment on an all-Vietnamese site** —
   `/hoc-cau-long-cho-nguoi-moi/`, `/lop-cau-long-tre-em/`,
   `/gia-hoc-cau-long-tphcm/`, `/huan-luyen-vien/`, `/gioi-thieu/`.

### What shipped

- Route `(site)/blog/` → `(site)/tin-tuc/` (`git mv`, history preserved).
- Every `/blog/` URL updated: `sitemap.ts`, `Nav`, `Footer`, `routes.ts`,
  `contentOpsStatus.ts`, both page files, and the SEO regression test.
- **`/blog/:slug*` → `/tin-tuc/:slug*` permanent redirect** in
  `next.config.ts`'s `FILE_ROUTE_REDIRECTS`. Not for search engines — there is
  nothing indexed — but for links shared before the rename.
- `/blog/` **stays** in `FILE_ROUTED_PATHS` and `CODE_RESERVED_PREFIXES`, and
  `/tin-tuc/` is added to both. A redirect source is resolved before the content
  catch-all just as a page is, so CMS content placed at `/blog/` would be
  equally unreachable.
- Visible copy: nav/footer label "Blog" → "Tin tức"; page title, H1, meta and
  OG/Twitter descriptions rewritten from "Tips cầu lông, hướng dẫn kỹ thuật và
  cẩm nang…" to news wording. **The old copy promised exactly the evergreen
  content this addendum moved away**, so renaming without it would have shipped
  a page that contradicted itself.

### Left for the owner

The new Vietnamese copy is deliberately plain — "Thông báo, cập nhật chương
trình và tin hoạt động của V2 Badminton tại TP.HCM." It is accurate but it is
not brand voice. Adjust the wording freely; the routing decision does not
depend on it.
