import { SignJWT, jwtVerify } from "jose";

export type SessionRole = "student" | "teacher";

export type Session = {
  role: SessionRole;
  name?: string;
};

const encoder = new TextEncoder();

function secret() {
  const value = process.env.SESSION_SECRET;
  if (!value) throw new Error("SESSION_SECRET is not configured.");
  return encoder.encode(value);
}

export async function createSession(session: Session) {
  return new SignJWT(session)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("14d")
    .sign(secret());
}

export async function readSession(token?: string): Promise<Session | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    if (payload.role !== "student" && payload.role !== "teacher") return null;
    return { role: payload.role, name: typeof payload.name === "string" ? payload.name : undefined };
  } catch {
    return null;
  }
}
