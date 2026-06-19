/**
 * Shared live-page URL resolver for Studio tools.
 *
 * This package is intentionally Sanity-free so web code can consume the same
 * route helpers without pulling in Studio runtime dependencies.
 */

/**
 * Base URL for the live site, without a trailing slash.
 * Falls back to the production domain when the env variable is absent.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL?.trim() ?? "https://v2badminton.com"
).replace(/\/+$/, "");

/**
 * Schema types that have a publicly-routed URL.
 * Must be kept in sync with the route resolver in the Next.js app.
 */
export const ROUTABLE_TYPES = new Set([
  "homepage_content",
  "content_hub",
  "content_node",
  "content_article",
  "court",
  "money_page",
  "static_page",
  "post",
]);

export function ensureLeadingSlash(path: string): string {
  return path.startsWith("/") ? path : `/${path}`;
}

export function ensureTrailingSlash(path: string): string {
  if (path === "/") return path;
  return path.endsWith("/") ? path : `${path}/`;
}

type SlugValue = { current?: string };

export type RoutableDoc = {
  slug?: SlugValue;
  fullPath?: SlugValue;
};

/**
 * Resolve a published-route PATH (not a full URL) from a document.
 * Returns null when the doc type is routable but required slug/fullPath fields
 * are empty. Caller must check ROUTABLE_TYPES.has(type) before using.
 *
 * The path is always slash-normalised (leading + trailing slash), e.g. "/".
 */
export function resolvePath(
  schemaType: string,
  doc: RoutableDoc | null,
): string | null {
  if (!doc) return null;

  switch (schemaType) {
    case "homepage_content":
      return "/";

    case "content_hub":
    case "content_node":
    case "content_article":
    case "court": {
      const fullPath = doc.fullPath?.current?.trim();
      if (!fullPath) return null;
      return ensureTrailingSlash(ensureLeadingSlash(fullPath));
    }

    case "money_page":
    case "static_page": {
      const slug = doc.slug?.current?.trim();
      if (!slug) return null;
      return `/${slug}/`;
    }

    case "post": {
      const slug = doc.slug?.current?.trim();
      if (!slug) return null;
      return `/blog/${slug}/`;
    }

    default:
      return null;
  }
}

/**
 * Convenience: resolve the full production URL for a document.
 * Returns null when the path cannot be determined.
 */
export function resolveFullUrl(
  schemaType: string,
  doc: RoutableDoc | null,
): string | null {
  const path = resolvePath(schemaType, doc);
  return path ? `${SITE_URL}${path}` : null;
}
