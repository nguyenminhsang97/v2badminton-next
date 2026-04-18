"use client";

import { trackEvent } from "@/lib/tracking";
import { HOME_SECTION_IDS } from "@/lib/anchors";

type EnterpriseTeaserProps = {
  onRequestQuote: () => void;
};

export function EnterpriseTeaser({
  onRequestQuote,
}: EnterpriseTeaserProps) {
  return (
    <div className="enterprise-teaser" id={HOME_SECTION_IDS.enterprise}>
      <div className="enterprise-teaser__copy">
        <span className="enterprise-teaser__badge">Doanh nghiệp</span>
        <div className="enterprise-teaser__headline">
          <h3 className="enterprise-teaser__title">Giải pháp cho doanh nghiệp</h3>
          <p className="enterprise-teaser__desc">
            Team building, lớp nội bộ hoặc hoạt động sức khỏe định kỳ, tư vấn theo
            quy mô và ngân sách.
          </p>
        </div>
      </div>

      <div className="enterprise-teaser__actions">
        <button
          type="button"
          className="btn btn--primary"
          onClick={() => {
            onRequestQuote();
            trackEvent("cta_click", {
              cta_name: "nhan_bao_gia",
              cta_location: "enterprise_teaser",
              page_type: "homepage",
              page_path: "/",
            });
          }}
        >
          Nhận báo giá
        </button>
      </div>
    </div>
  );
}
