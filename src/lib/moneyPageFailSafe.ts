import "server-only";

import { notFound } from "next/navigation";
import { isProductionDeployment } from "@/lib/env";
import { captureException } from "@/lib/monitoring";

type MissingMoneyPageArgs = {
  slug: string;
  path: string;
  degraded: boolean;
};

export function notFoundForMissingMoneyPage({
  slug,
  path,
  degraded,
}: MissingMoneyPageArgs): never {
  if (isProductionDeployment()) {
    captureException(new Error(`Money page content unavailable: ${slug}`), {
      tags: {
        area: "money_page_failsafe",
        degraded: String(degraded),
      },
      extras: {
        path,
        slug,
      },
    });
  }

  notFound();
}
