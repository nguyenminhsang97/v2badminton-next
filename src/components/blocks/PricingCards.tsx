"use client";

import { usePathname } from "next/navigation";
import type {
  SanityEnterprisePricingTier,
  SanityGroupPricingTier,
  SanityPricingTier,
  SanityPrivatePricingTier,
} from "@/lib/sanity";
import type { PageType } from "@/lib/routes";
import { trackEvent } from "@/lib/tracking";

export type PricingCardsProps = {
  tiers: SanityPricingTier[];
  ctaHref: string;
  trackingLocation: string;
  onEnterBusinessMode?: () => void;
  enterpriseCtaHref?: string;
};

function normalizePathname(pathname: string): string {
  if (pathname === "/") {
    return "/";
  }

  return pathname.endsWith("/") ? pathname : `${pathname}/`;
}

function getTrackingPageType(pathname: string): PageType {
  const normalizedPathname = normalizePathname(pathname);

  if (normalizedPathname === "/") {
    return "homepage";
  }

  if (
    normalizedPathname === "/lop-cau-long-binh-thanh/" ||
    normalizedPathname === "/lop-cau-long-thu-duc/"
  ) {
    return "seo_local";
  }

  if (normalizedPathname === "/cau-long-doanh-nghiep/") {
    return "seo_support";
  }

  return "seo_service";
}

function trackPricingCta(
  pathname: string,
  trackingLocation: string,
  ctaName: SanityPricingTier["ctaAction"],
) {
  trackEvent("cta_click", {
    cta_name: ctaName,
    cta_location: trackingLocation,
    page_type: getTrackingPageType(pathname),
    page_path: pathname,
  });
}

function GroupCard({
  ctaHref,
  pathname,
  tier,
  trackingLocation,
}: {
  ctaHref: string;
  pathname: string;
  tier: SanityGroupPricingTier;
  trackingLocation: string;
}) {
  return (
    <article className="pricing-card">
      <div className="pricing-card__header">
        <h3 className="pricing-card__name">{tier.name}</h3>
        <p className="pricing-card__meta">{tier.groupSize}</p>
      </div>
      <p className="pricing-card__price">{tier.displayPrice}</p>
      <p className="pricing-card__desc">{tier.description}</p>
      <ul className="pricing-card__features">
        {tier.features.map((feature) => (
          <li key={feature}>{feature}</li>
        ))}
      </ul>
      <a
        href={ctaHref}
        className="btn btn--primary pricing-card__cta"
        onClick={() => trackPricingCta(pathname, trackingLocation, tier.ctaAction)}
      >
        {tier.ctaLabel}
      </a>
    </article>
  );
}

function PrivateCard({
  ctaHref,
  pathname,
  tier,
  trackingLocation,
}: {
  ctaHref: string;
  pathname: string;
  tier: SanityPrivatePricingTier;
  trackingLocation: string;
}) {
  return (
    <article className="pricing-card">
      <div className="pricing-card__header">
        <h3 className="pricing-card__name">{tier.name}</h3>
      </div>
      <p className="pricing-card__price">{tier.displayPrice}</p>
      <p className="pricing-card__desc">{tier.description}</p>
      <ul className="pricing-card__features">
        {tier.features.map((feature) => (
          <li key={feature}>{feature}</li>
        ))}
      </ul>
      <a
        href={ctaHref}
        className="btn btn--primary pricing-card__cta"
        onClick={() => trackPricingCta(pathname, trackingLocation, tier.ctaAction)}
      >
        {tier.ctaLabel}
      </a>
    </article>
  );
}

function EnterpriseCard({
  ctaHref,
  enterpriseCtaHref,
  onEnterBusinessMode,
  pathname,
  tier,
  trackingLocation,
}: {
  ctaHref: string;
  enterpriseCtaHref?: string;
  onEnterBusinessMode?: () => void;
  pathname: string;
  tier: SanityEnterprisePricingTier;
  trackingLocation: string;
}) {
  if (onEnterBusinessMode) {
    return (
      <article className="pricing-card pricing-card--enterprise">
        <div className="pricing-card__header">
          <h3 className="pricing-card__name">{tier.name}</h3>
        </div>
        <p className="pricing-card__price">{tier.displayPrice}</p>
        <p className="pricing-card__desc">{tier.description}</p>
        <ul className="pricing-card__features">
          {tier.features.map((feature) => (
            <li key={feature}>{feature}</li>
          ))}
        </ul>
        <button
          type="button"
          className="btn btn--outline pricing-card__cta"
          onClick={() => {
            onEnterBusinessMode();
            trackPricingCta(pathname, trackingLocation, tier.ctaAction);
          }}
        >
          {tier.ctaLabel}
        </button>
      </article>
    );
  }

  return (
    <article className="pricing-card pricing-card--enterprise">
      <div className="pricing-card__header">
        <h3 className="pricing-card__name">{tier.name}</h3>
      </div>
      <p className="pricing-card__price">{tier.displayPrice}</p>
      <p className="pricing-card__desc">{tier.description}</p>
      <ul className="pricing-card__features">
        {tier.features.map((feature) => (
          <li key={feature}>{feature}</li>
        ))}
      </ul>
      <a
        href={enterpriseCtaHref ?? ctaHref}
        className="btn btn--outline pricing-card__cta"
        onClick={() => trackPricingCta(pathname, trackingLocation, tier.ctaAction)}
      >
        {tier.ctaLabel}
      </a>
    </article>
  );
}

function PricingCard({
  ctaHref,
  enterpriseCtaHref,
  onEnterBusinessMode,
  pathname,
  tier,
  trackingLocation,
}: {
  ctaHref: string;
  enterpriseCtaHref?: string;
  onEnterBusinessMode?: () => void;
  pathname: string;
  tier: SanityPricingTier;
  trackingLocation: string;
}) {
  switch (tier.kind) {
    case "group":
      return (
        <GroupCard
          ctaHref={ctaHref}
          pathname={pathname}
          tier={tier}
          trackingLocation={trackingLocation}
        />
      );
    case "private":
      return (
        <PrivateCard
          ctaHref={ctaHref}
          pathname={pathname}
          tier={tier}
          trackingLocation={trackingLocation}
        />
      );
    case "enterprise":
      return (
        <EnterpriseCard
          ctaHref={ctaHref}
          enterpriseCtaHref={enterpriseCtaHref}
          onEnterBusinessMode={onEnterBusinessMode}
          pathname={pathname}
          tier={tier}
          trackingLocation={trackingLocation}
        />
      );
  }
}

export function PricingCards({
  tiers,
  ctaHref,
  trackingLocation,
  onEnterBusinessMode,
  enterpriseCtaHref,
}: PricingCardsProps) {
  const pathname = normalizePathname(usePathname() ?? "/");

  return (
    <div className="pricing-grid">
      {tiers.map((tier) => (
        <PricingCard
          key={tier.id}
          ctaHref={ctaHref}
          enterpriseCtaHref={enterpriseCtaHref}
          onEnterBusinessMode={onEnterBusinessMode}
          pathname={pathname}
          tier={tier}
          trackingLocation={trackingLocation}
        />
      ))}
    </div>
  );
}
