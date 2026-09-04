import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const ROOT = resolve(__dirname, "../../../../");

function read(rel: string): string {
  return readFileSync(resolve(ROOT, rel), "utf8");
}

describe("fullPath route-change guardrails", () => {
  it("documents the URL rename flow for CMS and file-routed paths", () => {
    const runbook = read("../../docs/cms/url-rename-runbook.md");

    expect(runbook).toContain("Content-Platform URLs");
    expect(runbook).toContain("Create and publish a `route_redirect` document");
    expect(runbook).toContain("File-Routed URLs");
    expect(runbook).toContain("FILE_ROUTE_REDIRECTS");
    expect(runbook).toContain("Reserved Prefixes");
  });

  it("locks the fullPath input after a published twin exists", () => {
    const input = read("src/sanity/components/FullPathPreviewInput.tsx");

    expect(input).toContain("PublishedState");
    expect(input).toContain('defined(*[_id == $id][0]._id)');
    expect(input).toContain("isPathLocked ? null : props.renderDefault(props)");
    expect(input).toContain("docs/cms/url-rename-runbook.md");
  });

  it("blocks CMS paths that collide with file-routed pages", () => {
    const shared = read("src/sanity/schemaTypes/contentShared.ts");

    expect(shared).toContain("FILE_ROUTED_PATHS");
    expect(shared).toContain('"/hoc-cau-long-cho-nguoi-moi/"');
    expect(shared).toContain('"/chinh-sach-bien-tap/"');
    expect(shared).toContain("CODE_RESERVED_PREFIXES");
    expect(shared).toContain('"/san-pham/"');
    expect(shared).toContain("CMS route_redirect không áp dụng ở đây");
    expect(shared).toContain("docs/cms/url-rename-runbook.md");
  });

  it("keeps file-route redirects in next.config instead of CMS redirects", () => {
    const nextConfig = read("next.config.ts");

    expect(nextConfig).toContain("FILE_ROUTE_REDIRECTS");
    expect(nextConfig).toContain("async redirects()");
    expect(nextConfig).toContain("return FILE_ROUTE_REDIRECTS");
    expect(nextConfig).toContain("docs/cms/url-rename-runbook.md");
  });
});
