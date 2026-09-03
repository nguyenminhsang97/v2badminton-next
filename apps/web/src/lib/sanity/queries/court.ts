import "server-only";

import { cache } from "react";
import { sanityFetchOrFallback } from "../client";
import type { SanityCourt, SanityCourtCard } from "../types";
import { COURT_BY_ID_QUERY, COURTS_IN_AREA_QUERY } from "./shared";

export const getCourt = cache(
  async (id: string): Promise<SanityCourt | null> => {
    return sanityFetchOrFallback<SanityCourt | null>({
      query: COURT_BY_ID_QUERY,
      params: { id },
      fallback: null,
      tags: ["sanity:content", `sanity:content:${id}`],
    });
  },
);

export const getCourtsInArea = cache(
  async (areaId: string): Promise<SanityCourtCard[]> => {
    const courts = await sanityFetchOrFallback<SanityCourtCard[]>({
      query: COURTS_IN_AREA_QUERY,
      params: { areaId },
      fallback: [],
      tags: ["sanity:content", `sanity:content-area-courts:${areaId}`],
    });
    return courts ?? [];
  },
);
