import type { Metadata } from "next";
import { MoneyPageTemplate } from "@/components/money-page/MoneyPageTemplate";
import { JsonLd } from "@/components/ui/JsonLd";
import { notFoundForMissingMoneyPage } from "@/lib/moneyPageFailSafe";
import { buildMoneyPageMetadata } from "@/lib/moneyPageMetadata";
import { buildMetadata, canonicalUrl } from "@/lib/routes";
import { getMoneyPage } from "@/lib/sanity";
import {
  buildBreadcrumbSchema,
  buildFaqPageSchema,
  buildLocalPageBusinessSchema,
} from "@/lib/schema";

const PATH = "/lop-cau-long-thu-duc/" as const;
const SLUG = "lop-cau-long-thu-duc";

export async function generateMetadata(): Promise<Metadata> {
  const { page: moneyPage } = await getMoneyPage(SLUG);

  if (moneyPage) {
    return buildMoneyPageMetadata(PATH, moneyPage);
  }

  return buildMetadata(PATH);
}

export default async function ThuDucPage() {
  const { page: moneyPage, degraded } = await getMoneyPage(SLUG);

  if (!moneyPage) {
    notFoundForMissingMoneyPage({ slug: SLUG, path: PATH, degraded });
  }

  const localLocations = moneyPage.relatedLocations.filter(
    (location) => location.district === "thu_duc",
  );

  return (
    <>
      <JsonLd
        id="thu-duc-breadcrumb"
        data={buildBreadcrumbSchema([
          { name: "Trang chủ", item: canonicalUrl("/") },
          { name: "Lớp cầu lông Thủ Đức" },
        ])}
      />
      <JsonLd
        id="thu-duc-business"
        data={buildLocalPageBusinessSchema(
          PATH,
          localLocations,
          moneyPage.relatedPricing,
        )}
      />
      <JsonLd id="thu-duc-faq" data={buildFaqPageSchema(moneyPage.relatedFaqs)} />
      <MoneyPageTemplate
        page={{
          ...moneyPage,
          relatedLocations: localLocations,
        }}
        path={PATH}
      />
    </>
  );
}
