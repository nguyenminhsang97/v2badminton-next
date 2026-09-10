import { draftMode } from "next/headers";
import { validatePreviewUrl } from "@sanity/preview-url-secret";
import { getSanityDraftClient } from "@/lib/sanity/client";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * GET /api/draft-mode/enable
 *
 * Turns on draft mode so the site renders unpublished Sanity content for this
 * browser only, then redirects to the page being previewed.
 *
 * Security: the caller proves itself with a short-lived secret that the Studio
 * writes into Sanity and appends to this URL; `validatePreviewUrl` checks it
 * against the dataset. No shared static secret exists, which matters because the
 * Studio is a separate origin (cms.v2badminton.com) and anything embedded in its
 * bundle would be public.
 *
 * The redirect target comes back from `validatePreviewUrl` as a path, and is
 * re-checked here to be same-origin — an open redirect on a route that also sets
 * a session cookie would be worth more to an attacker than either alone.
 */
export async function GET(request: Request): Promise<Response> {
  const client = getSanityDraftClient();

  if (!client) {
    console.error(
      "[draft-mode] SANITY_API_VIEWER_TOKEN is not configured. Refusing to enable draft mode.",
    );
    return Response.json(
      { error: "draft_mode_not_configured" },
      { status: 500 },
    );
  }

  let isValid = false;
  let redirectTo = "/";

  try {
    const result = await validatePreviewUrl(client, request.url);
    isValid = result.isValid;
    redirectTo = result.redirectTo ?? "/";
  } catch (error) {
    console.warn("[draft-mode] Secret validation failed.", { error });
    return Response.json({ error: "invalid_secret" }, { status: 401 });
  }

  if (!isValid) {
    console.warn("[draft-mode] Invalid or expired secret. Rejecting.");
    return Response.json({ error: "invalid_secret" }, { status: 401 });
  }

  const safePath = toSameOriginPath(redirectTo);

  const draft = await draftMode();
  draft.enable();

  return new Response(null, {
    status: 307,
    headers: {
      Location: safePath,
      // Belt and braces: the pages themselves also send these, but a redirect
      // that hands out a preview cookie should never be cached either.
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}

/**
 * Reduce whatever came back to a path on this site. Anything absolute,
 * protocol-relative, or otherwise off-origin collapses to the homepage.
 */
function toSameOriginPath(target: string): string {
  if (!target.startsWith("/") || target.startsWith("//")) {
    return "/";
  }

  return target;
}
