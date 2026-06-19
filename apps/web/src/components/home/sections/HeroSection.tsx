import ReactDOM from "react-dom";
import { getImageProps } from "next/image";
import { HOME_SECTION_IDS, toHash } from "@/lib/anchors";
import { generatedImages } from "@/lib/generatedImages";
import type { CtaName } from "@/lib/tracking";
import type { HomepageHeroSectionProps } from "./sectionProps";
import { HeroCtas } from "./HeroCtas";
import {
  DEFAULT_HERO_SUBHEADING,
  HERO_SOCIAL_PROOF,
  HERO_STATUS_LABEL,
} from "./homepageHeroContent";

export function HeroSection({ campaign, content, facebookUrl }: HomepageHeroSectionProps) {
  // Precedence: campaign > homepage_content CMS > hardcoded fallback
  const heroSubheading =
    campaign?.heroDescription ??
    content?.subheading ??
    DEFAULT_HERO_SUBHEADING;
  const heroImageAlt =
    content?.heroImageAlt ??
    "HLV hướng dẫn học viên trong buổi tập cầu lông";
  const commonHeroImageProps = {
    alt: heroImageAlt,
    className: "hero__backdrop-image",
    fetchPriority: "high" as const,
    sizes: "100vw",
  };
  const {
    props: { srcSet: desktopHeroSrcSet },
  } = getImageProps({
    ...commonHeroImageProps,
    src: generatedImages.heroTraining,
    width: 1672,
    height: 941,
  });

  // Preload the desktop hero image in <head> so the browser discovers it
  // immediately during HTML parsing, not after finding the <picture> in <body>.
  // Only fires on viewports ≥ 768px to avoid fetching desktop image on mobile.
  ReactDOM.preload(generatedImages.heroTraining, {
    as: "image",
    imageSrcSet: desktopHeroSrcSet,
    imageSizes: "100vw",
    fetchPriority: "high",
    media: "(min-width: 768px)",
  });

  const {
    props: { srcSet: mobileHeroSrcSet, ...heroImageProps },
  } = getImageProps({
    ...commonHeroImageProps,
    src: generatedImages.afterWorkClass,
    width: 1122,
    height: 1402,
  });
  const primaryCtaHref =
    campaign?.primaryCtaUrl ??
    (campaign?.linkedPageSlug ? `/${campaign.linkedPageSlug}/` : null) ??
    toHash(HOME_SECTION_IDS.contact);

  const primaryCta: { href: string; label: string; trackingName: CtaName } = {
    href: primaryCtaHref,
    label:
      campaign?.primaryCtaLabel ??
      content?.primaryCtaLabel ??
      "Đăng ký học thử miễn phí",
    trackingName: campaign ? "campaign_primary" : "dang_ky_hoc_thu",
  };

  const secondaryCta: { href: string; label: string; trackingName: CtaName } = {
    href: campaign?.secondaryCtaUrl ?? toHash(HOME_SECTION_IDS.courses),
    label:
      campaign?.secondaryCtaLabel ??
      content?.secondaryCtaLabel ??
      "Xem các khóa học",
    trackingName: campaign ? "campaign_secondary" : "xem_khoa_hoc",
  };

  return (
    <section className="hero" id={HOME_SECTION_IDS.hero}>
      <div className="hero__shell">
        <div className="hero__backdrop">
          <picture className="hero__backdrop-picture">
            <source media="(min-width: 768px)" srcSet={desktopHeroSrcSet} />
            <source media="(max-width: 767px)" srcSet={mobileHeroSrcSet} />
            <img {...heroImageProps} alt={heroImageAlt} />
          </picture>
          <div className="hero__backdrop-overlay" />
        </div>

        <div className="hero__content">
          <div className="hero__copy-stack">
            <span className="hero__status-pill">
              <span className="hero__status-dot" aria-hidden="true" />
              {content?.statusLabel ?? HERO_STATUS_LABEL}
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
                  <span className="hero__heading-accent">cầu lông tại TP.HCM</span>{" "}
                  bắt đầu từ đây
                </span>
              </h1>
            )}
            <p className="hero__subheading">{heroSubheading}</p>
          </div>

          <HeroCtas primaryCta={primaryCta} secondaryCta={secondaryCta} />

          <p className="hero__service-area">
            V2 Badminton dạy cầu lông tại Bình Thạnh (sân Green) và Thủ Đức
            (Huệ Thiên, Khang Sport, Phúc Lộc), TP.HCM.
          </p>

          <div className="hero__proof">
            <div className="hero__avatars" aria-hidden="true">
              {HERO_SOCIAL_PROOF.map((avatar) => (
                <span key={avatar.initials} className={`hero__avatar ${avatar.accent}`}>
                  {avatar.initials}
                </span>
              ))}
            </div>
            <div className="hero__proof-copy">
              <strong className="hero__proof-score">Kinh nghiệm từ 2012</strong>
              <span className="hero__proof-meta">
                9.000+ theo dõi trên{" "}
                <a
                  href={facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hero__proof-link"
                >
                  Facebook
                </a>
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
