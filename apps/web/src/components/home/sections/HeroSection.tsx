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
    // Without this the LCP element ships as loading="lazy" fetchPriority="high",
    // which are two instructions that fight each other: next/image computes
    // `isLazy = !priority && !preload && (loading === 'lazy' || loading === undefined)`
    // (shared/lib/get-img-props.js:269), and passing only fetchPriority leaves
    // `loading` undefined, so isLazy stays true. fetchPriority then only says
    // "when you do fetch this, fetch it urgently" — it never says "fetch it now",
    // and a lazy image waits for layout, which waits for CSS and script.
    // Safe with the <picture> + <source media> below: the browser resolves a
    // single candidate, so eager cannot pull down both variants. (That caveat in
    // the Next docs applies to the light/dark pattern, where two <Image>s
    // coexist in the DOM and are hidden with CSS. Different shape.)
    loading: "eager" as const,
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

  // The mobile counterpart of the preload above, and it is the one that matters
  // most: the hero image is the LCP element, and on mobile it lives in a
  // <source media="(max-width: 767px)"> inside <body>, so without this the
  // browser cannot discover it until it has parsed past ~600 KB of scripts.
  // Measured on production before this existed: the mobile hero started
  // downloading at 754 ms and LCP landed at 792 ms, while desktop — which had
  // the preload — reached LCP in about a quarter of the time.
  // The two media queries are mutually exclusive, so exactly one preload is
  // ever used and neither viewport fetches the other's image.
  ReactDOM.preload(generatedImages.afterWorkClass, {
    as: "image",
    imageSrcSet: mobileHeroSrcSet,
    imageSizes: "100vw",
    fetchPriority: "high",
    media: "(max-width: 767px)",
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
      "Đăng ký học thử",
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
            {HERO_SOCIAL_PROOF.length > 0 ? (
              <div className="hero__avatars" aria-hidden="true">
                {HERO_SOCIAL_PROOF.map((avatar) => (
                  <span key={avatar.initials} className={`hero__avatar ${avatar.accent}`}>
                    {avatar.initials}
                  </span>
                ))}
              </div>
            ) : null}
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
