import { NextResponse, type NextRequest } from "next/server";

const PRIMARY_HOST = "v2badminton.com";

export function proxy(request: NextRequest) {
  const host = request.headers.get("host") ?? "";
  if (host === "v2badminton-next.vercel.app") {
    const url = new URL(
      request.nextUrl.pathname + request.nextUrl.search,
      `https://${PRIMARY_HOST}`,
    );
    return NextResponse.redirect(url, 308);
  }
  return NextResponse.next();
}

export const config = {
  // Match every path except Next internals and static assets.
  // Crucially, DO match /robots.txt and /sitemap.xml — these are crawl-critical
  // and must redirect off the Vercel alias to the primary domain.
  matcher: [
    "/((?!_next/|api/|.*\\.(?:js|css|map|png|jpg|jpeg|webp|gif|svg|ico|woff|woff2|ttf|otf|eot)$).*)",
  ],
};
