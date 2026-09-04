# Blog vs Content Platform Addendum

Status: draft decision for owner approval.

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

- Keep `/blog/` as the news feed while the public route already exists.
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

- [ ] Owner confirms blog is news-only.
- [ ] Owner confirms evergreen content belongs in content-platform docs.
- [ ] Owner confirms whether the public news feed remains `/blog/` or moves to
      `/tin-tuc/` before launch.
- [ ] CMS handoff brief is updated after approval to remove superseded blog
      migration deliverables.
