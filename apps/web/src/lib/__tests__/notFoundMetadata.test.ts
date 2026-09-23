import { beforeEach, describe, expect, it, vi } from "vitest";
import { NOT_FOUND_METADATA } from "@/lib/notFoundMetadata";

// Both routes reach notFound() for a missing record. What is asserted here is
// the metadata on the way there: returning {} lets the root layout's
// `robots: index, follow` stand on a page that does not exist, which is how
// /tin-tuc/<missing>/ ended up serving "index, follow" next to the noindex Next
// adds for the not-found render.
// The money-page routes pull in modules guarded by `server-only`, which throws
// outside a server build. Vitest runs plain Node, so stub it.
vi.mock("server-only", () => ({}));

const getPostBySlug = vi.fn();
const resolveContentRoute = vi.fn();
const loadSiteChromeSettings = vi.fn();
const getMoneyPage = vi.fn();

vi.mock("@/lib/sanity", () => ({
  getPostBySlug: (...args: unknown[]) => getPostBySlug(...args),
  getPublishedPosts: async () => [],
  resolveContentRoute: (...args: unknown[]) => resolveContentRoute(...args),
  getContentArticle: async () => null,
  getContentHub: async () => null,
  getContentNode: async () => null,
  getContentRedirect: async () => null,
  getContentSitemapEntries: async () => [],
  getCourt: async () => null,
  getMoneyPage: (...args: unknown[]) => getMoneyPage(...args),
  getScheduleBlocks: async () => [],
}));

vi.mock("@/components/layout/siteSettings", () => ({
  loadSiteChromeSettings: (...args: unknown[]) => loadSiteChromeSettings(...args),
}));

describe("NOT_FOUND_METADATA", () => {
  it("is noindex, and still lets crawlers follow the links out", () => {
    expect(NOT_FOUND_METADATA.robots).toEqual({ index: false, follow: true });
    expect(NOT_FOUND_METADATA.title).toBe("Không tìm thấy trang");
  });
});

describe("generateMetadata for a record that does not exist", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    loadSiteChromeSettings.mockResolvedValue({});
  });

  it("marks a missing blog post noindex instead of inheriting the layout default", async () => {
    getPostBySlug.mockResolvedValue(null);
    const { generateMetadata } = await import(
      "@/app/(site)/tin-tuc/[slug]/page"
    );

    const metadata = await generateMetadata({
      params: Promise.resolve({ slug: "bai-viet-khong-ton-tai" }),
    });

    expect(metadata.robots).toEqual({ index: false, follow: true });
  });

  it("does not mark a post that exists noindex", async () => {
    getPostBySlug.mockResolvedValue({
      slug: "co-that",
      title: "Bài có thật",
      metaTitle: null,
      metaDescription: "Mô tả",
      excerpt: "Tóm tắt",
      publishedAt: "2026-01-01",
      coverImageUrl: null,
    });
    const { generateMetadata } = await import(
      "@/app/(site)/tin-tuc/[slug]/page"
    );

    const metadata = await generateMetadata({
      params: Promise.resolve({ slug: "co-that" }),
    });

    expect(metadata.robots).toBeUndefined();
  });

  // These three fail closed by 404 instead of rendering placeholder copy, so their
  // metadata is the only thing standing between a Sanity outage and Google being
  // told an empty page is indexable. Found by serving a production build with
  // Sanity pointed at a project that does not exist: both district pages rendered
  // the not-found UI under `index, follow`.
  it.each([
    ["thu duc", () => import("@/app/(site)/lop-cau-long-thu-duc/page")],
    ["binh thanh", () => import("@/app/(site)/lop-cau-long-binh-thanh/page")],
    ["nguoi moi", () => import("@/app/(site)/hoc-cau-long-cho-nguoi-moi/page")],
  ])("marks the %s page noindex when its money page is gone", async (_name, load) => {
    getMoneyPage.mockResolvedValue({ page: null, degraded: true });
    const { generateMetadata } = await load();

    const metadata = await generateMetadata();

    expect(metadata.robots).toEqual({ index: false, follow: true });
  });

  it("marks an unknown content path noindex", async () => {
    resolveContentRoute.mockResolvedValue(null);
    const { generateMetadata } = await import("@/app/(site)/[...slug]/page");

    const metadata = await generateMetadata({
      params: Promise.resolve({ slug: ["khong-ton-tai-xyz"] }),
    });

    expect(metadata.robots).toEqual({ index: false, follow: true });
  });
});
