import { createFormToken, isFormTokenProtectionEnabled } from "@/lib/antispam";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export async function GET() {
  if (!isFormTokenProtectionEnabled()) {
    return Response.json(
      { token: null, enabled: false },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, no-cache, max-age=0",
        },
      },
    );
  }

  try {
    const token = await createFormToken();

    return Response.json(
      { token, enabled: true },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, no-cache, max-age=0",
        },
      },
    );
  } catch (error) {
    console.error("Form token route failed", error);
    return Response.json(
      { error: "form_token_unavailable", enabled: false },
      {
        status: 503,
        headers: {
          "Cache-Control": "no-store, no-cache, max-age=0",
        },
      },
    );
  }
}
