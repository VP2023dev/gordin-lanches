import { NextRequest, NextResponse } from "next/server";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "gordin123";

export async function POST(request: NextRequest) {
  const { senha } = await request.json();
  return NextResponse.json({
    ok: senha === ADMIN_PASSWORD,
  });
}
