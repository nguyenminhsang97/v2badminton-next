import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { beforeEach, describe, expect, it, vi } from "vitest";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import { buildMetadata, canonicalUrl, coreRoutes } from "@/lib/routes";
import {
  buildBreadcrumbSchema,
  buildCoursePageSchema,
  buildOrganizationSchema,
  buildWebsiteSchema,
} from "@/lib/schema";
import { siteConfig } from "@/lib/site";

const sanityMocks = vi.hoisted(() => ({
  getCoaches: vi.fn(),
  getContentSitemapEntries: vi.fn(),
  getMoneyPageSitemapEntries: vi.fn(),
  getPublishedPosts: vi.fn(),
}));

vi.mock("@/lib/sanity", () => sanityMocks);

function values<T>(value: T | readonly T[] | null | undefined): T[] {
  if (value === undefined || value === null) return [];
  return Array.isArray(value) ? Array.from(value as readonly T[]) : [value as T];
}

describe("SEO regression guardrails", () => {
  beforeEach(() => {
    sanityMocks.getPublishedPosts.mockResolvedValue([
      {
        slug: "tin-v2-open-day",
        publishedAt: "2026-05-01T00:00:00.000Z",
        updatedAt: "2026-05-09T00:00:00.000Z",
      },
    ]);
    sanityMocks.getCoaches.mockResolvedValue([
      { updatedAt: "2026-05-08T00:00:00.000Z" },
    ]);
    sanityMocks.getMoneyPageSitemapEntries.mockResolvedValue([
      {
        slug: "hoc-cau-long-cho-nguoi-moi",
        updatedAt: "2026-05-10T00:00:00.000Z",
      },
      {
        slug: "lop-cau-long-cuoi-tuan",
        updatedAt: "2026-05-11T00:00:00.000Z",
      },
    ]);
    sanityMocks.getContentSitemapEntries.mockResolvedValue([
      {
        type: "content_hub",
        path: "/ky-thuat-cau-long/",
        updatedAt: "2026-05-12T00:00:00.000Z",
      },
      {
        type: "court",
        path: "/san-cau-long/green-garden/",
        updatedAt: null,
      },
    ]);
  });

  it("keeps core-route metadata canonical, absolute, and social-ready", () => {
    for (const route of coreRoutes) {
      const metadata = buildMetadata(route.path);
      const expectedUrl = canonicalUrl(route.path);

      expect(metadata.alternates?.canonical).toBe(expectedUrl);
      expect(metadata.openGraph?.url).toBe(expectedUrl);
      expect(metadata.openGraph?.locale).toBe(siteConfig.locale);
      expect(metadata.openGraph?.siteName).toBe(siteConfig.name);
      expect((metadata.twitter as { card?: string } | undefined)?.card).toBe(
        "summary_large_image",
      );
      expect(metadata.openGraph?.images).toEqual([
        expect.stringMatching(/^https:\/\/v2badminton\.com\//),
      ]);
      expect(new URL(expectedUrl).pathname).toMatch(/\/$/);
    }
  });

  it("keeps root robots metadata controlled by the indexing env gate", () => {
    const layout = readFileSync(resolve(__dirname, "../../app/layout.tsx"), "utf8");

    expect(layout).toContain('NEXT_PUBLIC_ALLOW_INDEXING === "true"');
    expect(layout).toContain("robots: {");
    expect(layout).toContain("index: allowIndexing");
    expect(layout).toContain("follow: true");
  });

  it("keeps robots.txt scoped to API blocking and the canonical sitemap", () => {
    const config = robots();
    const rules = values(config.rules);

    expect(config.sitemap).toBe(`${siteConfig.siteUrl}/sitemap.xml`);
    expect(config.host).toBe(siteConfig.siteUrl);
    expect(rules.map((rule) => rule.userAgent)).toEqual(
      expect.arrayContaining([
        "*",
        "GPTBot",
        "ChatGPT-User",
        "ClaudeBot",
        "PerplexityBot",
      ]),
    );

    for (const rule of rules) {
      expect(values(rule.allow)).toContain("/");
      expect(values(rule.disallow)).toEqual(["/api/"]);
      expect(values(rule.disallow)).not.toContain("/blog/");
    }
  });

  it("keeps sitemap URLs canonical and covers static, blog, coach, and content routes", async () => {
    const entries = await sitemap();
    const urls = entries.map((entry) => entry.url);

    expect(urls).toContain(canonicalUrl("/"));
    expect(urls).toContain(canonicalUrl("/hoc-cau-long-cho-nguoi-moi/"));
    expect(urls).toContain(canonicalUrl("/lop-cau-long-cuoi-tuan/"));
    expect(urls).toContain(canonicalUrl("/gioi-thieu/"));
    expect(urls).toContain(canonicalUrl("/chinh-sach-bao-mat/"));
    expect(urls).toContain(canonicalUrl("/blog/"));
    expect(urls).toContain(canonicalUrl("/blog/tin-v2-open-day/"));
    expect(urls).toContain(canonicalUrl("/huan-luyen-vien/"));
    expect(urls).toContain(canonicalUrl("/ky-thuat-cau-long/"));
    expect(urls).toContain(canonicalUrl("/san-cau-long/green-garden/"));
    expect(urls).not.toContain(canonicalUrl("/monitoring-test/"));
    expect(new Set(urls).size).toBe(urls.length);

    for (const url of urls) {
      expect(url.startsWith(siteConfig.siteUrl)).toBe(true);
      expect(new URL(url).pathname).toMatch(/\/$/);
    }

    expect(
      entries.find((entry) => entry.url === canonicalUrl("/ky-thuat-cau-long/"))
        ?.priority,
    ).toBe(0.8);
    expect(
      entries.find(
        (entry) => entry.url === canonicalUrl("/san-cau-long/green-garden/"),
      )?.priority,
    ).toBe(0.6);
  });

  it("keeps JSON-LD builders schema.org-safe and free of rating markup", () => {
    const contact = {
      phoneE164: siteConfig.phoneE164,
      facebookUrl: siteConfig.facebookUrl,
    };
    const schemas = [
      buildOrganizationSchema(contact),
      buildWebsiteSchema(),
      buildBreadcrumbSchema([
        { name: "Trang chu", item: canonicalUrl("/") },
        {
          name: "Nguoi moi",
          item: canonicalUrl("/hoc-cau-long-cho-nguoi-moi/"),
        },
      ]),
      buildCoursePageSchema(
        "/hoc-cau-long-cho-nguoi-moi/",
        "Hoc cau long cho nguoi moi",
        "Khoa hoc cau long co ban tai TP.HCM.",
      ),
    ];

    for (const schema of schemas) {
      expect(schema["@context"]).toBe("https://schema.org");
      expect(schema["@type"]).toBeTruthy();
    }

    const serialized = JSON.stringify(schemas);
    expect(JSON.parse(serialized)).toEqual(schemas);
    expect(serialized).not.toContain("AggregateRating");
    expect(schemas[3]).toMatchObject({
      "@type": "Course",
      url: canonicalUrl("/hoc-cau-long-cho-nguoi-moi/"),
    });
  });
});
