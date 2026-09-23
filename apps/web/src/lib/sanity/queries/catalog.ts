import "server-only";

import { cache } from "react";
import { reportMissingCatalogContent } from "@/lib/catalogFailSafe";
import { sanityFetchOrFallback } from "../client";
import type {
  SanityCoach,
  SanityFaq,
  SanityFaqPage,
  SanityLocation,
  SanityPricingTier,
  SanityScheduleBlock,
  SanityTestimonial,
} from "../types";
import {
  COACHES_QUERY,
  FAQS_QUERY,
  getFallbackLocations,
  getFallbackScheduleBlocks,
  LOCATIONS_QUERY,
  PRICING_TIERS_QUERY,
  SCHEDULE_BLOCKS_QUERY,
  selectHomepageItems,
  TESTIMONIALS_QUERY,
} from "./shared";

export const getCoaches = cache(
  async (featuredOnly = false, limit?: number): Promise<SanityCoach[]> => {
    const coaches =
      (await sanityFetchOrFallback<SanityCoach[]>({
        query: COACHES_QUERY,
        fallback: [],
        tags: ["sanity:coaches"],
      })) ?? [];

    return selectHomepageItems(coaches, featuredOnly, limit);
  },
);

export const getTestimonials = cache(
  async (featuredOnly = false, limit?: number): Promise<SanityTestimonial[]> => {
    const testimonials =
      (await sanityFetchOrFallback<SanityTestimonial[]>({
        query: TESTIMONIALS_QUERY,
        fallback: [],
        tags: ["sanity:testimonials"],
      })) ?? [];

    return selectHomepageItems(testimonials, featuredOnly, limit);
  },
);

export const getLocations = cache(async (): Promise<SanityLocation[]> => {
  const locations = await sanityFetchOrFallback<SanityLocation[]>({
    query: LOCATIONS_QUERY,
    fallback: [],
    tags: ["sanity:locations"],
  });

  if (locations && locations.length > 0) {
    return locations;
  }

  // Owner ruling 2026-09-23: keep name and address, because someone trying to
  // reach a court needs them and they change rarely. The entries are flagged
  // `isFallback`, which keeps their coordinates out of JSON-LD — those drifted
  // 3 km for months before 2026-09-22, and a wrong pin sends a visitor to the
  // wrong street with Google's authority behind it.
  reportMissingCatalogContent({
    contentSet: "locations",
    tags: ["sanity:locations"],
  });

  return getFallbackLocations();
});

export const getPricingTiers = cache(async (): Promise<SanityPricingTier[]> => {
  const tiers = await sanityFetchOrFallback<SanityPricingTier[]>({
    query: PRICING_TIERS_QUERY,
    fallback: [],
    tags: ["sanity:pricing-tiers"],
  });

  if (tiers && tiers.length > 0) {
    return tiers;
  }

  // Fail closed, and say so. src/lib/pricing.ts was emptied in #99 precisely so
  // no unverified number could ever be served, which means losing the Sanity
  // tiers already produced a blank pricing block — just silently. This reports
  // it, and the empty list makes PricingStrip offer the quote line instead.
  reportMissingCatalogContent({
    contentSet: "pricing_tiers",
    tags: ["sanity:pricing-tiers"],
  });

  return [];
});

export const getScheduleBlocks = cache(async (): Promise<SanityScheduleBlock[]> => {
  const scheduleBlocks = await sanityFetchOrFallback<SanityScheduleBlock[]>({
    query: SCHEDULE_BLOCKS_QUERY,
    fallback: [],
    tags: ["sanity:schedule-blocks"],
  });

  if (scheduleBlocks && scheduleBlocks.length > 0) {
    return scheduleBlocks;
  }

  // Owner ruling 2026-09-23: keep showing the timetable, because it mirrors what
  // Sanity holds. That only stays true if someone checks: scripts/check-fallback-drift.mjs
  // compares the two, and it exists because the Khang Sport 11:30 slot lived on
  // in this list after the owner hid it in Sanity.
  reportMissingCatalogContent({
    contentSet: "schedule_blocks",
    tags: ["sanity:schedule-blocks"],
  });

  return getFallbackScheduleBlocks();
});

export const getFaqs = cache(
  async (
    page?: SanityFaqPage,
    featuredOnly = false,
    limit?: number,
  ): Promise<SanityFaq[]> => {
    const faqs = await sanityFetchOrFallback<SanityFaq[]>({
      query: FAQS_QUERY,
      params: page ? { page } : {},
      fallback: [],
      tags: page ? [`sanity:faqs:${page}`] : ["sanity:faqs"],
    });

    if (faqs && faqs.length > 0) {
      return selectHomepageItems(faqs, featuredOnly, limit);
    }

    // Owner ruling 2026-09-23: show nothing rather than the Sprint-2 copy. Those
    // fallback answers carried no prices, but they were written before the 2026-09
    // rulings and a visitor cannot tell a stale answer from a current one.
    reportMissingCatalogContent({
      contentSet: page ? `faqs:${page}` : "faqs",
      tags: page ? [`sanity:faqs:${page}`] : ["sanity:faqs"],
    });

    return [];
  },
);
