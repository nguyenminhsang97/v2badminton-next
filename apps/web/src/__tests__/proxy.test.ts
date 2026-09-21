import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { proxy } from "../proxy";

function request(url: string, cookie?: string): NextRequest {
  // NextRequest does not derive Host from the URL, and proxy() reads that header
  // to spot the Vercel alias — so set it explicitly.
  const headers: Record<string, string> = { host: new URL(url).host };

  if (cookie) {
    headers.cookie = cookie;
  }

  return new NextRequest(url, { headers });
}

describe("proxy", () => {
  it("keeps redirecting the Vercel alias to the primary domain", () => {
    const response = proxy(
      request("https://v2badminton-next.vercel.app/tin-tuc/"),
    );

    expect(response.status).toBe(308);
    expect(response.headers.get("location")).toBe(
      "https://v2badminton.com/tin-tuc/",
    );
  });

  it("leaves an ordinary request cacheable and indexable", () => {
    const response = proxy(request("https://v2badminton.com/"));

    expect(response.headers.get("x-robots-tag")).toBeNull();
    expect(response.headers.get("cache-control")).toBeNull();
  });

  it("marks a draft-mode request noindex and uncacheable", () => {
    const response = proxy(
      request("https://v2badminton.com/", "__prerender_bypass=abc123"),
    );

    expect(response.headers.get("x-robots-tag")).toContain("noindex");
    expect(response.headers.get("cache-control")).toContain("no-store");
  });
});
