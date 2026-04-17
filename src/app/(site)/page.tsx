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
import {
  toHomepageCoaches,
  toHomepageFaqs,
  toHomepageHeroCampaign,
  toHomepageLocations,
  toHomepageScheduleBlocks,
  toHomepageTestimonials,
} from "@/domain/homepage";
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
  const homepageCampaign = toHomepageHeroCampaign(campaign);
  const homepageCoaches = toHomepageCoaches(coaches);
  const homepageFaqs = toHomepageFaqs(faqs);
  const homepageLocations = toHomepageLocations(locations);
  const homepageScheduleBlocks = toHomepageScheduleBlocks(scheduleBlocks);
  const homepageTestimonials = toHomepageTestimonials(
    testimonials.length > 0 ? testimonials : HOMEPAGE_TESTIMONIAL_FALLBACKS,
  );

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
          <TestimonialsSection testimonials={homepageTestimonials} />
          <ScheduleSection scheduleBlocks={homepageScheduleBlocks} />
          <LocationsSection
            locations={homepageLocations}
            siteSettings={chromeSettings}
          />
          <FaqSection faqs={homepageFaqs} />
          <ContactFormErrorBoundary>
            <section className="section contact-section" id="lien-he">
              <HomepageScrollCoordinator />
              <ContactForm
                contactSettings={chromeSettings}
                locations={homepageLocations}
                scheduleBlocks={homepageScheduleBlocks}
              />
            </section>
          </ContactFormErrorBoundary>
        </div>
      </HomepageConversionProvider>
    </>
  );
}
