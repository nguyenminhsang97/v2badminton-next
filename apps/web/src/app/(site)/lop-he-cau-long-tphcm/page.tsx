import type { Metadata } from "next";
import {
  generatePublishedMoneyPageMetadata,
  renderPublishedMoneyPage,
  type PublishedMoneyPageRouteConfig,
} from "@/components/money-page/publishedMoneyPageRoute";

const CONFIG = {
  path: "/lop-he-cau-long-tphcm/",
  slug: "lop-he-cau-long-tphcm",
  breadcrumbId: "lop-he-breadcrumb",
  breadcrumbLabel: "Lớp cầu lông hè",
  faqId: "lop-he-faq",
  businessId: "lop-he-business",
} satisfies PublishedMoneyPageRouteConfig;

export async function generateMetadata(): Promise<Metadata> {
  return generatePublishedMoneyPageMetadata(CONFIG);
}

export default async function SummerCampaignPage() {
  return renderPublishedMoneyPage(CONFIG);
}
