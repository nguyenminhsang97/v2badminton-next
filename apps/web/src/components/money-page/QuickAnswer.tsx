import { getCheapestGroupTier } from "@/lib/moneyPagePricing";
import type { SanityMoneyPage } from "@/lib/sanity";

/**
 * "Học phí từ X" only when X really is the floor: the cheapest monthly group
 * tier, quoted with the wording the editor set in `displayPrice`. A page with
 * no group tier gets its price without "từ" — a per-hour or quoted price is
 * not a starting point for anything else on the page.
 */
function buildPricingText(page: SanityMoneyPage): string | null {
  const cheapestGroup = getCheapestGroupTier(page.relatedPricing);

  if (cheapestGroup?.displayPrice) {
    return `Học phí từ ${cheapestGroup.displayPrice}.`;
  }

  const onlyPrice = page.relatedPricing[0]?.displayPrice;

  return onlyPrice ? `Học phí: ${onlyPrice}.` : null;
}

type QuickAnswerProps = {
  page: SanityMoneyPage;
  quickAnswerLabel?: string;
};

export function QuickAnswer({ page, quickAnswerLabel = "Tóm tắt nhanh" }: QuickAnswerProps) {
  // Never render on fallback pages — AI engines must not extract placeholder copy.
  if (page.id.startsWith("fallback:")) {
    return null;
  }

  const districtLabels = [
    ...new Set(page.relatedLocations.map((loc) => loc.districtLabel)),
  ].join(" và ");

  const locationText = districtLabels
    ? `Địa điểm: ${districtLabels}, TP.HCM.`
    : null;

  const pricingText = buildPricingText(page);

  return (
    <div className="quick-answer">
      <p className="quick-answer__label">{quickAnswerLabel}</p>
      <p className="quick-answer__body">{page.metaDescription}</p>
      {locationText ? (
        <p className="quick-answer__body">{locationText}</p>
      ) : null}
      {pricingText ? (
        <p className="quick-answer__body">{pricingText}</p>
      ) : null}
    </div>
  );
}
