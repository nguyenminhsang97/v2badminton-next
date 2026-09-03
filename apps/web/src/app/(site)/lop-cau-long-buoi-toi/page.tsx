import type { Metadata } from "next";
import {
  generatePublishedMoneyPageMetadata,
  renderPublishedMoneyPage,
  type PublishedMoneyPageRouteConfig,
} from "@/components/money-page/publishedMoneyPageRoute";

const CONFIG = {
  path: "/lop-cau-long-buoi-toi/",
  slug: "lop-cau-long-buoi-toi",
  breadcrumbId: "buoi-toi-breadcrumb",
  breadcrumbLabel: "Lớp cầu lông buổi tối",
  faqId: "buoi-toi-faq",
  businessId: "buoi-toi-business",
} satisfies PublishedMoneyPageRouteConfig;

export async function generateMetadata(): Promise<Metadata> {
  return generatePublishedMoneyPageMetadata(CONFIG);
}

export default async function EveningMoneyPage() {
  return renderPublishedMoneyPage(CONFIG);
}
