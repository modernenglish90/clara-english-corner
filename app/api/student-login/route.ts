import { NextRequest, NextResponse } from "next/server";
import ACTIVE_STUDENTS from "@/lib/active-students";
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
  const listedStudent = ACTIVE_STUDENTS.find((student) => {
    const savedName = normalizeName(student);
    return savedName === normalized || savedName.includes(normalized) || normalized.includes(savedName);
  });

  if (listedStudent) {
    return signIn(listedStudent);
  }

  try {
    const rows = await db()<{ display_name: string }[]>`
      select display_name from students
      where is_active = true
        and (normalized_name = ${normalized} or display_name ilike ${`%${enteredName}%`})
      limit 1
    `;
    if (rows[0]) return signIn(rows[0].display_name);
  } catch {
    // The built-in list keeps registered students able to practise if the database is unavailable.
  }

  return NextResponse.json({ error: "Your name is not on Teacher Clara's active student list. Please contact Teacher Clara." }, { status: 401 });
}

async function signIn(name: string) {
  const response = NextResponse.json({ ok: true });
  response.cookies.set("clara_session", await createSession({ role: "student", name }), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
  });
  return response;
}
