import type { Metadata } from "next";
import {
  generatePublishedMoneyPageMetadata,
  renderPublishedMoneyPage,
  type PublishedMoneyPageRouteConfig,
} from "@/components/money-page/publishedMoneyPageRoute";

const CONFIG = {
  path: "/cau-long-doanh-nghiep/",
  slug: "cau-long-doanh-nghiep",
  breadcrumbId: "doanh-nghiep-breadcrumb",
  breadcrumbLabel: "Chương trình cầu lông doanh nghiệp",
  faqId: "doanh-nghiep-faq",
  businessId: "doanh-nghiep-business",
  degradedMetadataMode: "route",
} satisfies PublishedMoneyPageRouteConfig;

export async function generateMetadata(): Promise<Metadata> {
  return generatePublishedMoneyPageMetadata(CONFIG);
}

export default async function EnterpriseMoneyPage() {
  return renderPublishedMoneyPage(CONFIG);
}
