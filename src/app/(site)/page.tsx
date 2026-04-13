import { BusinessSection } from "@/components/home/BusinessSection";
import { ContactSection } from "@/components/home/ContactSection";
import { CourseSection } from "@/components/home/CourseSection";
import { FaqSection } from "@/components/home/FaqSection";
import { HeroSection } from "@/components/home/HeroSection";
import { HomepageConversionProvider } from "@/components/home/HomepageConversionProvider";
import { LocationsSection } from "@/components/home/LocationsSection";
import { PricingSection } from "@/components/home/PricingSection";
import { ScheduleSection } from "@/components/home/ScheduleSection";
import { SeoLinksBlock } from "@/components/home/SeoLinksBlock";
import { WhySection } from "@/components/home/WhySection";
import { JsonLd } from "@/components/ui/JsonLd";
import { buildMetadata } from "@/lib/routes";
import {
  getFaqs,
  getLocations,
  getPricingTiers,
  getScheduleBlocks,
  getSiteSettings,
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
  const [pricingTiers, scheduleBlocks, locations, faqs, siteSettings] =
    await Promise.all([
      getPricingTiers(),
      getScheduleBlocks(),
      getLocations(),
      getFaqs("homepage"),
      getSiteSettings(),
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
        <HeroSection />
        <PricingSection pricingTiers={pricingTiers} />
        <WhySection />
        <CourseSection />
        <ScheduleSection scheduleBlocks={scheduleBlocks} />
        <LocationsSection locations={locations} />
        <SeoLinksBlock />
        <BusinessSection />
        <FaqSection faqs={faqs} />
        <ContactSection
          siteSettings={siteSettings}
          locations={locations}
          scheduleBlocks={scheduleBlocks}
        />
      </HomepageConversionProvider>
    </>
  );
}
