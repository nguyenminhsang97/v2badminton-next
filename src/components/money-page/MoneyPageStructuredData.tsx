import { JsonLd } from "@/components/ui/JsonLd";
import { canonicalUrl, type CoreRoutePath } from "@/lib/routes";
import type { SanityFaq, SanityLocation, SanityPricingTier } from "@/lib/sanity";
import {
  buildBreadcrumbSchema,
  buildCoursePageSchema,
  buildFaqPageSchema,
  buildHomepageLocalBusinessSchema,
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
}: MoneyPageStructuredDataProps) {
  const hasSchemaFaqs = faqs.some((faq) => faq.includeInSchema);
  const hasCourseSchema = Boolean(courseId && courseName && courseDescription);

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
        data={buildHomepageLocalBusinessSchema(locations, pricingTiers)}
      />
      {hasCourseSchema ? (
        <JsonLd
          id={courseId}
          data={buildCoursePageSchema(path, courseName!, courseDescription!)}
        />
      ) : null}
      {hasSchemaFaqs ? (
        <JsonLd id={faqId} data={buildFaqPageSchema(faqs)} />
      ) : null}
    </>
  );
}
