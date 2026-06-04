/**
 * Shared live-page URL resolver for Studio tools.
 *
 * Extracted from openLivePageAction.tsx (Phase 2 PR 3) so that both the
 * document action and the dashboard tool share a single source of truth for
 * URL construction.  The logic and behaviour are identical to what was in
 * the action — no changes to the output paths.
 *
 * Consumers:
 *   - src/sanity/actions/openLivePageAction.tsx  (document action)
 *   - src/sanity/tools/DashboardTool.tsx          (dashboard live-page cards)
 */

import type { SanityDocument } from "sanity";

// ─── Site URL ─────────────────────────────────────────────────────────────────

/**
 * Base URL for the live site, without a trailing slash.
 * Falls back to the production domain when the env variable is absent.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL?.trim() ?? "https://v2badminton.com"
).replace(/\/+$/, "");

// ─── Routable types ───────────────────────────────────────────────────────────

/**
 * Schema types that have a publicly-routed URL.
 * Must be kept in sync with the route resolver in the Next.js app.
 */
export const ROUTABLE_TYPES = new Set([
  "homepage_content",
  "content_hub",
  "content_node",
  "content_article",
  "money_page",
  "static_page",
  "post",
]);

// ─── Path helpers ─────────────────────────────────────────────────────────────

export function ensureLeadingSlash(path: string): string {
  return path.startsWith("/") ? path : `/${path}`;
}

export function ensureTrailingSlash(path: string): string {
  if (path === "/") return path;
  return path.endsWith("/") ? path : `${path}/`;
}

// ─── Core resolver ────────────────────────────────────────────────────────────

type SlugValue = { current?: string };

export type RoutableDoc = SanityDocument & {
  slug?: SlugValue;
  fullPath?: SlugValue;
};

/**
 * Resolve a published-route PATH (not a full URL) from a document.
 * Returns null when the doc type is routable but required slug/fullPath fields
 * are empty.  Caller must check ROUTABLE_TYPES.has(type) before using.
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
    case "content_article": {
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
