import type { Metadata } from "next";
import {
  generatePublishedMoneyPageMetadata,
  renderPublishedMoneyPage,
  type PublishedMoneyPageRouteConfig,
} from "@/components/money-page/publishedMoneyPageRoute";

const CONFIG = {
  path: "/hoc-cau-long-1-kem-1/",
  slug: "hoc-cau-long-1-kem-1",
  breadcrumbId: "kem-rieng-breadcrumb",
  breadcrumbLabel: "Học cầu lông 1 kèm 1",
  faqId: "kem-rieng-faq",
  businessId: "kem-rieng-business",
} satisfies PublishedMoneyPageRouteConfig;

export async function generateMetadata(): Promise<Metadata> {
  return generatePublishedMoneyPageMetadata(CONFIG);
}

export default async function PrivateCoachingPage() {
  return renderPublishedMoneyPage(CONFIG);
}
