import { createHash, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const MOD_COOKIE = "cipensoio_mod";

function getModerationSecret(): string | null {
  const secret = process.env.MODERATION_SECRET?.trim();
  if (!secret || secret.includes("YOUR_")) return null;
  return secret;
}

export function isModerationSecretConfigured(): boolean {
  return Boolean(getModerationSecret());
}

export function hashModerationSecret(secret: string): string {
  return createHash("sha256").update(`cipensoio:${secret}`).digest("hex");
}

export function verifyModerationPassword(password: string): boolean {
  const secret = getModerationSecret();
  if (!secret) return false;

  const a = Buffer.from(hashModerationSecret(password));
  const b = Buffer.from(hashModerationSecret(secret));
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export async function isModeratorAuthenticated(): Promise<boolean> {
  const secret = getModerationSecret();
  if (!secret) return false;

  const jar = await cookies();
  const token = jar.get(MOD_COOKIE)?.value;
  if (!token) return false;

  const expected = hashModerationSecret(secret);
  try {
    const a = Buffer.from(token);
    const b = Buffer.from(expected);
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export async function setModeratorSession(): Promise<void> {
  const secret = getModerationSecret();
  if (!secret) throw new Error("MODERATION_SECRET non configurato");

  const jar = await cookies();
  jar.set(MOD_COOKIE, hashModerationSecret(secret), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/admin",
    maxAge: 60 * 60 * 12,
  });
}

export async function clearModeratorSession(): Promise<void> {
  const jar = await cookies();
  jar.set(MOD_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/admin",
    maxAge: 0,
  });
}
