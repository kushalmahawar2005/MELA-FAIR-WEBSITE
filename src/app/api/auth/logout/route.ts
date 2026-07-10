import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set("naaz-admin", "", { maxAge: 0, path: "/" });
  response.cookies.set("naaz-user", "", { maxAge: 0, path: "/" });
  return response;
}
