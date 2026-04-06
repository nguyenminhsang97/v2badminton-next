import { JsonLd } from "@/components/ui/JsonLd";
import { getFaqsForPage } from "@/lib/faqs";
import { pricingTiers } from "@/lib/pricing";
import { buildMetadata, canonicalUrl } from "@/lib/routes";
import { buildBreadcrumbSchema, buildFaqPageSchema } from "@/lib/schema";

export const metadata = buildMetadata("/hoc-cau-long-cho-nguoi-moi/");

export default function BeginnerPage() {
  const beginnerFaqs = getFaqsForPage("nguoi_moi");
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
      <JsonLd id="nguoi-moi-faq" data={buildFaqPageSchema("nguoi_moi")} />

      <section className="page-shell__section">
        <p className="page-shell__eyebrow">SEO Route Skeleton</p>
        <h1 className="page-shell__title">Học Cầu Lông Cho Người Mới Bắt Đầu Tại TP.HCM</h1>
        <p className="page-shell__text">
          Route này sẽ là page SEO service mạnh nhất của site, nên Sprint 1 khóa luôn metadata,
          pricing source-of-truth và FAQ data shape để Sprint 3 chỉ còn port content thật và schema.
        </p>
      </section>

      <section className="page-shell__grid">
        {visibleTiers.map((tier) => (
          <article key={tier.id} className="page-card">
            <span className="page-card__meta">{tier.shortLabel}</span>
            <strong className="page-card__title">{tier.displayPrice}</strong>
            <p className="page-card__text">{tier.description}</p>
          </article>
        ))}
      </section>

      <section className="page-shell__section">
        <p className="page-shell__eyebrow">FAQ Shape</p>
        <div className="page-shell__grid">
          {beginnerFaqs.map((faq) => (
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
