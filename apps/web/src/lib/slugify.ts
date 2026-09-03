/**
 * Vietnamese-aware slug generator for frontend use.
 * Identical logic to slugifyValue in sanity/schemaTypes/shared.ts —
 * kept separate so renderer code never imports from Sanity schema files.
 */
export function slugifyHeading(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96);
}
