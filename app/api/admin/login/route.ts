import { NextRequest, NextResponse } from "next/server";
import { correctTeacherPassword } from "@/lib/admin";
import { createSession } from "@/lib/session";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const { password } = await request.json().catch(() => ({}));
  if (typeof password !== "string" || !correctTeacherPassword(password)) {
    return NextResponse.json({ error: "Incorrect teacher password." }, { status: 401 });
  }
  const response = NextResponse.json({ ok: true });
  response.cookies.set("clara_session", await createSession({ role: "teacher" }), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
  });
  return response;
}
