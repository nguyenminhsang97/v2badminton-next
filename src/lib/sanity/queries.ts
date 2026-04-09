import "server-only";

import { cache } from "react";
import { defineQuery } from "next-sanity";
import { faqs as staticFaqs, type FaqItem } from "@/lib/faqs";
import { courtLocationMap, courtLocations } from "@/lib/locations";
import { pricingTiers as staticPricingTiers } from "@/lib/pricing";
import { scheduleItems as staticScheduleItems } from "@/lib/schedule";
import {
  BILLING_MODEL_OPTIONS,
  CTA_ACTION_OPTIONS,
  DISTRICT_OPTIONS,
  FAQ_PAGE_OPTIONS,
  SCHEDULE_LEVEL_OPTIONS,
} from "@/sanity/schemaTypes/shared";
import { sanityFetchOrFallback } from "./client";

export type SanityDistrict = (typeof DISTRICT_OPTIONS)[number]["value"];
export type SanityFaqPage = (typeof FAQ_PAGE_OPTIONS)[number]["value"];
export type SanityScheduleLevel = (typeof SCHEDULE_LEVEL_OPTIONS)[number]["value"];
export type SanityBillingModel = (typeof BILLING_MODEL_OPTIONS)[number]["value"];
export type SanityPricingCtaAction =
  (typeof CTA_ACTION_OPTIONS)[number]["value"];

export type SanityPortableTextSpan = {
  _key?: string;
  _type?: string;
  text?: string;
  marks?: string[];
};

export type SanityPortableTextBlock = {
  _key?: string;
  _type: string;
  style?: string;
  children?: SanityPortableTextSpan[];
  markDefs?: Array<Record<string, unknown>>;
};

export type SanitySiteSettings = {
  id: string;
  siteName: string;
  phoneDisplay: string;
  phoneE164: string;
  zaloNumber: string;
  facebookUrl: string;
  defaultOgImageUrl: string | null;
};

export type SanityLocation = {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  district: SanityDistrict;
  districtLabel: string;
  localPage: "/lop-cau-long-binh-thanh/" | "/lop-cau-long-thu-duc/" | null;
  addressText: string;
  mapsUrl: string;
  imageUrl: string | null;
  imageAlt: string | null;
  geoLat: number | null;
  geoLng: number | null;
  order: number;
};

type SanityPricingTierBase = {
  id: string;
  slug: string;
  name: string;
  shortLabel: string;
  description: string;
  billingModel: SanityBillingModel;
  displayPrice: string;
  features: string[];
  ctaLabel: string;
  ctaAction: SanityPricingCtaAction;
  order: number;
};

export type SanityGroupPricingTier = SanityPricingTierBase & {
  kind: "group";
  billingModel: "monthly_package";
  groupSize: string;
  pricePerMonth: number;
  sessionsPerWeek: number;
  sessionsPerMonth: number;
  pricePerHour: null;
};

export type SanityPrivatePricingTier = SanityPricingTierBase & {
  kind: "private";
  billingModel: "per_hour";
  groupSize: null;
  pricePerMonth: null;
  sessionsPerWeek: null;
  sessionsPerMonth: null;
  pricePerHour: number;
};

export type SanityEnterprisePricingTier = SanityPricingTierBase & {
  kind: "enterprise";
  billingModel: "quote";
  groupSize: null;
  pricePerMonth: null;
  sessionsPerWeek: null;
  sessionsPerMonth: null;
  pricePerHour: null;
};

export type SanityPricingTier =
  | SanityGroupPricingTier
  | SanityPrivatePricingTier
  | SanityEnterprisePricingTier;

export type SanityScheduleBlock = {
  id: string;
  slug: string;
  locationId: string;
  locationName: string;
  locationShortName: string;
  locationDistrict: SanityDistrict;
  dayGroup: string;
  timeLabel: string;
  timeSlotId: string;
  levels: SanityScheduleLevel[];
  order: number;
};

export type SanityFaq = {
  id: string;
  question: string;
  answer: SanityPortableTextBlock[];
  answerPlainText: string;
  pages: SanityFaqPage[];
  includeInSchema: boolean;
  order: number;
};

