import type { NextConfig } from "next";

/**
 * Studio-only Next.js shell. Deliberately minimal — see
 * docs/cms/gate-b-addendum-2026-09-09.md §B-8.
 *
 * - No CSP. Sanity Studio needs 'unsafe-eval', blob: workers and a wide
 *   connect-src; a hand-written policy breaks the editor and buys nothing.
 *   Access control on this origin is Vercel Password Protection, not CSP.
 * - No Sentry. The public site owns error reporting.
 * - No images config. The Studio serves its own assets.
 * - `env` mirrors apps/web/next.config.ts. NEXT_PUBLIC_* Sanity vars are
 *   public (browser-bundle safe) and already committed next door, so
 *   hardcoding the same fallbacks costs nothing and makes local dev and CI
 *   work with no .env file. A Vercel-set value still wins — the config reads
 *   process.env first. NEXT_PUBLIC_SITE_URL is deliberately NOT in here:
 *   it varies per environment and @v2/schema-shared already defaults it.
 * - No `trailingSlash`. The web app sets it; the Studio must not, or Sanity's
 *   own routes (/structure/pages-group;content_article) stop resolving.
 */
// A fallback keeps local dev working but would let a forgotten Vercel variable
// pass unnoticed, silently pointing the Studio at the real production dataset.
// Warn at build time so a misconfigured project shows up in the build log.
for (const key of [
  "NEXT_PUBLIC_SANITY_PROJECT_ID",
  "NEXT_PUBLIC_SANITY_DATASET",
] as const) {
  if (!process.env[key]?.trim()) {
    console.warn(
      `[studio] ${key} is not set — falling back to the committed default. ` +
        `On Vercel this means the environment variable is missing.`,
    );
  }
}

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_SANITY_PROJECT_ID:
      process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "w58s0f53",
    NEXT_PUBLIC_SANITY_DATASET:
      process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  },
  transpilePackages: ["@v2/schema-shared"],
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
        ],
      },
    ];
  },
};

export default nextConfig;
