import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MoneyPageStructuredData } from "@/components/money-page/MoneyPageStructuredData";
import { MoneyPageTemplate } from "@/components/money-page/MoneyPageTemplate";
import { buildMoneyPageMetadata } from "@/lib/moneyPageMetadata";
import { buildPublishedMoneyPageFallback } from "@/lib/moneyPageFallback";
import { buildMetadata } from "@/lib/routes";
import { getMoneyPage } from "@/lib/sanity";

const PATH = "/lop-cau-long-cho-nguoi-di-lam/";
const SLUG = "lop-cau-long-cho-nguoi-di-lam";

export async function generateMetadata(): Promise<Metadata> {
  const { page: moneyPage, degraded } = await getMoneyPage(SLUG);

  if (moneyPage) {
    return buildMoneyPageMetadata(PATH, moneyPage);
  }

  if (degraded) {
    return buildMetadata(PATH);
  }

  return {};
}

export default async function OfficeWorkerMoneyPage() {
  const { page: moneyPage, degraded } = await getMoneyPage(SLUG);

  if (!moneyPage && !degraded) {
    notFound();
  }

  const resolvedPage = moneyPage ?? buildPublishedMoneyPageFallback(PATH);

  return (
    <>
      <MoneyPageStructuredData
        path={PATH}
        breadcrumbId="nguoi-di-lam-breadcrumb"
        breadcrumbLabel="Lớp cầu lông cho người đi làm"
        faqId="nguoi-di-lam-faq"
        businessId="nguoi-di-lam-business"
        faqs={resolvedPage.relatedFaqs}
        locations={resolvedPage.relatedLocations}
        pricingTiers={resolvedPage.relatedPricing}
      />
      <MoneyPageTemplate page={resolvedPage} />
    </>
  );
}
