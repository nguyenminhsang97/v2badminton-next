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

export const pricingTiers: readonly PricingTier[] = [
  {
    id: "group-basic-3x",
    kind: "group",
    billingModel: "monthly_package",
    name: "3 buổi / tuần",
    shortLabel: "3 buổi cơ bản",
    description:
      "Lớp cơ bản dành cho người mới bắt đầu hoặc cần nền tảng chắc từ đầu.",
    groupSize: "2-6 người",
    sessionsPerWeek: 3,
    sessionsPerMonth: 12,
    pricePerMonth: 1_300_000,
    displayPrice: "1.300.000 VNĐ / tháng",
    priceRangeContribution: { min: 1_300_000, max: 1_300_000 },
    features: [
      "Lớp nhóm nhỏ 2-6 người",
      "Học 3 buổi mỗi tuần",
      "Phù hợp người mới bắt đầu",
    ],
    cta: {
      label: "Đăng ký học thử",
      ctaName: "dang_ky_hoc_thu",
    },
  },
  {
    id: "group-advanced-3x",
    kind: "group",
    billingModel: "monthly_package",
    name: "3 buổi / tuần nâng cao",
    shortLabel: "3 buổi nâng cao",
    description:
      "Dành cho học viên đã có nền tảng và muốn tập đều để nâng kỹ thuật nhanh hơn.",
    groupSize: "2-6 người",
    sessionsPerWeek: 3,
    sessionsPerMonth: 12,
    pricePerMonth: 1_500_000,
    displayPrice: "1.500.000 VNĐ / tháng",
    priceRangeContribution: { min: 1_500_000, max: 1_500_000 },
    features: [
      "Lớp nhóm nhỏ 2-6 người",
      "Học 3 buổi mỗi tuần",
      "Phù hợp học viên đã có nền tảng",
    ],
    cta: {
      label: "Đăng ký học thử",
      ctaName: "dang_ky_hoc_thu",
    },
  },
  {
    id: "group-basic-2x",
    kind: "group",
    billingModel: "monthly_package",
    name: "2 buổi / tuần",
    shortLabel: "2 buổi / tuần",
    description: "Phù hợp lịch làm việc bận nhưng vẫn muốn duy trì đều.",
    groupSize: "2-6 người",
    sessionsPerWeek: 2,
    sessionsPerMonth: 8,
    pricePerMonth: 1_000_000,
    displayPrice: "1.000.000 VNĐ / tháng",
    priceRangeContribution: { min: 1_000_000, max: 1_000_000 },
    features: [
      "Lớp nhóm nhỏ 2-6 người",
      "Học 2 buổi mỗi tuần",
      "Phù hợp người bận lịch làm việc",
    ],
    cta: {
      label: "Đăng ký học thử",
      ctaName: "dang_ky_hoc_thu",
    },
  },
  {
    id: "private-1-1",
    kind: "private",
    billingModel: "per_hour",
    name: "1 kèm 1",
    shortLabel: "1 kèm 1",
    description:
      "Học viên tự lo sân, phù hợp khi cần lịch riêng và theo sát.",
    pricePerHour: 400_000,
    displayPrice: "400.000 VNĐ / giờ / học viên",
    priceRangeContribution: { min: 400_000, max: 400_000 },
    features: [
      "Lịch học riêng theo nhu cầu",
      "HLV theo sát từng buổi",
      "Học viên tự lo sân tập",
    ],
    cta: {
      label: "Đăng ký học thử",
      ctaName: "dang_ky_hoc_thu",
    },
  },
  {
    id: "enterprise",
    kind: "enterprise",
    billingModel: "quote",
    name: "Doanh nghiệp",
    shortLabel: "Doanh nghiệp",
    description:
      "Thiết kế theo số lượng người, thời lượng và mục tiêu chương trình. Phù hợp cho team building, lớp nội bộ và lịch theo ngân sách doanh nghiệp.",
    priceLabel: "Giá thương lượng",
    displayPrice: "Giá thương lượng",
    priceRangeContribution: null,
    features: [
      "Thiết kế theo mục tiêu chương trình",
      "Tùy biến theo ngân sách doanh nghiệp",
      "Phù hợp team building và lớp nội bộ",
    ],
    cta: {
      label: "Nhận báo giá",
      ctaName: "nhan_bao_gia",
    },
  },
] as const;

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
