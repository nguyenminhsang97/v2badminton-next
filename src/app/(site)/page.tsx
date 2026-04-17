import { Suspense } from "react";
import { HomepageBusinessModeInitializer } from "@/components/home/HomepageBusinessModeInitializer";
import { CoachSection } from "@/components/home/CoachSection";
import { ContactSection } from "@/components/home/ContactSection";
import { ContactFormErrorBoundary } from "@/components/home/ContactFormErrorBoundary";
import { CourseSection } from "@/components/home/CourseSection";
import { FaqSection } from "@/components/home/FaqSection";
import { HeroSection } from "@/components/home/HeroSection";
import { HomepageConversionProvider } from "@/components/home/HomepageConversionProvider";
import { LocationsSection } from "@/components/home/LocationsSection";
import { ScheduleSection } from "@/components/home/ScheduleSection";
import { StatsBar } from "@/components/home/StatsBar";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { WhySection } from "@/components/home/WhySection";
import { loadSiteChromeSettings } from "@/components/layout/siteSettings";
import { JsonLd } from "@/components/ui/JsonLd";
import { buildMetadata } from "@/lib/routes";
import {
  getActiveCampaign,
  getHomepageCoaches,
  getHomepageFaqs,
  getHomepageTestimonials,
  getLocations,
  getPricingTiers,
  getScheduleBlocks,
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
      getHomepageFaqs(),
      loadSiteChromeSettings(),
      getHomepageCoaches(),
      getHomepageTestimonials(),
    ]);

  const courseSchemas = buildCourseSchemas(pricingTiers);

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
          <HeroSection campaign={campaign} />
          <StatsBar />
          <CourseSection pricingTiers={pricingTiers} />
          <WhySection />
          <CoachSection coaches={coaches} />
          <TestimonialsSection testimonials={testimonials} />
          <ScheduleSection scheduleBlocks={scheduleBlocks} />
          <LocationsSection locations={locations} siteSettings={chromeSettings} />
          <FaqSection faqs={faqs} />
          <ContactFormErrorBoundary>
            <ContactSection
              siteSettings={chromeSettings}
              locations={locations}
              scheduleBlocks={scheduleBlocks}
            />
          </ContactFormErrorBoundary>
        </div>
      </HomepageConversionProvider>
    </>
  );
}
