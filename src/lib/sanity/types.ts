import {
  AUDIENCE_OPTIONS,
  BILLING_MODEL_OPTIONS,
  CTA_ACTION_OPTIONS,
  DISTRICT_OPTIONS,
  FAQ_PAGE_OPTIONS,
  SCHEDULE_LEVEL_OPTIONS,
  STUDENT_GROUP_OPTIONS,
} from "@/sanity/schemaTypes/shared";

export type SanityDistrict = (typeof DISTRICT_OPTIONS)[number]["value"];
export type SanityFaqPage = (typeof FAQ_PAGE_OPTIONS)[number]["value"];
export type SanityScheduleLevel =
  (typeof SCHEDULE_LEVEL_OPTIONS)[number]["value"];
export type SanityBillingModel =
  (typeof BILLING_MODEL_OPTIONS)[number]["value"];
export type SanityPricingCtaAction =
  (typeof CTA_ACTION_OPTIONS)[number]["value"];
export type SanityStudentGroup =
  (typeof STUDENT_GROUP_OPTIONS)[number]["value"];
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
  updatedAt: string | null;
  name: string;
  photoUrl: string | null;
  photoAlt: string | null;
  teachingGroup: string;
  approach: string;
  roleBadge: string | null;
  credentialTags: string[];
  quote: string | null;
  focusLine: string | null;
  proofLabel: string | null;
  showStars: boolean;
  featured: boolean;
  homepageOrder: number;
  order: number;
};

export type SanityTestimonial = {
  id: string;
  studentName: string;
  avatarUrl: string | null;
  avatarAlt: string | null;
  studentGroup: SanityStudentGroup;
  kicker: string | null;
  rating: number;
  contextLabel: string | null;
  shortQuote: string | null;
  content: string;
  featured: boolean;
  homepageOrder: number;
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
  featured: boolean;
  homepageOrder: number;
  order: number;
};

export type SanityMoneyPage = {
  id: string;
  updatedAt: string | null;
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

export type SanityMoneyPageSitemapEntry = {
  slug: string;
  updatedAt: string | null;
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

export type SanityPostStatus = "draft" | "published";
export type SanityPostCategory = "tips" | "how-to" | "beginner" | "campaign";

export type SanityPost = {
  id: string;
  updatedAt: string | null;
  slug: string;
  title: string;
  status: SanityPostStatus;
  category: SanityPostCategory;
  publishedAt: string | null;
  excerpt: string | null;
  coverImageUrl: string | null;
  body: SanityPortableTextBlock[];
  metaTitle: string | null;
  metaDescription: string | null;
  relatedMoneyPageSlug: string | null;
};

export type SanityPostListItem = Pick<
  SanityPost,
  | "id"
  | "updatedAt"
  | "slug"
  | "title"
  | "category"
  | "publishedAt"
  | "excerpt"
  | "coverImageUrl"
>;
