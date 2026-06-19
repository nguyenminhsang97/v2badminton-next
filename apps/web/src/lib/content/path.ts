export function normalizeContentPath(segments: string[] | undefined): string {
  if (!segments || segments.length === 0) return "/";
  const joined = segments.join("/").trim().toLowerCase();
  const stripped = joined.replace(/^\/+|\/+$/g, "");
  if (!stripped) return "/";
  return `/${stripped}/`;
}
