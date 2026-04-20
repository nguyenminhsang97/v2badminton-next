import type { Metadata } from "next";
import { MoneyPageTemplate } from "@/components/money-page/MoneyPageTemplate";
import { JsonLd } from "@/components/ui/JsonLd";
import { buildMoneyPageMetadata } from "@/lib/moneyPageMetadata";
import { buildMetadata, canonicalUrl, getRouteMetadata } from "@/lib/routes";
import { getFaqs, getMoneyPage, getPricingTiers } from "@/lib/sanity";
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
  const { page: moneyPage } = await getMoneyPage(SLUG);
  const fallbackRoute = getRouteMetadata(PATH);
  const courseName =
    moneyPage?.h1 ?? "Học cầu lông cho người mới bắt đầu tại TP.HCM";
  const courseDescription =
    moneyPage?.metaDescription ?? fallbackRoute.description;

  if (moneyPage) {
    return (
      <>
        <JsonLd
          id="nguoi-moi-breadcrumb"
          data={buildBreadcrumbSchema([
            { name: "Trang chủ", item: canonicalUrl("/") },
            { name: "Học cầu lông cho người mới bắt đầu" },
          ])}
        />
        <JsonLd
          id="nguoi-moi-faq"
          data={buildFaqPageSchema(moneyPage.relatedFaqs)}
        />
        <JsonLd
          id="nguoi-moi-course"
          data={buildCoursePageSchema(PATH, courseName, courseDescription)}
        />
        <MoneyPageTemplate page={moneyPage} path={PATH} />
      </>
    );
  }

  const [beginnerFaqs, pricingTiers] = await Promise.all([
    getFaqs("nguoi_moi"),
    getPricingTiers(),
  ]);

  const visibleTiers = pricingTiers.filter((tier) => tier.kind !== "enterprise");

  return (
    <div className="page-shell">
      <JsonLd
        id="nguoi-moi-breadcrumb"
        data={buildBreadcrumbSchema([
          { name: "Trang chủ", item: canonicalUrl("/") },
          { name: "Học cầu lông cho người mới bắt đầu" },
        ])}
      />
      <JsonLd id="nguoi-moi-faq" data={buildFaqPageSchema(beginnerFaqs)} />
      <JsonLd
        id="nguoi-moi-course"
        data={buildCoursePageSchema(PATH, courseName, courseDescription)}
      />

      <section className="page-shell__section">
        <p className="page-shell__eyebrow">SEO Route Skeleton</p>
        <h1 className="page-shell__title">
          Học Cầu Lông Cho Người Mới Bắt Đầu Tại TP.HCM
        </h1>
        <p className="page-shell__text">
          Route này sẽ là page SEO service mạnh nhất của site, nên Sprint 1 khóa
          luôn metadata, pricing source-of-truth và FAQ data shape để Sprint 3
          chỉ còn port content thật và schema.
        </p>
      </section>

      <section className="page-shell__grid">
        {visibleTiers.length > 0 ? (
          visibleTiers.map((tier) => (
            <article key={tier.id} className="page-card">
              <span className="page-card__meta">{tier.shortLabel}</span>
              <strong className="page-card__title">{tier.displayPrice}</strong>
              <p className="page-card__text">{tier.description}</p>
            </article>
          ))
        ) : (
          <p className="page-shell__text">Học phí đang được cập nhật.</p>
        )}
      </section>

      <section className="page-shell__section">
        <p className="page-shell__eyebrow">FAQ Shape</p>
        {beginnerFaqs.length > 0 ? (
          <div className="page-shell__grid">
            {beginnerFaqs.map((faq) => (
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
