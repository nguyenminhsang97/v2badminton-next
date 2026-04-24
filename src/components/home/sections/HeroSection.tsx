import Image from "next/image";
import { StarIcon } from "@/components/ui/BrandIcons";
import { HOME_SECTION_IDS, toHash } from "@/lib/anchors";
import type { CtaName } from "@/lib/tracking";
import type { HomepageHeroSectionProps } from "./sectionProps";
import { HeroCtas } from "./HeroCtas";
import {
  DEFAULT_HERO_SUBHEADING,
  HERO_SOCIAL_PROOF,
  HERO_STATUS_LABEL,
} from "./homepageHeroContent";

export function HeroSection({ campaign }: HomepageHeroSectionProps) {
  const heroSubheading = campaign?.heroDescription ?? DEFAULT_HERO_SUBHEADING;
  const primaryCtaHref =
    campaign?.primaryCtaUrl ??
    (campaign?.linkedPageSlug ? `/${campaign.linkedPageSlug}/` : null) ??
    toHash(HOME_SECTION_IDS.contact);

  const primaryCta: { href: string; label: string; trackingName: CtaName } = {
    href: primaryCtaHref,
    label: campaign?.primaryCtaLabel ?? "Đăng ký học thử miễn phí",
    trackingName: campaign ? "campaign_primary" : "dang_ky_hoc_thu",
  };

  const secondaryCta: { href: string; label: string; trackingName: CtaName } = {
    href: campaign?.secondaryCtaUrl ?? toHash(HOME_SECTION_IDS.courses),
    label: campaign?.secondaryCtaLabel ?? "Xem các khóa học",
    trackingName: campaign ? "campaign_secondary" : "xem_khoa_hoc",
  };

  return (
    <section className="hero" id={HOME_SECTION_IDS.hero}>
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
                  <span className="hero__heading-accent">cầu lông</span> bắt đầu
                  từ đây
                </span>
              </h1>
            )}
            <p className="hero__subheading">{heroSubheading}</p>
          </div>

          <HeroCtas primaryCta={primaryCta} secondaryCta={secondaryCta} />

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
              <span className="hero__proof-meta">
                Từ 1,200+ học viên trên TP.HCM
              </span>
            </div>
          </div>
        </div>

        <a href={toHash(HOME_SECTION_IDS.courses)} className="hero__scroll-indicator">
          <span className="hero__scroll-mouse" aria-hidden="true">
            <span className="hero__scroll-wheel" />
          </span>
          <span className="hero__scroll-text">Kéo xuống để xem lộ trình</span>
        </a>
      </div>
    </section>
  );
}
