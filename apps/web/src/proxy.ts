import { NextResponse, type NextRequest } from "next/server";

const PRIMARY_HOST = "v2badminton.com";

/**
 * Next sets this cookie when draft mode is enabled. Its presence is enough to
 * mark the response uncacheable and unindexable — whether the preview session
 * is actually valid is decided further in, but a page rendered for a
 * cookie-bearing request must never reach a crawler or a shared cache.
 */
const DRAFT_MODE_COOKIE = "__prerender_bypass";

export function proxy(request: NextRequest) {
  const host = request.headers.get("host") ?? "";
  if (host === "v2badminton-next.vercel.app") {
    const url = new URL(
      request.nextUrl.pathname + request.nextUrl.search,
      `https://${PRIMARY_HOST}`,
    );
    return NextResponse.redirect(url, 308);
  }

  const response = NextResponse.next();

  if (request.cookies.has(DRAFT_MODE_COOKIE)) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
    response.headers.set("Cache-Control", "no-store, must-revalidate");
  }

  return response;
}

export const config = {
  // Match every path except Next internals and static assets.
  // Crucially, DO match /robots.txt and /sitemap.xml — these are crawl-critical
  // and must redirect off the Vercel alias to the primary domain.
  matcher: [
    "/((?!_next/|api/|.*\\.(?:js|css|map|png|jpg|jpeg|webp|gif|svg|ico|woff|woff2|ttf|otf|eot)$).*)",
  ],
};
