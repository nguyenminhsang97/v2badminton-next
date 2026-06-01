import type { Metadata } from "next";
import { loadSiteChromeSettings } from "@/components/layout/siteSettings";
import { buildMoneyPageMetadata } from "@/lib/moneyPageMetadata";
import {
  buildPublishedMoneyPageFallback,
  type PublishedMoneyPagePath,
} from "@/lib/moneyPageFallback";
import { buildMetadata } from "@/lib/routes";
import { getMoneyPage, getScheduleBlocks } from "@/lib/sanity";
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

  // Both fallback branches return noindex: a page with placeholder body content
  // must never be indexed regardless of which metadata path produced the title.
  // Trade-off: a transient Sanity outage on a real page temporarily makes it
  // noindex. Outages are rare and short; indexing placeholder copy is materially
  // worse for SEO. A last-known-good content cache would remove this trade-off —
  // flagged for the CMS migration handoff brief (W4.1).
  if (config.degradedMetadataMode === "route" && degraded) {
    return { ...buildMetadata(config.path), robots: { index: false, follow: true } };
  }

  return {
    ...buildMoneyPageMetadata(
      config.path,
      buildPublishedMoneyPageFallback(config.path),
    ),
    robots: { index: false, follow: true },
  };
}

export async function renderPublishedMoneyPage(
  config: PublishedMoneyPageRouteConfig,
) {
  const [{ page: moneyPage }, scheduleBlocks, chromeSettings] = await Promise.all([
    getMoneyPage(config.slug),
    getScheduleBlocks(),
    loadSiteChromeSettings(),
  ]);

  const contact = {
    phoneE164: chromeSettings.phoneE164,
    facebookUrl: chromeSettings.facebookUrl,
  };

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
        scheduleBlocks={scheduleBlocks}
        contact={contact}
      />
      <MoneyPageTemplate page={resolvedPage} path={config.path} />
    </>
  );
}
