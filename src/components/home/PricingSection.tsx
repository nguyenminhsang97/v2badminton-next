"use client";

import { PricingCards } from "@/components/blocks/PricingCards";
import type { SanityPricingTier } from "@/lib/sanity";
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

export function PricingSection({
  pricingTiers,
}: HomepagePricingSectionProps) {
  const { enterBusinessMode } = useHomepageConversion();
  const sitePriceRange = buildSitePriceRange(pricingTiers);

  return (
    <section className="section" id="hoc-phi">
      <div className="section__header">
        <p className="section__eyebrow">Chi phí theo nhu cầu</p>
        <h2 className="section__title">HỌC PHÍ</h2>
        {sitePriceRange ? (
          <p className="section__subtitle">Từ {sitePriceRange}</p>
        ) : null}
        <p className="section__desc">
          Có đủ lựa chọn từ nhóm nhỏ, kèm riêng đến gói doanh nghiệp. Bạn có thể
          đi theo form chung để được tư vấn lịch phù hợp trước khi chốt.
        </p>
      </div>
      <PricingCards
        tiers={pricingTiers}
        ctaHref="#lien-he"
        trackingLocation="pricing"
        onEnterBusinessMode={enterBusinessMode}
      />
    </section>
  );
}
