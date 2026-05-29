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

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
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

      bucket(S, "pages-group", "Trang", PAGE_TYPES),
      bucket(S, "data-group", "Dữ liệu", DATA_TYPES),
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
