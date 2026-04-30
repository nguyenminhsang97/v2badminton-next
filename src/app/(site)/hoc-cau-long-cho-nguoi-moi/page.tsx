import type { Metadata } from "next";
import { MoneyPageTemplate } from "@/components/money-page/MoneyPageTemplate";
import { JsonLd } from "@/components/ui/JsonLd";
import { notFoundForMissingMoneyPage } from "@/lib/moneyPageFailSafe";
import { buildMoneyPageMetadata } from "@/lib/moneyPageMetadata";
import { buildMetadata, canonicalUrl } from "@/lib/routes";
import { getMoneyPage } from "@/lib/sanity";
import {
  buildBreadcrumbSchema,
  buildCoursePageSchema,
  buildFaqPageSchema,
} from "@/lib/schema";

const PATH = "/hoc-cau-long-cho-nguoi-moi/" as const;
const SLUG = "hoc-cau-long-cho-nguoi-moi";

export async function generateMetadata(): Promise<Metadata> {
  const { page: moneyPage } = await getMoneyPage(SLUG);

  if (moneyPage) {
    return buildMoneyPageMetadata(PATH, moneyPage);
  }

  return buildMetadata(PATH);
}

export default async function BeginnerPage() {
  const { page: moneyPage, degraded } = await getMoneyPage(SLUG);

  if (!moneyPage) {
    notFoundForMissingMoneyPage({ slug: SLUG, path: PATH, degraded });
  }

  return (
    <>
      <JsonLd
        id="nguoi-moi-breadcrumb"
        data={buildBreadcrumbSchema([
          { name: "Trang chủ", item: canonicalUrl("/") },
          { name: "Học cầu lông cho người mới bắt đầu" },
        ])}
      />
      <JsonLd id="nguoi-moi-faq" data={buildFaqPageSchema(moneyPage.relatedFaqs)} />
      <JsonLd
        id="nguoi-moi-course"
        data={buildCoursePageSchema(
          PATH,
          moneyPage.h1,
          moneyPage.metaDescription,
        )}
      />
      <MoneyPageTemplate page={moneyPage} path={PATH} />
    </>
  );
}
