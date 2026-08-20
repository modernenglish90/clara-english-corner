import { NextRequest, NextResponse } from "next/server";
import { readSession } from "@/lib/session";

export async function proxy(request: NextRequest) {
  const session = await readSession(request.cookies.get("clara_session")?.value);
  const { pathname } = request.nextUrl;
  const needsTeacher = pathname.startsWith("/admin");
  const allowed = needsTeacher ? session?.role === "teacher" : Boolean(session);

  if (!allowed) {
    const url = request.nextUrl.clone();
    url.pathname = needsTeacher ? "/admin/login" : "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/daily-english/:path*", "/admin/:path*"],
};
