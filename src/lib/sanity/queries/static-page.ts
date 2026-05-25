import "server-only";

import { cache } from "react";
import { sanityFetchOrFallback } from "../client";
import type { SanityStaticPage } from "../types";
import { STATIC_PAGE_QUERY } from "./shared";

/**
 * Fetch a static_page doc by its slug.current value.
 *
 * Returns null when:
 * - No published doc exists for the given slug (most common at W3b deploy time).
 * - The Sanity fetch fails (network / API error — sanityFetchOrFallback swallows).
 *
 * The renderer treats null identically to "all fields missing": every value
 * falls back to its FALLBACK_* constant, so the page output is unchanged from
 * the pre-W3b hardcoded JSX.
 *
 * Spec: .claude/CMS/v2badminton-cms-w3b-gioi-thieu-renderer-ticket.md
 */
export const getStaticPage = cache(
  async (slug: string): Promise<SanityStaticPage | null> => {
    return sanityFetchOrFallback<SanityStaticPage | null>({
      query: STATIC_PAGE_QUERY,
      params: { slug },
      fallback: null,
      tags: ["sanity:static-pages", `sanity:static-page:${slug}`],
    });
  },
);
