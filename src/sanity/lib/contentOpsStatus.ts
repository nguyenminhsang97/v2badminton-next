/**
 * Content-ops status derivation — Studio Phase 2, PR 4A.
 *
 * Pure functions only.  No React, no Sanity client imports.
 * Single source of truth for every display value in the content-ops table.
 *
 * Draft semantics:
 *   GROQ returns both the published document ({_id: "abc"}) and its native
 *   Sanity draft twin ({_id: "drafts.abc"}) when both exist.  groupRows()
 *   merges these into one logical row keyed by the canonical (non-drafts) ID.
 *
 * Status chip priority:
 *   1. published + draft twin → "Có thay đổi chưa đăng"
 *   2. draft only            → "Nháp"
 *   3. published, hub/node isIndexed==false → "Ẩn khỏi Google"
 *   4. published, article/post status=="draft" → "Nháp"  (editorial staging)
 *   5. otherwise             → "Đã đăng"
 *
 * Cover column:
 *   content_article → hasCover (coverImage field)
 *   money_page      → hasHero  (heroImage field)
 *   all others      → "Không áp dụng" (no image field on this type)
 */

/** Raw shape returned by CONTENT_OPS_QUERY — one Sanity document per entry. */
export type RawOpsRow = {
  /** Sanity _id — may start with "drafts." */
  _id: string;
  _type: string;
  _updatedAt: string;
  title: string;
  slug: string | null;
  fullPath: string | null;
  isIndexed: boolean | null;
  /** "draft" | "published" | null (only on content_article, post) */
  status: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  metaDescription: string | null;
  hasCover: boolean;
  hasHero: boolean;
};

export type StatusChip =
  | "Nháp"
  | "Đã đăng"
  | "Ẩn khỏi Google"
  | "Có thay đổi chưa đăng";

export type CoverStatus = "✓" | "—" | "Không áp dụng";

export type SeoStatus = "✓" | "⚠";

/** One logical row in the ops table (published + draft twin merged). */
export type ContentOpsRow = {
  /** Canonical document ID without "drafts." prefix. */
  baseId: string;
  _type: string;
  title: string;
  slug: string | null;
  fullPath: string | null;
  /** Most-recent _updatedAt across published and draft versions. */
  updatedAt: string;
  statusChip: StatusChip;
  seoStatus: SeoStatus;
  coverStatus: CoverStatus;
};

/**
 * Group raw GROQ rows by canonical ID and derive all display values.
 *
 * Expected inputs (per RawOpsRow._id):
 * | hasPublished | hasDraft | chip result                  |
 * |      ✓       |    ✓     | Có thay đổi chưa đăng        |
 * |      ✗       |    ✓     | Nháp                         |
 * |      ✓       |    ✗     | isIndexed==false → Ẩn khỏi Google |
 * |      ✓       |    ✗     | status=="draft" → Nháp       |
 * |      ✓       |    ✗     | otherwise       → Đã đăng    |
 */
export function groupRows(raw: RawOpsRow[]): ContentOpsRow[] {
  const grouped = new Map<string, { published?: RawOpsRow; draft?: RawOpsRow }>();

  for (const row of raw) {
    const isDraft = row._id.startsWith("drafts.");
    const baseId = isDraft ? row._id.slice("drafts.".length) : row._id;
    const entry = grouped.get(baseId) ?? {};
    if (isDraft) {
      if (!entry.draft || row._updatedAt > entry.draft._updatedAt) {
        entry.draft = row;
      }
    } else {
      entry.published = row;
    }
    grouped.set(baseId, entry);
  }

  const result: ContentOpsRow[] = [];

  for (const [baseId, { published, draft }] of grouped) {
    const canonical = published ?? draft!;

    const updatedAt =
      published && draft
        ? published._updatedAt > draft._updatedAt
          ? published._updatedAt
          : draft._updatedAt
        : canonical._updatedAt;

    result.push({
      baseId,
      _type: canonical._type,
      title: canonical.title,
      slug: canonical.slug,
      fullPath: canonical.fullPath,
      updatedAt,
      statusChip: deriveStatusChip({
        hasPublished: !!published,
        hasDraft: !!draft,
        editorialStatus: canonical.status,
        isIndexed: canonical.isIndexed,
        _type: canonical._type,
      }),
      seoStatus: deriveSeoStatus({
        _type: canonical._type,
        seoTitle: canonical.seoTitle,
        seoDescription: canonical.seoDescription,
        metaDescription: canonical.metaDescription,
      }),
      coverStatus: deriveCoverStatus({
        _type: canonical._type,
        hasCover: canonical.hasCover,
        hasHero: canonical.hasHero,
      }),
    });
  }

  return result;
}

function deriveStatusChip(args: {
  hasPublished: boolean;
  hasDraft: boolean;
  editorialStatus: string | null;
  isIndexed: boolean | null;
  _type: string;
}): StatusChip {
  const { hasPublished, hasDraft, editorialStatus, isIndexed, _type } = args;

  if (hasPublished && hasDraft) return "Có thay đổi chưa đăng";
  if (!hasPublished) return "Nháp";

  if (
    (_type === "content_hub" || _type === "content_node") &&
    isIndexed === false
  ) {
    return "Ẩn khỏi Google";
  }

  if (
    (_type === "content_article" || _type === "court" || _type === "post") &&
    editorialStatus === "draft"
  ) {
    return "Nháp";
  }

  return "Đã đăng";
}

function deriveSeoStatus(args: {
  _type: string;
  seoTitle: string | null;
  seoDescription: string | null;
  metaDescription: string | null;
}): SeoStatus {
  const { _type, seoTitle, seoDescription, metaDescription } = args;
  const desc = _type === "money_page" ? metaDescription : seoDescription;
  const hasTitle = !!(seoTitle?.trim());
  const hasDesc = !!(desc && desc.trim().length >= 50);
  return hasTitle && hasDesc ? "✓" : "⚠";
}

function deriveCoverStatus(args: {
  _type: string;
  hasCover: boolean;
  hasHero: boolean;
}): CoverStatus {
  const { _type, hasCover, hasHero } = args;
  if (_type === "content_article" || _type === "court") return hasCover ? "✓" : "—";
  if (_type === "money_page") return hasHero ? "✓" : "—";
  return "Không áp dụng";
}

/** Build the Sanity Studio document-edit intent URL for a canonical doc ID. */
export function buildEditIntent(baseId: string, type: string): string {
  return `/studio/intent/edit/id=${baseId};type=${type}`;
}

/**
 * Resolve the published-route path from a ContentOpsRow.
 * Returns null when the required slug/fullPath field is absent.
 * Mirrors resolvePath() from src/sanity/lib/resolvePath.ts but works on the
 * flat strings stored in ContentOpsRow (not the nested {current:string} objects).
 */
export function resolveOpsPath(row: ContentOpsRow): string | null {
  const { _type, slug, fullPath } = row;

  switch (_type) {
    case "content_hub":
    case "content_node":
    case "content_article":
    case "court": {
      if (!fullPath) return null;
      const p = fullPath.startsWith("/") ? fullPath : `/${fullPath}`;
      return p.endsWith("/") ? p : `${p}/`;
    }
    case "money_page":
    case "static_page":
      return slug ? `/${slug}/` : null;
    case "post":
      return slug ? `/blog/${slug}/` : null;
    default:
      return null;
  }
}
