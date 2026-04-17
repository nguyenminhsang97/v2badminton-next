import type { Metadata } from "next";
import {
  generatePublishedMoneyPageMetadata,
  renderPublishedMoneyPage,
  type PublishedMoneyPageRouteConfig,
} from "@/components/money-page/publishedMoneyPageRoute";

const CONFIG = {
  path: "/lop-cau-long-cuoi-tuan/",
  slug: "lop-cau-long-cuoi-tuan",
  breadcrumbId: "cuoi-tuan-breadcrumb",
  breadcrumbLabel: "Lớp cầu lông cuối tuần",
  faqId: "cuoi-tuan-faq",
  businessId: "cuoi-tuan-business",
} satisfies PublishedMoneyPageRouteConfig;

export async function generateMetadata(): Promise<Metadata> {
  return generatePublishedMoneyPageMetadata(CONFIG);
}

export default async function WeekendMoneyPage() {
  return renderPublishedMoneyPage(CONFIG);
}
