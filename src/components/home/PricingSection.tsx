"use client";

import {
  pricingTiers,
  sitePriceRange,
  type GroupTier,
  type PrivateTier,
  type EnterpriseTier,
  type PricingTier,
} from "@/lib/pricing";
import { trackEvent } from "@/lib/tracking";
import { useHomepageConversion } from "./HomepageConversionProvider";

function GroupCard({ tier }: { tier: GroupTier }) {
  return (
    <article className="pricing-card">
      <div className="pricing-card__header">
        <h3 className="pricing-card__name">{tier.name}</h3>
        <p className="pricing-card__meta">{tier.groupSize}</p>
      </div>
      <p className="pricing-card__price">{tier.displayPrice}</p>
      <p className="pricing-card__desc">{tier.description}</p>
      <ul className="pricing-card__features">
        {tier.features.map((f) => (
          <li key={f}>{f}</li>
        ))}
      </ul>
      <a
        href="#lien-he"
        className="btn btn--primary pricing-card__cta"
        onClick={() =>
          trackEvent("cta_click", {
            cta_name: tier.cta.ctaName,
            cta_location: "pricing",
            page_type: "homepage",
            page_path: "/",
          })
        }
      >
        {tier.cta.label}
      </a>
    </article>
  );
}

function PrivateCard({ tier }: { tier: PrivateTier }) {
  return (
    <article className="pricing-card">
      <div className="pricing-card__header">
        <h3 className="pricing-card__name">{tier.name}</h3>
      </div>
      <p className="pricing-card__price">{tier.displayPrice}</p>
      <p className="pricing-card__desc">{tier.description}</p>
      <ul className="pricing-card__features">
        {tier.features.map((f) => (
          <li key={f}>{f}</li>
        ))}
      </ul>
      <a
        href="#lien-he"
        className="btn btn--primary pricing-card__cta"
        onClick={() =>
          trackEvent("cta_click", {
            cta_name: tier.cta.ctaName,
            cta_location: "pricing",
            page_type: "homepage",
            page_path: "/",
          })
        }
      >
        {tier.cta.label}
      </a>
    </article>
  );
}

function EnterpriseCard({ tier }: { tier: EnterpriseTier }) {
  const { enterBusinessMode } = useHomepageConversion();

  return (
    <article className="pricing-card pricing-card--enterprise">
      <div className="pricing-card__header">
        <h3 className="pricing-card__name">{tier.name}</h3>
      </div>
      <p className="pricing-card__price">{tier.displayPrice}</p>
      <p className="pricing-card__desc">{tier.description}</p>
      <ul className="pricing-card__features">
        {tier.features.map((f) => (
          <li key={f}>{f}</li>
        ))}
      </ul>
      <button
        type="button"
        className="btn btn--outline pricing-card__cta"
        onClick={() => {
          enterBusinessMode();
          trackEvent("cta_click", {
            cta_name: tier.cta.ctaName,
            cta_location: "pricing",
            page_type: "homepage",
            page_path: "/",
          });
        }}
      >
        {tier.cta.label}
      </button>
    </article>
  );
}

function PricingCard({ tier }: { tier: PricingTier }) {
  switch (tier.kind) {
    case "group":
      return <GroupCard tier={tier} />;
    case "private":
      return <PrivateCard tier={tier} />;
    case "enterprise":
      return <EnterpriseCard tier={tier} />;
  }
}

export function PricingSection() {
  return (
    <section className="section" id="hoc-phi">
      <div className="section__header">
        <h2 className="section__title">Học phí</h2>
        {sitePriceRange && (
          <p className="section__subtitle">Từ {sitePriceRange}</p>
        )}
      </div>
      <div className="pricing-grid">
        {pricingTiers.map((tier) => (
          <PricingCard key={tier.id} tier={tier} />
        ))}
      </div>
    </section>
  );
}
