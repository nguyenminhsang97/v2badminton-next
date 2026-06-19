import type { Metadata } from "next";
import {
  generatePublishedMoneyPageMetadata,
  renderPublishedMoneyPage,
  type PublishedMoneyPageRouteConfig,
} from "@/components/money-page/publishedMoneyPageRoute";

const CONFIG = {
  path: "/team-building-cau-long/",
  slug: "team-building-cau-long",
  breadcrumbId: "team-building-breadcrumb",
  breadcrumbLabel: "Team building cầu lông",
  faqId: "team-building-faq",
  businessId: "team-building-business",
} satisfies PublishedMoneyPageRouteConfig;

export async function generateMetadata(): Promise<Metadata> {
  return generatePublishedMoneyPageMetadata(CONFIG);
}

export default async function TeamBuildingMoneyPage() {
  return renderPublishedMoneyPage(CONFIG);
}
