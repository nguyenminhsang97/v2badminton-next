"use client";

import { ArrowRightIcon, ShuttleIcon } from "@/components/ui/BrandIcons";
import { trackEvent, type CtaName } from "@/lib/tracking";

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

export function HeroCtas({ primaryCta, secondaryCta }: HeroCtasProps) {
  return (
    <div className="hero__cta-group">
      <a
        href={primaryCta.href}
        className="btn btn--lg hero__cta hero__cta--primary"
        onClick={() =>
          trackEvent("cta_click", {
            cta_name: primaryCta.trackingName,
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
            cta_name: secondaryCta.trackingName,
            cta_location: "hero",
            page_type: "homepage",
            page_path: "/",
          })
        }
      >
        <span>{secondaryCta.label}</span>
      </a>
    </div>
  );
}
