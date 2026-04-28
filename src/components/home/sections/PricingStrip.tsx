import type { SanityPricingTier } from "@/lib/sanity";
import Link from "next/link";
import { HOME_SECTION_IDS, toHash } from "@/lib/anchors";
import { MobileDotCarousel } from "@/components/ui/MobileDotCarousel";

type PricingStripProps = {
  tiers: readonly SanityPricingTier[];
};

function getSortedPricingTiers(tiers: readonly SanityPricingTier[]) {
  const groupTiers = tiers
    .filter(
      (tier): tier is Extract<SanityPricingTier, { kind: "group" }> =>
        tier.kind === "group",
    )
    .sort((left, right) => {
      if (left.sessionsPerWeek !== right.sessionsPerWeek) {
        return left.sessionsPerWeek - right.sessionsPerWeek;
      }

      return left.pricePerMonth - right.pricePerMonth;
    });

  const privateTier =
    tiers.find(
      (tier): tier is Extract<SanityPricingTier, { kind: "private" }> =>
        tier.kind === "private",
    ) ?? null;

  return {
    groupTiers,
    privateTier,
  };
}

function buildPricingMeta(tier: Extract<SanityPricingTier, { kind: "group" }>) {
  const sessionsLabel = `${tier.sessionsPerWeek} buổi/tuần`;
  return tier.groupSize ? `${sessionsLabel} · ${tier.groupSize}` : sessionsLabel;
}

export function PricingStrip({ tiers }: PricingStripProps) {
  const { groupTiers, privateTier } = getSortedPricingTiers(tiers);

  return (
    <div className="pricing-strip" id={HOME_SECTION_IDS.pricing}>
      <div className="pricing-strip__header">
        <p className="pricing-strip__eyebrow">Chi tiết học phí</p>
        <h3 className="pricing-strip__title">4 mức học phí hiện tại</h3>
        <p className="pricing-strip__desc">
          Lớp nhóm 2-6 người theo số buổi mỗi tuần, lớp 1 kèm 1 theo lịch riêng.
        </p>
      </div>
      <MobileDotCarousel
        ariaLabel="Chọn mức học phí"
        className="pricing-strip__carousel"
        trackClassName="pricing-strip__grid"
      >
        {groupTiers.map((tier, index) => (
          <article
            key={tier.id}
            className={`pricing-strip__item ${
              index === 0 ? "pricing-strip__item--featured" : ""
            }`}
          >
            <div className="pricing-strip__copy">
              {index === 0 ? (
                <span className="pricing-strip__tag">Từ mức cơ bản</span>
              ) : null}
              <strong className="pricing-strip__name">{tier.name}</strong>
              <span className="pricing-strip__meta">{buildPricingMeta(tier)}</span>
            </div>
            <strong className="pricing-strip__price">{tier.displayPrice}</strong>
          </article>
        ))}
        {privateTier ? (
          <article className="pricing-strip__item pricing-strip__item--private">
            <div className="pricing-strip__copy">
              <strong className="pricing-strip__name">{privateTier.name}</strong>
              <span className="pricing-strip__meta">Theo lịch riêng</span>
            </div>
            <strong className="pricing-strip__price">{privateTier.displayPrice}</strong>
          </article>
        ) : null}
      </MobileDotCarousel>
      <Link className="pricing-strip__cta" href={toHash(HOME_SECTION_IDS.contact)}>
        Đăng ký tư vấn mức phù hợp
      </Link>
    </div>
  );
}
