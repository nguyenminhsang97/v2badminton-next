import "server-only";

import { cache } from "react";
import { defineQuery } from "next-sanity";
import { faqs as staticFaqs, type FaqItem } from "@/lib/faqs";
import { courtLocationMap, courtLocations } from "@/lib/locations";
import { pricingTiers as staticPricingTiers } from "@/lib/pricing";
import { scheduleItems as staticScheduleItems } from "@/lib/schedule";
import {
  AUDIENCE_OPTIONS,
  BILLING_MODEL_OPTIONS,
  CTA_ACTION_OPTIONS,
  DISTRICT_OPTIONS,
  FAQ_PAGE_OPTIONS,
  SCHEDULE_LEVEL_OPTIONS,
  STUDENT_GROUP_OPTIONS,
} from "@/sanity/schemaTypes/shared";
import { sanityFetchOrFallback, sanityFetchWithStatus } from "./client";

export type SanityDistrict = (typeof DISTRICT_OPTIONS)[number]["value"];
export type SanityFaqPage = (typeof FAQ_PAGE_OPTIONS)[number]["value"];
export type SanityScheduleLevel = (typeof SCHEDULE_LEVEL_OPTIONS)[number]["value"];
export type SanityBillingModel = (typeof BILLING_MODEL_OPTIONS)[number]["value"];
export type SanityPricingCtaAction =
  (typeof CTA_ACTION_OPTIONS)[number]["value"];
export type SanityStudentGroup = (typeof STUDENT_GROUP_OPTIONS)[number]["value"];
export type SanityAudience = (typeof AUDIENCE_OPTIONS)[number]["value"];

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

export type SanityCoach = {
  id: string;
  name: string;
  photoUrl: string | null;
  photoAlt: string | null;
  teachingGroup: string;
  approach: string;
  order: number;
};

