"use client";

import type {
  SanityEnterprisePricingTier,
  SanityGroupPricingTier,
  SanityPricingTier,
  SanityPrivatePricingTier,
} from "@/lib/sanity";
import { trackEvent } from "@/lib/tracking";
import { useHomepageConversion } from "./HomepageConversionProvider";
import type { HomepagePricingSectionProps } from "./sectionProps";

function formatVnd(value: number): string {
  return `${new Intl.NumberFormat("vi-VN").format(value)} VNĐ`;
}

function buildSitePriceRange(tiers: readonly SanityPricingTier[]): string | null {
  const comparablePrices = tiers
    .map((tier) => {
      switch (tier.kind) {
        case "group":
          return tier.pricePerMonth;
        case "private":
          return tier.pricePerHour;
        case "enterprise":
          return null;
      }
    })
    .filter((price): price is number => price !== null);

  if (comparablePrices.length === 0) {
    return null;
  }

  const min = Math.min(...comparablePrices);
  const max = Math.max(...comparablePrices);

  return min === max ? formatVnd(min) : `${formatVnd(min)} – ${formatVnd(max)}`;
}

function GroupCard({ tier }: { tier: SanityGroupPricingTier }) {
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
        href="#lien-he"
        className="btn btn--primary pricing-card__cta"
        onClick={() =>
          trackEvent("cta_click", {
            cta_name: tier.ctaAction,
            cta_location: "pricing",
            page_type: "homepage",
            page_path: "/",
          })
        }
      >
        {tier.ctaLabel}
      </a>
    </article>
  );
}

function PrivateCard({ tier }: { tier: SanityPrivatePricingTier }) {
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
        href="#lien-he"
        className="btn btn--primary pricing-card__cta"
        onClick={() =>
          trackEvent("cta_click", {
            cta_name: tier.ctaAction,
            cta_location: "pricing",
            page_type: "homepage",
            page_path: "/",
          })
        }
      >
        {tier.ctaLabel}
      </a>
    </article>
  );
}

function EnterpriseCard({ tier }: { tier: SanityEnterprisePricingTier }) {
  const { enterBusinessMode } = useHomepageConversion();

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
          enterBusinessMode();
          trackEvent("cta_click", {
            cta_name: tier.ctaAction,
            cta_location: "pricing",
            page_type: "homepage",
            page_path: "/",
          });
        }}
      >
        {tier.ctaLabel}
      </button>
    </article>
  );
}

function PricingCard({ tier }: { tier: SanityPricingTier }) {
  switch (tier.kind) {
    case "group":
      return <GroupCard tier={tier} />;
    case "private":
      return <PrivateCard tier={tier} />;
    case "enterprise":
      return <EnterpriseCard tier={tier} />;
  }
}

export function PricingSection({
  pricingTiers,
}: HomepagePricingSectionProps) {
  const sitePriceRange = buildSitePriceRange(pricingTiers);

  return (
    <section className="section" id="hoc-phi">
      <div className="section__header">
        <h2 className="section__title">Học phí</h2>
        {sitePriceRange && <p className="section__subtitle">Từ {sitePriceRange}</p>}
      </div>
      <div className="pricing-grid">
        {pricingTiers.map((tier) => (
          <PricingCard key={tier.id} tier={tier} />
        ))}
      </div>
    </section>
  );
}
