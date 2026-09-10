import path from "node:path";
import type { NextConfig } from "next";
import { loadEnvConfig } from "@next/env";
import { withSentryConfig } from "@sentry/nextjs";

/**
 * Load the repo-root env files.
 *
 * Env lives at the repo root, but `next dev` reads `process.cwd()` — which is
 * this workspace — so without this the local server starts with no
 * SANITY_API_READ_TOKEN. That is not a loud failure: Sanity answers an
 * unauthenticated read with a *subset* of the dataset, so the local site renders
 * with no pricing tiers, no CMS locations, no schedule blocks and 45 of 67 FAQs,
 * and looks plausible while differing from production. Checking UI against that
 * is how you reach a confident wrong conclusion.
 *
 * `loadEnvConfig` never overwrites a variable that is already set, so on Vercel —
 * where the platform provides them and no .env file exists — this is a no-op.
 */
loadEnvConfig(
  path.resolve(import.meta.dirname, "../.."),
  process.env.NODE_ENV !== "production",
  console,
  // forceReload. Next already called loadEnvConfig for this workspace, and the
  // function memoises its result and returns early on the second call. Without
  // this flag the repo-root files are never read.
  true,
);

// W8-3 — Report-Only CSP. Intentionally broad to avoid false breakage during
// the bake window; W8-4 will narrow before any enforcement. `'unsafe-inline'`
// is required by GTM's dangerouslySetInnerHTML bootstrap and by next/image's
// inline style="..." attributes; removing it requires a separate nonce
// migration. `'unsafe-eval'` is kept while GTM container scripts and some
// Sentry codepaths may eval; W8-4 will re-evaluate after bake. Three regional
// Sentry ingest wildcards are listed because the DSN host is not enumerated
// at config-time; W8-4 will narrow to the one our DSN actually uses.
// `upgrade-insecure-requests` is intentionally NOT included here — it has no
// effect in Report-Only mode and belongs in W8-4 enforcement.
// See .claude/CMS/v2badminton-cms-w8-3-csp-report-only-ticket.md
const CSP_REPORT_ONLY = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://*.googletagmanager.com https://challenges.cloudflare.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://cdn.sanity.io https://www.googletagmanager.com https://*.google-analytics.com",
  "font-src 'self' data:",
  "connect-src 'self' https://*.ingest.sentry.io https://*.ingest.us.sentry.io https://*.ingest.de.sentry.io https://*.google-analytics.com https://www.google-analytics.com https://analytics.google.com https://*.googletagmanager.com https://*.api.sanity.io https://*.apicdn.sanity.io https://cdn.sanity.io https://challenges.cloudflare.com",
  "frame-src 'self' https://www.googletagmanager.com https://challenges.cloudflare.com",
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
].join("; ");

type FileRouteRedirect = {
  source: string;
  destination: string;
  permanent: boolean;
};

// File-routed page URL moves belong here because CMS route_redirect records are
// resolved only by the content catch-all, after filesystem routes have matched.
// Follow docs/cms/url-rename-runbook.md before adding entries.
const FILE_ROUTE_REDIRECTS: FileRouteRedirect[] = [
  // /blog/ -> /tin-tuc/ (2026-09-08). The news feed was renamed while it still
  // had zero published posts and was noindex, so nothing was indexed and no
  // ranking or backlink was at stake. This redirect exists for links shared
  // before the rename, not for search engines.
  // Split into two rules on purpose. A single `/blog/:slug*` -> `/tin-tuc/:slug*`
  // works, but with `trailingSlash: true` it sends post URLs to a slashless
  // destination that then needs a second 308 to add the slash back — a two-hop
  // chain for every shared link. `:slug+` (one or more) carries the trailing
  // slash itself, and the index gets its own rule because `+` cannot match empty.
  { source: "/blog", destination: "/tin-tuc/", permanent: true },
  { source: "/blog/:slug+", destination: "/tin-tuc/:slug+/", permanent: true },
];

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1"],
  // Workspace package consumed as source via tsconfig paths; npm symlinks it
  // under apps/web/node_modules/@v2/schema-shared, so SWC needs explicit
  // transpile permission. See .claude/CMS/CMS-STUDIO-SPLIT-IMPLEMENTATION-PLAN.md §4.5.
  transpilePackages: ["@v2/schema-shared"],
  // NEXT_PUBLIC_* Sanity vars are public (browser-bundle safe) and committed
  // here so Vercel builds work without separate env-var dashboard settings.
  env: {
    NEXT_PUBLIC_SANITY_PROJECT_ID:
      process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "w58s0f53",
    NEXT_PUBLIC_SANITY_DATASET:
      process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
  trailingSlash: true,
  poweredByHeader: false,
  async redirects() {
    return FILE_ROUTE_REDIRECTS;
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          {
            key: "Content-Security-Policy-Report-Only",
            value: CSP_REPORT_ONLY,
          },
        ],
      },
    ];
  },
};

const sentryBuildOptions = {
  silent: !process.env.CI,
  ...(process.env.SENTRY_AUTH_TOKEN &&
  process.env.SENTRY_ORG &&
  process.env.SENTRY_PROJECT
    ? {
        authToken: process.env.SENTRY_AUTH_TOKEN,
        org: process.env.SENTRY_ORG,
        project: process.env.SENTRY_PROJECT,
        widenClientFileUpload: true,
      }
    : {}),
};

export default withSentryConfig(nextConfig, sentryBuildOptions);
