import { JsonLd } from "@/components/ui/JsonLd";
import { getFaqsForPage } from "@/lib/faqs";
import { getCourtsForLocalPage } from "@/lib/locations";
import { buildMetadata, canonicalUrl } from "@/lib/routes";
import {
  buildBreadcrumbSchema,
  buildFaqPageSchema,
  buildLocalPageBusinessSchema,
} from "@/lib/schema";

export const metadata = buildMetadata("/lop-cau-long-thu-duc/");

export default function ThuDucPage() {
  const courts = getCourtsForLocalPage("/lop-cau-long-thu-duc/");
  const faqs = getFaqsForPage("thu_duc");

  return (
    <div className="page-shell">
      <JsonLd
        id="thu-duc-breadcrumb"
        data={buildBreadcrumbSchema([
          { name: "Trang chủ", item: canonicalUrl("/") },
          { name: "Lớp cầu lông Thủ Đức" },
        ])}
      />
      <JsonLd
        id="thu-duc-business"
        data={buildLocalPageBusinessSchema("/lop-cau-long-thu-duc/")}
      />
      <JsonLd id="thu-duc-faq" data={buildFaqPageSchema("thu_duc")} />

      <section className="page-shell__section">
        <p className="page-shell__eyebrow">Local SEO Skeleton</p>
        <h1 className="page-shell__title">Lớp Cầu Lông Tại Thủ Đức — V2 Badminton</h1>
        <p className="page-shell__text">
          Route này giữ cấu trúc multi-location cho Huệ Thiên, Khang Sport và Phúc Lộc,
          cùng local schema và decision-support sections của production.
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
