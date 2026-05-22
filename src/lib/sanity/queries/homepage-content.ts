import "server-only";

import { cache } from "react";
import { sanityFetchOrFallback } from "../client";
import type { SanityHomepageContent } from "../types";
import { HOMEPAGE_CONTENT_QUERY } from "./shared";

export const getHomepageContent = cache(
  async (): Promise<SanityHomepageContent | null> => {
    return sanityFetchOrFallback<SanityHomepageContent>({
      query: HOMEPAGE_CONTENT_QUERY,
      fallback: null,
      tags: ["sanity:homepage-content"],
    });
  },
);
