import { beforeEach, describe, expect, it, vi } from "vitest";

const enable = vi.fn();
const disable = vi.fn();
const validatePreviewUrl = vi.fn();
const getSanityDraftClient = vi.fn();

vi.mock("next/headers", () => ({
  draftMode: async () => ({ enable, disable, isEnabled: false }),
}));

vi.mock("@sanity/preview-url-secret", () => ({
  validatePreviewUrl: (...args: unknown[]) => validatePreviewUrl(...args),
}));

vi.mock("@/lib/sanity/client", () => ({
  getSanityDraftClient: () => getSanityDraftClient(),
}));

const { GET: enableRoute } = await import("../enable/route");
const { GET: disableRoute } = await import("../disable/route");

const ENABLE_URL =
  "https://v2badminton.com/api/draft-mode/enable?sanity-preview-secret=s3cret";

beforeEach(() => {
  vi.clearAllMocks();
  getSanityDraftClient.mockReturnValue({});
});

describe("GET /api/draft-mode/enable", () => {
  it("refuses when the viewer token is not configured", async () => {
    getSanityDraftClient.mockReturnValue(null);

    const response = await enableRoute(new Request(ENABLE_URL));

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({
      error: "draft_mode_not_configured",
    });
    expect(enable).not.toHaveBeenCalled();
  });

  it("rejects an invalid secret without enabling draft mode", async () => {
    validatePreviewUrl.mockResolvedValue({ isValid: false });

    const response = await enableRoute(new Request(ENABLE_URL));

    expect(response.status).toBe(401);
    expect(enable).not.toHaveBeenCalled();
  });

  it("rejects when validation throws", async () => {
    validatePreviewUrl.mockRejectedValue(new Error("network"));

    const response = await enableRoute(new Request(ENABLE_URL));

    expect(response.status).toBe(401);
    expect(enable).not.toHaveBeenCalled();
  });

  it("enables draft mode and redirects to the previewed path", async () => {
    validatePreviewUrl.mockResolvedValue({
      isValid: true,
      redirectTo: "/ky-thuat-cau-long/ky-thuat-dap-cau-smash/",
    });

    const response = await enableRoute(new Request(ENABLE_URL));

    expect(enable).toHaveBeenCalledOnce();
    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe(
      "/ky-thuat-cau-long/ky-thuat-dap-cau-smash/",
    );
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(response.headers.get("x-robots-tag")).toContain("noindex");
  });

  it.each([
    ["https://evil.example/steal", "an absolute URL"],
    ["//evil.example/steal", "a protocol-relative URL"],
  ])("sends %s to the homepage instead of redirecting off-site (%s)", async (
    target,
  ) => {
    validatePreviewUrl.mockResolvedValue({ isValid: true, redirectTo: target });

    const response = await enableRoute(new Request(ENABLE_URL));

    expect(response.headers.get("location")).toBe("/");
  });
});

describe("GET /api/draft-mode/disable", () => {
  it("disables draft mode and returns to the given path", async () => {
    const response = await disableRoute(
      new Request("https://v2badminton.com/api/draft-mode/disable?path=/tin-tuc/"),
    );

    expect(disable).toHaveBeenCalledOnce();
    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe("/tin-tuc/");
  });

  it("falls back to the homepage for an off-origin path", async () => {
    const response = await disableRoute(
      new Request(
        "https://v2badminton.com/api/draft-mode/disable?path=https://evil.example",
      ),
    );

    expect(response.headers.get("location")).toBe("/");
  });

  it("needs no secret — leaving preview is not privileged", async () => {
    const response = await disableRoute(
      new Request("https://v2badminton.com/api/draft-mode/disable"),
    );

    expect(response.status).toBe(307);
    expect(disable).toHaveBeenCalledOnce();
  });
});
