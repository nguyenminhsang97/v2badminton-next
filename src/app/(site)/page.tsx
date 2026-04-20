import { Suspense } from "react";
import { HomepageBusinessModeInitializer } from "@/components/home/conversion/HomepageBusinessModeInitializer";
import { HomepageConversionProvider } from "@/components/home/conversion/HomepageConversionProvider";
import { assertLegacyScheduleCompatibility } from "@/components/home/compat/legacyScheduleCompatibility";
import { CoachSection } from "@/components/home/sections/CoachSection";
import { CourseSection } from "@/components/home/sections/CourseSection";
import { DeferredContactSection } from "@/components/home/sections/DeferredContactSection";
import { DeferredScheduleSection } from "@/components/home/sections/DeferredScheduleSection";
import { DeferredTestimonialsSection } from "@/components/home/sections/DeferredTestimonialsSection";
import { FaqSection } from "@/components/home/sections/FaqSection";
import { HeroSection } from "@/components/home/sections/HeroSection";
import { LocationsSection } from "@/components/home/sections/LocationsSection";
import { StatsBar } from "@/components/home/sections/StatsBar";
import { WhySection } from "@/components/home/sections/WhySection";
import { loadSiteChromeSettings } from "@/components/layout/siteSettings";
import { JsonLd } from "@/components/ui/JsonLd";
import { HOMEPAGE_TESTIMONIAL_FALLBACKS } from "@/content/homepage-testimonials.fallback";
import {
  toHomepageCoaches,
  toHomepageFaqs,
  toHomepageHeroCampaign,
  toHomepageLocations,
  toHomepageScheduleBlocks,
  toHomepageTestimonials,
} from "@/domain/homepage";
import { buildMetadata } from "@/lib/routes";
import {
  getActiveCampaign,
  getCoaches,
  getFaqs,
  getLocations,
  getPricingTiers,
  getScheduleBlocks,
  getTestimonials,
} from "@/lib/sanity";
import {
  buildCourseSchemas,
  buildFaqPageSchema,
  buildHomepageLocalBusinessSchema,
  buildOrganizationSchema,
  buildWebsiteSchema,
} from "@/lib/schema";

export const metadata = buildMetadata("/");

export default async function Home() {
  const [
    campaign,
    pricingTiers,
    scheduleBlocks,
    locations,
    faqs,
    chromeSettings,
    coaches,
    testimonials,
  ] =
    await Promise.all([
      getActiveCampaign(),
      getPricingTiers(),
      getScheduleBlocks(),
      getLocations(),
      getFaqs("homepage", true, 5),
      loadSiteChromeSettings(),
      getCoaches(true, 3),
      getTestimonials(true, 6),
    ]);

  const courseSchemas = buildCourseSchemas(pricingTiers);
  const homepageCampaign = toHomepageHeroCampaign(campaign);
  const homepageCoaches = toHomepageCoaches(coaches);
  const homepageFaqs = toHomepageFaqs(faqs);
  const homepageLocations = toHomepageLocations(locations);
  const homepageScheduleBlocks = toHomepageScheduleBlocks(scheduleBlocks);
  const homepageTestimonials = toHomepageTestimonials(
    testimonials.length > 0 ? testimonials : HOMEPAGE_TESTIMONIAL_FALLBACKS,
  );

  assertLegacyScheduleCompatibility(homepageLocations, homepageScheduleBlocks);

  return (
    <>
      <JsonLd id="organization-schema" data={buildOrganizationSchema()} />
      <JsonLd id="website-schema" data={buildWebsiteSchema()} />
      <JsonLd
        id="homepage-business-schema"
        data={buildHomepageLocalBusinessSchema(locations, pricingTiers)}
      />
      <JsonLd id="homepage-faq-schema" data={buildFaqPageSchema(faqs)} />
      <JsonLd id="homepage-course-schema" data={courseSchemas} />

      <HomepageConversionProvider>
        <Suspense fallback={null}>
          <HomepageBusinessModeInitializer />
        </Suspense>
        <div className="home-page">
          <HeroSection campaign={homepageCampaign} />
          <StatsBar />
          <CourseSection pricingTiers={pricingTiers} />
          <WhySection />
          <CoachSection coaches={homepageCoaches} />
          <DeferredTestimonialsSection testimonials={homepageTestimonials} />
          <DeferredScheduleSection scheduleBlocks={homepageScheduleBlocks} />
          <LocationsSection
            locations={homepageLocations}
            siteSettings={chromeSettings}
          />
          <FaqSection faqs={homepageFaqs} />
          <DeferredContactSection
            siteSettings={chromeSettings}
            locations={homepageLocations}
            scheduleBlocks={homepageScheduleBlocks}
          />
        </div>
      </HomepageConversionProvider>
    </>
  );
}
