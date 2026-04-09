import { JsonLd } from "@/components/ui/JsonLd";
import { getFaqsForPage } from "@/lib/faqs";
import { getCourtsForLocalPage } from "@/lib/locations";
import { buildMetadata, canonicalUrl } from "@/lib/routes";
import {
  buildBreadcrumbSchema,
  buildFaqPageSchema,
  buildLocalPageBusinessSchema,
} from "@/lib/schema";

export const metadata = buildMetadata("/lop-cau-long-binh-thanh/");

export default function BinhThanhPage() {
  const courts = getCourtsForLocalPage("/lop-cau-long-binh-thanh/");
  const faqs = getFaqsForPage("binh_thanh");

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
        data={buildLocalPageBusinessSchema("/lop-cau-long-binh-thanh/")}
      />
      <JsonLd id="binh-thanh-faq" data={buildFaqPageSchema("binh_thanh")} />

      <section className="page-shell__section">
        <p className="page-shell__eyebrow">Local SEO Skeleton</p>
        <h1 className="page-shell__title">Lớp Cầu Lông Tại Bình Thạnh — V2 Badminton</h1>
        <p className="page-shell__text">
          Local page này sẽ giữ Green-centric intent, decision-support content và LocalBusiness
          schema của bản production hiện tại.
        </p>
      </section>

      <section className="page-shell__grid">
        {courts.map((court) => (
          <article key={court.id} className="page-card">
            <span className="page-card__meta">{court.districtLabel}</span>
            <strong className="page-card__title">{court.name}</strong>
            <p className="page-card__text">{court.addressText}</p>
          </article>
        ))}
      </section>

      <section className="page-shell__section">
        <p className="page-shell__eyebrow">FAQ Shape</p>
        <div className="page-shell__grid">
          {faqs.map((faq) => (
            <article key={faq.id} className="page-card">
              <strong className="page-card__title">{faq.question}</strong>
              <p className="page-card__text">{faq.answerText}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
