import type { Metadata } from "next";

/**
 * Metadata for a route that is about to call `notFound()`.
 *
 * Returning `{}` from `generateMetadata` is not neutral: the root layout's
 * metadata applies instead, so a missing page inherits `robots: index, follow`
 * and the site's default title. Next then adds its own `noindex` for the
 * not-found render, leaving two contradictory robots tags on one page. Google
 * takes the most restrictive, so nothing is indexed either way, but the page
 * states both and the next reader has to work out which wins.
 *
 * It is load-bearing here, not cosmetic. `(site)/loading.tsx` means the response
 * has already begun streaming by the time `notFound()` runs, so these URLs are
 * served as HTTP 200 (see the note in `(site)/[...slug]/page.tsx`); the noindex
 * is what keeps them out of the index.
 *
 * `follow: true` on purpose — the links on the not-found page still point at
 * real pages worth crawling.
 */
export const NOT_FOUND_METADATA: Metadata = {
  title: "Không tìm thấy trang",
  robots: { index: false, follow: true },
};
