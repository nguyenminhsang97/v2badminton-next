import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

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
  // Example:
  // { source: "/old-money-page/", destination: "/new-money-page/", permanent: true },
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
