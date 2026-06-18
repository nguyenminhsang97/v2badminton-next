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

/**
 * Inline body image — emitted by content_article.body for `_type == "bodyImage"`
 * array members. Discriminator MUST match the Sanity array-member `name`
 * ("bodyImage"), not the underlying schema `type` ("image").
 */
export type SanityArticleBodyImageSize = "inline" | "wide" | "full";

export type SanityArticleBodyImage = {
  _key?: string;
  _type: "bodyImage";
  url: string | null;
  alt: string;
  caption: string | null;
  size: SanityArticleBodyImageSize;
  width: number | null;
  height: number | null;
  lqip: string | null;
  hotspot:
    | { x: number; y: number; height: number; width: number }
    | null;
};

export type SanityArticleBodyNode =
  | SanityPortableTextBlock
  | SanityArticleBodyImage;

export type SanitySiteSettingsNav = {
  ctaLabel: string | null;
};

export type SanitySiteSettingsFooter = {
  brandSubtitle: string | null;
  brandCopy: string | null;
  col1Heading: string | null;
  col2Heading: string | null;
  col3Heading: string | null;
};

export type SanitySiteSettingsCmsUiStrings = {
  quickAnswerLabel: string | null;
  readArticleCta: string | null;
  exploreNodeCta: string | null;
  hubEyebrow: string | null;
  faqEyebrow: string | null;
  faqTitle: string | null;
  articleAsideLabel: string | null;
  articleAsideTitle: string | null;
  articleAsideCta: string | null;
  techDocEyebrow: string | null;
  techDocTitle: string | null;
  techDocCategory: string | null;
  moneyPricingEyebrow: string | null;
  moneyPricingTitle: string | null;
  moneyLocationsEyebrow: string | null;
  moneyLocationsTitle: string | null;
  moneyFaqEyebrow: string | null;
  moneyFaqTitle: string | null;
  moneyRelatedPagesEyebrow: string | null;
  moneyRelatedPagesTitle: string | null;
  moneyCtaEyebrow: string | null;
  moneyCtaTitle: string | null;
};

