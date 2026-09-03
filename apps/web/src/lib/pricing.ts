/**
 * SPRINT 2 STATUS: Fallback-only.
 * Imported exclusively by src/lib/sanity/queries.ts for getFallbackPricingTiers().
 * Not imported directly by any page or component.
 * Do not delete - fallback is required while Sanity dataset may be empty or unreachable.
 * Scheduled for removal in Sprint 5 after production Sanity data is validated.
 */
export type BillingModel = "monthly_package" | "per_hour" | "quote";
export type PricingCtaName = "dang_ky_hoc_thu" | "nhan_bao_gia";

export type BaseTier = {
  id: string;
  name: string;
  shortLabel: string;
  description: string;
  features: string[];
  cta: {
    label: string;
    ctaName: PricingCtaName;
  };
};

export type GroupTier = BaseTier & {
  kind: "group";
  billingModel: "monthly_package";
  groupSize: "2-6 người";
  sessionsPerWeek: 2 | 3;
  sessionsPerMonth: number;
  pricePerMonth: number;
  displayPrice: string;
  priceRangeContribution: { min: number; max: number };
};

export type PrivateTier = BaseTier & {
  kind: "private";
  billingModel: "per_hour";
  pricePerHour: number;
  displayPrice: string;
  priceRangeContribution: { min: number; max: number };
};

export type EnterpriseTier = BaseTier & {
  kind: "enterprise";
  billingModel: "quote";
  priceLabel: string;
  displayPrice: string;
  priceRangeContribution: null;
};

export type PricingTier = GroupTier | PrivateTier | EnterpriseTier;

// Fail-safe: fallback pricing rỗng để không hiển thị giá chưa xác minh khi
// Sanity không trả về `pricing_tier`. Các consumer đã xử lý mảng rỗng bằng
// cách ẩn block hoặc hiển thị "Tư vấn trực tiếp".
export const pricingTiers: readonly PricingTier[] = [] as const;

export function buildPriceRange(
  tiers: readonly PricingTier[],
): string | null {
  const contributions = tiers
    .map((tier) => tier.priceRangeContribution)
    .filter(
      (contribution): contribution is { min: number; max: number } =>
        contribution !== null,
    );

  if (contributions.length === 0) {
    return null;
  }

  const min = Math.min(...contributions.map((contribution) => contribution.min));
  const max = Math.max(...contributions.map((contribution) => contribution.max));

  return min === max
    ? formatVnd(min)
    : `${formatVnd(min)} – ${formatVnd(max)}`;
}

export const sitePriceRange = buildPriceRange(pricingTiers);

function formatVnd(value: number): string {
  return `${value.toLocaleString("vi-VN")} VNĐ`;
}
