import "server-only";

import { cache } from "react";
import { sanityFetchWithStatus } from "../client";
import type { SanityMoneyPage, SanityMoneyPageLoadResult } from "../types";
import { MONEY_PAGE_QUERY } from "./shared";

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
