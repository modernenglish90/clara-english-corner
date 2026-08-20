import { NextRequest, NextResponse } from "next/server";
import { db, normalizeName } from "@/lib/database";
import { createSession } from "@/lib/session";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const { name } = await request.json().catch(() => ({}));
  if (typeof name !== "string" || !name.trim()) {
    return NextResponse.json({ error: "Please enter your name." }, { status: 400 });
  }

  const normalized = normalizeName(name);
  const enteredName = name.trim().replace(/\s+/g, " ");
  const rows = await db()<{ display_name: string }[]>`
    select display_name from students
    where is_active = true
      and (normalized_name = ${normalized} or display_name ilike ${`%${enteredName}%`})
    limit 1
  `;
  if (!rows[0]) {
    return NextResponse.json({ error: "Your name is not on Clara's active student list. Please contact Clara." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set("clara_session", await createSession({ role: "student", name: rows[0].display_name }), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
  });
  return response;
}
