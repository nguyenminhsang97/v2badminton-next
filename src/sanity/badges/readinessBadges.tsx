import type { DocumentBadgeComponent, SanityDocument } from "sanity";

/**
 * Readiness badges — small visual chips in document list views that flag
 * common "missing something" or "needs attention" states so editors don't
 * have to open each doc to know what's incomplete.
 *
 * Each badge returns a {label, color, title} descriptor or null. Badges are
 * presentational only — they NEVER block save/publish (Sanity's field-level
 * validation is the gate for that). Color palette follows Sanity's tones:
 * "danger" (red), "warning" (amber), "default" (grey).
 *
 * Wired per-schema via `components: { badges: [...] }`.
 */

type RoutableDoc = SanityDocument & {
  coverImage?: unknown;
  heroImage?: unknown;
  photo?: unknown;
  metaDescription?: string;
  seoDescription?: string;
  status?: string;
  isActive?: boolean;
};

function getDoc(props: {
  draft?: SanityDocument | null;
  published?: SanityDocument | null;
}): RoutableDoc | null {
  return (props.draft ?? props.published) as RoutableDoc | null;
}

// ─── content_article ─────────────────────────────────────────────────────

export const missingCoverImageBadge: DocumentBadgeComponent = (props) => {
  const doc = getDoc(props);
  if (!doc) return null;
  if (doc.coverImage) return null;
  // Cover image is OPTIONAL on content_article per the 2026-05-29 policy
  // (S8 deferred — see .claude/CMS/v2badminton-studio-ui-ux-roadmap.md).
  // This badge is a SOFT HINT, not a publish blocker: tooltip text intentionally
  // avoids "cần thêm" / "bắt buộc" so it does not contradict the policy.
  return {
    label: "Thiếu ảnh bìa",
    color: "warning",
    title:
      "Có thể thêm cover image để hiển thị đẹp hơn ở danh sách và làm OG image khi chia sẻ. Không bắt buộc.",
  };
};
missingCoverImageBadge.displayName = "MissingCoverImageBadge";

// ─── content_article + post ──────────────────────────────────────────────

export const draftStatusBadge: DocumentBadgeComponent = (props) => {
  const doc = getDoc(props);
  if (!doc) return null;
  if (doc.status !== "draft") return null;
  return {
    label: "Nháp",
    color: "primary",
    title: "Đang ở trạng thái draft — chưa hiển thị công khai.",
  };
};
draftStatusBadge.displayName = "DraftStatusBadge";

// ─── money_page ──────────────────────────────────────────────────────────

export const missingHeroImageBadge: DocumentBadgeComponent = (props) => {
  const doc = getDoc(props);
  if (!doc) return null;
  if (doc.heroImage) return null;
  return {
    label: "Thiếu ảnh tiêu đề",
    color: "warning",
    title:
      "Trang chưa có heroImage. Ảnh này hiển thị đầu trang và làm OG image khi chia sẻ.",
  };
};
missingHeroImageBadge.displayName = "MissingHeroImageBadge";

export const missingMetaDescriptionBadge: DocumentBadgeComponent = (props) => {
  const doc = getDoc(props);
  if (!doc) return null;
  const desc = (doc.metaDescription ?? "").trim();
  if (desc.length >= 50) return null;
  return {
    label: "Thiếu mô tả SEO",
    color: "danger",
    title: `metaDescription chỉ có ${desc.length} ký tự. Cần ít nhất 50 để hiển thị tốt trên Google.`,
  };
};
missingMetaDescriptionBadge.displayName = "MissingMetaDescriptionBadge";

// ─── coach ───────────────────────────────────────────────────────────────

export const missingCoachPhotoBadge: DocumentBadgeComponent = (props) => {
  const doc = getDoc(props);
  if (!doc) return null;
  if (doc.isActive === false) return null;
  if (doc.photo) return null;
  return {
    label: "Thiếu ảnh HLV",
    color: "warning",
    title: "HLV đang active nhưng chưa có ảnh.",
  };
};
missingCoachPhotoBadge.displayName = "MissingCoachPhotoBadge";
