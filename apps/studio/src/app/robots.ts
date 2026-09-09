import type { MetadataRoute } from "next";

/**
 * The Studio origin must never be indexed. next-sanity/studio already sets
 * `robots: noindex` on the page metadata; this is defence in depth at the
 * origin level and stops the host serving a 404 for /robots.txt.
 * No `sitemap` entry, on purpose.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", disallow: "/" }],
  };
}
