import type { Metadata } from "next";
import { MoneyPageTemplate } from "@/components/money-page/MoneyPageTemplate";
import { JsonLd } from "@/components/ui/JsonLd";
import { notFoundForMissingMoneyPage } from "@/lib/moneyPageFailSafe";
import { NOT_FOUND_METADATA } from "@/lib/notFoundMetadata";
import { buildMoneyPageMetadata } from "@/lib/moneyPageMetadata";
import { canonicalUrl } from "@/lib/routes";
import { getMoneyPage, getScheduleBlocks } from "@/lib/sanity";
import { loadSiteChromeSettings } from "@/components/layout/siteSettings";
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

  // No money page means the route below calls notFound(), so this must not
  // advertise the page as indexable. Measured against a local build with Sanity
  // unreachable: the route served the not-found UI while the metadata still said
  // `index, follow`, next to the noindex Next adds for a not-found render.
  return NOT_FOUND_METADATA;
}

export default async function BinhThanhPage() {
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
          contact,
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
