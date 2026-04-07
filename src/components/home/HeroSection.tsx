"use client";

import { trackEvent } from "@/lib/tracking";

const HERO_HEADING = "Dạy Cầu Lông Bình Thạnh & Thủ Đức";
const HERO_SUBHEADING =
  "Lớp nhóm nhỏ 2-6 người, HLV chuyên nghiệp. Dành cho người mới bắt đầu, nhân viên văn phòng và doanh nghiệp tại TP.HCM.";

const TRUST_STATS = [
  { value: "4", label: "sân tập" },
  { value: "15+", label: "khung giờ" },
  { value: "2-6", label: "người / lớp" },
] as const;

export function HeroSection() {
  return (
    <section className="hero" id="hero">
      <div className="hero__content">
        <h1 className="hero__heading">{HERO_HEADING}</h1>
        <p className="hero__subheading">{HERO_SUBHEADING}</p>

        <div className="hero__cta-group">
          <a
            href="#lien-he"
            className="btn btn--primary btn--lg"
            onClick={() =>
              trackEvent("cta_click", {
                cta_name: "dang_ky_ngay",
                cta_location: "hero",
                page_type: "homepage",
                page_path: "/",
              })
            }
          >
            Đăng ký ngay
          </a>
          <a
            href="#lich-hoc"
            className="btn btn--outline btn--lg"
            onClick={() =>
              trackEvent("cta_click", {
                cta_name: "xem_khoa_hoc",
                cta_location: "hero",
                page_type: "homepage",
                page_path: "/",
              })
            }
          >
            Xem lịch học
          </a>
        </div>

        <div className="hero__trust-strip">
          {TRUST_STATS.map((stat) => (
            <div key={stat.label} className="hero__trust-item">
              <span className="hero__trust-value">{stat.value}</span>
              <span className="hero__trust-label">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
