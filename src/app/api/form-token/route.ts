import { createFormToken } from "@/lib/antispam";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export async function GET() {
  try {
    const token = await createFormToken();

    return Response.json(
      { token },
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
      { error: "form_token_unavailable" },
      {
        status: 503,
        headers: {
          "Cache-Control": "no-store, no-cache, max-age=0",
        },
      },
    );
  }
}
