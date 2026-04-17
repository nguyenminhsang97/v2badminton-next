import type { SiteChromeSettings } from "@/components/layout/siteSettings";
import type {
  SanityActiveCampaign,
  SanityCoach,
  SanityFaq,
  SanityLocation,
  SanityScheduleBlock,
  SanityTestimonial,
} from "@/lib/sanity";

export type HomepageHeroSectionProps = {
  campaign: SanityActiveCampaign | null;
};

export type HomepageCoachSectionProps = {
  coaches: SanityCoach[];
};

export type HomepageFaqSectionProps = {
  faqs: SanityFaq[];
};

export type HomepageTestimonialsSectionProps = {
  testimonials: SanityTestimonial[];
};

export type HomepageScheduleSectionProps = {
  scheduleBlocks: SanityScheduleBlock[];
};

export type HomepageLocationsSectionProps = {
  locations: SanityLocation[];
  siteSettings: SiteChromeSettings;
};

export type HomepageContactSectionProps = {
  siteSettings: SiteChromeSettings;
  locations: SanityLocation[];
  scheduleBlocks: SanityScheduleBlock[];
};
