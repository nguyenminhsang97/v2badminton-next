/**
 * Sanity document _type → Next.js cache tag mapping.
 *
 * This is the single source of truth for on-demand revalidation.
 * When a Sanity webhook fires, the handler looks up the document's `_type`
 * in this map to determine which cache tags to purge via `revalidateTag`.
 *
 * Maintenance rule: if you add a new Sanity document type or a new GROQ query
 * that embeds one type inside another, update this map. Unknown types are a
 * 200 no-op + warning (see route handler).
 *
 * Cross-references / dereference traps:
 * - `location`, `pricing_tier`, `faq` are embedded inside `money_page` GROQ
 *   joins, so editing any of them must also purge `sanity:money-pages`.
 * - `faq` on the homepage is fetched with page-scoped tag `sanity:faqs:homepage`
 *   (not bare `sanity:faqs`), so we must include both.
 *
 * @see .claude/CMS/v2badminton-cms-cache-revalidation-plan.md §4
 */

/**
 * Static tags to purge for each Sanity document `_type`.
 * Slug/id-dependent tags are added dynamically by `getRevalidationTags()`.
 */
const REVALIDATION_MAP: Record<string, readonly string[]> = {
  // Global chrome — every route fetches site_settings
  site_settings: ["sanity:site-settings"],

  // Homepage-only singletons
  homepage_content: ["sanity:homepage-content"],
  campaign: ["sanity:campaign"],

  // Catalog types (homepage + money pages)
  coach: ["sanity:coaches"],
  testimonial: ["sanity:testimonials"],

  // Catalog types that are also embedded (dereferenced) in money pages
  location: ["sanity:locations", "sanity:money-pages"],
  pricing_tier: ["sanity:pricing-tiers", "sanity:money-pages"],
  schedule_block: ["sanity:schedule-blocks"],

  // FAQ: homepage uses page-scoped tag, plus money pages embed relatedFaqs
  faq: ["sanity:faqs", "sanity:faqs:homepage", "sanity:money-pages"],

  // File-routed money pages
  money_page: ["sanity:money-pages"],

  // Static pages (/gioi-thieu/, privacy, editorial policy)
  static_page: ["sanity:static-pages"],

  // Blog
  post: ["sanity:posts"],

  // Content platform (hubs, nodes, articles, courts) — broad tag covers route
  // resolution, parent/child listings, sitemap, redirects, and slug changes
  content_hub: ["sanity:content"],
  content_node: ["sanity:content"],
  content_article: ["sanity:content"],
  court: ["sanity:content"],

  // Route redirects (content platform)
  route_redirect: ["sanity:content"],
};

/**
 * Parsed webhook payload shape (only the fields we use).
 * All fields except `_type` are optional/untrusted.
 */
export interface SanityWebhookPayload {
  _type: string;
  _id?: string;
  slug?: string;
  fullPath?: string;
  beforeFullPath?: string;
  status?: string;
}

/**
 * Given a parsed Sanity webhook payload, return the deduplicated set of
 * Next.js cache tags to purge via `revalidateTag`.
 *
 * Returns an empty array for unknown `_type` values (caller should warn).
 */
export function getRevalidationTags(payload: SanityWebhookPayload): string[] {
  const staticTags = REVALIDATION_MAP[payload._type];
  if (!staticTags) {
    return [];
  }

  const tags = new Set<string>(staticTags);

  // Add slug-specific tags when slug is present
  const slug = payload.slug;
  if (slug) {
    switch (payload._type) {
      case "money_page":
        tags.add(`sanity:money-page:${slug}`);
        break;
      case "static_page":
        tags.add(`sanity:static-page:${slug}`);
        break;
      case "post":
        tags.add(`sanity:post:${slug}`);
        break;
    }
  }

  // Add per-id tags for content platform types
  const id = payload._id;
  if (id && ["content_hub", "content_node", "content_article", "court"].includes(payload._type)) {
    tags.add(`sanity:content:${id}`);
  }

  return Array.from(tags);
}

/**
 * Check whether a document ID represents a draft.
 * Sanity draft documents have IDs prefixed with "drafts."
 */
export function isDraftId(id: string | undefined): boolean {
  return typeof id === "string" && id.startsWith("drafts.");
}
