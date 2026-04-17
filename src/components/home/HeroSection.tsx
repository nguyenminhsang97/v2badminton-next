"use client";

import Image from "next/image";
import {
  ArrowRightIcon,
  ShuttleIcon,
  StarIcon,
} from "@/components/ui/BrandIcons";
import { trackEvent } from "@/lib/tracking";
import type { HomepageHeroSectionProps } from "./sectionProps";

const DEFAULT_HERO_SUBHEADING =
  "Lộ trình cầu lông bài bản cho thiếu nhi, người mới và người đi làm, với HLV chứng chỉ quốc gia và sân tập thuận tiện tại TP.HCM.";

const HERO_SOCIAL_PROOF = [
  { initials: "NH", accent: "hero__avatar--green" },
  { initials: "VA", accent: "hero__avatar--indigo" },
  { initials: "MK", accent: "hero__avatar--violet" },
  { initials: "TL", accent: "hero__avatar--sky" },
] as const;

const HERO_STATUS_LABEL = "HỌC VIÊN CẦU LÔNG HÀNG ĐẦU TP.HCM";

export function HeroSection({ campaign }: HomepageHeroSectionProps) {
  const heroSubheading = campaign?.heroDescription ?? DEFAULT_HERO_SUBHEADING;
  const primaryCtaHref =
    campaign?.primaryCtaUrl ??
    (campaign?.linkedPageSlug ? `/${campaign.linkedPageSlug}/` : null) ??
    "#lien-he";

  const primaryCta = {
    label: campaign?.primaryCtaLabel ?? "Đăng ký học thử miễn phí",
    href: primaryCtaHref,
  };

  const secondaryCta = {
    label: campaign?.secondaryCtaLabel ?? "Xem các khóa học",
    href: campaign?.secondaryCtaUrl ?? "#khoa-hoc",
  };

  return (
    <section className="hero" id="hero">
      <div className="hero__shell">
        <div className="hero__backdrop">
          <Image
            src="/images/course-basic.webp"
            alt="Huấn luyện học viên trên sân cầu lông"
            className="hero__backdrop-image"
            width={1600}
            height={1100}
            sizes="100vw"
            priority
          />
          <div className="hero__backdrop-overlay" />
        </div>

        <div className="hero__content">
          <div className="hero__copy-stack">
            <span className="hero__status-pill">
              <span className="hero__status-dot" aria-hidden="true" />
              {HERO_STATUS_LABEL}
            </span>
            {campaign?.badgeText ? (
              <span className="hero__campaign-badge">{campaign.badgeText}</span>
            ) : null}
            {campaign?.heroTitle ? (
              <h1 className="hero__heading hero__heading--campaign">
                {campaign.heroTitle}
              </h1>
            ) : (
              <h1 className="hero__heading">
                <span className="hero__heading-line hero__heading-line--one">
                  Hành trình chinh phục
                </span>
                <span className="hero__heading-line hero__heading-line--two">
                  <span className="hero__heading-accent">cầu lông</span> bắt đầu từ đây
                </span>
              </h1>
            )}
            <p className="hero__subheading">{heroSubheading}</p>
          </div>

          <div className="hero__cta-group">
            <a
              href={primaryCta.href}
              className="btn btn--lg hero__cta hero__cta--primary"
              onClick={() =>
                trackEvent("cta_click", {
                  cta_name: campaign ? "campaign_primary" : "dang_ky_hoc_thu",
                  cta_location: "hero",
                  page_type: "homepage",
                  page_path: "/",
                })
              }
            >
              <ShuttleIcon className="hero__cta-icon hero__cta-icon--primary" />
              <span>{primaryCta.label}</span>
              <ArrowRightIcon className="hero__cta-arrow" />
            </a>
            <a
              href={secondaryCta.href}
              className="btn btn--lg hero__cta hero__cta--secondary"
              onClick={() =>
                trackEvent("cta_click", {
                  cta_name: campaign ? "campaign_secondary" : "xem_khoa_hoc",
                  cta_location: "hero",
                  page_type: "homepage",
                  page_path: "/",
                })
              }
            >
              <span>{secondaryCta.label}</span>
            </a>
          </div>

          <div className="hero__proof">
            <div className="hero__avatars" aria-hidden="true">
              {HERO_SOCIAL_PROOF.map((avatar) => (
                <span key={avatar.initials} className={`hero__avatar ${avatar.accent}`}>
                  {avatar.initials}
                </span>
              ))}
            </div>
            <div className="hero__proof-copy">
              <div className="hero__proof-rating" aria-label="Đánh giá 4.9 trên 5">
                <div className="hero__proof-stars" aria-hidden="true">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <StarIcon key={index} className="hero__proof-star" />
                  ))}
                </div>
                <strong className="hero__proof-score">4.9</strong>
              </div>
              <span className="hero__proof-meta">Theo sát ngay từ buổi đầu, dễ bắt nhịp và duy trì đều</span>
            </div>
          </div>
        </div>

        <a href="#khoa-hoc" className="hero__scroll-indicator">
          <span className="hero__scroll-mouse" aria-hidden="true">
            <span className="hero__scroll-wheel" />
          </span>
          <span className="hero__scroll-text">Kéo xuống để xem lộ trình</span>
        </a>
      </div>
    </section>
  );
}
