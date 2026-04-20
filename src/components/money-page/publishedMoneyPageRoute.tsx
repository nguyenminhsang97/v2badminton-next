import type { Metadata } from "next";
import { notFound } from "next/navigation";
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
  const { page: moneyPage, degraded } = await getMoneyPage(config.slug);

  if (!moneyPage && config.degradedMetadataMode === "route" && degraded) {
    notFound();
  }

  const resolvedPage = moneyPage ?? buildPublishedMoneyPageFallback(config.path);

  return (
    <>
      <MoneyPageStructuredData
        path={config.path}
        breadcrumbId={config.breadcrumbId}
        breadcrumbLabel={config.breadcrumbLabel}
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
