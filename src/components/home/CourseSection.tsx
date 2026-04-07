"use client";

import { pricingTiers } from "@/lib/pricing";
import { trackEvent } from "@/lib/tracking";
import { useHomepageConversion } from "./HomepageConversionProvider";

/**
 * Course cards derived from pricing tiers.
 *
 * - Basic (group, co_ban): setCourseIntent("co_ban") + scroll to #lich-hoc
 * - Advanced (group, nang_cao): setCourseIntent("nang_cao") + scroll to #lich-hoc
 * - Enterprise: enterBusinessMode() + scroll to #lien-he
 *
 * Course cards MUST NOT own independent conversion state.
 * All actions flow through HomepageConversionProvider (S2-B6).
 */

const basicTier = pricingTiers.find(
  (t) => t.kind === "group" && !t.name.toLowerCase().includes("nang cao"),
);
const advancedTier = pricingTiers.find(
  (t) => t.kind === "group" && t.name.toLowerCase().includes("nang cao"),
);
const enterpriseTier = pricingTiers.find((t) => t.kind === "enterprise");

type CourseCardDef = {
  id: string;
  title: string;
  description: string;
  ctaLabel: string;
  action: "basic" | "advanced" | "enterprise";
};

const courseCards: CourseCardDef[] = [
  ...(basicTier
    ? [
        {
          id: "course-basic",
          title: "Khoa co ban",
          description: basicTier.description,
          ctaLabel: "Xem lich hoc co ban",
          action: "basic" as const,
        },
      ]
    : []),
  ...(advancedTier
    ? [
        {
          id: "course-advanced",
          title: "Khoa nang cao",
          description: advancedTier.description,
          ctaLabel: "Xem lich hoc nang cao",
          action: "advanced" as const,
        },
      ]
    : []),
  ...(enterpriseTier
    ? [
        {
          id: "course-enterprise",
          title: "Doanh nghiep",
          description: enterpriseTier.description,
          ctaLabel: enterpriseTier.cta.label,
          action: "enterprise" as const,
        },
      ]
    : []),
];

export function CourseSection() {
  const { setCourseIntent, enterBusinessMode } = useHomepageConversion();

  function handleClick(card: CourseCardDef) {
    switch (card.action) {
      case "basic":
        setCourseIntent("co_ban");
        trackEvent("cta_click", {
          cta_name: "xem_khoa_hoc",
          cta_location: "course_cards",
          page_type: "homepage",
          page_path: "/",
        });
        break;
      case "advanced":
        setCourseIntent("nang_cao");
        trackEvent("cta_click", {
          cta_name: "xem_khoa_hoc",
          cta_location: "course_cards",
          page_type: "homepage",
          page_path: "/",
        });
        break;
      case "enterprise":
        enterBusinessMode();
        trackEvent("cta_click", {
          cta_name: "nhan_bao_gia",
          cta_location: "course_cards",
          page_type: "homepage",
          page_path: "/",
        });
        break;
    }
  }

  return (
    <section className="section" id="khoa-hoc">
      <div className="section__header">
        <h2 className="section__title">Khoa hoc</h2>
      </div>
      <div className="course-grid">
        {courseCards.map((card) => (
          <article key={card.id} className="course-card">
            <h3 className="course-card__title">{card.title}</h3>
            <p className="course-card__desc">{card.description}</p>
            <button
              type="button"
              className={`btn ${card.action === "enterprise" ? "btn--outline" : "btn--primary"} course-card__cta`}
              onClick={() => handleClick(card)}
            >
              {card.ctaLabel}
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
