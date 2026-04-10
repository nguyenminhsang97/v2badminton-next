import type { Metadata } from "next";
import { MoneyPageTemplate } from "@/components/money-page/MoneyPageTemplate";
import { JsonLd } from "@/components/ui/JsonLd";
import { buildMoneyPageMetadata } from "@/lib/moneyPageMetadata";
import { buildMetadata, canonicalUrl } from "@/lib/routes";
import {
  getFaqs,
  getLocations,
  getMoneyPage,
  getPricingTiers,
} from "@/lib/sanity";
import {
  buildBreadcrumbSchema,
  buildFaqPageSchema,
  buildLocalPageBusinessSchema,
} from "@/lib/schema";

const PATH = "/lop-cau-long-binh-thanh/" as const;
const SLUG = "lop-cau-long-binh-thanh";

export async function generateMetadata(): Promise<Metadata> {
  const moneyPage = await getMoneyPage(SLUG);

  if (moneyPage) {
    return buildMoneyPageMetadata(PATH, moneyPage);
  }

  return buildMetadata(PATH);
}

export default async function BinhThanhPage() {
  const moneyPage = await getMoneyPage(SLUG);

  if (moneyPage) {
    const localLocations = moneyPage.relatedLocations.filter(
      (location) => location.district === "binh_thanh",
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
          )}
        />
        <JsonLd
          id="binh-thanh-faq"
          data={buildFaqPageSchema(moneyPage.relatedFaqs)}
        />
        <MoneyPageTemplate
          page={{
            ...moneyPage,
            relatedLocations: localLocations,
          }}
        />
      </>
    );
  }

  const [faqs, locations, pricingTiers] = await Promise.all([
    getFaqs("binh_thanh"),
    getLocations(),
    getPricingTiers(),
  ]);

  const binhThanhLocations = locations.filter(
    (location) => location.district === "binh_thanh",
  );

  return (
    <div className="page-shell">
      <JsonLd
        id="binh-thanh-breadcrumb"
        data={buildBreadcrumbSchema([
          { name: "Trang chủ", item: canonicalUrl("/") },
          { name: "Lớp cầu lông Bình Thạnh" },
        ])}
      />
      <JsonLd
        id="binh-thanh-business"
        data={buildLocalPageBusinessSchema(PATH, binhThanhLocations, pricingTiers)}
      />
      <JsonLd id="binh-thanh-faq" data={buildFaqPageSchema(faqs)} />

      <section className="page-shell__section">
        <p className="page-shell__eyebrow">Local SEO Skeleton</p>
        <h1 className="page-shell__title">
          Lớp Cầu Lông Tại Bình Thạnh - V2 Badminton
        </h1>
        <p className="page-shell__text">
          Local page này sẽ giữ Green-centric intent, decision-support content và
          LocalBusiness schema của bản production hiện tại.
        </p>
      </section>

      <section className="page-shell__grid">
        {binhThanhLocations.length > 0 ? (
          binhThanhLocations.map((location) => (
            <article key={location.id} className="page-card">
              <span className="page-card__meta">{location.districtLabel}</span>
              <strong className="page-card__title">{location.name}</strong>
              <p className="page-card__text">{location.addressText}</p>
            </article>
          ))
        ) : (
          <p className="page-shell__text">Địa điểm đang được cập nhật.</p>
        )}
      </section>

      <section className="page-shell__section">
        <p className="page-shell__eyebrow">FAQ Shape</p>
        {faqs.length > 0 ? (
          <div className="page-shell__grid">
            {faqs.map((faq) => (
              <article key={faq.id} className="page-card">
                <strong className="page-card__title">{faq.question}</strong>
                <p className="page-card__text">{faq.answerPlainText}</p>
              </article>
            ))}
          </div>
        ) : (
          <p className="page-shell__text">FAQ đang được cập nhật.</p>
        )}
      </section>
    </div>
  );
}
