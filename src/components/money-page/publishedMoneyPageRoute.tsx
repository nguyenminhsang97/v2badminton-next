import type { Metadata } from "next";
import { buildMoneyPageMetadata } from "@/lib/moneyPageMetadata";
import {
  buildPublishedMoneyPageFallback,
  type PublishedMoneyPagePath,
} from "@/lib/moneyPageFallback";
import { buildMetadata } from "@/lib/routes";
import { getMoneyPage } from "@/lib/sanity";
import { MoneyPageStructuredData } from "./MoneyPageStructuredData";
import { MoneyPageTemplate } from "./MoneyPageTemplate";

type DegradedMetadataMode = "route" | "fallback";

const SERVICE_MONEY_PAGE_PATHS = new Set<PublishedMoneyPagePath>([
  "/lop-cau-long-tre-em/",
  "/lop-cau-long-cho-nguoi-di-lam/",
  "/hoc-cau-long-1-kem-1/",
  "/cau-long-doanh-nghiep/",
]);

export type PublishedMoneyPageRouteConfig = {
  path: PublishedMoneyPagePath;
  slug: string;
  breadcrumbId: string;
  breadcrumbLabel: string;
  faqId: string;
  businessId: string;
  degradedMetadataMode?: DegradedMetadataMode;
};

export async function generatePublishedMoneyPageMetadata(
  config: PublishedMoneyPageRouteConfig,
): Promise<Metadata> {
  const { page: moneyPage, degraded } = await getMoneyPage(config.slug);

  if (moneyPage) {
    return buildMoneyPageMetadata(config.path, moneyPage);
  }

  if (config.degradedMetadataMode === "route" && degraded) {
    return buildMetadata(config.path);
  }

  return buildMoneyPageMetadata(
    config.path,
    buildPublishedMoneyPageFallback(config.path),
  );
}

export async function renderPublishedMoneyPage(
  config: PublishedMoneyPageRouteConfig,
) {
  const { page: moneyPage } = await getMoneyPage(config.slug);

  const resolvedPage = moneyPage ?? buildPublishedMoneyPageFallback(config.path);
  const shouldRenderCourseSchema = SERVICE_MONEY_PAGE_PATHS.has(config.path);

  return (
    <>
      <MoneyPageStructuredData
        path={config.path}
        breadcrumbId={config.breadcrumbId}
        breadcrumbLabel={config.breadcrumbLabel}
        courseId={shouldRenderCourseSchema ? `${config.slug}-course` : undefined}
        courseName={shouldRenderCourseSchema ? resolvedPage.h1 : undefined}
        courseDescription={
          shouldRenderCourseSchema ? resolvedPage.metaDescription : undefined
        }
        faqId={config.faqId}
        businessId={config.businessId}
        faqs={resolvedPage.relatedFaqs}
        locations={resolvedPage.relatedLocations}
        pricingTiers={resolvedPage.relatedPricing}
      />
      <MoneyPageTemplate page={resolvedPage} path={config.path} />
    </>
  );
}
