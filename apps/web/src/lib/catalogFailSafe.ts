import "server-only";

import { isProductionDeployment } from "@/lib/env";
import { captureException } from "@/lib/monitoring";

type MissingCatalogContentArgs = {
  /** Sanity content set that came back empty, e.g. "pricing_tiers". */
  contentSet: string;
  /** Cache tags the empty fetch was made under, for tracing the revalidation. */
  tags: readonly string[];
};

/**
 * Report a catalog fetch that returned nothing and let the caller fail closed.
 *
 * Money pages already fail closed via `moneyPageFailSafe.ts`, which 404s. This is
 * the softer sibling for homepage catalog content: it only reports, and the caller
 * returns an empty list so the section can degrade on its own terms.
 *
 * Use it for anything carrying numbers a visitor could act on — prices, schedules.
 * Serving a stale hardcoded mirror of those is worse than showing nothing, because
 * a wrong price is a promise the business then has to honour or walk back.
 */
export function reportMissingCatalogContent({
  contentSet,
  tags,
}: MissingCatalogContentArgs): void {
  if (!isProductionDeployment()) {
    return;
  }

  captureException(new Error(`Catalog content unavailable: ${contentSet}`), {
    tags: {
      area: "catalog_failsafe",
      content_set: contentSet,
    },
    extras: {
      tags: [...tags],
    },
  });
}
