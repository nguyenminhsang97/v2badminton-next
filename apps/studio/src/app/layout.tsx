import type { ReactNode } from "react";

/**
 * Minimal HTML shell for the standalone Studio app.
 *
 * `metadata` and `viewport` — including `robots: "noindex"` — come from
 * next-sanity/studio and are re-exported by the page segment, exactly as they
 * were when the Studio was mounted inside apps/web.
 */
export default function StudioLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
