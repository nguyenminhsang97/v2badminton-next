import type { Metadata } from "next";
import {
  generatePublishedMoneyPageMetadata,
  renderPublishedMoneyPage,
  type PublishedMoneyPageRouteConfig,
} from "@/components/money-page/publishedMoneyPageRoute";

const CONFIG = {
  path: "/lop-cau-long-tre-em/",
  slug: "lop-cau-long-tre-em",
  breadcrumbId: "tre-em-breadcrumb",
  breadcrumbLabel: "Lớp cầu lông trẻ em",
  faqId: "tre-em-faq",
  businessId: "tre-em-business",
  degradedMetadataMode: "route",
} satisfies PublishedMoneyPageRouteConfig;

export async function generateMetadata(): Promise<Metadata> {
  return generatePublishedMoneyPageMetadata(CONFIG);
}

export default async function ChildrenMoneyPage() {
  return renderPublishedMoneyPage(CONFIG);
}
