import type {
  HomepageCoach,
  HomepageFaq,
  HomepageHeroCampaign,
  HomepageLocation,
  HomepageScheduleBlock,
  HomepageTestimonial,
} from "@/domain/homepage";
import type { SiteChromeSettings } from "@/components/layout/siteSettings";

export type HomepageHeroSectionProps = {
  campaign: HomepageHeroCampaign | null;
};

export type HomepageCoachSectionProps = {
  coaches: HomepageCoach[];
};

export type HomepageFaqSectionProps = {
  faqs: HomepageFaq[];
};

export type HomepageTestimonialsSectionProps = {
  testimonials: HomepageTestimonial[];
};

export type HomepageScheduleSectionProps = {
  scheduleBlocks: HomepageScheduleBlock[];
};

export type HomepageLocationsSectionProps = {
  locations: HomepageLocation[];
  siteSettings: SiteChromeSettings;
};

export type HomepageContactSectionProps = {
  siteSettings: SiteChromeSettings;
  locations: HomepageLocation[];
  scheduleBlocks: HomepageScheduleBlock[];
};
