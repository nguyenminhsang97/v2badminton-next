import type {
  HomepageCoach,
  HomepageFaq,
  HomepageHeroCampaign,
  HomepageLocation,
  HomepageScheduleBlock,
  HomepageTestimonial,
} from "@/domain/homepage";
import type { SiteChromeSettings } from "@/components/layout/siteSettings";
import type {
  SanityHomepageBasicSection,
  SanityHomepageCourseSection,
  SanityHomepageEnterpriseTeaser,
  SanityHomepageHeadingOnlySection,
  SanityHomepageHero,
  SanityHomepagePricingStrip,
  SanityHomepageStatsBar,
  SanityHomepageWhySection,
  SanityPricingTier,
} from "@/lib/sanity";

export type HomepageHeroSectionProps = {
  campaign: HomepageHeroCampaign | null;
  content?: SanityHomepageHero | null;
  facebookUrl: string;
};

export type HomepageCoachSectionProps = {
  coaches: HomepageCoach[];
  content?: SanityHomepageBasicSection | null;
};

export type HomepageFaqSectionProps = {
  faqs: HomepageFaq[];
  content?: SanityHomepageHeadingOnlySection | null;
};

export type HomepageTestimonialsSectionProps = {
  testimonials: HomepageTestimonial[];
  content?: SanityHomepageHeadingOnlySection | null;
};

export type HomepageScheduleSectionProps = {
  scheduleBlocks: HomepageScheduleBlock[];
  content?: SanityHomepageBasicSection | null;
};

export type HomepageLocationsSectionProps = {
  locations: HomepageLocation[];
  siteSettings: SiteChromeSettings;
  content?: SanityHomepageBasicSection | null;
};

export type HomepageContactSectionProps = {
  siteSettings: SiteChromeSettings;
  locations: HomepageLocation[];
  scheduleBlocks: HomepageScheduleBlock[];
};

export type HomepageStatsSectionProps = {
  content?: SanityHomepageStatsBar | null;
};

export type HomepageWhySectionProps = {
  content?: SanityHomepageWhySection | null;
};

export type HomepageCourseSectionProps = {
  pricingTiers: SanityPricingTier[];
  content?: SanityHomepageCourseSection | null;
};

export type HomepagePricingStripProps = {
  tiers: readonly SanityPricingTier[];
  content?: SanityHomepagePricingStrip | null;
};

export type HomepageEnterpriseTeaserProps = {
  content?: SanityHomepageEnterpriseTeaser | null;
};
