import type { Metadata } from "next";
import {
  generatePublishedMoneyPageMetadata,
  renderPublishedMoneyPage,
  type PublishedMoneyPageRouteConfig,
} from "@/components/money-page/publishedMoneyPageRoute";

const CONFIG = {
  path: "/lop-cau-long-cho-nguoi-di-lam/",
  slug: "lop-cau-long-cho-nguoi-di-lam",
  breadcrumbId: "nguoi-di-lam-breadcrumb",
  breadcrumbLabel: "Lớp cầu lông cho người đi làm",
  faqId: "nguoi-di-lam-faq",
  businessId: "nguoi-di-lam-business",
  degradedMetadataMode: "route",
} satisfies PublishedMoneyPageRouteConfig;

export async function generateMetadata(): Promise<Metadata> {
  return generatePublishedMoneyPageMetadata(CONFIG);
}

export default async function OfficeWorkerMoneyPage() {
  return renderPublishedMoneyPage(CONFIG);
}
