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

function getTierBadge(tier: SanityPricingTier): string {
  switch (tier.kind) {
    case "group":
      return "Phổ biến";
    case "private":
      return "Linh hoạt";
    case "enterprise":
      return "Theo quy mô";
  }
}

function getTierLabel(tier: SanityPricingTier): string {
  switch (tier.kind) {
    case "group":
      return "Nhóm nhỏ";
    case "private":
      return "1 kèm 1";
    case "enterprise":
      return "Doanh nghiệp";
  }
}

function getTierTags(tier: SanityPricingTier): readonly string[] {
  switch (tier.kind) {
    case "group":
      return ["4-6 học viên", "HLV theo sát"];
    case "private":
      return ["Theo lịch riêng", "Tăng tốc kỹ thuật"];
    case "enterprise":
      return ["Báo giá riêng", "Team building"];
  }
}

function PricingFeatureList({ features }: { features: string[] }) {
  return (
    <ul className="pricing-card__features">
      {features.map((feature) => (
        <li key={feature}>{feature}</li>
      ))}
    </ul>
  );
}

function PricingCardShell({
  badge,
  children,
  cta,
  featured = false,
  name,
  price,
  tags,
  tier,
}: {
  badge: string;
  children: React.ReactNode;
  cta: React.ReactNode;
  featured?: boolean;
  name: string;
  price: string;
  tags: readonly string[];
  tier: string;
}) {
  return (
    <article
      className={`pricing-card ${featured ? "pricing-card--featured" : ""}`}
    >
      <div className="pricing-card__header">
        <div className="pricing-card__eyebrow">
          <p className="pricing-card__tier">{tier}</p>
          <span className="pricing-card__badge">{badge}</span>
        </div>
        <h3 className="pricing-card__name">{name}</h3>
        <p className="pricing-card__price">{price}</p>
      </div>
      <div className="pricing-card__tags">
        {tags.map((tag) => (
          <span key={tag} className="pricing-card__tag">
            {tag}
          </span>
        ))}
      </div>
      {children}
      {cta}
    </article>
  );
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
    <PricingCardShell
      badge={getTierBadge(tier)}
      featured
      name={tier.name}
      price={tier.displayPrice}
      tags={getTierTags(tier)}
      tier={getTierLabel(tier)}
      cta={
        <a
          href={ctaHref}
          className="btn btn--primary pricing-card__cta"
          onClick={() =>
            trackPricingCta(pathname, trackingLocation, tier.ctaAction)
          }
        >
          {tier.ctaLabel}
        </a>
      }
    >
      <p className="pricing-card__desc">{tier.description}</p>
      <p className="pricing-card__meta">{tier.groupSize}</p>
      <PricingFeatureList features={tier.features} />
    </PricingCardShell>
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
    <PricingCardShell
      badge={getTierBadge(tier)}
      name={tier.name}
      price={tier.displayPrice}
      tags={getTierTags(tier)}
      tier={getTierLabel(tier)}
      cta={
        <a
          href={ctaHref}
          className="btn btn--outline pricing-card__cta"
          onClick={() =>
            trackPricingCta(pathname, trackingLocation, tier.ctaAction)
          }
        >
          {tier.ctaLabel}
        </a>
      }
    >
      <p className="pricing-card__desc">{tier.description}</p>
      <PricingFeatureList features={tier.features} />
    </PricingCardShell>
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
  const button = onEnterBusinessMode ? (
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
  ) : (
    <a
      href={enterpriseCtaHref ?? ctaHref}
      className="btn btn--outline pricing-card__cta"
      onClick={() => trackPricingCta(pathname, trackingLocation, tier.ctaAction)}
    >
      {tier.ctaLabel}
    </a>
  );

  return (
    <PricingCardShell
      badge={getTierBadge(tier)}
      name={tier.name}
      price={tier.displayPrice}
      tags={getTierTags(tier)}
      tier={getTierLabel(tier)}
      cta={button}
    >
      <p className="pricing-card__desc">{tier.description}</p>
      <PricingFeatureList features={tier.features} />
    </PricingCardShell>
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