export type SanitySiteSettings = {
  id: string;
  siteName: string;
  phoneDisplay: string;
  phoneE164: string;
  zaloNumber: string;
  facebookUrl: string;
  defaultOgImageUrl: string | null;
  nav: SanitySiteSettingsNav | null;
  footer: SanitySiteSettingsFooter | null;
  cmsUiStrings: SanitySiteSettingsCmsUiStrings | null;
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

// ─── Content Platform (Phase 1) ────────────────────────────────────────────

export type SanityContentFormat = "guide" | "how_to" | "explainer";
export type SanityContentStatus = "draft" | "published";

export type SanityContentHub = {
  id: string;
  slug: string;
  fullPath: string;
  title: string;
  seoTitle: string;
  seoDescription: string;
  quickAnswer: string | null;
  intro: SanityPortableTextBlock[];
  isIndexed: boolean;
  updatedAt: string | null;
  directArticles: SanityContentArticleCard[];
  directNodes: SanityContentChildNode[];
};

export type SanityContentNode = SanityContentHub & {
  parentHubSlug: string;
  parentHubTitle: string;
  parentHubFullPath: string;
  parentNodeSlug: string | null;
  parentNodeTitle: string | null;
  parentNodeFullPath: string | null;
};

export type SanityArticleCoachByline = {
  id: string;
  name: string;
  credentialTags: string[];
};

export type SanityArticleAuthor =
  | { kind: "organization"; coach?: undefined }
  | { kind: "coach"; coach: SanityArticleCoachByline };

export type SanityContentArticle = {
  id: string;
  slug: string;
  fullPath: string;
  title: string;
  seoTitle: string;
  seoDescription: string;
  contentFormat: SanityContentFormat;
  status: SanityContentStatus;
  publishedAt: string | null;
  updatedAt: string | null;
  excerpt: string | null;
  quickAnswer: string | null;
  coverImageUrl: string | null;
  coverImageAlt: string | null;
  body: SanityArticleBodyNode[];
  hubSlug: string;
  hubTitle: string;
  hubFullPath: string;
  nodeSlug: string | null;
  nodeTitle: string | null;
  nodeFullPath: string | null;
  relatedFaqs: SanityFaq[];
  relatedMoneyPageSlug: string | null;
  author: SanityArticleAuthor;
  reviewer: SanityArticleCoachByline | null;
  lastReviewed: string | null;
};

export type SanityContentArticleCard = {
  id: string;
  slug: string;
  fullPath: string;
  title: string;
  excerpt: string | null;
  coverImageUrl: string | null;
  coverImageAlt: string | null;
  publishedAt: string | null;
  contentFormat: SanityContentFormat;
};

export type SanityContentChildNode = {
  id: string;
  slug: string;
  fullPath: string;
  title: string;
  quickAnswer: string | null;
};

export type SanityRouteResolution = {
  _type: "content_hub" | "content_node" | "content_article" | "court";
  _id: string;
  isIndexed: boolean;
};

export type SanityRouteRedirect = {
  toPath: string;
  permanent: boolean;
};

// ─── Homepage singleton (W2) ────────────────────────────────────────────────

export type SanityHomepageStatIcon =
  | "users"
  | "trophy"
  | "shuttle"
  | "calendar"
  | "mapPin"
  | "arrowRight";

export type SanityHomepageHero = {
  statusLabel: string | null;
  subheading: string | null;
  primaryCtaLabel: string | null;
  secondaryCtaLabel: string | null;
  heroImageAlt: string | null;
};

export type SanityHomepageStatItem = {
  value: string | null;
  label: string | null;
  icon: SanityHomepageStatIcon | null;
};

export type SanityHomepageStatsBar = {
  items: SanityHomepageStatItem[];
};

export type SanityHomepageProofStat = {
  value: string | null;
  statTitle: string | null;
  statDescription: string | null;
};

export type SanityHomepageDifferentiator = {
  title: string | null;
  description: string | null;
  icon: SanityHomepageStatIcon | null;
};

export type SanityHomepageWhySection = {
  eyebrow: string | null;
  title: string | null;
  description: string | null;
  proofStat: SanityHomepageProofStat | null;
  differentiators: SanityHomepageDifferentiator[];
};

export type SanityHomepageCourseCard = {
  categoryBadge: string | null;
  levelChip: string | null;
  title: string | null;
  subtitle: string | null;
  description: string | null;
  amount: string | null;
  meta: string | null;
  imageAlt: string | null;
  linkedMoneyPageSlug: string | null;
};

export type SanityHomepageCourseSection = {
  eyebrow: string | null;
  title: string | null;
  cards: SanityHomepageCourseCard[];
};

export type SanityHomepageBasicSection = {
  eyebrow: string | null;
  title: string | null;
  description: string | null;
};

export type SanityHomepageHeadingOnlySection = {
  eyebrow: string | null;
  title: string | null;
};

export type SanityHomepagePricingStrip = {
  eyebrow: string | null;
  title: string | null;
  secondary: string | null;
};

export type SanityHomepageEnterpriseTeaser = {
  badge: string | null;
  title: string | null;
  description: string | null;
  ctaLabel: string | null;
};

export type SanityHomepageContent = {
  id: string;
  updatedAt: string | null;
  hero: SanityHomepageHero | null;
  statsBar: SanityHomepageStatsBar | null;
  whySection: SanityHomepageWhySection | null;
  courseSection: SanityHomepageCourseSection | null;
  locationsSection: SanityHomepageBasicSection | null;
  faqSection: SanityHomepageHeadingOnlySection | null;
  pricingStrip: SanityHomepagePricingStrip | null;
  scheduleSection: SanityHomepageBasicSection | null;
  coachSection: SanityHomepageBasicSection | null;
  testimonialsSection: SanityHomepageHeadingOnlySection | null;
  enterpriseTeaser: SanityHomepageEnterpriseTeaser | null;
};

export type SanityContentSitemapEntry = {
  path: string;
  updatedAt: string | null;
  type: "content_hub" | "content_node" | "content_article" | "court";
};

// ─── Court directory (Phase 2 — locked spec: .claude/CMS/v2badminton-cms-phase-2-locked-spec.md) ──

export type SanityCourtSurface = "wood" | "synthetic" | "acrylic" | "concrete" | "other";
export type SanityCourtLighting = "excellent" | "good" | "adequate" | "poor";
export type SanityCourtParking = "free" | "paid" | "street_only" | "none";
export type SanityCourtBestFor =
  | "beginner"
  | "intermediate"
  | "advanced"
  | "kids"
  | "evening_play"
  | "morning_play"
  | "tournament_practice";

export type SanityCourtOpeningHoursDay = {
  open: string | null;
  close: string | null;
};

export type SanityCourtOpeningHours = {
  monday: SanityCourtOpeningHoursDay | null;
  tuesday: SanityCourtOpeningHoursDay | null;
  wednesday: SanityCourtOpeningHoursDay | null;
  thursday: SanityCourtOpeningHoursDay | null;
  friday: SanityCourtOpeningHoursDay | null;
  saturday: SanityCourtOpeningHoursDay | null;
  sunday: SanityCourtOpeningHoursDay | null;
};

export type SanityCourtContactInfo = {
  phone: string | null;
  facebookUrl: string | null;
  bookingUrl: string | null;
};

export type SanityCourt = {
  id: string;
  slug: string;
  fullPath: string;
  updatedAt: string | null;
  name: string;
  shortName: string;
  status: SanityContentStatus;
  publishedAt: string | null;
  lastReviewedAt: string | null;
  addressText: string;
  mapsUrl: string;
  geoLat: number | null;
  geoLng: number | null;
  courtCount: number | null;
  surfaceType: SanityCourtSurface | null;
  lighting: SanityCourtLighting | null;
  parking: SanityCourtParking | null;
  priceRangeText: string | null;
  openingHours: SanityCourtOpeningHours | null;
  contactInfo: SanityCourtContactInfo | null;
  reviewSummary: SanityPortableTextBlock[];
  pros: string[];
  cons: string[];
  bestFor: SanityCourtBestFor[];
  v2PartnerNote: string | null;
  coverImageUrl: string | null;
  coverImageAlt: string | null;
  gallery: Array<{ url: string; alt: string | null }>;
  quickAnswer: string | null;
  seoTitle: string;
  seoDescription: string;
  hubSlug: string;
  hubTitle: string;
  hubFullPath: string;
  nodeSlug: string | null;
  nodeTitle: string | null;
  nodeFullPath: string | null;
  relatedFaqs: SanityFaq[];
  relatedMoneyPageSlug: string | null;
};

export type SanityCourtCard = {
  id: string;
  slug: string;
  fullPath: string;
  name: string;
  shortName: string;
  quickAnswer: string | null;
  coverImageUrl: string | null;
  coverImageAlt: string | null;
  lastReviewedAt: string | null;
  publishedAt: string | null;
};

// ─── Static pages (W3b) ────────────────────────────────────────────────────

export type SanityStaticPageOgImage = {
  url: string;
  alt: string;
  hotspot: unknown;
  crop: unknown;
};

/**
 * Projection type for STATIC_PAGE_QUERY.
 * All optional fields are null when not set in the CMS.
 * Renderer falls back to FALLBACK_* constants for every null field.
 */
export type SanityStaticPage = {
  slug: string;
  title: string | null;
  breadcrumbLabel: string | null;
  eyebrow: string | null;
  lead: string | null;
  body: SanityPortableTextBlock[] | null;
  seoTitle: string | null;
  seoDescription: string | null;
  ogImage: SanityStaticPageOgImage | null;
};
