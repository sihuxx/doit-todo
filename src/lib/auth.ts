import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import type { AuthPayload } from "@/types";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET ?? "fallback-secret");
const COOKIE_NAME = "doit-token";
const MAX_AGE = 60 * 60 * 24 * 7; // 7일

export async function signToken(payload: Omit<AuthPayload, "iat" | "exp">) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(SECRET);
}

export async function verifyToken(token: string): Promise<AuthPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload as unknown as AuthPayload;
  } catch {
    return null;
  }
}

export function setAuthCookie(token: string) {
  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: MAX_AGE,
    path: "/",
  });
}

export function clearAuthCookie() {
  cookies().delete(COOKIE_NAME);
}

export async function getSession(): Promise<AuthPayload | null> {
  const token = cookies().get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}
