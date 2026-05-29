import type { StructureBuilder, StructureResolver } from "sanity/structure";

export const singletonActions = new Set(["publish", "discardChanges", "restore"]);
export const singletonTypes = new Set(["site_settings", "homepage_content"]);

/**
 * Studio desk organized into 4 buckets:
 *   1. Cài đặt   — singletons (site config, homepage content)
 *   2. Trang     — routable docs (money page, static page, hub/node/article, post)
 *   3. Dữ liệu   — reference data used by Trang (FAQ, coach, testimonial, location, pricing, schedule, campaign)
 *   4. Đường dẫn — route plumbing (redirects)
 *
 * Each bucket lists the default per-type document lists first, then optional
 * curated filtered views (e.g. "Bài viết — Nháp", "FAQ — Nổi bật trên trang chủ").
 * Filtered views are pure GROQ filters — they don't create new doc types.
 *
 * Anything not in one of the four sets falls into "Khác" so a newly-added doc
 * type never silently disappears from the desk.
 */

const PAGE_TYPES = new Set([
  "money_page",
  "static_page",
  "content_hub",
  "content_node",
  "content_article",
  "post",
]);

const DATA_TYPES = new Set([
  "faq",
  "coach",
  "testimonial",
  "location",
  "pricing_tier",
  "schedule_block",
  "campaign",
]);

const ROUTE_TYPES = new Set(["route_redirect"]);

const KNOWN_BUCKETED_TYPES = new Set<string>([
  ...singletonTypes,
  ...PAGE_TYPES,
  ...DATA_TYPES,
  ...ROUTE_TYPES,
]);

function singletonListItem(
  S: StructureBuilder,
  schemaType: string,
  title: string,
) {
  return S.listItem()
    .id(schemaType)
    .title(title)
    .child(S.document().schemaType(schemaType).documentId(schemaType));
}

/**
 * Build a filtered document list for a given schema type.
 * Filter is a GROQ predicate appended to the type filter, e.g. `status=="draft"`.
 */
function filteredView(
  S: StructureBuilder,
  options: {
    id: string;
    title: string;
    schemaType: string;
    filter: string;
    params?: Record<string, unknown>;
  },
) {
  return S.listItem()
    .id(options.id)
    .title(options.title)
    .child(
      S.documentList()
        .id(options.id)
        .title(options.title)
        .schemaType(options.schemaType)
        .filter(`_type == $type && (${options.filter})`)
        .params({ type: options.schemaType, ...(options.params ?? {}) }),
    );
}

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      // ─── 1. Cài đặt ───────────────────────────────────────────
      S.listItem()
        .id("settings-group")
        .title("Cài đặt")
        .child(
          S.list()
            .title("Cài đặt")
            .items([
              singletonListItem(S, "site_settings", "Cài đặt website"),
              singletonListItem(S, "homepage_content", "Nội dung trang chủ"),
            ]),
        ),

      S.divider(),

      // ─── 2. Trang ─────────────────────────────────────────────
      S.listItem()
        .id("pages-group")
        .title("Trang")
        .child(
          S.list()
            .title("Trang")
            .items([
              ...S.documentTypeListItems().filter((item) =>
                PAGE_TYPES.has(item.getId() ?? ""),
              ),
              S.divider(),
              filteredView(S, {
                id: "content-article-drafts",
                title: "Bài viết — Nháp",
                schemaType: "content_article",
                filter: 'status == "draft"',
              }),
              filteredView(S, {
                id: "content-article-published",
                title: "Bài viết — Đã đăng",
                schemaType: "content_article",
                filter: 'status == "published"',
              }),
              filteredView(S, {
                id: "money-page-enterprise",
                title: "Money pages — Doanh nghiệp",
                schemaType: "money_page",
                filter: 'audience == "enterprise"',
              }),
              filteredView(S, {
                id: "money-page-beginner",
                title: "Money pages — Người mới",
                schemaType: "money_page",
                filter: 'audience == "beginner"',
              }),
            ]),
        ),

      // ─── 3. Dữ liệu ───────────────────────────────────────────
      S.listItem()
        .id("data-group")
        .title("Dữ liệu")
        .child(
          S.list()
            .title("Dữ liệu")
            .items([
              ...S.documentTypeListItems().filter((item) =>
                DATA_TYPES.has(item.getId() ?? ""),
              ),
              S.divider(),
              filteredView(S, {
                id: "faq-featured",
                title: "FAQ — Nổi bật trên trang chủ",
                schemaType: "faq",
                filter: "featured == true",
              }),
              filteredView(S, {
                id: "coach-featured",
                title: "HLV — Nổi bật trên trang chủ",
                schemaType: "coach",
                filter: "featured == true",
              }),
              filteredView(S, {
                id: "testimonial-featured",
                title: "Đánh giá — Nổi bật trên trang chủ",
                schemaType: "testimonial",
                filter: "featured == true",
              }),
              filteredView(S, {
                id: "campaign-active",
                title: "Chiến dịch — Đang chạy",
                schemaType: "campaign",
                filter: 'status == "active"',
              }),
            ]),
        ),

      // ─── 4. Đường dẫn ─────────────────────────────────────────
      bucket(S, "routing-group", "Đường dẫn", ROUTE_TYPES),

      // Safety net: any document type not classified above shows up here so a
      // newly-added schema never silently vanishes from the desk.
      S.listItem()
        .id("other-group")
        .title("Khác")
        .child(
          S.list()
            .title("Khác")
            .items(
              S.documentTypeListItems().filter(
                (item) => !KNOWN_BUCKETED_TYPES.has(item.getId() ?? ""),
              ),
            ),
        ),
    ]);

// Used only by the Đường dẫn bucket — kept after structure for proximity to
// where it's referenced.
function bucket(
  S: StructureBuilder,
  id: string,
  title: string,
  typeSet: Set<string>,
) {
  return S.listItem()
    .id(id)
    .title(title)
    .child(
      S.list()
        .title(title)
        .items(
          S.documentTypeListItems().filter((item) =>
            typeSet.has(item.getId() ?? ""),
          ),
        ),
    );
}
