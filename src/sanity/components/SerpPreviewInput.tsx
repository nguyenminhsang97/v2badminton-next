import { useFormValue } from "sanity";
import type { StringInputProps } from "sanity";

/**
 * SerpPreviewInput — custom Sanity Studio input for SEO title fields.
 *
 * Wraps the default string input with a live Google search-result preview that
 * shows how the page will appear in SERPs:
 *   1. Breadcrumb (v2badminton.com › slug)
 *   2. Blue title line (truncates around ~60 chars in real Google)
 *   3. Grey description (truncates around 155–160 chars)
 *   4. Character-count overage warnings
 *
 * Wired via `components: { input: SerpPreviewInput }` on the SEO/meta title
 * field of: content_article, content_hub, content_node, money_page, static_page.
 *
 * Self-adapts to the document type — reads `seoDescription` OR `metaDescription`
 * via useFormValue (whichever the document uses), and derives the public URL
 * from `fullPath.current` (hub/node/article) OR `slug.current` (money/static).
 */

type DocumentShape = {
  _type?: string;
  slug?: { current?: string };
  fullPath?: { current?: string };
  seoDescription?: string;
  metaDescription?: string;
};

const TITLE_SOFT_LIMIT = 60;
const DESCRIPTION_SOFT_LIMIT = 160;

function derivePath(doc: DocumentShape | null): string {
  if (!doc) return "/";
  const fullPath = doc.fullPath?.current?.trim();
  if (fullPath) return fullPath.startsWith("/") ? fullPath : `/${fullPath}`;
  const slug = doc.slug?.current?.trim();
  if (slug) return `/${slug}/`;
  return "/";
}

function deriveDescription(doc: DocumentShape | null): string {
  if (!doc) return "";
  return (doc.seoDescription ?? doc.metaDescription ?? "").trim();
}

function breadcrumbFromPath(path: string): string {
  const trimmed = path.replace(/^\/+|\/+$/g, "");
  if (!trimmed) return "v2badminton.com";
  const parts = trimmed.split("/").filter(Boolean);
  return `v2badminton.com › ${parts.join(" › ")}`;
}

export function SerpPreviewInput(props: StringInputProps) {
  const doc = useFormValue([]) as DocumentShape | null;

  const title = (props.value ?? "").trim();
  const description = deriveDescription(doc);
  const path = derivePath(doc);
  const breadcrumb = breadcrumbFromPath(path);

  const titleOver = title.length > TITLE_SOFT_LIMIT;
  const descOver = description.length > DESCRIPTION_SOFT_LIMIT;

  return (
    <div>
      {/* SERP preview card */}
      <div
        style={{
          border: "1px solid var(--card-border-color, #d9d9d9)",
          borderRadius: "8px",
          padding: "12px 14px",
          background: "#ffffff",
          marginBottom: "10px",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            fontSize: "12px",
            color: "#5f6368",
            marginBottom: "2px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {breadcrumb}
        </div>
        <div
          style={{
            color: "#1a0dab",
            fontSize: "18px",
            fontWeight: 400,
            lineHeight: 1.3,
            marginBottom: "3px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 1,
            WebkitBoxOrient: "vertical",
          }}
        >
          {title || (
            <span style={{ color: "#9aa0a6", fontStyle: "italic" }}>
              (chưa đặt tiêu đề SEO)
            </span>
          )}
        </div>
        <div
          style={{
            fontSize: "13px",
            color: "#4d5156",
            lineHeight: 1.4,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {description || (
            <span style={{ color: "#9aa0a6", fontStyle: "italic" }}>
              (chưa có mô tả SEO)
            </span>
          )}
        </div>
      </div>

      {/* Character-count warnings */}
      <div
        style={{
          display: "flex",
          gap: "14px",
          fontSize: "12px",
          marginBottom: "6px",
          flexWrap: "wrap",
        }}
      >
        <span style={{ color: titleOver ? "#b45309" : "#888" }}>
          Tiêu đề: <b>{title.length}</b> / {TITLE_SOFT_LIMIT} ký tự
          {titleOver ? " — Google có thể cắt" : ""}
        </span>
        <span style={{ color: descOver ? "#b45309" : "#888" }}>
          Mô tả: <b>{description.length}</b> / {DESCRIPTION_SOFT_LIMIT} ký tự
          {descOver ? " — Google có thể cắt" : ""}
        </span>
      </div>

      {/* Default input below */}
      {props.renderDefault(props)}
    </div>
  );
}
