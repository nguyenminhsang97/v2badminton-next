"use client";

import { trackEvent } from "@/lib/tracking";

const HERO_EYEBROW = "Bình Thạnh & Thủ Đức — TP.HCM";

const HERO_SUBHEADING =
  "V2 Badminton có lớp cho người mới bắt đầu, người đi làm cần lịch buổi tối hoặc cuối tuần, và học viên muốn học 1 kèm 1 bài bản tại 4 sân ở Bình Thạnh và Thủ Đức.";

const TRUST_STATS = [
  { value: "4", label: "Sân tập" },
  { value: "2", label: "Quận phủ sóng" },
  { value: "1:1", label: "Kèm riêng" },
] as const;

export function HeroSection() {
  return (
    <section className="hero" id="hero">
      <div className="hero__content">
        <p className="hero__eyebrow">{HERO_EYEBROW}</p>
        <h1 className="hero__heading">
          HỌC CẦU LÔNG
          <br />
          TẠI TP.HCM
          <br />
          <span className="hero__heading-accent">BÌNH THẠNH &amp; THỦ ĐỨC</span>
        </h1>
        <p className="hero__subheading">{HERO_SUBHEADING}</p>

        <p className="hero__quick-links">
          Tìm nhanh:{" "}
          <a href="/hoc-cau-long-cho-nguoi-moi/">người mới</a>,{" "}
          <a href="/lop-cau-long-binh-thanh/">Bình Thạnh</a>,{" "}
          <a href="/lop-cau-long-thu-duc/">Thủ Đức</a>,{" "}
          <a href="/lop-cau-long-tre-em/">trẻ em</a>,{" "}
          <a href="/lop-cau-long-cho-nguoi-di-lam/">người đi làm</a>,{" "}
          <a href="/cau-long-doanh-nghiep/">doanh nghiệp</a>.
        </p>

        <div className="hero__cta-group">
          <a
            href="#lien-he"
            className="btn btn--primary btn--lg"
            onClick={() =>
              trackEvent("cta_click", {
                cta_name: "dang_ky_hoc_thu",
                cta_location: "hero",
                page_type: "homepage",
                page_path: "/",
              })
            }
          >
            Đăng ký học thử →
          </a>
          <a
            href="#khoa-hoc"
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
            Xem khóa học
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

      {/* Decorative orb - hidden from assistive tech */}
      <div className="hero__shuttle" aria-hidden="true">
        <div className="hero__shuttle-ring" />
        <div className="hero__shuttle-ring" />
        <div className="hero__shuttle-ring" />
        <div className="hero__shuttle-icon" />
      </div>
    </section>
  );
}
