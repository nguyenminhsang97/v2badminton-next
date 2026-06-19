import "server-only";

import { cache } from "react";
import { sanityFetchOrFallback } from "../client";
import type { SanityActiveCampaign, SanitySiteSettings } from "../types";
import { ACTIVE_CAMPAIGN_QUERY, SITE_SETTINGS_QUERY } from "./shared";

export const getSiteSettings = cache(async (): Promise<SanitySiteSettings | null> => {
  return sanityFetchOrFallback<SanitySiteSettings>({
    query: SITE_SETTINGS_QUERY,
    fallback: null,
    tags: ["sanity:site-settings"],
  });
});

export const getActiveCampaign = cache(
  async (): Promise<SanityActiveCampaign | null> => {
    const now = new Date();
    const vnTime = new Date(now.getTime() + 7 * 60 * 60 * 1000);
    const today = vnTime.toISOString().split("T")[0];

    return sanityFetchOrFallback<SanityActiveCampaign>({
      query: ACTIVE_CAMPAIGN_QUERY,
      params: { today },
      fallback: null,
      tags: ["sanity:campaign"],
    });
  },
);
