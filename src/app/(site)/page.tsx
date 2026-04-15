import { Suspense } from "react";
import { BusinessSection } from "@/components/home/BusinessSection";
import { HomepageBusinessModeInitializer } from "@/components/home/HomepageBusinessModeInitializer";
import { CoachSection } from "@/components/home/CoachSection";
import { ContactSection } from "@/components/home/ContactSection";
import { ContactFormErrorBoundary } from "@/components/home/ContactFormErrorBoundary";
import { CourseSection } from "@/components/home/CourseSection";
import { FaqSection } from "@/components/home/FaqSection";
import { HeroSection } from "@/components/home/HeroSection";
import { HomepageConversionProvider } from "@/components/home/HomepageConversionProvider";
import { LocationsSection } from "@/components/home/LocationsSection";
import { PricingSection } from "@/components/home/PricingSection";
import { ScheduleSection } from "@/components/home/ScheduleSection";
import { SeoLinksBlock } from "@/components/home/SeoLinksBlock";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { WhySection } from "@/components/home/WhySection";
import { JsonLd } from "@/components/ui/JsonLd";
import { buildMetadata } from "@/lib/routes";
import {
  getActiveCampaign,
  getCoaches,
  getFaqs,
  getLocations,
  getPricingTiers,
  getScheduleBlocks,
  getSiteSettings,
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
    siteSettings,
    coaches,
    testimonials,
  ] =
    await Promise.all([
      getActiveCampaign(),
      getPricingTiers(),
      getScheduleBlocks(),
      getLocations(),
      getFaqs("homepage"),
      getSiteSettings(),
      getCoaches(),
      getTestimonials(),
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
        <HeroSection campaign={campaign} />
        <CourseSection />
        <WhySection />
        <CoachSection coaches={coaches} />
        <PricingSection pricingTiers={pricingTiers} />
        <ScheduleSection scheduleBlocks={scheduleBlocks} />
        <TestimonialsSection testimonials={testimonials} />
        <LocationsSection locations={locations} />
        <FaqSection faqs={faqs} />
        <ContactFormErrorBoundary>
          <ContactSection
            siteSettings={siteSettings}
            locations={locations}
            scheduleBlocks={scheduleBlocks}
          />
        </ContactFormErrorBoundary>
        <BusinessSection />
        <SeoLinksBlock />
      </HomepageConversionProvider>
    </>
  );
}
