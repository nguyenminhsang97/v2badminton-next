import { JsonLd } from "@/components/ui/JsonLd";
import { buildMetadata, canonicalUrl } from "@/lib/routes";
import { getFaqs, getLocations, getPricingTiers } from "@/lib/sanity";
import {
  buildBreadcrumbSchema,
  buildFaqPageSchema,
  buildLocalPageBusinessSchema,
} from "@/lib/schema";

export const metadata = buildMetadata("/lop-cau-long-thu-duc/");

export default async function ThuDucPage() {
  const [faqs, locations, pricingTiers] = await Promise.all([
    getFaqs("thu_duc"),
    getLocations(),
    getPricingTiers(),
  ]);

  const thuDucLocations = locations.filter(
    (location) => location.district === "thu_duc",
  );

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
        data={buildLocalPageBusinessSchema(
          "/lop-cau-long-thu-duc/",
          thuDucLocations,
          pricingTiers,
        )}
      />
      <JsonLd id="thu-duc-faq" data={buildFaqPageSchema(faqs)} />

      <section className="page-shell__section">
        <p className="page-shell__eyebrow">Local SEO Skeleton</p>
        <h1 className="page-shell__title">
          Lớp Cầu Lông Tại Thủ Đức - V2 Badminton
        </h1>
        <p className="page-shell__text">
          Route này giữ cấu trúc multi-location cho Huệ Thiên, Khang Sport và
          Phúc Lộc, cùng local schema và decision-support sections của production.
        </p>
      </section>

      <section className="page-shell__grid">
        {thuDucLocations.length > 0 ? (
          thuDucLocations.map((location) => (
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
