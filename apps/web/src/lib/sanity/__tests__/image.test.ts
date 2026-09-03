import { describe, it, expect } from "vitest";
import { sanityImageLoader } from "../image";

const SANITY_SRC =
  "https://cdn.sanity.io/images/w58s0f53/production/abc-1120x960.jpg";

describe("sanityImageLoader", () => {
  it("defaults quality to 75 when not provided", () => {
    const url = sanityImageLoader({ src: SANITY_SRC, width: 720 });
    expect(url).toContain("q=75");
  });

  it("passes through a custom quality value", () => {
    const url = sanityImageLoader({ src: SANITY_SRC, width: 720, quality: 90 });
    expect(url).toContain("q=90");
    expect(url).not.toContain("q=75");
  });

  it("caps requested width at 1920", () => {
    const url = sanityImageLoader({ src: SANITY_SRC, width: 4000 });
    expect(url).toContain("w=1920");
    expect(url).not.toContain("w=4000");
  });

  it("preserves widths under the cap", () => {
    const url = sanityImageLoader({ src: SANITY_SRC, width: 720 });
    expect(url).toContain("w=720");
  });

  it("strips an existing query string and replaces it", () => {
    const dirty = `${SANITY_SRC}?w=99&foo=bar`;
    const url = sanityImageLoader({ src: dirty, width: 720 });
    expect(url).not.toContain("foo=bar");
    expect(url).not.toContain("w=99");
    expect(url).toContain("w=720");
    expect(url.startsWith(SANITY_SRC)).toBe(true);
  });

  it("includes fit=max to avoid upscaling small originals", () => {
    const url = sanityImageLoader({ src: SANITY_SRC, width: 720 });
    expect(url).toContain("fit=max");
  });

  it("emits auto=format for webp/avif negotiation", () => {
    const url = sanityImageLoader({ src: SANITY_SRC, width: 720 });
    expect(url).toContain("auto=format");
  });

  it("returns non-Sanity sources unchanged", () => {
    const localSrc = "/_next/static/media/coach.jpg";
    expect(sanityImageLoader({ src: localSrc, width: 720 })).toBe(localSrc);

    const externalSrc = "https://example.com/foo.png";
    expect(sanityImageLoader({ src: externalSrc, width: 720, quality: 80 })).toBe(
      externalSrc,
    );
  });

  it("rounds fractional widths", () => {
    const url = sanityImageLoader({ src: SANITY_SRC, width: 720.6 });
    expect(url).toContain("w=721");
  });
});
