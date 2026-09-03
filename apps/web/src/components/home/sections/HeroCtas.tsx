import { ArrowRightIcon, ShuttleIcon } from "@/components/ui/BrandIcons";
import type { CtaName } from "@/lib/tracking";

type HeroCtasProps = {
  primaryCta: {
    href: string;
    label: string;
    trackingName: CtaName;
  };
  secondaryCta: {
    href: string;
    label: string;
    trackingName: CtaName;
  };
};

// Server component — tracking is handled by the global delegated listener in
// TrackingBootstrap which matches [data-track-event="cta_click"][data-cta-name][data-cta-location].
export function HeroCtas({ primaryCta, secondaryCta }: HeroCtasProps) {
  return (
    <div className="hero__cta-group">
      <a
        href={primaryCta.href}
        className="btn btn--lg hero__cta hero__cta--primary"
        data-track-event="cta_click"
        data-cta-name={primaryCta.trackingName}
        data-cta-location="hero"
        data-page-type="homepage"
        data-page-path="/"
      >
        <ShuttleIcon className="hero__cta-icon hero__cta-icon--primary" />
        <span>{primaryCta.label}</span>
        <ArrowRightIcon className="hero__cta-arrow" />
      </a>
      <a
        href={secondaryCta.href}
        className="btn btn--lg hero__cta hero__cta--secondary"
        data-track-event="cta_click"
        data-cta-name={secondaryCta.trackingName}
        data-cta-location="hero"
        data-page-type="homepage"
        data-page-path="/"
      >
        <span>{secondaryCta.label}</span>
      </a>
    </div>
  );
}
