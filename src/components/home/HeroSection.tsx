"use client";

import { trackEvent } from "@/lib/tracking";
import type { HomepageHeroSectionProps } from "./sectionProps";

const DEFAULT_HERO_EYEBROW = "Bình Thạnh & Thủ Đức — TP.HCM";

const DEFAULT_HERO_SUBHEADING =
  "V2 Badminton có lớp cho người mới bắt đầu, người đi làm cần lịch buổi tối hoặc cuối tuần, và học viên muốn học 1 kèm 1 bài bản tại 4 sân ở Bình Thạnh và Thủ Đức.";

const TRUST_STATS = [
  { value: "4", label: "Sân tập" },
  { value: "2", label: "Quận phủ sóng" },
  { value: "1:1", label: "Kèm riêng" },
] as const;

const QUICK_LINKS = [
  { href: "/hoc-cau-long-cho-nguoi-moi/", label: "Người mới" },
  { href: "/lop-cau-long-binh-thanh/", label: "Bình Thạnh" },
  { href: "/lop-cau-long-thu-duc/", label: "Thủ Đức" },
  { href: "/lop-cau-long-tre-em/", label: "Trẻ em" },
  { href: "/lop-cau-long-cho-nguoi-di-lam/", label: "Người đi làm" },
  { href: "/cau-long-doanh-nghiep/", label: "Doanh nghiệp" },
] as const;

const HERO_HIGHLIGHTS = [
  {
    href: "/hoc-cau-long-cho-nguoi-moi/",
    title: "Bắt đầu từ cơ bản",
    description:
      "Sửa kỹ thuật từ những buổi đầu, học đúng nền tảng thay vì tự mò lâu dài.",
  },
  {
    href: "/lop-cau-long-cho-nguoi-di-lam/",
    title: "Lịch tối & cuối tuần",
    description:
      "Phù hợp người đi làm muốn tập đều mà không ảnh hưởng nhịp sinh hoạt.",
  },
  {
    href: "/cau-long-doanh-nghiep/",
    title: "Chương trình doanh nghiệp",
    description:
      "Team building, lớp nội bộ và giải đấu nhỏ theo quy mô từng công ty.",
  },
] as const;

export function HeroSection({ campaign }: HomepageHeroSectionProps) {
  const heroSubheading = campaign?.heroDescription ?? DEFAULT_HERO_SUBHEADING;
  const primaryCtaHref =
    campaign?.primaryCtaUrl ??
    (campaign?.linkedPageSlug ? `/${campaign.linkedPageSlug}/` : null) ??
    "#lien-he";
  const primaryCta = {
    label: campaign?.primaryCtaLabel ?? "Đăng ký học thử →",
    href: primaryCtaHref,
  };
  const secondaryCta = {
    label: campaign?.secondaryCtaLabel ?? "Xem khóa học",
    href: campaign?.secondaryCtaUrl ?? "#khoa-hoc",
  };

  return (
    <section className="hero" id="hero">
      <div className="hero__shell">
        <div className="hero__content">
          {campaign?.badgeText ? (
            <span className="hero__campaign-badge">{campaign.badgeText}</span>
          ) : null}
          <p className="hero__eyebrow">{DEFAULT_HERO_EYEBROW}</p>
          {campaign?.heroTitle ? (
            <h1 className="hero__heading hero__heading--campaign">
              {campaign.heroTitle}
            </h1>
          ) : (
            <h1 className="hero__heading">
              HỌC CẦU LÔNG
              <br />
              TẠI TP.HCM
              <br />
              <span className="hero__heading-accent">
                BÌNH THẠNH &amp; THỦ ĐỨC
              </span>
            </h1>
          )}
          <p className="hero__subheading">{heroSubheading}</p>

          <div className="hero__quick-block">
            <p className="hero__quick-label">Tìm nhanh theo nhu cầu</p>
            <div className="hero__quick-grid">
              {QUICK_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="hero__quick-link"
                  onClick={() =>
                    trackEvent("cta_click", {
                      cta_name: "xem_khoa_hoc",
                      cta_location: "hero_quick_links",
                      page_type: "homepage",
                      page_path: "/",
                    })
                  }
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          <div className="hero__cta-group">
            <a
              href={primaryCta.href}
              className="btn btn--primary btn--lg"
              onClick={() =>
                trackEvent("cta_click", {
                  cta_name: campaign ? "campaign_primary" : "dang_ky_hoc_thu",
                  cta_location: "hero",
                  page_type: "homepage",
                  page_path: "/",
                })
              }
            >
              {primaryCta.label}
            </a>
            <a
              href={secondaryCta.href}
              className="btn btn--outline btn--lg"
              onClick={() =>
                trackEvent("cta_click", {
                  cta_name: campaign ? "campaign_secondary" : "xem_khoa_hoc",
                  cta_location: "hero",
                  page_type: "homepage",
                  page_path: "/",
                })
              }
            >
              {secondaryCta.label}
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

        <aside className="hero__aside">
          <div className="hero__aside-panel">
            <p className="hero__aside-eyebrow">Lộ trình nổi bật</p>
            <div className="hero__highlights">
              {HERO_HIGHLIGHTS.map((highlight) => (
                <a
                  key={highlight.href}
                  href={highlight.href}
                  className="hero__highlight-card"
                  onClick={() =>
                    trackEvent("cta_click", {
                      cta_name: "xem_khoa_hoc",
                      cta_location: "hero_aside",
                      page_type: "homepage",
                      page_path: "/",
                    })
                  }
                >
                  <strong className="hero__highlight-title">
                    {highlight.title}
                  </strong>
                  <span className="hero__highlight-desc">
                    {highlight.description}
                  </span>
                </a>
              ))}
            </div>
          </div>

          <div className="hero__aside-note">
            <p className="hero__aside-note-title">
              Một form chung cho mọi nhu cầu học.
            </p>
            <p className="hero__aside-note-copy">
              Chọn sân, khung giờ hoặc mục tiêu học trước. V2 sẽ gọi lại để chốt
              lịch phù hợp nhất theo khu vực và trình độ của bạn.
            </p>
          </div>
        </aside>

        <div className="hero__shuttle" aria-hidden="true">
          <div className="hero__shuttle-ring" />
          <div className="hero__shuttle-ring" />
          <div className="hero__shuttle-ring" />
          <div className="hero__shuttle-icon" />
        </div>
      </div>
    </section>
  );
}
