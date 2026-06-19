import { checkDatabaseConnection, isDatabaseConfigured } from "@/lib/db";
import { captureException } from "@/lib/monitoring";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!isDatabaseConfigured()) {
    return Response.json(
      { status: "degraded", error: "db_not_configured" },
      { status: 503 },
    );
  }

  try {
    await checkDatabaseConnection();
    return Response.json({ status: "ok" }, { status: 200 });
  } catch (error) {
    console.error("Health check failed", error);
    captureException(error, {
      tags: {
        area: "health_check",
      },
    });
    return Response.json(
      { status: "degraded", error: "db_unreachable" },
      { status: 503 },
    );
  }
}
