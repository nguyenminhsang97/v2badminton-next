"use client";

import Image from "next/image";
import { siteConfig } from "@/lib/site";
import { trackEvent } from "@/lib/tracking";
import type { HomepageHeroSectionProps } from "./sectionProps";

const DEFAULT_HERO_EYEBROW = "Bình Thạnh & Thủ Đức - TP.HCM";

const DEFAULT_HERO_SUBHEADING =
  "V2 Badminton có lớp cho người mới bắt đầu, trẻ em cần nền tảng đúng ngay từ đầu, người đi làm muốn lịch tối hoặc cuối tuần, và cả lớp 1 kèm 1 để tiến bộ nhanh hơn.";

const TRUST_STATS = [
  { value: "4 sân", label: "Đang hoạt động" },
  { value: "Tối & cuối tuần", label: "Khung giờ dễ theo" },
  { value: "1:1 + nhóm nhỏ", label: "Lộ trình linh hoạt" },
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
    title: "Lịch tối và cuối tuần",
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

const HERO_SOCIAL_PROOF = [
  { initials: "V2" },
  { initials: "HL" },
  { initials: "CL" },
] as const;

export function HeroSection({ campaign }: HomepageHeroSectionProps) {
  const heroSubheading = campaign?.heroDescription ?? DEFAULT_HERO_SUBHEADING;
  const primaryCtaHref =
    campaign?.primaryCtaUrl ??
    (campaign?.linkedPageSlug ? `/${campaign.linkedPageSlug}/` : null) ??
    "#lien-he";

  const primaryCta = {
    label: campaign?.primaryCtaLabel ?? "Đăng ký học thử",
    href: primaryCtaHref,
  };

  const secondaryCta = {
    label: campaign?.secondaryCtaLabel ?? "Xem khóa học",
    href: campaign?.secondaryCtaUrl ?? "#khoa-hoc",
  };

  const tertiaryCta = {
    label: "Tư vấn qua Zalo",
    href: `https://zalo.me/${siteConfig.zaloNumber}`,
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
              Hành trình chinh phục
              <br />
              cầu lông bắt đầu từ đây
            </h1>
          )}
          <p className="hero__subheading">{heroSubheading}</p>

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
            <a
              href={tertiaryCta.href}
              className="btn btn--ghost btn--lg"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                trackEvent("contact_click", {
                  method: "zalo",
                  page_type: "homepage",
                  page_path: "/",
                })
              }
            >
              {tertiaryCta.label}
            </a>
          </div>

          <div className="hero__proof">
            <div className="hero__proof-social">
              <div className="hero__avatars" aria-hidden="true">
                {HERO_SOCIAL_PROOF.map((avatar) => (
                  <span key={avatar.initials} className="hero__avatar">
                    {avatar.initials}
                  </span>
                ))}
              </div>
              <div className="hero__proof-copy">
                <strong className="hero__proof-title">
                  Tư vấn theo độ tuổi và lịch học
                </strong>
                <span className="hero__proof-meta">
                  Phụ huynh, người mới và người đi làm đều có lộ trình riêng.
                </span>
              </div>
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
        </div>

        <div className="hero__visual">
          <div className="hero__visual-frame">
            <Image
              src="/images/course-basic.webp"
              alt="Huấn luyện viên V2 hướng dẫn học viên trên sân cầu lông"
              className="hero__visual-image"
              width={960}
              height={720}
              sizes="(max-width: 959px) 100vw, 44vw"
              priority
            />
            <div className="hero__visual-overlay" />
          </div>

          <div className="hero__visual-card">
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
            <div className="hero__visual-note">
              <strong>Một form chung cho mọi nhu cầu học.</strong>
              <p>
                Chọn sân, khung giờ hoặc mục tiêu học trước. V2 sẽ gọi lại để
                chốt lịch phù hợp nhất theo khu vực và trình độ của bạn.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
