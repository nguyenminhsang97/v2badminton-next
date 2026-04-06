import type { MetadataRoute } from "next";
import { canonicalUrl, coreRoutes } from "@/lib/routes";

export default function sitemap(): MetadataRoute.Sitemap {
  return coreRoutes.map((route) => ({
    url: canonicalUrl(route.path),
    lastModified: "2026-04-06",
    changeFrequency: "weekly",
    priority: route.path === "/" ? 1 : 0.8,
  }));
}
