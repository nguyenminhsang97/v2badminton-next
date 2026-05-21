import { defineArrayMember, defineField } from "sanity";
import { slugifyValue } from "./shared";

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
export function defineFullPathField(options?: { warnDepth?: boolean }) {
  return defineField({
    name: "fullPath",
    title: "Đường dẫn đầy đủ (URL)",
    type: "slug",
    description:
      "Tự động tạo từ slug và nhánh cha. Bấm Generate SAU KHI đã đặt slug và chọn nhánh cha. Không sửa tay. Đây là URL thật của trang.",
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
