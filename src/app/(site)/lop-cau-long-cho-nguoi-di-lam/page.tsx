import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MoneyPageStructuredData } from "@/components/money-page/MoneyPageStructuredData";
import { MoneyPageTemplate } from "@/components/money-page/MoneyPageTemplate";
import { buildMoneyPageMetadata } from "@/lib/moneyPageMetadata";
import { getMoneyPage } from "@/lib/sanity";

const PATH = "/lop-cau-long-cho-nguoi-di-lam/";
const SLUG = "lop-cau-long-cho-nguoi-di-lam";

export async function generateMetadata(): Promise<Metadata> {
  const moneyPage = await getMoneyPage(SLUG);

  if (!moneyPage) {
    return {};
  }

  return buildMoneyPageMetadata(PATH, moneyPage);
}

export default async function OfficeWorkerMoneyPage() {
  const moneyPage = await getMoneyPage(SLUG);

  if (!moneyPage) {
    notFound();
  }

  return (
    <>
      <MoneyPageStructuredData
        path={PATH}
        breadcrumbId="nguoi-di-lam-breadcrumb"
        breadcrumbLabel="Lớp cầu lông cho người đi làm"
        faqId="nguoi-di-lam-faq"
        businessId="nguoi-di-lam-business"
        faqs={moneyPage.relatedFaqs}
        locations={moneyPage.relatedLocations}
        pricingTiers={moneyPage.relatedPricing}
      />
      <MoneyPageTemplate page={moneyPage} />
    </>
  );
}
