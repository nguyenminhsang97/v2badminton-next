/**
 * GROQ query for the "Bảng điều khiển" dashboard (Phase 2 PR 2).
 *
 * A single projection query that returns all four stat-tile counts + the
 * recently-updated list in one round-trip.  All sub-queries are read-only
 * (no mutations, no drafts write).
 *
 * ─── Draft semantics ─────────────────────────────────────────────────────────
 * Sanity has two overlapping "draft" concepts that must not be confused:
 *
 * 1. **Native Sanity draft** (`_id in path("drafts.**")`)
 *    Every unpublished edit creates a shadow document under "drafts.<id>".
 *    These are never shown publicly — they live alongside (or instead of) the
 *    published document.  This dashboard queries the *published* view by
 *    filtering them out with `!(_id in path("drafts.**"))`.
 *
 * 2. **Editorial status field** (`status: "draft" | "published"`)
 *    `content_article` and `post` have an explicit `status` field.  Even after
 *    a Sanity publish, the document's editorial status can be "draft" — meaning
 *    the editor has saved + published the document but hasn't toggled status to
 *    "published" yet (intentional staging workflow).  These ARE visible in the
 *    published dataset but are NOT publicly rendered by the site (the renderer
 *    filters `status == "published"`).
 *
 * Consequence for counts:
 *   - "Bản nháp" = content_article/post in published dataset with `status == "draft"`.
 *   - "Đã đăng" = content_article/post with `status == "published"` + all
 *     money_page/static_page/hub/node that exist in published dataset.
 *   - money_page, static_page, content_hub, content_node have no editorial
 *     status field; native Sanity publish is their only "live" gate.
 *
 * ─── SEO threshold ───────────────────────────────────────────────────────────
 * "Thiếu SEO" mirrors the existing readinessBadges:
 *   - money_page: missing `metaDescription` OR length < 50 chars
 *   - all others: missing `seoDescription` OR length < 50 chars
 *
 * ─── Cover image ─────────────────────────────────────────────────────────────
 * "Thiếu ảnh bìa" mirrors `missingCoverImageBadge`: content_article without a
 * `coverImage` field.  Soft hint only — cover images are optional (S8 deferred).
 */

export const DASHBOARD_API_VERSION = "2026-04-09";

/** Excludes native Sanity draft documents from query results. */
const PUBLISHED_ONLY = `!(_id in path("drafts.**"))`;

export const DASHBOARD_QUERY = `{
  // ── Bản nháp (editorial drafts) ─────────────────────────────────────────
  // content_article + post with explicit status == "draft" in the published
  // dataset.  Native Sanity draft twins (drafts.**) are excluded to avoid
  // double-counting.
  "draftCount": count(*[
    _type in ["content_article", "post"] &&
    ${PUBLISHED_ONLY} &&
    status == "draft"
  ]),

  // ── Đã đăng (live content) ───────────────────────────────────────────────
  // content_article/post marked published + all money_page, static_page,
  // indexed hub/node that exist in the published dataset.
  "publishedCount": count(*[
    (
      (_type in ["content_article", "post"] && status == "published") ||
      _type in ["money_page", "static_page"] ||
      (_type in ["content_hub", "content_node"] && isIndexed == true)
    ) &&
    ${PUBLISHED_ONLY}
  ]),

  // ── Thiếu SEO ────────────────────────────────────────────────────────────
  // Mirrors readinessBadges thresholds.
  // money_page uses metaDescription; everything else uses seoDescription.
  // Only counts published docs — draft docs with missing SEO are expected.
  "missingSeoCount": count(*[
    (
      (_type in ["content_article","content_hub","content_node","static_page"] &&
        (!defined(seoDescription) || length(seoDescription) < 50)) ||
      (_type == "money_page" &&
        (!defined(metaDescription) || length(metaDescription) < 50))
    ) &&
    ${PUBLISHED_ONLY}
  ]),

  // ── Thiếu ảnh bìa (missing article cover) ───────────────────────────────
  // Mirrors missingCoverImageBadge — soft hint only, not a blocker.
  "missingCoverCount": count(*[
    _type == "content_article" &&
    ${PUBLISHED_ONLY} &&
    !defined(coverImage)
  ]),

  // ── Mới cập nhật (recently updated, cross-type, top 8) ──────────────────
  // Excludes reference-data types (faq, coach, testimonial, etc.) because the
  // editor cares most about page-level content changes here.
  "recentlyUpdated": *[
    _type in [
      "content_article",
      "content_hub",
      "content_node",
      "money_page",
      "static_page",
      "post"
    ] &&
    ${PUBLISHED_ONLY}
  ] | order(_updatedAt desc) [0...8] {
    _id,
    _type,
    _updatedAt,
    "title": coalesce(title, h1, name, slug.current, "Untitled")
  }
}`;

// ─── TypeScript types ─────────────────────────────────────────────────────

export type DashboardRecentItem = {
  _id: string;
  _type: string;
  _updatedAt: string;
  title: string;
};

export type DashboardQueryResult = {
  draftCount: number;
  publishedCount: number;
  missingSeoCount: number;
  missingCoverCount: number;
  recentlyUpdated: DashboardRecentItem[];
};
