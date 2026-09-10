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
  getFallbackFaqs,
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

    const faqItems = faqs && faqs.length > 0 ? faqs : getFallbackFaqs(page);

    return selectHomepageItems(faqItems, featuredOnly, limit);
  },
);