const PUBLISHED_ONLY_FILTER = '!(_id in path("drafts.**"))';

function toPortableTextBlocks(text: string): SanityPortableTextBlock[] {
  return [
    {
      _key: "fallback-answer",
      _type: "block",
      style: "normal",
      markDefs: [],
      children: [
        {
          _key: "fallback-answer-span",
          _type: "span",
          text,
          marks: [],
        },
      ],
    },
  ];
}

function mapFallbackFaq(item: FaqItem): SanityFaq {
  return {
    id: item.id,
    question: item.question,
    answer: toPortableTextBlocks(item.answerText),
    answerPlainText: item.answerText,
    pages: [item.page],
    includeInSchema: item.schemaEligible,
    order: item.order,
  };
}

function getFallbackLocations(): SanityLocation[] {
  return courtLocations.map((court, index) => ({
    id: court.id,
    slug: court.id,
    name: court.name,
    shortName: court.shortName,
    district: court.district,
    districtLabel: court.districtLabel,
    localPage: court.localPage,
    addressText: court.addressText,
    mapsUrl: court.mapsUrl,
    imageUrl: court.image,
    imageAlt: court.imageAlt,
    geoLat: court.geo.lat,
    geoLng: court.geo.lng,
    order: index + 1,
  }));
}

function getFallbackPricingTiers(): SanityPricingTier[] {
  return staticPricingTiers.map((tier, index) => {
    switch (tier.kind) {
      case "group":
        return {
          id: tier.id,
          slug: tier.id,
          name: tier.name,
          shortLabel: tier.shortLabel,
          kind: "group",
          billingModel: "monthly_package",
          description: tier.description,
          groupSize: tier.groupSize,
          pricePerMonth: tier.pricePerMonth,
          pricePerHour: null,
          displayPrice: tier.displayPrice,
          sessionsPerWeek: tier.sessionsPerWeek,
          sessionsPerMonth: tier.sessionsPerMonth,
          features: [...tier.features],
          ctaLabel: tier.cta.label,
          ctaAction: tier.cta.ctaName,
          order: index + 1,
        } satisfies SanityGroupPricingTier;
      case "private":
        return {
          id: tier.id,
          slug: tier.id,
          name: tier.name,
          shortLabel: tier.shortLabel,
          kind: "private",
          billingModel: "per_hour",
          description: tier.description,
          groupSize: null,
          pricePerMonth: null,
          pricePerHour: tier.pricePerHour,
          displayPrice: tier.displayPrice,
          sessionsPerWeek: null,
          sessionsPerMonth: null,
          features: [...tier.features],
          ctaLabel: tier.cta.label,
          ctaAction: tier.cta.ctaName,
          order: index + 1,
        } satisfies SanityPrivatePricingTier;
      case "enterprise":
        return {
          id: tier.id,
          slug: tier.id,
          name: tier.name,
          shortLabel: tier.shortLabel,
          kind: "enterprise",
          billingModel: "quote",
          description: tier.description,
          groupSize: null,
          pricePerMonth: null,
          pricePerHour: null,
          displayPrice: tier.displayPrice,
          sessionsPerWeek: null,
          sessionsPerMonth: null,
          features: [...tier.features],
          ctaLabel: tier.cta.label,
          ctaAction: tier.cta.ctaName,
          order: index + 1,
        } satisfies SanityEnterprisePricingTier;
    }
  });
}

function getFallbackScheduleBlocks(): SanityScheduleBlock[] {
  return staticScheduleItems.map((item, index) => {
    const location = courtLocationMap[item.courtId];

    return {
      id: item.id,
      slug: item.id,
      locationId: item.courtId,
      locationName: location.name,
      locationShortName: location.shortName,
      locationDistrict: location.district,
      dayGroup: item.dayGroup,
      timeLabel: item.timeLabel,
      timeSlotId: item.timeSlotId,
      levels: [...item.levels],
      order: index + 1,
    };
  });
}

