import { timingSafeEqual } from "node:crypto";
import { NextRequest } from "next/server";
import { readSession } from "@/lib/session";

export async function teacherSession(request: NextRequest) {
  const session = await readSession(request.cookies.get("clara_session")?.value);
  return session?.role === "teacher" ? session : null;
}

export function correctTeacherPassword(value: string) {
  const configured = process.env.TEACHER_PASSWORD;
  if (!configured) throw new Error("TEACHER_PASSWORD is not configured.");
  const left = Buffer.from(value);
  const right = Buffer.from(configured);
  return left.length === right.length && timingSafeEqual(left, right);
}
