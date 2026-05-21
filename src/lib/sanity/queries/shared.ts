import "server-only";

import { defineQuery } from "next-sanity";
import { faqs as staticFaqs, type FaqItem } from "@/lib/faqs";
import { courtLocationMap, courtLocations } from "@/lib/locations";
import { pricingTiers as staticPricingTiers } from "@/lib/pricing";
import { scheduleItems as staticScheduleItems } from "@/lib/schedule";
import type {
  SanityEnterprisePricingTier,
  SanityFaq,
  SanityFaqPage,
  SanityGroupPricingTier,
  SanityLocation,
  SanityPortableTextBlock,
  SanityPricingTier,
  SanityPrivatePricingTier,
  SanityScheduleBlock,
} from "../types";

export const PUBLISHED_ONLY_FILTER = '!(_id in path("drafts.**"))';

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
    featured: false,
    homepageOrder: item.order,
    order: item.order,
  };
}

export function getFallbackLocations(): SanityLocation[] {
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

export function getFallbackPricingTiers(): SanityPricingTier[] {
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

export function getFallbackScheduleBlocks(): SanityScheduleBlock[] {
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

export function getFallbackFaqs(page?: SanityFaqPage): SanityFaq[] {
  return staticFaqs
    .filter((faq) => page === undefined || faq.page === page)
    .map(mapFallbackFaq);
}

export function selectHomepageItems<
  TItem extends { featured: boolean; homepageOrder: number; order: number },
>(items: readonly TItem[], featuredOnly: boolean, limit?: number): TItem[] {
  if (!featuredOnly) {
    return limit === undefined ? [...items] : items.slice(0, limit);
  }

  const featuredItems = items
    .filter((item) => item.featured)
    .sort((left, right) => {
      const homepageOrderDiff = left.homepageOrder - right.homepageOrder;
      if (homepageOrderDiff !== 0) {
        return homepageOrderDiff;
      }

      return left.order - right.order;
    });

  const selectedItems = featuredItems.length > 0 ? featuredItems : items;
  return limit === undefined ? [...selectedItems] : selectedItems.slice(0, limit);
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
  "featured": coalesce(featured, false),
  "homepageOrder": coalesce(homepageOrder, 9999),
  "order": coalesce(order, 9999)
}`;

export const SITE_SETTINGS_QUERY = defineQuery(`
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

export const COACHES_QUERY = defineQuery(`
  *[
    _type == "coach" &&
    isActive == true &&
    ${PUBLISHED_ONLY_FILTER}
  ]
  | order(coalesce(order, 9999) asc, _createdAt asc){
    "id": _id,
    "updatedAt": coalesce(_updatedAt, null),
    name,
    "photoUrl": coalesce(photo.asset->url, null),
    "photoAlt": coalesce(photoAlt, null),
    teachingGroup,
    approach,
    "roleBadge": coalesce(roleBadge, null),
    "credentialTags": coalesce(credentialTags, []),
    "quote": coalesce(quote, null),
    "focusLine": coalesce(focusLine, null),
    "proofLabel": coalesce(proofLabel, null),
    "showStars": coalesce(showStars, true),
    "featured": coalesce(featured, false),
    "homepageOrder": coalesce(homepageOrder, 9999),
    "order": coalesce(order, 9999)
  }
`);

export const TESTIMONIALS_QUERY = defineQuery(`
  *[
    _type == "testimonial" &&
    isActive == true &&
    ${PUBLISHED_ONLY_FILTER}
  ]
  | order(coalesce(order, 9999) asc, _createdAt asc){
    "id": _id,
    studentName,
    "avatarUrl": coalesce(avatar.asset->url, null),
    "avatarAlt": coalesce(avatarAlt, null),
    studentGroup,
    "kicker": coalesce(kicker, null),
    "rating": coalesce(rating, 5),
    "contextLabel": coalesce(contextLabel, null),
    "shortQuote": coalesce(shortQuote, null),
    content,
    "featured": coalesce(featured, false),
    "homepageOrder": coalesce(homepageOrder, 9999),
    "order": coalesce(order, 9999)
  }
`);

export const LOCATIONS_QUERY = defineQuery(`
  *[
    _type == "location" &&
    isActive == true &&
    defined(slug.current) &&
    ${PUBLISHED_ONLY_FILTER}
  ]
  | order(coalesce(order, 9999) asc, _createdAt asc)
  ${LOCATION_PROJECTION}
`);

export const PRICING_TIERS_QUERY = defineQuery(`
  *[
    _type == "pricing_tier" &&
    isActive == true &&
    defined(slug.current) &&
    ${PUBLISHED_ONLY_FILTER}
  ]
  | order(coalesce(order, 9999) asc, _createdAt asc)
  ${PRICING_TIER_PROJECTION}
`);

export const SCHEDULE_BLOCKS_QUERY = defineQuery(`
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

export const FAQS_QUERY = defineQuery(`
  *[
    _type == "faq" &&
    (!defined($page) || $page in pages) &&
    ${PUBLISHED_ONLY_FILTER}
  ]
  | order(coalesce(order, 9999) asc, _createdAt asc)
  ${FAQ_PROJECTION}
`);

export const MONEY_PAGE_QUERY = defineQuery(`
  *[
    _type == "money_page" &&
    slug.current == $slug &&
    ${PUBLISHED_ONLY_FILTER}
  ][0]{
    "id": _id,
    "updatedAt": coalesce(_updatedAt, null),
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

export const MONEY_PAGE_SITEMAP_QUERY = defineQuery(`
  *[
    _type == "money_page" &&
    defined(slug.current) &&
    count(body) > 0 &&
    defined(metaTitle) &&
    defined(metaDescription) &&
    ${PUBLISHED_ONLY_FILTER}
  ]{
    "slug": slug.current,
    "updatedAt": coalesce(_updatedAt, null)
  }
`);

export const ACTIVE_CAMPAIGN_QUERY = defineQuery(`
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
    "linkedPageSlug": coalesce(linkedPage->slug.current, null)
  }
`);

export const PUBLISHED_POSTS_QUERY = defineQuery(`
  *[
    _type == "post" &&
    status == "published" &&
    defined(slug.current) &&
    ${PUBLISHED_ONLY_FILTER}
  ]
  | order(coalesce(publishedAt, _createdAt) desc){
    "id": _id,
    "updatedAt": coalesce(_updatedAt, null),
    "slug": slug.current,
    title,
    category,
    publishedAt,
    "excerpt": coalesce(excerpt, null),
    "coverImageUrl": coalesce(coverImage.asset->url, null)
  }
`);

export const POST_BY_SLUG_QUERY = defineQuery(`
  *[
    _type == "post" &&
    slug.current == $slug &&
    status == "published" &&
    ${PUBLISHED_ONLY_FILTER}
  ][0]{
    "id": _id,
    "updatedAt": coalesce(_updatedAt, null),
    "slug": slug.current,
    title,
    status,
    category,
    publishedAt,
    "excerpt": coalesce(excerpt, null),
    "coverImageUrl": coalesce(coverImage.asset->url, null),
    "body": coalesce(body, []),
    "metaTitle": coalesce(metaTitle, null),
    "metaDescription": coalesce(metaDescription, null),
    "relatedMoneyPageSlug": coalesce(relatedMoneyPage->slug.current, null)
  }
`);

// ─── Content Platform projections (Phase 1) ────────────────────────────────

export const CONTENT_CHILD_NODE_PROJECTION = `{
  "id": _id,
  "slug": slug.current,
  "fullPath": fullPath.current,
  title,
  "quickAnswer": coalesce(quickAnswer, null)
}`;

export const CONTENT_ARTICLE_CARD_PROJECTION = `{
  "id": _id,
  "slug": slug.current,
  "fullPath": fullPath.current,
  title,
  "excerpt": coalesce(excerpt, null),
  "coverImageUrl": coalesce(coverImage.asset->url, null),
  "coverImageAlt": coalesce(coverImage.alt, null),
  "publishedAt": coalesce(publishedAt, null),
  contentFormat
}`;

export const CONTENT_ARTICLE_PROJECTION = `{
  "id": _id,
  "slug": slug.current,
  "fullPath": fullPath.current,
  "updatedAt": coalesce(_updatedAt, null),
  title,
  contentFormat,
  status,
  publishedAt,
  "excerpt": coalesce(excerpt, null),
  "quickAnswer": coalesce(quickAnswer, null),
  seoTitle,
  seoDescription,
  "coverImageUrl": coalesce(coverImage.asset->url, null),
  "coverImageAlt": coalesce(coverImage.alt, null),
  "body": coalesce(body, []),
  "hubSlug": parentHub->slug.current,
  "hubTitle": parentHub->title,
  "hubFullPath": parentHub->fullPath.current,
  "nodeSlug": coalesce(parentNode->slug.current, null),
  "nodeTitle": coalesce(parentNode->title, null),
  "nodeFullPath": coalesce(parentNode->fullPath.current, null),
  "relatedMoneyPageSlug": coalesce(relatedMoneyPage->slug.current, null),
  "relatedFaqs": *[
    _type == "faq" &&
    _id in coalesce(^.relatedFaqs[]._ref, []) &&
    ${PUBLISHED_ONLY_FILTER}
  ]
  | order(coalesce(order, 9999) asc, _createdAt asc)
  ${FAQ_PROJECTION}
}`;

// ─── Content Platform queries (Phase 1) ────────────────────────────────────

export const ROUTE_RESOLUTION_QUERY = defineQuery(`
  *[
    fullPath.current == $path && ${PUBLISHED_ONLY_FILTER} && (
      _type in ["content_hub", "content_node"] ||
      (_type == "content_article" && status == "published")
    )
  ][0]{ _type, "_id": _id, "isIndexed": coalesce(isIndexed, true) }
`);

export const CONTENT_HUB_BY_ID_QUERY = defineQuery(`
  *[
    _type == "content_hub" &&
    _id == $id &&
    ${PUBLISHED_ONLY_FILTER}
  ][0]{
    "id": _id,
    "slug": slug.current,
    "fullPath": fullPath.current,
    "updatedAt": coalesce(_updatedAt, null),
    title,
    seoTitle,
    seoDescription,
    "quickAnswer": coalesce(quickAnswer, null),
    "intro": coalesce(intro, []),
    "isIndexed": coalesce(isIndexed, true),
    "directNodes": *[
      _type == "content_node" &&
      parentHub._ref == ^._id &&
      !defined(parentNode) &&
      coalesce(isIndexed, true) &&
      ${PUBLISHED_ONLY_FILTER}
    ] | order(title asc) ${CONTENT_CHILD_NODE_PROJECTION},
    "directArticles": *[
      _type == "content_article" &&
      parentHub._ref == ^._id &&
      !defined(parentNode) &&
      status == "published" &&
      ${PUBLISHED_ONLY_FILTER}
    ] | order(coalesce(publishedAt, _createdAt) desc) ${CONTENT_ARTICLE_CARD_PROJECTION}
  }
`);

export const CONTENT_NODE_BY_ID_QUERY = defineQuery(`
  *[
    _type == "content_node" &&
    _id == $id &&
    ${PUBLISHED_ONLY_FILTER}
  ][0]{
    "id": _id,
    "slug": slug.current,
    "fullPath": fullPath.current,
    "updatedAt": coalesce(_updatedAt, null),
    title,
    seoTitle,
    seoDescription,
    "quickAnswer": coalesce(quickAnswer, null),
    "intro": coalesce(intro, []),
    "isIndexed": coalesce(isIndexed, true),
    "parentHubSlug": parentHub->slug.current,
    "parentHubTitle": parentHub->title,
    "parentHubFullPath": parentHub->fullPath.current,
    "parentNodeSlug": coalesce(parentNode->slug.current, null),
    "parentNodeTitle": coalesce(parentNode->title, null),
    "parentNodeFullPath": coalesce(parentNode->fullPath.current, null),
    "directNodes": *[
      _type == "content_node" &&
      parentNode._ref == ^._id &&
      coalesce(isIndexed, true) &&
      ${PUBLISHED_ONLY_FILTER}
    ] | order(title asc) ${CONTENT_CHILD_NODE_PROJECTION},
    "directArticles": *[
      _type == "content_article" &&
      parentNode._ref == ^._id &&
      status == "published" &&
      ${PUBLISHED_ONLY_FILTER}
    ] | order(coalesce(publishedAt, _createdAt) desc) ${CONTENT_ARTICLE_CARD_PROJECTION}
  }
`);

export const CONTENT_ARTICLE_BY_ID_QUERY = defineQuery(`
  *[
    _type == "content_article" &&
    _id == $id &&
    status == "published" &&
    ${PUBLISHED_ONLY_FILTER}
  ][0]${CONTENT_ARTICLE_PROJECTION}
`);

export const CONTENT_REDIRECT_QUERY = defineQuery(`
  *[
    _type == "route_redirect" &&
    fromPath == $path &&
    ${PUBLISHED_ONLY_FILTER}
  ][0]{ toPath, "permanent": coalesce(permanent, true) }
`);

/**
 * Reverse-link query: given a money-page slug, fetch all published articles
 * that point to it via `relatedMoneyPage`. Used by the money-page template
 * to surface a "Tài liệu kỹ thuật" section (B.1 — no schema change needed,
 * derived from the article-side edge).
 */
export const ARTICLES_BY_MONEY_PAGE_QUERY = defineQuery(`
  *[
    _type == "content_article" &&
    status == "published" &&
    ${PUBLISHED_ONLY_FILTER} &&
    relatedMoneyPage->slug.current == $moneyPageSlug
  ] | order(coalesce(publishedAt, _createdAt) desc) [0...6]
  ${CONTENT_ARTICLE_CARD_PROJECTION}
`);

export const CONTENT_SITEMAP_QUERY = defineQuery(`
  *[
    (
      (_type in ["content_hub", "content_node"]) ||
      (_type == "content_article" && status == "published")
    ) &&
    defined(fullPath.current) &&
    coalesce(isIndexed, true) &&
    ${PUBLISHED_ONLY_FILTER}
  ]{
    "path": fullPath.current,
    "updatedAt": coalesce(_updatedAt, null),
    "type": _type
  }
`);
