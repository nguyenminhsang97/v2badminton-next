import * as Sentry from "@sentry/nextjs";
import { isMonitoringTestRoutesEnabled } from "@/lib/env";
import { captureException } from "@/lib/monitoring";

export const dynamic = "force-dynamic";

export async function POST() {
  if (!isMonitoringTestRoutesEnabled()) {
    return Response.json({ status: "not_found" }, { status: 404 });
  }

  const error = new Error("Monitoring test server error");
  captureException(error, {
    tags: {
      area: "monitoring_test_server",
    },
  });
  await Sentry.flush(2000);

  return Response.json(
    {
      status: "captured",
      message: "Server-side monitoring test event sent to Sentry.",
    },
    {
      status: 500,
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
