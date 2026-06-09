import { beforeEach, describe, expect, it, vi } from "vitest";
import { encodeSignatureHeader, SIGNATURE_HEADER_NAME } from "@sanity/webhook";

// Mock next/cache before importing the route handler
vi.mock("next/cache", () => ({
  revalidateTag: vi.fn(),
}));

// Must import after mock setup
const { revalidateTag } = await import("next/cache");
const { POST } = await import("../route");

const TEST_SECRET = "test-webhook-secret-for-unit-tests";

/**
 * Helper: build a signed Request with a valid HMAC signature.
 */
async function buildSignedRequest(
  body: Record<string, unknown>,
): Promise<Request> {
  const raw = JSON.stringify(body);
  const timestamp = Date.now();
  const signature = await encodeSignatureHeader(raw, timestamp, TEST_SECRET);

  return new Request("http://localhost/api/revalidate/sanity", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      [SIGNATURE_HEADER_NAME]: signature,
    },
    body: raw,
  });
}

/**
 * Helper: build a Request with an invalid signature.
 */
function buildBadSigRequest(body: string): Request {
  return new Request("http://localhost/api/revalidate/sanity", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      [SIGNATURE_HEADER_NAME]: "t=0,v=invalid-signature-value",
    },
    body,
  });
}

/**
 * Helper: build a Request with no signature header.
 */
function buildNoSigRequest(body: string): Request {
  return new Request("http://localhost/api/revalidate/sanity", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  });
}

describe("POST /api/revalidate/sanity", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Set the secret env var for tests
    process.env.SANITY_REVALIDATE_SECRET = TEST_SECRET;
  });

  // --- Secret missing → 500 ---

  it("returns 500 when SANITY_REVALIDATE_SECRET is not set", async () => {
    delete process.env.SANITY_REVALIDATE_SECRET;

    const req = await buildSignedRequest({ _type: "coach" });
    const res = await POST(req);

    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json.error).toBe("server_configuration_error");
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  // --- Missing signature → 401 ---

  it("returns 401 when signature header is missing", async () => {
    const req = buildNoSigRequest(JSON.stringify({ _type: "coach" }));
    const res = await POST(req);

    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json.error).toBe("missing_signature");
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  // --- Invalid signature → 401 ---

  it("returns 401 when signature is invalid", async () => {
    const req = buildBadSigRequest(JSON.stringify({ _type: "coach" }));
    const res = await POST(req);

    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json.error).toBe("invalid_signature");
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  // --- Valid signature, bad JSON → 400 ---

  it("returns 400 when signature is valid but body is not JSON", async () => {
    const raw = "this is not json";
    const timestamp = Date.now();
    const signature = await encodeSignatureHeader(raw, timestamp, TEST_SECRET);

    const req = new Request("http://localhost/api/revalidate/sanity", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        [SIGNATURE_HEADER_NAME]: signature,
      },
      body: raw,
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBe("invalid_json");
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  // --- Draft _id → 200 no-op ---

  it("returns 200 no-op for draft documents", async () => {
    const req = await buildSignedRequest({
      _type: "coach",
      _id: "drafts.abc123",
    });
    const res = await POST(req);

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.revalidated).toEqual([]);
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  // --- Unknown _type → 200 no-op ---

  it("returns 200 no-op for unknown _type", async () => {
    const req = await buildSignedRequest({
      _type: "some_unknown_type",
      _id: "xyz",
    });
    const res = await POST(req);

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.revalidated).toEqual([]);
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  // --- Missing _type → 200 no-op ---

  it("returns 200 no-op when _type is missing", async () => {
    const req = await buildSignedRequest({ _id: "abc" });
    const res = await POST(req);

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.revalidated).toEqual([]);
  });

  // --- Valid mapped type → revalidateTag called ---

  it("revalidates correct tags for coach _type", async () => {
    const req = await buildSignedRequest({
      _type: "coach",
      _id: "coach-123",
    });
    const res = await POST(req);

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.revalidated).toEqual(["sanity:coaches"]);
    expect(revalidateTag).toHaveBeenCalledWith("sanity:coaches", { expire: 0 });
    expect(revalidateTag).toHaveBeenCalledTimes(1);
  });

  it("revalidates correct tags for location (dereference trap)", async () => {
    const req = await buildSignedRequest({
      _type: "location",
      _id: "loc-1",
    });
    const res = await POST(req);

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.revalidated).toContain("sanity:locations");
    expect(json.revalidated).toContain("sanity:money-pages");
    expect(revalidateTag).toHaveBeenCalledWith("sanity:locations", { expire: 0 });
    expect(revalidateTag).toHaveBeenCalledWith("sanity:money-pages", { expire: 0 });
  });

  it("revalidates correct tags for faq (homepage + money-pages)", async () => {
    const req = await buildSignedRequest({
      _type: "faq",
      _id: "faq-1",
    });
    const res = await POST(req);

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.revalidated).toContain("sanity:faqs");
    expect(json.revalidated).toContain("sanity:faqs:homepage");
    expect(json.revalidated).toContain("sanity:money-pages");
    expect(revalidateTag).toHaveBeenCalledTimes(3);
  });

  it("revalidates slug-specific tag for money_page with slug", async () => {
    const req = await buildSignedRequest({
      _type: "money_page",
      _id: "mp-1",
      slug: "hoc-cau-long",
    });
    const res = await POST(req);

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.revalidated).toContain("sanity:money-pages");
    expect(json.revalidated).toContain("sanity:money-page:hoc-cau-long");
  });

  it("revalidates content_article with _id tag", async () => {
    const req = await buildSignedRequest({
      _type: "content_article",
      _id: "article-abc",
    });
    const res = await POST(req);

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.revalidated).toContain("sanity:content");
    expect(json.revalidated).toContain("sanity:content:article-abc");
  });

  it("revalidates site_settings (global chrome)", async () => {
    const req = await buildSignedRequest({
      _type: "site_settings",
      _id: "site-settings",
    });
    const res = await POST(req);

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.revalidated).toEqual(["sanity:site-settings"]);
    expect(revalidateTag).toHaveBeenCalledWith("sanity:site-settings", { expire: 0 });
  });
});
