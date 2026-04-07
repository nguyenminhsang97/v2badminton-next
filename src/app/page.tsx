import { JsonLd } from "@/components/ui/JsonLd";
import { buildMetadata } from "@/lib/routes";
import {
  buildCourseSchemas,
  buildFaqPageSchema,
  buildHomepageLocalBusinessSchema,
  buildOrganizationSchema,
  buildWebsiteSchema,
} from "@/lib/schema";

import { HomepageConversionProvider } from "@/components/home/HomepageConversionProvider";
import { HeroSection } from "@/components/home/HeroSection";
import { PricingSection } from "@/components/home/PricingSection";
import { WhySection } from "@/components/home/WhySection";
import { SeoLinksBlock } from "@/components/home/SeoLinksBlock";
import { CourseSection } from "@/components/home/CourseSection";
import { ScheduleSection } from "@/components/home/ScheduleSection";
import { LocationsSection } from "@/components/home/LocationsSection";
import { BusinessSection } from "@/components/home/BusinessSection";
import { FaqSection } from "@/components/home/FaqSection";
import { ContactSection } from "@/components/home/ContactSection";

// S2-A0: Homepage metadata — verify-only, already wired in Sprint 1
export const metadata = buildMetadata("/");

export default function Home() {
  const courseSchemas = buildCourseSchemas();

  return (
    <>
      {/* JSON-LD — S2-E4: verify baseline survives homepage rewrite */}
      <JsonLd id="organization-schema" data={buildOrganizationSchema()} />
      <JsonLd id="website-schema" data={buildWebsiteSchema()} />
      <JsonLd id="homepage-business-schema" data={buildHomepageLocalBusinessSchema()} />
      <JsonLd id="homepage-faq-schema" data={buildFaqPageSchema("homepage")} />
      <JsonLd id="homepage-course-schema" data={courseSchemas} />

      {/* S2-B6: Single conversion-state owner wraps all interactive sections */}
      <HomepageConversionProvider>
        <HeroSection />
        <PricingSection />
        <WhySection />
        <CourseSection />
        <ScheduleSection />
        <LocationsSection />
        <SeoLinksBlock />
        <BusinessSection />
        <FaqSection />
        <ContactSection />
      </HomepageConversionProvider>
    </>
  );
}
