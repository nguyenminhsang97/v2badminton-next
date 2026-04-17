import { Suspense } from "react";
import { HomepageBusinessModeInitializer } from "@/components/home/HomepageBusinessModeInitializer";
import { CoachSection } from "@/components/home/CoachSection";
import { ContactFormErrorBoundary } from "@/components/home/ContactFormErrorBoundary";
import { ContactForm } from "@/components/home/ContactForm";
import { CourseSection } from "@/components/home/CourseSection";
import { FaqSection } from "@/components/home/FaqSection";
import { HeroSection } from "@/components/home/HeroSection";
import { HomepageConversionProvider } from "@/components/home/HomepageConversionProvider";
import { HomepageScrollCoordinator } from "@/components/home/HomepageScrollCoordinator";
import { LocationsSection } from "@/components/home/LocationsSection";
import { ScheduleSection } from "@/components/home/ScheduleSection";
import { StatsBar } from "@/components/home/StatsBar";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { WhySection } from "@/components/home/WhySection";
import { loadSiteChromeSettings } from "@/components/layout/siteSettings";
import { HOMEPAGE_TESTIMONIAL_FALLBACKS } from "@/content/homepage-testimonials.fallback";
import { JsonLd } from "@/components/ui/JsonLd";
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
  const homepageTestimonials =
    testimonials.length > 0 ? testimonials : HOMEPAGE_TESTIMONIAL_FALLBACKS;

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
          <TestimonialsSection testimonials={homepageTestimonials} />
          <ScheduleSection scheduleBlocks={scheduleBlocks} />
          <LocationsSection locations={locations} siteSettings={chromeSettings} />
          <FaqSection faqs={faqs} />
          <ContactFormErrorBoundary>
            <section className="section contact-section" id="lien-he">
              <HomepageScrollCoordinator />
              <ContactForm
                contactSettings={chromeSettings}
                locations={locations}
                scheduleBlocks={scheduleBlocks}
              />
            </section>
          </ContactFormErrorBoundary>
        </div>
      </HomepageConversionProvider>
    </>
  );
}
