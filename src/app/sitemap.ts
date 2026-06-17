import type { MetadataRoute } from "next";
import { canonicalUrl, coreRoutes } from "@/lib/routes";
import {
  getCoaches,
  getContentSitemapEntries,
  getMoneyPageSitemapEntries,
  getPublishedPosts,
} from "@/lib/sanity";
import type { SanityContentSitemapEntry } from "@/lib/sanity";

function resolveLastModified(
  value: string | null | undefined,
  fallback: Date,
) {
  return value ?? fallback;
}

function latestLastModified(
  values: Array<string | null | undefined>,
  fallback: Date,
) {
  const latest = values
    .filter((value): value is string => Boolean(value))
    .map((value) => new Date(value).getTime())
    .filter(Number.isFinite)
    .sort((left, right) => right - left)[0];

  return latest ? new Date(latest).toISOString() : fallback;
}

function priorityForContentType(type: SanityContentSitemapEntry["type"]): number {
  switch (type) {
    case "content_hub": return 0.8;
    case "content_node": return 0.7;
    case "content_article": return 0.7;
    case "court": return 0.6;
  }
}

// Stable fallback date — prevents Google from seeing lastmod change on every request.
// Update only when the site goes through a meaningful redesign or content restructure.
const SITE_RELAUNCH_DATE = new Date("2026-04-01T00:00:00Z");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const generatedAt = SITE_RELAUNCH_DATE;
  const [posts, coaches, moneyPages, contentEntries] = await Promise.all([
    getPublishedPosts(),
    getCoaches(),
    getMoneyPageSitemapEntries(),
    getContentSitemapEntries(),
  ]);
  const moneyPageUpdatedAtByPath = new Map<string, string | null>(
    moneyPages.map((page) => [`/${page.slug}/`, page.updatedAt] as const),
  );
  const ALWAYS_INDEX_PATHS = new Set<string>([
    "/",
    "/hoc-cau-long-cho-nguoi-moi/",
    "/lop-cau-long-binh-thanh/",
    "/lop-cau-long-thu-duc/",
  ]);
  // PRECONDITION: the three money-page entries above route through
  // `notFoundForMissingMoneyPage()` when their Sanity money_page is missing —
  // they return HTTP 404, not a fallback render. Listing them here
  // unconditionally is only safe AFTER confirming that all three required
  // money_page documents (slugs: hoc-cau-long-cho-nguoi-moi,
  // lop-cau-long-binh-thanh, lop-cau-long-thu-duc) exist in production Sanity
  // with non-empty body. If any is missing, either (a) populate it in Sanity
  // before deploying, or (b) temporarily remove it from this set and gate it
  // via publishedMoneyPagePaths like the other money pages.
  //
  // "/gioi-thieu/" is NOT listed here — it is not a coreRoutes entry, so it
  // ships as a static sitemap entry (aboutRoute below), added in the same
  // W3.4 PR that creates the page.

  const publishedMoneyPagePaths = new Set(
    moneyPages.map((page) => `/${page.slug}/`),
  );

  const staticRoutes = coreRoutes
    .filter(
      (route) =>
        ALWAYS_INDEX_PATHS.has(route.path) ||
        publishedMoneyPagePaths.has(route.path),
    )
    .map((route) => ({
      url: canonicalUrl(route.path),
      lastModified: resolveLastModified(
        moneyPageUpdatedAtByPath.get(route.path),
        generatedAt,
      ),
      changeFrequency: "weekly" as const,
      priority: route.path === "/" ? 1 : 0.8,
    }));

  const legalRoutes = [
    {
      url: canonicalUrl("/chinh-sach-bao-mat/"),
      lastModified: generatedAt.toISOString(),
      changeFrequency: "yearly" as const,
      priority: 0.3,
    },
  ];

  const aboutRoute = [
    {
      url: canonicalUrl("/gioi-thieu/"),
      lastModified: generatedAt.toISOString(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
  ];

  const blogRoutes =
    posts.length > 0
      ? [
          {
            url: canonicalUrl("/blog/"),
            lastModified: latestLastModified(
              posts.map((post) => post.updatedAt ?? post.publishedAt),
              generatedAt,
            ),
            changeFrequency: "weekly" as const,
            priority: 0.7,
          },
          ...posts.map((post) => ({
            url: canonicalUrl(`/blog/${post.slug}/`),
            lastModified: resolveLastModified(
              post.updatedAt ?? post.publishedAt,
              generatedAt,
            ),
            changeFrequency: "monthly" as const,
            priority: 0.6,
          })),
        ]
      : [];

  const coachRoutes =
    coaches.length > 0
      ? [
          {
            url: canonicalUrl("/huan-luyen-vien/"),
            lastModified: latestLastModified(
              coaches.map((coach) => coach.updatedAt),
              generatedAt,
            ),
            changeFrequency: "monthly" as const,
            priority: 0.6,
          },
        ]
      : [];

  const contentRoutes = contentEntries.map((entry) => ({
    url: canonicalUrl(entry.path),
    lastModified: resolveLastModified(entry.updatedAt, generatedAt),
    changeFrequency: "weekly" as const,
    priority: priorityForContentType(entry.type),
  }));

  return [
    ...staticRoutes,
    ...aboutRoute,
    ...legalRoutes,
    ...blogRoutes,
    ...coachRoutes,
    ...contentRoutes,
  ];
}
