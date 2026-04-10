import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MoneyPageTemplate } from "@/components/money-page/MoneyPageTemplate";
import { buildMoneyPageMetadata } from "@/lib/moneyPageMetadata";
import { getMoneyPage } from "@/lib/sanity";

const PATH = "/cau-long-doanh-nghiep/";
const SLUG = "cau-long-doanh-nghiep";

export async function generateMetadata(): Promise<Metadata> {
  const moneyPage = await getMoneyPage(SLUG);

  if (!moneyPage) {
    return {};
  }

  return buildMoneyPageMetadata(PATH, moneyPage);
}

export default async function EnterpriseMoneyPage() {
  const moneyPage = await getMoneyPage(SLUG);

  if (!moneyPage) {
    notFound();
  }

  return <MoneyPageTemplate page={moneyPage} />;
}
