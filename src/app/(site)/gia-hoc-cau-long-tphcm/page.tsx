import type { Metadata } from "next";
import {
  generatePublishedMoneyPageMetadata,
  renderPublishedMoneyPage,
  type PublishedMoneyPageRouteConfig,
} from "@/components/money-page/publishedMoneyPageRoute";

const CONFIG = {
  path: "/gia-hoc-cau-long-tphcm/",
  slug: "gia-hoc-cau-long-tphcm",
  breadcrumbId: "bang-gia-breadcrumb",
  breadcrumbLabel: "Giá học cầu lông TP.HCM",
  faqId: "bang-gia-faq",
  businessId: "bang-gia-business",
} satisfies PublishedMoneyPageRouteConfig;

export async function generateMetadata(): Promise<Metadata> {
  return generatePublishedMoneyPageMetadata(CONFIG);
}

export default async function PricingGuideMoneyPage() {
  return renderPublishedMoneyPage(CONFIG);
}
