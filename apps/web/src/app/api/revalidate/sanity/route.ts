import { revalidateTag } from "next/cache";
import {
  isSignatureError,
  isValidSignature,
  SIGNATURE_HEADER_NAME,
} from "@sanity/webhook";
import {
  getRevalidationTags,
  isDraftId,
  type SanityWebhookPayload,
} from "@/lib/sanity/revalidationMap";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * POST /api/revalidate/sanity
 *
 * Receives signed Sanity GROQ-projection webhooks and purges the
 * corresponding Next.js cache tags via `revalidateTag`.
 *
 * Security: HMAC signature verified via @sanity/webhook before any
 * processing. Secret comes from SANITY_REVALIDATE_SECRET env var.
 *
 * @see .claude/CMS/v2badminton-cms-cache-revalidation-plan.md
 */
export async function POST(req: Request): Promise<Response> {
  // 1. Check secret is configured
  const secret = process.env.SANITY_REVALIDATE_SECRET?.trim();
  if (!secret) {
    console.error(
      "[revalidate/sanity] SANITY_REVALIDATE_SECRET is not configured. Rejecting request.",
    );
    return Response.json(
      { error: "server_configuration_error" },
      { status: 500 },
    );
  }

  // 2. Read raw body (before JSON.parse — required for signature verification)
  const rawBody = await req.text();

  // 3. Get signature header
  const signature = req.headers.get(SIGNATURE_HEADER_NAME);
  if (!signature) {
    console.warn("[revalidate/sanity] Missing signature header. Rejecting.");
    return Response.json({ error: "missing_signature" }, { status: 401 });
  }

  // 4. Verify signature (async, can throw on malformed/expired signatures)
  try {
    const isValid = await isValidSignature(rawBody, signature, secret);
    if (!isValid) {
      console.warn("[revalidate/sanity] Invalid signature. Rejecting.");
      return Response.json({ error: "invalid_signature" }, { status: 401 });
    }
  } catch (err: unknown) {
    if (isSignatureError(err)) {
      console.warn(
        `[revalidate/sanity] Signature verification error: ${err.message}`,
      );
    } else {
      console.warn("[revalidate/sanity] Signature verification threw.", err);
    }
    return Response.json({ error: "invalid_signature" }, { status: 401 });
  }

  // 5. Parse JSON (signature is valid, but body might not be valid JSON)
  let payload: SanityWebhookPayload;
  try {
    payload = JSON.parse(rawBody) as SanityWebhookPayload;
  } catch {
    console.warn("[revalidate/sanity] Valid signature but unparseable JSON body.");
    return Response.json({ error: "invalid_json" }, { status: 400 });
  }

  // 6. Validate _type exists
  if (!payload._type || typeof payload._type !== "string") {
    console.warn("[revalidate/sanity] Payload missing _type field.");
    return Response.json({ revalidated: [] }, { status: 200 });
  }

  // 7. Drop draft documents (defensive — webhook filter should exclude them)
  if (isDraftId(payload._id)) {
    console.info(
      `[revalidate/sanity] Skipping draft document: _type=${payload._type}, _id=${payload._id}`,
    );
    return Response.json({ revalidated: [] }, { status: 200 });
  }

  // 8. Map _type to cache tags
  const tags = getRevalidationTags(payload);

  if (tags.length === 0) {
    console.warn(
      `[revalidate/sanity] Unknown _type="${payload._type}" — no tags to purge. Consider updating revalidationMap.ts.`,
    );
    return Response.json({ revalidated: [] }, { status: 200 });
  }

  // 9. Purge each tag — { expire: 0 } for immediate invalidation per Next.js 16
  // webhook best practice (not stale-while-revalidate; content should be fresh
  // on the very next request after a CMS publish)
  for (const tag of tags) {
    revalidateTag(tag, { expire: 0 });
  }

  console.info(
    `[revalidate/sanity] Revalidated: _type=${payload._type}, _id=${payload._id ?? "unknown"}, tags=[${tags.join(", ")}]`,
  );

  return Response.json({ revalidated: tags }, { status: 200 });
}
