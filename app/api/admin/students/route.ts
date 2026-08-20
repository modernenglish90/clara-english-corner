import { NextRequest, NextResponse } from "next/server";
import { teacherSession } from "@/lib/admin";
import { db, normalizeName } from "@/lib/database";

export const runtime = "nodejs";

async function requireTeacher(request: NextRequest) {
  return (await teacherSession(request)) ? null : NextResponse.json({ error: "Teacher access required." }, { status: 401 });
}

export async function GET(request: NextRequest) {
  const denied = await requireTeacher(request);
  if (denied) return denied;
  const students = await db()<{ id: number; display_name: string }[]>`
    select id, display_name from students where is_active = true order by display_name asc
  `;
  return NextResponse.json({ students });
}

export async function POST(request: NextRequest) {
  const denied = await requireTeacher(request);
  if (denied) return denied;
  const { name } = await request.json().catch(() => ({}));
  if (typeof name !== "string" || !name.trim()) return NextResponse.json({ error: "A student name is required." }, { status: 400 });
  const displayName = name.trim().replace(/\s+/g, " ");
  const normalized = normalizeName(displayName);
  await db()`
    insert into students (display_name, normalized_name, is_active)
    values (${displayName}, ${normalized}, true)
    on conflict (normalized_name) do update set display_name = excluded.display_name, is_active = true
  `;
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: NextRequest) {
  const denied = await requireTeacher(request);
  if (denied) return denied;
  const id = Number(request.nextUrl.searchParams.get("id"));
  if (!Number.isInteger(id) || id < 1) return NextResponse.json({ error: "Invalid student." }, { status: 400 });
  await db()`delete from students where id = ${id}`;
  return NextResponse.json({ ok: true });
}
