import { defineArrayMember, defineField } from "sanity";
import { slugifyValue } from "./shared";
import { FullPathPreviewInput } from "../components/FullPathPreviewInput";

/**
 * Phase 1 content-platform shared building blocks.
 *
 * Locked spec: .claude/CMS/v2badminton-cms-phase-1-locked-spec.md
 * - Route resolution is by exact normalized `fullPath` lookup (Decision 2).
 * - `fullPath` is a derived slug field generated from the parent chain + own slug;
 *   global uniqueness is enforced at validation time across all routable docs.
 * - No separate editor-facing route_registry document in Phase 1.
 */

export const SANITY_VALIDATION_API_VERSION = "2026-04-09";

/** Routable document types whose paths must be globally unique. */
export const ROUTABLE_TYPES = [
  "content_hub",
  "content_node",
  "content_article",
  "court",
] as const;

// File-routed pages are matched before the content catch-all. A CMS fullPath or
// route_redirect source on these paths would never behave as editors expect.
export const FILE_ROUTED_PATHS = [
  "/",
  "/blog/",
  "/cau-long-doanh-nghiep/",
  "/chinh-sach-bao-mat/",
  "/chinh-sach-bien-tap/",
  "/gia-hoc-cau-long-tphcm/",
  "/gioi-thieu/",
  "/hoc-cau-long-1-kem-1/",
  "/hoc-cau-long-cho-nguoi-moi/",
  "/huan-luyen-vien/",
  "/lop-cau-long-binh-thanh/",
  "/lop-cau-long-buoi-toi/",
  "/lop-cau-long-cho-nguoi-di-lam/",
  "/lop-cau-long-cuoi-tuan/",
  "/lop-cau-long-thu-duc/",
  "/lop-cau-long-tre-em/",
  "/lop-he-cau-long-tphcm/",
  "/team-building-cau-long/",
] as const;

const CODE_RESERVED_PREFIXES = [
  "/api/",
  "/blog/",
  "/dich-vu/",
  "/khuyen-mai/",
  "/san-pham/",
  "/studio/",
] as const;

export const CONTENT_STATUS_OPTIONS = [
  { title: "Nháp", value: "draft" },
  { title: "Đã đăng", value: "published" },
] as const;

/**
 * Phase 1 content formats only. `product_review`, `news`, `video` are added at
 * their owning milestone (Decision 3) as non-breaking enum additions.
 */
export const CONTENT_FORMAT_OPTIONS = [
  { title: "Hướng dẫn (guide)", value: "guide" },
  { title: "Cách làm từng bước (how-to)", value: "how_to" },
  { title: "Giải thích (explainer)", value: "explainer" },
] as const;

/** Shared portable-text block, mirrors the moneyPage/post body convention. */
export const contentBodyBlock = defineArrayMember({
  type: "block",
  styles: [
    { title: "Normal", value: "normal" },
    { title: "H2", value: "h2" },
    { title: "H3", value: "h3" },
  ],
  lists: [
    { title: "Bullet", value: "bullet" },
    { title: "Numbered", value: "number" },
  ],
  marks: {
    decorators: [
      { title: "Strong", value: "strong" },
      { title: "Emphasis", value: "em" },
    ],
    annotations: [
      {
        name: "link",
        title: "Link",
        type: "object",
        fields: [
          defineField({
            name: "href",
            title: "URL",
            type: "url",
            validation: (Rule) =>
              Rule.required().uri({ scheme: ["http", "https", "mailto", "tel"] }),
          }),
        ],
      },
    ],
  },
});

/**
 * Inline body image — used ONLY by `content_article.body`. Not added to court
 * `reviewSummary` or hub/node `intro` (those keep `of: [contentBodyBlock]`).
 *
 * Stored `_type` is "bodyImage" (the array-member name), not "image". Keep the
 * GROQ conditional projection, TS discriminator, and PortableText renderer key
 * all aligned to "bodyImage".
 *
 * Async validation surfaces non-blocking warnings about image dimensions and
 * file size (see thresholds below) so editors can deliberately override for a
 * small diagram or long banner. Pattern mirrors `findPathConflict` —
 * `getClient({ apiVersion }).fetch(...)` for asset metadata.
 */
export const ARTICLE_BODY_IMAGE_SIZES = [
  { title: "Trong cột (mặc định)", value: "inline" },
  { title: "Rộng", value: "wide" },
  { title: "Toàn khung", value: "full" },
] as const;

const BODY_IMAGE_MIN_WIDTH_PX = 1440;
const BODY_IMAGE_MAX_BYTES = 800 * 1024;
const BODY_IMAGE_ASPECT_MIN = 0.4;
const BODY_IMAGE_ASPECT_MAX = 3.0;

