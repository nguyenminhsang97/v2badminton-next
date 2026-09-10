import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const ROOT = resolve(__dirname, "../../../../../");

function read(rel: string): string {
  return readFileSync(resolve(ROOT, rel), "utf8");
}

function exists(rel: string): boolean {
  return existsSync(resolve(ROOT, rel));
}

/**
 * P1.7 — losing the pricing tiers is visible and reported, not silent.
 *
 * A stale price is worse than no price: it is a number a visitor acts on and the
 * business then has to honour or walk back. #99 already emptied the hardcoded
 * mirror for that reason, so the remaining gap was not staleness — it was that
 * an outage blanked the block with nobody told and no way left to convert.
 * These lock in the quote line, the surviving CTA, and the Sentry report.
 */
describe("pricing fails closed", () => {
  it("has no hardcoded pricing mirror left in the repo", () => {
    expect(exists("apps/web/src/lib/pricing.ts")).toBe(false);
  });

  it("returns an empty list and reports instead of falling back", () => {
    const catalog = read("apps/web/src/lib/sanity/queries/catalog.ts");

    expect(catalog).toContain("reportMissingCatalogContent");
    expect(catalog).toContain('contentSet: "pricing_tiers"');
    expect(catalog).not.toContain("getFallbackPricingTiers");
  });

  it("keeps the fallback path for content where staleness is tolerable", () => {
    const catalog = read("apps/web/src/lib/sanity/queries/catalog.ts");

    // FAQs, locations and schedule blocks still fall back on purpose — a stale
    // answer beats a collapsed layout. Only numbers fail closed.
    expect(catalog).toContain("getFallbackFaqs");
    expect(catalog).toContain("getFallbackLocations");
    expect(catalog).toContain("getFallbackScheduleBlocks");
  });

  it("only reports from production so local and preview stay quiet", () => {
    const failSafe = read("apps/web/src/lib/catalogFailSafe.ts");

    expect(failSafe).toContain("isProductionDeployment");
    expect(failSafe).toContain("captureException");
    expect(failSafe).toContain('area: "catalog_failsafe"');
  });

  it("shows the quote line, keeping the CTA, when there are no tiers", () => {
    const strip = read("apps/web/src/components/home/sections/PricingStrip.tsx");

    expect(strip).toContain("hasPricing");
    expect(strip).toContain("Liên hệ để nhận báo giá");
    // The conversion path must survive the outage, not just the section.
    expect(strip).toContain("Đăng ký tư vấn mức phù hợp");
  });
});

describe("testimonials fail closed", () => {
  it("has no testimonial fallback module", () => {
    expect(exists("apps/web/src/content/homepage-testimonials.fallback.ts")).toBe(
      false,
    );
  });

  it("passes Sanity testimonials straight through", () => {
    const page = read("apps/web/src/app/(site)/page.tsx");

    expect(page).not.toContain("HOMEPAGE_TESTIMONIAL_FALLBACKS");
    expect(page).toContain("toHomepageTestimonials(testimonials)");
  });
});
