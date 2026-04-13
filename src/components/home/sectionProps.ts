import type {
  SanityFaq,
  SanityLocation,
  SanityPricingTier,
  SanityScheduleBlock,
  SanitySiteSettings,
} from "@/lib/sanity";

export type HomepageFaqSectionProps = {
  faqs: SanityFaq[];
};

export type HomepagePricingSectionProps = {
  pricingTiers: SanityPricingTier[];
};

export type HomepageScheduleSectionProps = {
  scheduleBlocks: SanityScheduleBlock[];
};

export type HomepageLocationsSectionProps = {
  locations: SanityLocation[];
};

export type HomepageContactSectionProps = {
  siteSettings: SanitySiteSettings | null;
  locations: SanityLocation[];
  scheduleBlocks: SanityScheduleBlock[];
};
