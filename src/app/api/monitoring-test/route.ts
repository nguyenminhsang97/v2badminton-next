import { captureException } from "@/lib/monitoring";

export const dynamic = "force-dynamic";

export async function POST() {
  if (process.env.ENABLE_MONITORING_TEST_ROUTES !== "true") {
    return Response.json({ status: "not_found" }, { status: 404 });
  }

  const error = new Error("Monitoring test server error");
  captureException(error, {
    tags: {
      area: "monitoring_test_server",
    },
  });

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
