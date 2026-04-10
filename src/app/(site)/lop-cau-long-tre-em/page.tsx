import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MoneyPageTemplate } from "@/components/money-page/MoneyPageTemplate";
import { buildMoneyPageMetadata } from "@/lib/moneyPageMetadata";
import { getMoneyPage } from "@/lib/sanity";

const PATH = "/lop-cau-long-tre-em/";
const SLUG = "lop-cau-long-tre-em";

export async function generateMetadata(): Promise<Metadata> {
  const moneyPage = await getMoneyPage(SLUG);

  if (!moneyPage) {
    return {};
  }

  return buildMoneyPageMetadata(PATH, moneyPage);
}

export default async function ChildrenMoneyPage() {
  const moneyPage = await getMoneyPage(SLUG);

  if (!moneyPage) {
    notFound();
  }

  return <MoneyPageTemplate page={moneyPage} />;
}
