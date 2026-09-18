import { draftMode } from "next/headers";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * GET /api/draft-mode/disable
 *
 * Leaves draft mode and returns to the published site. No secret required —
 * turning preview *off* is not a privileged action, and making it awkward would
 * only tempt an editor to stay in preview while checking live pages.
 */
export async function GET(request: Request): Promise<Response> {
  const draft = await draftMode();
  draft.disable();

  const requested = new URL(request.url).searchParams.get("path");
  const safePath =
    requested && requested.startsWith("/") && !requested.startsWith("//")
      ? requested
      : "/";

  return new Response(null, {
    status: 307,
    headers: {
      Location: safePath,
      "Cache-Control": "no-store",
    },
  });
}