function getFallbackFaqs(page?: SanityFaqPage): SanityFaq[] {
  return staticFaqs
    .filter((faq) => page === undefined || faq.page === page)
    .map(mapFallbackFaq);
}

const SITE_SETTINGS_QUERY = defineQuery(`
  *[
    _type == "site_settings" &&
    ${PUBLISHED_ONLY_FILTER}
  ][0]{
    "id": _id,
    siteName,
    phoneDisplay,
    phoneE164,
    zaloNumber,
    facebookUrl,
    "defaultOgImageUrl": defaultOgImage.asset->url
  }
`);

const LOCATIONS_QUERY = defineQuery(`
  *[
    _type == "location" &&
    isActive == true &&
    defined(slug.current) &&
    ${PUBLISHED_ONLY_FILTER}
  ]
  | order(coalesce(order, 9999) asc, _createdAt asc){
    "id": _id,
    "slug": slug.current,
    name,
    shortName,
    district,
    "districtLabel": select(
      district == "binh_thanh" => "Bình Thạnh",
      district == "thu_duc" => "Thủ Đức",
      district
    ),
    "localPage": select(
      district == "binh_thanh" => "/lop-cau-long-binh-thanh/",
      district == "thu_duc" => "/lop-cau-long-thu-duc/",
      null
    ),
    addressText,
    mapsUrl,
    "imageUrl": image.asset->url,
    imageAlt,
    geoLat,
    geoLng,
    "order": coalesce(order, 9999)
  }
`);

const PRICING_TIERS_QUERY = defineQuery(`
  *[
    _type == "pricing_tier" &&
    isActive == true &&
    defined(slug.current) &&
    ${PUBLISHED_ONLY_FILTER}
  ]
  | order(coalesce(order, 9999) asc, _createdAt asc){
    "id": _id,
    "slug": slug.current,
    name,
    shortLabel,
    kind,
    billingModel,
    description,
    groupSize,
    pricePerMonth,
    pricePerHour,
    displayPrice,
    sessionsPerWeek,
    sessionsPerMonth,
    "features": coalesce(features, []),
    ctaLabel,
    ctaAction,
    "order": coalesce(order, 9999)
  }
`);

const SCHEDULE_BLOCKS_QUERY = defineQuery(`
  *[
    _type == "schedule_block" &&
    isActive == true &&
    defined(slug.current) &&
    defined(location->_id) &&
    ${PUBLISHED_ONLY_FILTER}
  ]
  | order(coalesce(order, 9999) asc, _createdAt asc){
    "id": _id,
    "slug": slug.current,
    "locationId": location->_id,
    "locationName": location->name,
    "locationShortName": location->shortName,
    "locationDistrict": location->district,
    dayGroup,
    timeLabel,
    timeSlotId,
    "levels": coalesce(levels, []),
    "order": coalesce(order, 9999)
  }
`);

const FAQS_QUERY = defineQuery(`
  *[
    _type == "faq" &&
    (!defined($page) || $page in pages) &&
    ${PUBLISHED_ONLY_FILTER}
  ]
  | order(coalesce(order, 9999) asc, _createdAt asc){
    "id": _id,
    question,
    "answer": coalesce(answer, []),
    "answerPlainText": pt::text(answer),
    "pages": coalesce(pages, []),
    includeInSchema,
    "order": coalesce(order, 9999)
  }
`);

export const getSiteSettings = cache(async (): Promise<SanitySiteSettings | null> => {
  return sanityFetchOrFallback<SanitySiteSettings>({
    query: SITE_SETTINGS_QUERY,
    fallback: null,
    tags: ["sanity:site-settings"],
  });
});

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

  return getFallbackPricingTiers();
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
  async (page?: SanityFaqPage): Promise<SanityFaq[]> => {
    const faqs = await sanityFetchOrFallback<SanityFaq[]>({
      query: FAQS_QUERY,
      params: page ? { page } : {},
      fallback: [],
      tags: page ? [`sanity:faqs:${page}`] : ["sanity:faqs"],
    });

    if (faqs && faqs.length > 0) {
      return faqs;
    }

    return getFallbackFaqs(page);
  },
);