type BodyImageAssetMetadata = {
  width?: number | null;
  height?: number | null;
  size?: number | null;
};

export const contentBodyImage = defineArrayMember({
  name: "bodyImage",
  type: "image",
  title: "Ảnh chèn vào nội dung",
  options: { hotspot: true },
  fields: [
    defineField({
      name: "alt",
      title: "Mô tả ảnh (alt)",
      type: "string",
      description:
        "Bắt buộc cho SEO và trợ năng. Mô tả nội dung ảnh trong ngữ cảnh bài viết.",
      validation: (Rule) => Rule.required().min(3),
    }),
    defineField({
      name: "caption",
      title: "Chú thích (tuỳ chọn)",
      type: "string",
      description: "Tối đa 140 ký tự. Hiển thị dưới ảnh.",
      validation: (Rule) => Rule.max(140),
    }),
    defineField({
      name: "size",
      title: "Kích thước hiển thị",
      type: "string",
      initialValue: "inline",
      description:
        "Trong cột = nằm gọn trong cột chữ. Rộng = lớn hơn cột chữ. Toàn khung = chiếm hết bề ngang khung bài.",
      options: { list: [...ARTICLE_BODY_IMAGE_SIZES], layout: "radio" },
      validation: (Rule) => Rule.required(),
    }),
  ],
  validation: (Rule) =>
    Rule.custom(async (value, context) => {
      const ref = (value as { asset?: { _ref?: string } } | undefined)?.asset
        ?._ref;
      if (!ref) return true;
      const client = (
        context as unknown as RouteValidationContext
      ).getClient({ apiVersion: SANITY_VALIDATION_API_VERSION });
      const meta = await client.fetch<BodyImageAssetMetadata | null>(
        `*[_id == $id][0]{
          "width": metadata.dimensions.width,
          "height": metadata.dimensions.height,
          size
        }`,
        { id: ref },
      );
      const warnings: string[] = [];
      const w = meta?.width ?? null;
      const h = meta?.height ?? null;
      if (w !== null && w < BODY_IMAGE_MIN_WIDTH_PX) {
        warnings.push(
          `Ảnh chỉ rộng ${w}px — nên ≥ ${BODY_IMAGE_MIN_WIDTH_PX}px để rõ trên màn hình retina.`,
        );
      }
      if (meta?.size && meta.size > BODY_IMAGE_MAX_BYTES) {
        warnings.push(
          `File ảnh ${(meta.size / 1024).toFixed(0)} KB — nên nén xuống ≤ ${
            BODY_IMAGE_MAX_BYTES / 1024
          } KB trước khi upload.`,
        );
      }
      if (w !== null && h !== null && h > 0) {
        const ratio = w / h;
        if (ratio < BODY_IMAGE_ASPECT_MIN || ratio > BODY_IMAGE_ASPECT_MAX) {
          warnings.push(
            `Tỉ lệ ảnh ${ratio.toFixed(2)} hơi bất thường — kiểm tra lại ảnh có bị cắt nhầm không.`,
          );
        }
      }
      return warnings.length === 0 ? true : warnings.join(" ");
    }).warning(),
  preview: {
    select: {
      alt: "alt",
      caption: "caption",
      size: "size",
      media: "asset",
    },
    prepare({ alt, caption, size, media }) {
      const sizeLabel =
        size === "wide"
          ? "Rộng"
          : size === "full"
            ? "Toàn khung"
            : "Trong cột";
      return {
        title: (alt as string) || "(thiếu alt)",
        subtitle: `${sizeLabel}${caption ? ` · ${caption}` : ""}`,
        media,
      };
    },
  },
});

/** Normalize any path to a single leading + trailing slash, lowercased. */
export function normalizePath(input: string): string {
  const trimmed = (input ?? "").trim().toLowerCase().replace(/^\/+|\/+$/g, "");
  return trimmed ? `/${trimmed}/` : "/";
}

type SlugValue = { current?: string };

type RouteDocument = {
  _id?: string;
  slug?: SlugValue;
  parentHub?: { _ref?: string };
  parentNode?: { _ref?: string };
};

type SanityFetchClient = {
  fetch: <T>(query: string, params?: Record<string, unknown>) => Promise<T>;
};

type RouteValidationContext = {
  document?: RouteDocument;
  getClient: (options: { apiVersion: string }) => SanityFetchClient;
};

/**
 * Build a routable document's full path by composing the parent's already-built
 * `fullPath` with this document's own slug segment. Hubs have no parent, so
 * their full path is just `/{slug}/`.
 */
