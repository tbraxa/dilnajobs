import "server-only";

import { cookies, headers } from "next/headers";
import { and, eq, gt, isNull } from "drizzle-orm";
import { db } from "@/db/client";
import { adminSessions, magicTokens } from "@/db/schema";
import { env, isAdminEmail } from "@/lib/env";
import { hashIp, randomToken, sha256 } from "@/lib/crypto";
import { sendEmail } from "@/lib/email";
import { log } from "@/lib/logging";
import { enforceRateLimit } from "@/lib/rate-limit";
import { audit } from "@/lib/audit";
import { clientIp, sessionCookieOptions } from "@/lib/auth";
import { captureException } from "@/lib/observability";
import { getRequestId } from "@/lib/request-id";

export const ADMIN_COOKIE = "dj_admin";

export type AdminSession = {
  sessionId: string;
  email: string;
};

export function cookieFromHeader(header: string | null, name: string): string | undefined {
  if (!header) return undefined;
  for (const part of header.split(";")) {
    const [key, ...rest] = part.trim().split("=");
    if (key === name) return decodeURIComponent(rest.join("="));
  }
  return undefined;
}

export async function requestAdminMagicLink(emailRaw: string): Promise<{ ok: true } | { ok: false; error: string }> {
  const email = emailRaw.trim().toLowerCase();
  const ip = await clientIp();
  const requestId = await getRequestId();

  try {
    await enforceRateLimit({ bucket: "admin-magic:ip", key: ip, limit: 8, windowMs: 60 * 60 * 1000 });
    await enforceRateLimit({ bucket: "admin-magic:email", key: email, limit: 5, windowMs: 60 * 60 * 1000 });
  } catch {
    return { ok: false, error: "Příliš mnoho pokusů. Zkuste to za chvíli." };
  }

  if (!isAdminEmail(email)) {
    log("info", "admin.magic.denied", { requestId });
    return { ok: true };
  }

  const token = randomToken(32);
  const expiresAt = new Date(Date.now() + env.MAGIC_LINK_MINUTES * 60 * 1000);
  await db.insert(magicTokens).values({
    email,
    tokenHash: sha256(token),
    purpose: "admin",
    expiresAt,
  });

  const url = `${env.APP_URL}/admin/prihlaseni/overit?token=${encodeURIComponent(token)}`;
  await sendEmail({
    to: email,
    subject: "Přihlášení správce DílnaJobs",
    text: `Odkaz platí ${env.MAGIC_LINK_MINUTES} minut a jde použít jen jednou.\n\n${url}\n\nPokud jste o něj nežádali, ignorujte ho.`,
  });
  log("info", "admin.magic.sent", { requestId, minutes: env.MAGIC_LINK_MINUTES });
  return { ok: true };
}

export async function createAdminSessionFromToken(token: string): Promise<{
  sessionToken: string;
  expiresAt: Date;
} | null> {
  if (!token || token.length < 20) return null;
  const tokenHash = sha256(token);
  const ip = await clientIp();
  const ua = (await headers()).get("user-agent")?.slice(0, 240);
  const requestId = await getRequestId();

  const [row] = await db
    .select()
    .from(magicTokens)
    .where(
      and(
        eq(magicTokens.tokenHash, tokenHash),
        eq(magicTokens.purpose, "admin"),
        isNull(magicTokens.consumedAt),
        gt(magicTokens.expiresAt, new Date()),
      ),
    )
    .limit(1);

  if (!row || !isAdminEmail(row.email)) {
    log("warn", "admin.magic.invalid", { requestId });
    return null;
  }

  await db.update(magicTokens).set({ consumedAt: new Date() }).where(eq(magicTokens.id, row.id));

  const sessionToken = randomToken(32);
  const expiresAt = new Date(Date.now() + env.SESSION_DAYS * 86400000);
  const [session] = await db
    .insert(adminSessions)
    .values({
      email: row.email,
      tokenHash: sha256(sessionToken),
      expiresAt,
      userAgent: ua,
      ipHash: hashIp(ip),
    })
    .returning({ id: adminSessions.id });

  if (!session) return null;

  await audit({
    actorType: "admin",
    action: "admin.session.created",
    resourceType: "admin_session",
    resourceId: session.id,
    ipHash: hashIp(ip),
    metadata: { requestId },
  });

  return { sessionToken, expiresAt };
}

export async function getAdminSessionFromRaw(raw: string | undefined): Promise<AdminSession | null> {
  if (!raw) return null;
  const [row] = await db
    .select({
      sessionId: adminSessions.id,
      email: adminSessions.email,
    })
    .from(adminSessions)
    .where(and(eq(adminSessions.tokenHash, sha256(raw)), gt(adminSessions.expiresAt, new Date())))
    .limit(1);
  if (!row || !isAdminEmail(row.email)) return null;
  return row;
}

export async function getAdminSession(): Promise<AdminSession | null> {
  const jar = await cookies();
  return getAdminSessionFromRaw(jar.get(ADMIN_COOKIE)?.value);
}

export async function requireAdminSession(): Promise<AdminSession> {
  const session = await getAdminSession();
  if (!session) throw new Error("unauthenticated");
  return session;
}

export async function destroyAdminSession() {
  const jar = await cookies();
  const raw = jar.get(ADMIN_COOKIE)?.value;
  if (raw) {
    await db.delete(adminSessions).where(eq(adminSessions.tokenHash, sha256(raw)));
  }
  jar.set(ADMIN_COOKIE, "", {
    ...sessionCookieOptions(new Date(0)),
    expires: new Date(0),
  });
}

export { sessionCookieOptions };

export async function safeAdminLinkRequest(email: string) {
  try {
    return await requestAdminMagicLink(email);
  } catch (err) {
    captureException(err, { event: "admin.magic.request", requestId: await getRequestId() });
    await audit({
      actorType: "admin",
      action: "admin.magic.failed",
      metadata: { requestId: await getRequestId() },
    });
    return { ok: false as const, error: "Odkaz se teď nepodařilo odeslat." };
  }
}
