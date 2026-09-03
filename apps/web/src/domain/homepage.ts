import type {
  SanityActiveCampaign,
  SanityCoach,
  SanityFaq,
  SanityLocation,
  SanityScheduleBlock,
  SanityTestimonial,
} from "@/lib/sanity";

export type HomepageHeroCampaign = Pick<
  SanityActiveCampaign,
  | "id"
  | "slug"
  | "name"
  | "status"
  | "startDate"
  | "endDate"
  | "badgeText"
  | "heroTitle"
  | "heroDescription"
  | "primaryCtaLabel"
  | "primaryCtaUrl"
  | "secondaryCtaLabel"
  | "secondaryCtaUrl"
  | "featuredAudience"
  | "linkedPageSlug"
>;

export type HomepageCoach = Pick<
  SanityCoach,
  | "id"
  | "name"
  | "photoUrl"
  | "photoAlt"
  | "teachingGroup"
  | "approach"
  | "roleBadge"
  | "credentialTags"
  | "quote"
  | "focusLine"
  | "proofLabel"
  | "showStars"
  | "featured"
  | "homepageOrder"
  | "order"
>;

export type HomepageTestimonial = Pick<
  SanityTestimonial,
  | "id"
  | "studentName"
  | "avatarUrl"
  | "avatarAlt"
  | "studentGroup"
  | "kicker"
  | "rating"
  | "contextLabel"
  | "shortQuote"
  | "content"
  | "featured"
  | "homepageOrder"
  | "order"
>;

export type HomepageLocation = Pick<
  SanityLocation,
  | "id"
  | "slug"
  | "name"
  | "shortName"
  | "district"
  | "districtLabel"
  | "localPage"
  | "addressText"
  | "mapsUrl"
  | "imageUrl"
  | "imageAlt"
  | "geoLat"
  | "geoLng"
  | "order"
>;

export type HomepageScheduleBlock = Pick<
  SanityScheduleBlock,
  | "id"
  | "slug"
  | "locationId"
  | "locationName"
  | "locationShortName"
  | "locationDistrict"
  | "dayGroup"
  | "timeLabel"
  | "timeSlotId"
  | "levels"
  | "order"
>;

export type HomepageFaq = Pick<
  SanityFaq,
  | "id"
  | "question"
  | "answer"
  | "answerPlainText"
  | "pages"
  | "includeInSchema"
  | "featured"
  | "homepageOrder"
  | "order"
>;

export function toHomepageHeroCampaign(
  campaign: SanityActiveCampaign | null,
): HomepageHeroCampaign | null {
  return campaign ? { ...campaign } : null;
}

export function toHomepageCoaches(
  coaches: readonly SanityCoach[],
): HomepageCoach[] {
  return coaches.map((coach) => ({ ...coach }));
}

export function toHomepageTestimonials(
  testimonials: readonly SanityTestimonial[],
): HomepageTestimonial[] {
  return testimonials.map((testimonial) => ({ ...testimonial }));
}

export function toHomepageLocations(
  locations: readonly SanityLocation[],
): HomepageLocation[] {
  return locations.map((location) => ({ ...location }));
}

export function toHomepageScheduleBlocks(
  scheduleBlocks: readonly SanityScheduleBlock[],
): HomepageScheduleBlock[] {
  return scheduleBlocks.map((scheduleBlock) => ({ ...scheduleBlock }));
}

export function toHomepageFaqs(faqs: readonly SanityFaq[]): HomepageFaq[] {
  return faqs.map((faq) => ({ ...faq }));
}
