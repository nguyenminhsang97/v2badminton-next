import "server-only";

import { cache } from "react";
import { sanityFetchOrFallback } from "../client";
import type {
  SanityContentArticle,
  SanityContentArticleCard,
  SanityContentHub,
  SanityContentNode,
  SanityContentSitemapEntry,
  SanityRouteRedirect,
  SanityRouteResolution,
} from "../types";
import {
  ARTICLES_BY_MONEY_PAGE_QUERY,
  CONTENT_ARTICLE_BY_ID_QUERY,
  CONTENT_HUB_BY_ID_QUERY,
  CONTENT_NODE_BY_ID_QUERY,
  CONTENT_REDIRECT_QUERY,
  CONTENT_SITEMAP_QUERY,
  ROUTE_RESOLUTION_QUERY,
} from "./shared";

export const resolveContentRoute = cache(
  async (path: string): Promise<SanityRouteResolution | null> => {
    return sanityFetchOrFallback<SanityRouteResolution | null>({
      query: ROUTE_RESOLUTION_QUERY,
      params: { path },
      fallback: null,
      tags: ["sanity:content", `sanity:content-route:${path}`],
    });
  },
);

export const getContentHub = cache(
  async (id: string): Promise<SanityContentHub | null> => {
    return sanityFetchOrFallback<SanityContentHub | null>({
      query: CONTENT_HUB_BY_ID_QUERY,
      params: { id },
      fallback: null,
      tags: ["sanity:content", `sanity:content:${id}`],
    });
  },
);

export const getContentNode = cache(
  async (id: string): Promise<SanityContentNode | null> => {
    return sanityFetchOrFallback<SanityContentNode | null>({
      query: CONTENT_NODE_BY_ID_QUERY,
      params: { id },
      fallback: null,
      tags: ["sanity:content", `sanity:content:${id}`],
    });
  },
);

export const getContentArticle = cache(
  async (id: string): Promise<SanityContentArticle | null> => {
    return sanityFetchOrFallback<SanityContentArticle | null>({
      query: CONTENT_ARTICLE_BY_ID_QUERY,
      params: { id },
      fallback: null,
      tags: ["sanity:content", `sanity:content:${id}`],
    });
  },
);

export const getContentRedirect = cache(
  async (path: string): Promise<SanityRouteRedirect | null> => {
    return sanityFetchOrFallback<SanityRouteRedirect | null>({
      query: CONTENT_REDIRECT_QUERY,
      params: { path },
      fallback: null,
      tags: ["sanity:content", `sanity:content-redirect:${path}`],
    });
  },
);

/**
 * Reverse-lookup: articles that link to a given money-page slug via
 * `relatedMoneyPage`. Returns up to 6, ordered newest first.
 * Used by MoneyPageTemplate to surface a "Tài liệu kỹ thuật" section.
 */
export const getArticlesForMoneyPage = cache(
  async (moneyPageSlug: string): Promise<SanityContentArticleCard[]> => {
    const articles = await sanityFetchOrFallback<SanityContentArticleCard[]>({
      query: ARTICLES_BY_MONEY_PAGE_QUERY,
      params: { moneyPageSlug },
      fallback: [],
      tags: ["sanity:content", `sanity:money-page-articles:${moneyPageSlug}`],
    });
    return articles ?? [];
  },
);

export const getContentSitemapEntries = cache(
  async (): Promise<SanityContentSitemapEntry[]> => {
    const entries = await sanityFetchOrFallback<SanityContentSitemapEntry[]>({
      query: CONTENT_SITEMAP_QUERY,
      fallback: [],
      tags: ["sanity:content"],
    });

    return entries ?? [];
  },
);
