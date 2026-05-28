import type { SanityMoneyPage } from "@/lib/sanity";

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

  const firstPrice = page.relatedPricing[0];
  const pricingText = firstPrice?.displayPrice
    ? `Học phí từ ${firstPrice.displayPrice}.`
    : null;

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
