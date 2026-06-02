// W10.2: title updated in routes.ts — touch to bust Vercel build cache
import type { Metadata } from "next";
import { MoneyPageTemplate } from "@/components/money-page/MoneyPageTemplate";
import { JsonLd } from "@/components/ui/JsonLd";
import { notFoundForMissingMoneyPage } from "@/lib/moneyPageFailSafe";
import { buildMoneyPageMetadata } from "@/lib/moneyPageMetadata";
import { buildMetadata, canonicalUrl } from "@/lib/routes";
import { getMoneyPage, getScheduleBlocks } from "@/lib/sanity";
import { loadSiteChromeSettings } from "@/components/layout/siteSettings";
import {
  buildBreadcrumbSchema,
  filterScheduleBlocksForLocations,
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
  const [{ page: moneyPage, degraded }, scheduleBlocks, chromeSettings] = await Promise.all([
    getMoneyPage(SLUG),
    getScheduleBlocks(),
    loadSiteChromeSettings(),
  ]);

  const contact = {
    phoneE164: chromeSettings.phoneE164,
    facebookUrl: chromeSettings.facebookUrl,
  };

  if (!moneyPage) {
    notFoundForMissingMoneyPage({ slug: SLUG, path: PATH, degraded });
  }

  const localLocations = moneyPage.relatedLocations.filter(
    (location) => location.district === "thu_duc",
  );
  const localScheduleBlocks = filterScheduleBlocksForLocations(
    scheduleBlocks,
    localLocations,
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
          localScheduleBlocks,
          contact,
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