export type SanityTestimonial = {
  id: string;
  studentName: string;
  studentGroup: SanityStudentGroup;
  contextLabel: string | null;
  content: string;
  order: number;
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

export type SanityMoneyPage = {
  id: string;
  slug: string;
  audience: SanityAudience;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  intro: SanityPortableTextBlock[];
  body: SanityPortableTextBlock[];
  heroImageUrl: string | null;
  relatedLocations: SanityLocation[];
  relatedPricing: SanityPricingTier[];
  relatedFaqs: SanityFaq[];
  ctaLabel: string;
};

export type SanityMoneyPageLoadResult = {
  page: SanityMoneyPage | null;
  degraded: boolean;
};

export type SanityActiveCampaign = {
  id: string;
  slug: string;
  name: string;
  status: "active";
  startDate: string;
  endDate: string;
  badgeText: string | null;
  heroTitle: string | null;
  heroDescription: string | null;
  primaryCtaLabel: string | null;
  primaryCtaUrl: string | null;
  secondaryCtaLabel: string | null;
  secondaryCtaUrl: string | null;
  featuredAudience: SanityAudience | null;
  linkedPageSlug: string | null;
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

const LOCATION_PROJECTION = `{
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
}`;

const PRICING_TIER_PROJECTION = `{
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
}`;

const FAQ_PROJECTION = `{
  "id": _id,
  question,
  "answer": coalesce(answer, []),
  "answerPlainText": pt::text(answer),
  "pages": coalesce(pages, []),
  includeInSchema,
  "order": coalesce(order, 9999)
}`;

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

const COACHES_QUERY = defineQuery(`
  *[
    _type == "coach" &&
    isActive == true &&
    ${PUBLISHED_ONLY_FILTER}
  ]
  | order(coalesce(order, 9999) asc, _createdAt asc){
    "id": _id,
    name,
    "photoUrl": coalesce(photo.asset->url, null),
    "photoAlt": coalesce(photoAlt, null),
    teachingGroup,
    approach,
    "order": coalesce(order, 9999)
  }
`);

const TESTIMONIALS_QUERY = defineQuery(`
  *[
    _type == "testimonial" &&
    isActive == true &&
    ${PUBLISHED_ONLY_FILTER}
  ]
  | order(coalesce(order, 9999) asc, _createdAt asc){
    "id": _id,
    studentName,
    studentGroup,
    "contextLabel": coalesce(contextLabel, null),
    content,
    "order": coalesce(order, 9999)
  }
`);

const LOCATIONS_QUERY = defineQuery(`
  *[
    _type == "location" &&
    isActive == true &&
    defined(slug.current) &&
    ${PUBLISHED_ONLY_FILTER}
  ]
  | order(coalesce(order, 9999) asc, _createdAt asc)
  ${LOCATION_PROJECTION}
`);

const PRICING_TIERS_QUERY = defineQuery(`
  *[
    _type == "pricing_tier" &&
    isActive == true &&
    defined(slug.current) &&
    ${PUBLISHED_ONLY_FILTER}
  ]
  | order(coalesce(order, 9999) asc, _createdAt asc)
  ${PRICING_TIER_PROJECTION}
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
  | order(coalesce(order, 9999) asc, _createdAt asc)
  ${FAQ_PROJECTION}
`);

const MONEY_PAGE_QUERY = defineQuery(`
  *[
    _type == "money_page" &&
    slug.current == $slug &&
    ${PUBLISHED_ONLY_FILTER}
  ][0]{
    "id": _id,
    "slug": slug.current,
    audience,
    h1,
    metaTitle,
    metaDescription,
    "intro": coalesce(intro, []),
    "body": coalesce(body, []),
    "heroImageUrl": coalesce(heroImage.asset->url, null),
    "relatedLocations": *[
      _type == "location" &&
      _id in coalesce(^.relatedLocations[]._ref, []) &&
      isActive == true &&
      defined(slug.current) &&
      ${PUBLISHED_ONLY_FILTER}
    ]
    | order(coalesce(order, 9999) asc, _createdAt asc)
    ${LOCATION_PROJECTION},
    "relatedPricing": *[
      _type == "pricing_tier" &&
      _id in coalesce(^.relatedPricing[]._ref, []) &&
      isActive == true &&
      defined(slug.current) &&
      ${PUBLISHED_ONLY_FILTER}
    ]
    | order(coalesce(order, 9999) asc, _createdAt asc)
    ${PRICING_TIER_PROJECTION},
    "relatedFaqs": *[
      _type == "faq" &&
      _id in coalesce(^.relatedFaqs[]._ref, []) &&
      ${PUBLISHED_ONLY_FILTER}
    ]
    | order(coalesce(order, 9999) asc, _createdAt asc)
    ${FAQ_PROJECTION},
    ctaLabel
  }
`);

const ACTIVE_CAMPAIGN_QUERY = defineQuery(`
  *[
    _type == "campaign" &&
    status == "active" &&
    startDate <= $today &&
    endDate >= $today &&
    ${PUBLISHED_ONLY_FILTER}
  ]
  | order(startDate desc)[0]{
    "id": _id,
    "slug": slug.current,
    name,
    status,
    startDate,
    endDate,
    "badgeText": coalesce(badgeText, null),
    "heroTitle": coalesce(heroTitle, null),
    "heroDescription": coalesce(heroDescription, null),
    "primaryCtaLabel": coalesce(primaryCtaLabel, null),
    "primaryCtaUrl": coalesce(primaryCtaUrl, null),
    "secondaryCtaLabel": coalesce(secondaryCtaLabel, null),
    "secondaryCtaUrl": coalesce(secondaryCtaUrl, null),
    "featuredAudience": coalesce(featuredAudience, null),
    "linkedPageSlug": linkedPage->slug.current
  }
`);

export const getSiteSettings = cache(async (): Promise<SanitySiteSettings | null> => {
  return sanityFetchOrFallback<SanitySiteSettings>({
    query: SITE_SETTINGS_QUERY,
    fallback: null,
    tags: ["sanity:site-settings"],
  });
});

export const getCoaches = cache(async (): Promise<SanityCoach[]> => {
  const coaches = await sanityFetchOrFallback<SanityCoach[]>({
    query: COACHES_QUERY,
    fallback: [],
    tags: ["sanity:coaches"],
  });

  return coaches ?? [];
});

export const getTestimonials = cache(async (): Promise<SanityTestimonial[]> => {
  const testimonials = await sanityFetchOrFallback<SanityTestimonial[]>({
    query: TESTIMONIALS_QUERY,
    fallback: [],
    tags: ["sanity:testimonials"],
  });

  return testimonials ?? [];
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

export const getActiveCampaign = cache(
  async (): Promise<SanityActiveCampaign | null> => {
    // Vietnam is UTC+7 with no daylight saving.
    // Raw ISO dates are UTC-based and can be one day behind local time
    // between midnight and 06:59 ICT.
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
