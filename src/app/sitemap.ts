import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

const routes = [
  "",
  "/hoc-cau-long-cho-nguoi-moi",
  "/lop-cau-long-binh-thanh",
  "/lop-cau-long-thu-duc",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${siteConfig.siteUrl}${route}/`.replace(/(?<!:)\/{2,}/g, "/"),
    lastModified: "2026-04-06",
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.8,
  }));
}
