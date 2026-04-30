import type { Metadata } from "next";
import { MoneyPageTemplate } from "@/components/money-page/MoneyPageTemplate";
import { JsonLd } from "@/components/ui/JsonLd";
import { notFoundForMissingMoneyPage } from "@/lib/moneyPageFailSafe";
import { buildMoneyPageMetadata } from "@/lib/moneyPageMetadata";
import { buildMetadata, canonicalUrl } from "@/lib/routes";
import { getMoneyPage, getScheduleBlocks } from "@/lib/sanity";
import {
  buildBreadcrumbSchema,
  filterScheduleBlocksForLocations,
  buildFaqPageSchema,
  buildLocalPageBusinessSchema,
} from "@/lib/schema";

const PATH = "/lop-cau-long-binh-thanh/" as const;
const SLUG = "lop-cau-long-binh-thanh";

export async function generateMetadata(): Promise<Metadata> {
  const { page: moneyPage } = await getMoneyPage(SLUG);

  if (moneyPage) {
    return buildMoneyPageMetadata(PATH, moneyPage);
  }

  return buildMetadata(PATH);
}

export default async function BinhThanhPage() {
  const [{ page: moneyPage, degraded }, scheduleBlocks] = await Promise.all([
    getMoneyPage(SLUG),
    getScheduleBlocks(),
  ]);

  if (!moneyPage) {
    notFoundForMissingMoneyPage({ slug: SLUG, path: PATH, degraded });
  }

  const localLocations = moneyPage.relatedLocations.filter(
    (location) => location.district === "binh_thanh",
  );
  const localScheduleBlocks = filterScheduleBlocksForLocations(
    scheduleBlocks,
    localLocations,
  );

  return (
    <>
      <JsonLd
        id="binh-thanh-breadcrumb"
        data={buildBreadcrumbSchema([
          { name: "Trang chủ", item: canonicalUrl("/") },
          { name: "Lớp cầu lông Bình Thạnh" },
        ])}
      />
      <JsonLd
        id="binh-thanh-business"
        data={buildLocalPageBusinessSchema(
          PATH,
          localLocations,
          moneyPage.relatedPricing,
          localScheduleBlocks,
        )}
      />
      <JsonLd id="binh-thanh-faq" data={buildFaqPageSchema(moneyPage.relatedFaqs)} />
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
