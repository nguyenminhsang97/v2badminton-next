import { JsonLd } from "@/components/ui/JsonLd";
import { canonicalUrl, type CoreRoutePath } from "@/lib/routes";
import type {
  SanityFaq,
  SanityLocation,
  SanityPricingTier,
  SanityScheduleBlock,
} from "@/lib/sanity";
import {
  buildBreadcrumbSchema,
  buildCoursePageSchema,
  buildFaqPageSchema,
  buildHomepageLocalBusinessSchema,
  filterScheduleBlocksForLocations,
  type ContactDetails,
} from "@/lib/schema";

type MoneyPageStructuredDataProps = {
  path: CoreRoutePath;
  breadcrumbId: string;
  breadcrumbLabel: string;
  courseId?: string;
  courseName?: string;
  courseDescription?: string;
  faqId: string;
  businessId: string;
  faqs: SanityFaq[];
  locations: SanityLocation[];
  pricingTiers: SanityPricingTier[];
  scheduleBlocks?: SanityScheduleBlock[];
  contact: ContactDetails;
};

export function MoneyPageStructuredData({
  path,
  breadcrumbId,
  breadcrumbLabel,
  courseId,
  courseName,
  courseDescription,
  faqId,
  businessId,
  faqs,
  locations,
  pricingTiers,
  scheduleBlocks = [],
  contact,
}: MoneyPageStructuredDataProps) {
  const hasSchemaFaqs = faqs.some((faq) => faq.includeInSchema);
  const hasCourseSchema = Boolean(courseId && courseName && courseDescription);
  const schemaScheduleBlocks =
    locations.length > 0
      ? filterScheduleBlocksForLocations(scheduleBlocks, locations)
      : scheduleBlocks;

  return (
    <>
      <JsonLd
        id={breadcrumbId}
        data={buildBreadcrumbSchema([
          { name: "Trang chủ", item: canonicalUrl("/") },
          { name: breadcrumbLabel, item: canonicalUrl(path) },
        ])}
      />
      <JsonLd
        id={businessId}
        data={buildHomepageLocalBusinessSchema(
          locations,
          pricingTiers,
          schemaScheduleBlocks,
          contact,
        )}
      />
      {hasCourseSchema ? (
        <JsonLd
          id={courseId}
          data={buildCoursePageSchema(path, courseName!, courseDescription!, {
            locations,
            pricingTiers,
            scheduleBlocks: schemaScheduleBlocks,
          })}
        />
      ) : null}
      {hasSchemaFaqs ? (
        <JsonLd id={faqId} data={buildFaqPageSchema(faqs)} />
      ) : null}
    </>
  );
}
