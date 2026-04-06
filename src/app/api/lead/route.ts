import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      success: false,
      message:
        "Lead endpoint scaffolded. Integrate Telegram/Web3Forms/DB flow in the next implementation sprint.",
    },
    { status: 501 },
  );
}