export async function slugifyFullPath(
  input: string,
  _schemaType: unknown,
  context: RouteValidationContext,
): Promise<string> {
  const document = context.document;
  const ownSegment = slugifyValue(document?.slug?.current ?? input ?? "");

  const parentNodeRef = document?.parentNode?._ref;
  const parentHubRef = document?.parentHub?._ref;
  const parentRef = parentNodeRef ?? parentHubRef;

  if (!parentRef) {
    // Hub (or any root-level routable doc): /{slug}/
    return normalizePath(ownSegment);
  }

  const client = context.getClient({
    apiVersion: SANITY_VALIDATION_API_VERSION,
  });
  const parent = await client.fetch<{ fullPath?: SlugValue } | null>(
    "*[_id in [$id, $draftId]][0]{fullPath}",
    { id: parentRef, draftId: `drafts.${parentRef}` },
  );

  const base = parent?.fullPath?.current ?? "/";
  return normalizePath(`${base}/${ownSegment}`);
}

/**
 * Global route-uniqueness check. A path may be owned by exactly one routable
 * document (hub/node/article) and must not collide with a redirect source.
 * This IS the Phase 1 "route uniqueness system" — no registry document needed.
 */
export async function findPathConflict(
  path: string,
  context: RouteValidationContext,
): Promise<string | true> {
  const normalized = normalizePath(path);
  if (
    FILE_ROUTED_PATHS.includes(
      normalized as (typeof FILE_ROUTED_PATHS)[number],
    )
  ) {
    return `Đường dẫn "${normalized}" đã thuộc về một file route trong code. Hãy dùng next.config.ts redirects nếu cần đổi URL này. Xem docs/cms/url-rename-runbook.md.`;
  }

  const reservedPrefix = CODE_RESERVED_PREFIXES.find(
    (prefix) => normalized.startsWith(prefix),
  );
  if (reservedPrefix) {
    return `Đường dẫn "${normalized}" nằm trong prefix code-reserved "${reservedPrefix}". CMS route_redirect không áp dụng ở đây; hãy dùng next.config.ts redirects nếu cần đổi URL này. Xem docs/cms/url-rename-runbook.md.`;
  }

  const rawId = context.document?._id?.replace(/^drafts\./, "") ?? "";
  const client = context.getClient({
    apiVersion: SANITY_VALIDATION_API_VERSION,
  });

  const conflictCount = await client.fetch<number>(
    `count(*[
      !(_id in [$id, $draftId]) && (
        (_type in $routableTypes && fullPath.current == $path) ||
        (_type == "route_redirect" && fromPath == $path)
      )
    ])`,
    {
      path: normalized,
      id: rawId,
      draftId: `drafts.${rawId}`,
      routableTypes: [...ROUTABLE_TYPES],
    },
  );

  return conflictCount === 0
    ? true
    : `Đường dẫn "${normalized}" đã được dùng bởi tài liệu khác. Mỗi URL chỉ thuộc về một trang.`;
}

/** Depth after the hub segment, used for the soft max-depth warning. */
export function pathDepthAfterHub(fullPath: string): number {
  const segments = normalizePath(fullPath).split("/").filter(Boolean);
  // segments = [hub, ...nodes, ownSlug]; depth after hub excludes the hub.
  return Math.max(segments.length - 1, 0);
}

/**
 * Shared `fullPath` field. Generated from slug + parent chain; required;
 * globally unique. Pass `warnDepth` for node/article to surface the
 * recommended max-depth-3 soft warning (schema still allows arbitrary depth).
 */
export function defineFullPathField(options?: {
  warnDepth?: boolean;
  group?: string;
}) {
  return defineField({
    name: "fullPath",
    title: "Đường dẫn đầy đủ (URL)",
    type: "slug",
    group: options?.group,
    description:
      "Tự động tạo từ slug và nhánh cha. Bấm Generate SAU KHI đã đặt slug và chọn nhánh cha. Không sửa tay. Đây là URL thật của trang.",
    components: { input: FullPathPreviewInput },
    options: {
      source: (document: unknown) =>
        (document as RouteDocument)?.slug?.current ?? "",
      slugify: slugifyFullPath,
    },
    validation: (Rule) => [
      Rule.required().custom(async (value, context) => {
        const current = (value as SlugValue | undefined)?.current;
        if (!current) {
          return "Bấm Generate để tạo đường dẫn từ slug và nhánh cha.";
        }
        return findPathConflict(
          current,
          context as unknown as RouteValidationContext,
        );
      }),
      Rule.custom((value) => {
        if (!options?.warnDepth) return true;
        const current = (value as SlugValue | undefined)?.current;
        if (!current) return true;
        return pathDepthAfterHub(current) > 3
          ? "URL khá sâu (hơn 3 cấp sau hub). Cân nhắc rút gọn trừ khi có lý do rõ ràng."
          : true;
      }).warning(),
    ],
  });
}
