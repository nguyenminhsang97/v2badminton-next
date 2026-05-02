"use client";

import { useHomepageBusinessMode } from "@/components/home/conversion/HomepageConversionProvider";
import { EnterpriseTeaser } from "./EnterpriseTeaser";

/**
 * Mounts EnterpriseTeaser inside HomepageConversionProvider so the
 * "Nhận báo giá" button can flip homepage state into business mode.
 *
 * Lives at the bottom of the homepage (after locations) so it stays
 * discoverable for B2B searchers without competing with the B2C
 * decision flow above (course → schedule → contact).
 */
export function HomepageEnterpriseTeaser() {
  const { enterBusinessMode } = useHomepageBusinessMode();
  return <EnterpriseTeaser onRequestQuote={enterBusinessMode} />;
}
