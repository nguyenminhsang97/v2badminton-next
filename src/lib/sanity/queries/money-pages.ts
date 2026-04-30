import "server-only";

import { cache } from "react";
import { sanityFetchOrFallback, sanityFetchWithStatus } from "../client";
import type {
  SanityMoneyPage,
  SanityMoneyPageLoadResult,
  SanityMoneyPageSitemapEntry,
} from "../types";
import { MONEY_PAGE_QUERY, MONEY_PAGE_SITEMAP_QUERY } from "./shared";

export const getMoneyPage = cache(
  async (slug: string): Promise<SanityMoneyPageLoadResult> => {
    const result = await sanityFetchWithStatus<SanityMoneyPage | null>({
      query: MONEY_PAGE_QUERY,
      params: { slug },
      fallback: null,
      tags: ["sanity:money-pages", `sanity:money-page:${slug}`],
    });

    return {
      page: result.data,
      degraded: result.state !== "success",
    };
  },
);

export const getMoneyPageSitemapEntries = cache(
  async (): Promise<SanityMoneyPageSitemapEntry[]> => {
    const entries = await sanityFetchOrFallback<SanityMoneyPageSitemapEntry[]>({
      query: MONEY_PAGE_SITEMAP_QUERY,
      fallback: [],
      tags: ["sanity:money-pages"],
    });

    return entries ?? [];
  },
);
