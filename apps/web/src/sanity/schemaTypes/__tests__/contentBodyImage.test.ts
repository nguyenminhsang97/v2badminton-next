import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * CMS-IBI safety net.
 *
 * The body-image discriminator MUST stay aligned across four layers:
 *   1. Schema array-member `name` ("bodyImage")            → contentShared.ts
 *   2. GROQ conditional projection `_type == "bodyImage"`  → queries/shared.ts
 *   3. TS type literal `_type: "bodyImage"`                → types.ts
 *   4. PortableText renderer key `types: { bodyImage }`    → ArticleView.tsx
 *
 * Layers 3 + 4 are pinned by TypeScript (a renamed literal fails compile).
 * Layer 2 is just a string at runtime — if it desyncs, body images render
 * blank with no compile error. These tests pin it.
 *
 * Source files are read as text rather than imported because the schema
 * pulls in `sanity` (CSS) and `queries/shared.ts` is marked `"server-only"`,
 * neither of which works in node-env vitest. Layer A of the verification
 * plan (Studio draft test) covers in-Studio behavior.
 */

const ROOT = resolve(__dirname, "../../../../");

function read(rel: string): string {
  return readFileSync(resolve(ROOT, rel), "utf8");
}

describe("body-image discriminator alignment", () => {
  it("schema defines the array member with name 'bodyImage'", () => {
    const schema = read("src/sanity/schemaTypes/contentShared.ts");
    expect(schema).toMatch(/contentBodyImage = defineArrayMember\(\{/);
    expect(schema).toMatch(/name:\s*"bodyImage"/);
  });

  it("article body widens its `of` to include contentBodyImage", () => {
    const article = read("src/sanity/schemaTypes/contentArticle.ts");
    expect(article).toMatch(/of:\s*\[contentBodyBlock,\s*contentBodyImage\]/);
  });

  it("GROQ projection keys the conditional on _type == 'bodyImage'", () => {
    const projection = read("src/lib/sanity/queries/shared.ts");
    expect(projection).toContain('_type == "bodyImage"');
  });

  it("GROQ projection emits asset url and dimension metadata", () => {
    const projection = read("src/lib/sanity/queries/shared.ts");
    expect(projection).toContain('"url": asset->url');
    expect(projection).toContain('"width": asset->metadata.dimensions.width');
    expect(projection).toContain('"height": asset->metadata.dimensions.height');
    expect(projection).toContain('"lqip": asset->metadata.lqip');
  });

  it("GROQ projection coalesces alt, caption, and size", () => {
    const projection = read("src/lib/sanity/queries/shared.ts");
    expect(projection).toContain('"alt": coalesce(alt, "")');
    expect(projection).toContain('"caption": coalesce(caption, null)');
    expect(projection).toContain('"size": coalesce(size, "inline")');
  });

  it("GROQ projection preserves text-block passthrough via spread", () => {
    const projection = read("src/lib/sanity/queries/shared.ts");
    expect(projection).toMatch(/body\[\]\{\s*\.\.\.,/);
  });

  it("renderer keys PortableText `types` on bodyImage", () => {
    const view = read("src/components/content/ArticleView.tsx");
    expect(view).toMatch(/types:\s*\{\s*bodyImage:\s*ArticleBodyImage/);
  });

  it("renderer renders <figure> with data-size variant", () => {
    const view = read("src/components/content/ArticleView.tsx");
    expect(view).toContain('className="blog-post__body-figure"');
    expect(view).toContain("data-size={size}");
  });
});
