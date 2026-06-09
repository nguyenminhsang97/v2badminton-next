import { describe, expect, it } from "vitest";
import {
  getRevalidationTags,
  isDraftId,
  type SanityWebhookPayload,
} from "../revalidationMap";

describe("getRevalidationTags", () => {
  // --- Mapped types return correct static tags ---

  it("site_settings → sanity:site-settings", () => {
    const tags = getRevalidationTags({ _type: "site_settings" });
    expect(tags).toEqual(["sanity:site-settings"]);
  });

  it("homepage_content → sanity:homepage-content", () => {
    const tags = getRevalidationTags({ _type: "homepage_content" });
    expect(tags).toEqual(["sanity:homepage-content"]);
  });

  it("campaign → sanity:campaign", () => {
    const tags = getRevalidationTags({ _type: "campaign" });
    expect(tags).toEqual(["sanity:campaign"]);
  });

  it("coach → sanity:coaches", () => {
    const tags = getRevalidationTags({ _type: "coach" });
    expect(tags).toEqual(["sanity:coaches"]);
  });

  it("testimonial → sanity:testimonials", () => {
    const tags = getRevalidationTags({ _type: "testimonial" });
    expect(tags).toEqual(["sanity:testimonials"]);
  });

  // --- Dereference traps: location/pricing_tier/faq include money-pages ---

  it("location includes sanity:money-pages (dereference trap)", () => {
    const tags = getRevalidationTags({ _type: "location" });
    expect(tags).toContain("sanity:locations");
    expect(tags).toContain("sanity:money-pages");
  });

  it("pricing_tier includes sanity:money-pages (dereference trap)", () => {
    const tags = getRevalidationTags({ _type: "pricing_tier" });
    expect(tags).toContain("sanity:pricing-tiers");
    expect(tags).toContain("sanity:money-pages");
  });

  it("schedule_block → sanity:schedule-blocks (no dereference needed)", () => {
    const tags = getRevalidationTags({ _type: "schedule_block" });
    expect(tags).toEqual(["sanity:schedule-blocks"]);
  });

  it("faq includes sanity:faqs, sanity:faqs:homepage, and sanity:money-pages", () => {
    const tags = getRevalidationTags({ _type: "faq" });
    expect(tags).toContain("sanity:faqs");
    expect(tags).toContain("sanity:faqs:homepage");
    expect(tags).toContain("sanity:money-pages");
    expect(tags).toHaveLength(3);
  });

  // --- Slug-dependent tags ---

  it("money_page with slug adds sanity:money-page:<slug>", () => {
    const tags = getRevalidationTags({
      _type: "money_page",
      slug: "hoc-cau-long",
    });
    expect(tags).toContain("sanity:money-pages");
    expect(tags).toContain("sanity:money-page:hoc-cau-long");
  });

  it("money_page without slug only returns broad tag", () => {
    const tags = getRevalidationTags({ _type: "money_page" });
    expect(tags).toEqual(["sanity:money-pages"]);
  });

  it("static_page with slug adds sanity:static-page:<slug>", () => {
    const tags = getRevalidationTags({
      _type: "static_page",
      slug: "gioi-thieu",
    });
    expect(tags).toContain("sanity:static-pages");
    expect(tags).toContain("sanity:static-page:gioi-thieu");
  });

  it("post with slug adds sanity:post:<slug>", () => {
    const tags = getRevalidationTags({
      _type: "post",
      slug: "my-first-post",
    });
    expect(tags).toContain("sanity:posts");
    expect(tags).toContain("sanity:post:my-first-post");
  });

  // --- Content platform types include broad tag + per-id ---

  it("content_hub includes sanity:content broad tag", () => {
    const tags = getRevalidationTags({ _type: "content_hub" });
    expect(tags).toContain("sanity:content");
  });

  it("content_article with _id adds sanity:content:<_id>", () => {
    const tags = getRevalidationTags({
      _type: "content_article",
      _id: "abc123",
    });
    expect(tags).toContain("sanity:content");
    expect(tags).toContain("sanity:content:abc123");
  });

  it("content_node with _id adds sanity:content:<_id>", () => {
    const tags = getRevalidationTags({
      _type: "content_node",
      _id: "node456",
    });
    expect(tags).toContain("sanity:content");
    expect(tags).toContain("sanity:content:node456");
  });

  it("route_redirect → sanity:content", () => {
    const tags = getRevalidationTags({ _type: "route_redirect" });
    expect(tags).toEqual(["sanity:content"]);
  });

  // --- Unknown type returns empty ---

  it("unknown _type returns empty array", () => {
    const tags = getRevalidationTags({ _type: "some_future_type" });
    expect(tags).toEqual([]);
  });

  // --- Deduplication ---

  it("tags are deduplicated", () => {
    // faq has 3 static tags, none should be duplicated
    const tags = getRevalidationTags({ _type: "faq" });
    const unique = new Set(tags);
    expect(tags).toHaveLength(unique.size);
  });
});

describe("isDraftId", () => {
  it("returns true for draft IDs", () => {
    expect(isDraftId("drafts.abc123")).toBe(true);
  });

  it("returns false for published IDs", () => {
    expect(isDraftId("abc123")).toBe(false);
  });

  it("returns false for undefined", () => {
    expect(isDraftId(undefined)).toBe(false);
  });

  it("returns false for empty string", () => {
    expect(isDraftId("")).toBe(false);
  });
});
