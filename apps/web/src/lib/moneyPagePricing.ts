import type { SanityGroupPricingTier, SanityPricingTier } from "@/lib/sanity";

/**
 * The group tier with the lowest monthly price, or null when there is none.
 *
 * This is what "Học phí từ …" must quote. The pricing query sorts tiers by
 * their `order` field, which is a display order chosen in the Studio — not a
 * price order — so the first tier in the array is not the cheapest. Quoting
 * `relatedPricing[0]` put "từ 1.300.000" on every money page while the
 * cheapest class was 1.000.000 (T1 in docs/tasks-in-progress.md). Changing
 * `order` in Sanity is not the fix either: it also drives where tiers appear.
 *
 * Only monthly group tiers are compared. A private tier is priced per hour and
 * an enterprise tier by quote, so neither can be the "from" figure on a page
 * that also sells monthly classes. On a tie the earlier tier wins, so the
 * result does not depend on how `reduce` happens to break it.
 */
export function getCheapestGroupTier(
  tiers: readonly SanityPricingTier[],
): SanityGroupPricingTier | null {
  let cheapest: SanityGroupPricingTier | null = null;

  for (const tier of tiers) {
    if (tier.kind !== "group") {
      continue;
    }

    if (cheapest === null || tier.pricePerMonth < cheapest.pricePerMonth) {
      cheapest = tier;
    }
  }

  return cheapest;
}
