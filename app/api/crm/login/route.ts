import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const { password } = (await request.json().catch(() => ({}))) as { password?: string };
  const expected = process.env.CRM_PASSWORD;
  if (!expected) {
    return NextResponse.json({ error: "CRM password not configured" }, { status: 500 });
  }
  if (password !== expected) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set("crm_token", expected, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
  return res;
}
