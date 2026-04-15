import type { MetadataRoute } from "next";
import { canonicalUrl, coreRoutes } from "@/lib/routes";
import { getPublishedPosts } from "@/lib/sanity";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPublishedPosts();
  const staticRoutes = coreRoutes.map((route) => ({
    url: canonicalUrl(route.path),
    lastModified: "2026-04-10",
    changeFrequency: "weekly" as const,
    priority: route.path === "/" ? 1 : 0.8,
  }));

  const blogRoutes = [
    {
      url: canonicalUrl("/blog/"),
      lastModified: "2026-04-14",
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },
    ...posts.map((post) => ({
      url: canonicalUrl(`/blog/${post.slug}/`),
      lastModified: post.publishedAt ?? "2026-04-14",
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];

  return [...staticRoutes, ...blogRoutes];
}
