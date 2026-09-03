"use client";

import { trackEvent } from "@/lib/tracking";
import { HOME_SECTION_IDS } from "@/lib/anchors";

import type { SanityHomepageEnterpriseTeaser } from "@/lib/sanity";

type EnterpriseTeaserProps = {
  onRequestQuote: () => void;
  content?: SanityHomepageEnterpriseTeaser | null;
};

export function EnterpriseTeaser({
  onRequestQuote,
  content,
}: EnterpriseTeaserProps) {
  const badge = content?.badge ?? "Doanh nghiệp";
  const title = content?.title ?? "Giải pháp cho doanh nghiệp";
  const description =
    content?.description ??
    "Team building, lớp nội bộ hoặc hoạt động sức khỏe định kỳ, tư vấn theo quy mô và ngân sách.";
  const ctaLabel = content?.ctaLabel ?? "Nhận báo giá";

  return (
    <section className="section enterprise-section" id={HOME_SECTION_IDS.enterprise}>
      <div className="enterprise-teaser">
        <div className="enterprise-teaser__copy">
          <span className="enterprise-teaser__badge">{badge}</span>
          <div className="enterprise-teaser__headline">
            <h3 className="enterprise-teaser__title">{title}</h3>
            <p className="enterprise-teaser__desc">{description}</p>
          </div>
        </div>

        <div className="enterprise-teaser__actions">
          <button
            type="button"
            className="btn btn--primary"
            onClick={() => {
              onRequestQuote();
              trackEvent("cta_click", {
                // GA event name stays hardcoded — not CMS-driven (W2 ticket §D7)
                cta_name: "nhan_bao_gia",
                cta_location: "enterprise_teaser",
                page_type: "homepage",
                page_path: "/",
              });
            }}
          >
            {ctaLabel}
          </button>
        </div>
      </div>
    </section>
  );
}
