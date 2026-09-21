import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { QuickAnswer } from "@/components/money-page/QuickAnswer";
import { getCheapestGroupTier } from "@/lib/moneyPagePricing";
import type {
  SanityGroupPricingTier,
  SanityMoneyPage,
  SanityPricingTier,
} from "@/lib/sanity";

/**
 * T1 in docs/tasks-in-progress.md. Fixtures mirror the published tiers in the
 * order the pricing query returns them — by the Studio `order` field, which
 * puts the 1.300.000 class first and the cheapest (1.000.000) third.
 */
function group(
  id: string,
  pricePerMonth: number,
  displayPrice: string,
  order: number,
): SanityGroupPricingTier {
  return {
    id,
    slug: id,
    name: id,
    shortLabel: id,
    description: "",
    kind: "group",
    billingModel: "monthly_package",
    displayPrice,
    features: [],
    ctaLabel: "Đăng ký học thử",
    ctaAction: "dang_ky_hoc_thu",
    order,
    groupSize: "4-8 người",
    pricePerMonth,
    sessionsPerWeek: 3,
    sessionsPerMonth: 12,
    pricePerHour: null,
  };
}

const BASIC_3X = group("pricingTier.group-basic-3x", 1_300_000, "1.300.000 VNĐ / tháng", 1);
const ADVANCED_3X = group("pricingTier.group-advanced-3x", 1_500_000, "1.500.000 VNĐ / tháng", 2);
const BASIC_2X = group("pricingTier.group-basic-2x", 1_000_000, "1.000.000 VNĐ / tháng", 3);

const PRIVATE_1_1: SanityPricingTier = {
  id: "pricingTier.private-1-1",
  slug: "private-1-1",
  name: "1 kèm 1",
  shortLabel: "1 kèm 1",
  description: "",
  kind: "private",
  billingModel: "per_hour",
  displayPrice: "400.000 VNĐ / giờ / học viên",
  features: [],
  ctaLabel: "Đăng ký học thử",
  ctaAction: "dang_ky_hoc_thu",
  order: 4,
  groupSize: null,
  pricePerMonth: null,
  sessionsPerWeek: null,
  sessionsPerMonth: null,
  pricePerHour: 400_000,
};

/** In query order — the order that caused the bug. */
const QUERY_ORDER: SanityPricingTier[] = [BASIC_3X, ADVANCED_3X, BASIC_2X, PRIVATE_1_1];

function pageWith(relatedPricing: SanityPricingTier[]): SanityMoneyPage {
  return {
    id: "money-page-test",
    updatedAt: null,
    slug: "lop-cau-long-binh-thanh",
    audience: "nguoi_moi",
    h1: "",
    metaTitle: "",
    metaDescription: "Lớp cầu lông tại Bình Thạnh.",
    intro: [],
    body: [],
    heroImageUrl: null,
    relatedLocations: [],
    relatedPricing,
    relatedFaqs: [],
    ctaLabel: "",
  };
}

function renderQuickAnswer(relatedPricing: SanityPricingTier[]): string {
  return renderToStaticMarkup(createElement(QuickAnswer, { page: pageWith(relatedPricing) }));
}

describe("getCheapestGroupTier", () => {
  it("finds the cheapest tier when it is not first in the array", () => {
    expect(getCheapestGroupTier(QUERY_ORDER)).toBe(BASIC_2X);
  });

  it("never returns a per-hour tier, however cheap it looks", () => {
    const cheapest = getCheapestGroupTier([PRIVATE_1_1, BASIC_3X]);

    expect(cheapest).toBe(BASIC_3X);
    expect(cheapest?.kind).toBe("group");
  });

  it("returns null when there is no group tier", () => {
    expect(getCheapestGroupTier([PRIVATE_1_1])).toBeNull();
    expect(getCheapestGroupTier([])).toBeNull();
  });

  it("keeps the earlier tier on a tie", () => {
    const twin = group("pricingTier.twin", 1_000_000, "1.000.000 VNĐ / tháng", 9);

    expect(getCheapestGroupTier([BASIC_2X, twin])).toBe(BASIC_2X);
  });
});

describe("QuickAnswer pricing line", () => {
  it("quotes the cheapest group tier as the starting price", () => {
    const html = renderQuickAnswer(QUERY_ORDER);

    expect(html).toContain("Học phí từ 1.000.000 VNĐ / tháng.");
    expect(html).not.toContain("1.300.000");
  });

  it("drops 'từ' when the page only sells a per-hour class", () => {
    const html = renderQuickAnswer([PRIVATE_1_1]);

    expect(html).toContain("Học phí: 400.000 VNĐ / giờ / học viên.");
    expect(html).not.toContain("Học phí từ");
  });

  it("shows no pricing line when the page has no tiers", () => {
    expect(renderQuickAnswer([])).not.toContain("Học phí");
  });
});
