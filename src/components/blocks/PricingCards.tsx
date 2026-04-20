import type {
  SanityEnterprisePricingTier,
  SanityGroupPricingTier,
  SanityPricingTier,
  SanityPrivatePricingTier,
} from "@/lib/sanity";
import type { PageType } from "@/lib/routes";

export type PricingCardsProps = {
  tiers: SanityPricingTier[];
  ctaHref: string;
  trackingLocation: string;
  pagePath: string;
  pageType: PageType;
  enterpriseCtaHref?: string;
};

function getPricingTrackingAttributes(
  pagePath: string,
  pageType: PageType,
  trackingLocation: string,
  ctaName: SanityPricingTier["ctaAction"],
) {
  return {
    "data-track-event": "cta_click",
    "data-cta-name": ctaName,
    "data-cta-location": trackingLocation,
    "data-page-path": pagePath,
    "data-page-type": pageType,
  } as const;
}

function getTierBadge(tier: SanityPricingTier): string {
  switch (tier.kind) {
    case "group":
      return "Được chọn nhiều";
    case "private":
      return "Linh hoạt";
    case "enterprise":
      return "Theo nhu cầu";
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

function getTierAccentClass(tier: SanityPricingTier): string {
  switch (tier.kind) {
    case "group":
      return "pricing-card--group";
    case "private":
      return "pricing-card--private";
    case "enterprise":
      return "pricing-card--enterprise";
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
  accentClassName,
  badge,
  children,
  cta,
  featured = false,
  name,
  price,
  tags,
  tier,
}: {
  accentClassName: string;
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
      className={`pricing-card ${accentClassName} ${featured ? "pricing-card--featured" : ""}`}
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
  featuredTierId,
  pagePath,
  pageType,
  tier,
  trackingLocation,
}: {
  ctaHref: string;
  featuredTierId: string | null;
  pagePath: string;
  pageType: PageType;
  tier: SanityGroupPricingTier;
  trackingLocation: string;
}) {
  return (
    <PricingCardShell
      accentClassName={getTierAccentClass(tier)}
      badge={getTierBadge(tier)}
      featured={tier.id === featuredTierId}
      name={tier.name}
      price={tier.displayPrice}
      tags={getTierTags(tier)}
      tier={getTierLabel(tier)}
      cta={
        <a
          href={ctaHref}
          className="btn btn--primary pricing-card__cta"
          {...getPricingTrackingAttributes(
            pagePath,
            pageType,
            trackingLocation,
            tier.ctaAction,
          )}
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
  pagePath,
  pageType,
  tier,
  trackingLocation,
}: {
  ctaHref: string;
  pagePath: string;
  pageType: PageType;
  tier: SanityPrivatePricingTier;
  trackingLocation: string;
}) {
  return (
    <PricingCardShell
      accentClassName={getTierAccentClass(tier)}
      badge={getTierBadge(tier)}
      name={tier.name}
      price={tier.displayPrice}
      tags={getTierTags(tier)}
      tier={getTierLabel(tier)}
      cta={
        <a
          href={ctaHref}
          className="btn btn--outline pricing-card__cta"
          {...getPricingTrackingAttributes(
            pagePath,
            pageType,
            trackingLocation,
            tier.ctaAction,
          )}
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
  pagePath,
  pageType,
  tier,
  trackingLocation,
}: {
  ctaHref: string;
  enterpriseCtaHref?: string;
  pagePath: string;
  pageType: PageType;
  tier: SanityEnterprisePricingTier;
  trackingLocation: string;
}) {
  const button = (
    <a
      href={enterpriseCtaHref ?? ctaHref}
      className="btn btn--outline pricing-card__cta"
      {...getPricingTrackingAttributes(
        pagePath,
        pageType,
        trackingLocation,
        tier.ctaAction,
      )}
    >
      {tier.ctaLabel}
    </a>
  );

  return (
    <PricingCardShell
      accentClassName={getTierAccentClass(tier)}
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
  featuredTierId,
  pagePath,
  pageType,
  tier,
  trackingLocation,
}: {
  ctaHref: string;
  enterpriseCtaHref?: string;
  featuredTierId: string | null;
  pagePath: string;
  pageType: PageType;
  tier: SanityPricingTier;
  trackingLocation: string;
}) {
  switch (tier.kind) {
    case "group":
      return (
        <GroupCard
          ctaHref={ctaHref}
          featuredTierId={featuredTierId}
          pagePath={pagePath}
          pageType={pageType}
          tier={tier}
          trackingLocation={trackingLocation}
        />
      );
    case "private":
      return (
        <PrivateCard
          ctaHref={ctaHref}
          pagePath={pagePath}
          pageType={pageType}
          tier={tier}
          trackingLocation={trackingLocation}
        />
      );
    case "enterprise":
      return (
        <EnterpriseCard
          ctaHref={ctaHref}
          enterpriseCtaHref={enterpriseCtaHref}
          pagePath={pagePath}
          pageType={pageType}
          tier={tier}
          trackingLocation={trackingLocation}
        />
      );
  }
}

export function PricingCards({
  tiers,
  ctaHref,
  pagePath,
  pageType,
  trackingLocation,
  enterpriseCtaHref,
}: PricingCardsProps) {
  const featuredTierId = tiers.find((tier) => tier.kind === "group")?.id ?? null;

  return (
    <div className="pricing-grid">
      {tiers.map((tier) => (
        <PricingCard
          key={tier.id}
          ctaHref={ctaHref}
          enterpriseCtaHref={enterpriseCtaHref}
          featuredTierId={featuredTierId}
          pagePath={pagePath}
          pageType={pageType}
          tier={tier}
          trackingLocation={trackingLocation}
        />
      ))}
    </div>
  );
}
