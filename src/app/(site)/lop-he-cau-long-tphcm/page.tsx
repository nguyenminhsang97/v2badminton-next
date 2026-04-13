import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MoneyPageStructuredData } from "@/components/money-page/MoneyPageStructuredData";
import { MoneyPageTemplate } from "@/components/money-page/MoneyPageTemplate";
import { buildMoneyPageMetadata } from "@/lib/moneyPageMetadata";
import { buildPublishedMoneyPageFallback } from "@/lib/moneyPageFallback";
import { getMoneyPage } from "@/lib/sanity";

const PATH = "/lop-he-cau-long-tphcm/";
const SLUG = "lop-he-cau-long-tphcm";

export async function generateMetadata(): Promise<Metadata> {
  const { page: moneyPage, degraded } = await getMoneyPage(SLUG);

  if (moneyPage) {
    return buildMoneyPageMetadata(PATH, moneyPage);
  }

  if (degraded) {
    return buildMoneyPageMetadata(PATH, buildPublishedMoneyPageFallback(PATH));
  }

  return {};
}

export default async function SummerCampaignPage() {
  const { page: moneyPage, degraded } = await getMoneyPage(SLUG);

  if (!moneyPage && !degraded) {
    notFound();
  }

  const resolvedPage = moneyPage ?? buildPublishedMoneyPageFallback(PATH);

  return (
    <>
      <MoneyPageStructuredData
        path={PATH}
        breadcrumbId="lop-he-breadcrumb"
        breadcrumbLabel="Lớp cầu lông hè"
        faqId="lop-he-faq"
        businessId="lop-he-business"
        faqs={resolvedPage.relatedFaqs}
        locations={resolvedPage.relatedLocations}
        pricingTiers={resolvedPage.relatedPricing}
      />
      <MoneyPageTemplate page={resolvedPage} />
    </>
  );
}
