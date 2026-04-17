import type {
  SanityActiveCampaign,
  SanityCoach,
  SanityFaq,
  SanityLocation,
  SanityScheduleBlock,
  SanitySiteSettings,
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
};

export type HomepageContactSectionProps = {
  siteSettings: SanitySiteSettings | null;
  locations: SanityLocation[];
  scheduleBlocks: SanityScheduleBlock[];
};
