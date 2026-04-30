import type { MetadataRoute } from "next";
import { canonicalUrl, coreRoutes } from "@/lib/routes";
import {
  getCoaches,
  getMoneyPageSitemapEntries,
  getPublishedPosts,
} from "@/lib/sanity";

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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const generatedAt = new Date();
  const [posts, coaches, moneyPages] = await Promise.all([
    getPublishedPosts(),
    getCoaches(),
    getMoneyPageSitemapEntries(),
  ]);
  const moneyPageUpdatedAtByPath = new Map<string, string | null>(
    moneyPages.map((page) => [`/${page.slug}/`, page.updatedAt] as const),
  );
  const staticRoutes = coreRoutes.map((route) => ({
    url: canonicalUrl(route.path),
    lastModified: resolveLastModified(
      moneyPageUpdatedAtByPath.get(route.path),
      generatedAt,
    ),
    changeFrequency: "weekly" as const,
    priority: route.path === "/" ? 1 : 0.8,
  }));

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

  return [...staticRoutes, ...blogRoutes, ...coachRoutes];
}
