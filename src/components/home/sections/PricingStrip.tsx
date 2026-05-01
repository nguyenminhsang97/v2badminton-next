import type { SanityPricingTier } from "@/lib/sanity";
import Link from "next/link";
import { HOME_SECTION_IDS, toHash } from "@/lib/anchors";

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

function formatVnd(value: number): string {
  return new Intl.NumberFormat("vi-VN").format(value);
}

function buildGroupSummary(
  tiers: Array<Extract<SanityPricingTier, { kind: "group" }>>,
) {
  if (tiers.length === 0) {
    return null;
  }

  const prices = tiers.map((tier) => tier.pricePerMonth);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const priceLabel =
    minPrice === maxPrice
      ? `${formatVnd(minPrice)} VNĐ / tháng`
      : `${formatVnd(minPrice)} - ${formatVnd(maxPrice)} VNĐ / tháng`;
  const sessions = [...new Set(tiers.map((tier) => tier.sessionsPerWeek))].sort(
    (left, right) => left - right,
  );
  const sessionLabel =
    sessions.length === 1
      ? `${sessions[0]} buổi/tuần`
      : `${sessions[0]}-${sessions[sessions.length - 1]} buổi/tuần`;
  const groupSize = tiers.find((tier) => tier.groupSize)?.groupSize;

  return {
    priceLabel,
    metaLabel: groupSize ? `${sessionLabel} · ${groupSize}` : sessionLabel,
  };
}

export function PricingStrip({ tiers }: PricingStripProps) {
  const { groupTiers, privateTier } = getSortedPricingTiers(tiers);
  const groupSummary = buildGroupSummary(groupTiers);

  return (
    <div className="pricing-strip" id={HOME_SECTION_IDS.pricing}>
      <div className="pricing-strip__header">
        <p className="pricing-strip__eyebrow">Chi tiết học phí</p>
        <h3 className="pricing-strip__title">Học phí chính hiện tại</h3>
        <p className="pricing-strip__desc">
          Lớp nhóm 2-6 người theo số buổi mỗi tuần, lớp 1 kèm 1 theo lịch riêng.
        </p>
      </div>
      <div className="pricing-strip__summary" aria-label="Tóm tắt học phí">
        {groupSummary ? (
          <article className="pricing-strip__summary-item pricing-strip__summary-item--group">
            <span className="pricing-strip__summary-label">Lớp nhóm</span>
            <strong className="pricing-strip__summary-price">
              {groupSummary.priceLabel}
            </strong>
            <span className="pricing-strip__summary-meta">
              {groupSummary.metaLabel}
            </span>
          </article>
        ) : null}
        {privateTier ? (
          <article className="pricing-strip__summary-item pricing-strip__summary-item--private">
            <span className="pricing-strip__summary-label">1 kèm 1</span>
            <strong className="pricing-strip__summary-price">
              {privateTier.displayPrice}
            </strong>
            <span className="pricing-strip__summary-meta">
              Theo lịch riêng · 1 học viên
            </span>
          </article>
        ) : null}
      </div>
      <Link className="pricing-strip__cta" href={toHash(HOME_SECTION_IDS.contact)}>
        Đăng ký tư vấn mức phù hợp
      </Link>
    </div>
  );
}
