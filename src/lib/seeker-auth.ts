import "server-only";

import { cookies, headers } from "next/headers";
import { and, eq, gt, isNull } from "drizzle-orm";
import { db, sql } from "@/db/client";
import { magicTokens, seekerSessions, seekerUsers } from "@/db/schema";
import { audit } from "@/lib/audit";
import { clientIp } from "@/lib/auth";
import { hashIp, randomToken, sha256 } from "@/lib/crypto";
import { sendEmail } from "@/lib/email";
import { env } from "@/lib/env";
import { log } from "@/lib/logging";
import { captureException } from "@/lib/observability";
import { enforceRateLimit, RateLimitError } from "@/lib/rate-limit";
import { getRequestId } from "@/lib/request-id";
import { resolveAppUrl } from "@/lib/app-url";

export const SEEKER_SESSION_COOKIE = "fj_seeker_session";

export type SeekerSession = {
  sessionId: string;
  userId: string;
  email: string;
  name: string;
  phone: string | null;
  city: string | null;
  desiredRole: string | null;
  bio: string | null;
};

function cookieSecure() {
  return env.NODE_ENV === "production";
}

export function safeAccountNext(value: string | null | undefined, fallback = "/ucet/prehled") {
  if (!value || !value.startsWith("/") || value.startsWith("//") || /[\u0000-\u001f\\]/.test(value)) {
    return fallback;
  }
  return value;
}

export async function requestSeekerMagicLink(input: {
  email: string;
  intent: "login" | "register";
  name?: string;
  next?: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const email = input.email.trim().toLowerCase();
  const ip = await clientIp();
  const requestId = await getRequestId();

  try {
    await enforceRateLimit({ bucket: "seeker-magic:ip", key: ip, limit: 10, windowMs: 60 * 60 * 1000 });
    await enforceRateLimit({ bucket: "seeker-magic:email", key: email, limit: 5, windowMs: 60 * 60 * 1000 });
  } catch (error) {
    if (error instanceof RateLimitError) {
      return { ok: false, error: "Příliš mnoho pokusů. Zkuste to za chvíli." };
    }
    throw error;
  }

  const existing = await sql<{ id: string; email: string; name: string }[]>`
    select * from seeker_user_by_email(${email})
  `;
  let user = existing[0];

  if (input.intent === "register" && !user) {
    try {
      const [created] = await db
        .insert(seekerUsers)
        .values({
          email,
          name: input.name?.trim() || email.split("@")[0] || "Uchazeč",
        })
        .returning({ id: seekerUsers.id, email: seekerUsers.email, name: seekerUsers.name });
      user = created;
      await audit({
        actorType: "seeker",
        actorId: created.id,
        action: "seeker.registered",
        ipHash: hashIp(ip),
      });
    } catch (error) {
      const raced = await sql<{ id: string; email: string; name: string }[]>`
        select * from seeker_user_by_email(${email})
      `;
      user = raced[0];
      if (!user) {
        captureException(error, { event: "seeker.register.failed", requestId });
        return { ok: false, error: "Účet se teď nepodařilo založit." };
      }
    }
  }

  // Login remains enumeration-safe: unknown addresses receive the same UI response.
  if (!user) {
    log("info", "seeker.magic.unknown_email", { requestId });
    return { ok: true };
  }

  try {
    const token = randomToken(32);
    const expiresAt = new Date(Date.now() + env.MAGIC_LINK_MINUTES * 60 * 1000);
    await db.insert(magicTokens).values({
      email,
      tokenHash: sha256(token),
      purpose: "seeker",
      expiresAt,
    });

    const next = safeAccountNext(input.next);
    const url = new URL("/ucet/prihlaseni/overit", resolveAppUrl());
    url.searchParams.set("token", token);
    url.searchParams.set("next", next);
    await sendEmail({
      to: email,
      subject: "Přihlášení do FairJobs",
      text: `Odkaz platí ${env.MAGIC_LINK_MINUTES} minut a jde použít jen jednou.\n\n${url.toString()}\n\nPokud jste o něj nežádali, ignorujte ho.`,
    });
    log("info", "seeker.magic.sent", { requestId, minutes: env.MAGIC_LINK_MINUTES });
    return { ok: true };
  } catch (error) {
    captureException(error, { event: "seeker.magic.send_failed", requestId });
    return { ok: false, error: "Odkaz se teď nepodařilo odeslat." };
  }
}

export async function consumeSeekerMagicLink(token: string): Promise<boolean> {
  if (!token || token.length < 20) return false;
  const tokenHash = sha256(token);
  const ip = await clientIp();
  const ua = (await headers()).get("user-agent")?.slice(0, 240);

  try {
    await enforceRateLimit({
      bucket: "seeker-magic-consume:ip",
      key: ip,
      limit: 30,
      windowMs: 60 * 60 * 1000,
    });
  } catch {
    return false;
  }

  const [magic] = await db
    .update(magicTokens)
    .set({ consumedAt: new Date() })
    .where(
      and(
        eq(magicTokens.tokenHash, tokenHash),
        eq(magicTokens.purpose, "seeker"),
        isNull(magicTokens.consumedAt),
        gt(magicTokens.expiresAt, new Date()),
      ),
    )
    .returning({ email: magicTokens.email });
  if (!magic) return false;

  const users = await sql<{ id: string }[]>`select id from seeker_user_by_email(${magic.email})`;
  const user = users[0];
  if (!user) return false;

  const sessionToken = randomToken(32);
  const expiresAt = new Date(Date.now() + env.SESSION_DAYS * 86_400_000);
  const [session] = await db
    .insert(seekerSessions)
    .values({
      seekerUserId: user.id,
      tokenHash: sha256(sessionToken),
      expiresAt,
      userAgent: ua,
      ipHash: hashIp(ip),
    })
    .returning({ id: seekerSessions.id });

  await audit({
    actorType: "seeker",
    actorId: user.id,
    action: "seeker.session.created",
    resourceType: "seeker_session",
    resourceId: session.id,
    ipHash: hashIp(ip),
  });

  const jar = await cookies();
  jar.set(SEEKER_SESSION_COOKIE, sessionToken, {
    httpOnly: true,
    secure: cookieSecure(),
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
    priority: "high",
  });
  return true;
}

export async function getSeekerSession(): Promise<SeekerSession | null> {
  const raw = (await cookies()).get(SEEKER_SESSION_COOKIE)?.value;
  if (!raw) return null;
  const rows = await sql<
    {
      session_id: string;
      user_id: string;
      email: string;
      name: string;
      phone: string | null;
      city: string | null;
      desired_role: string | null;
      bio: string | null;
    }[]
  >`select * from seeker_session_by_token_hash(${sha256(raw)})`;
  const row = rows[0];
  if (!row) return null;
  return {
    sessionId: row.session_id,
    userId: row.user_id,
    email: row.email,
    name: row.name,
    phone: row.phone,
    city: row.city,
    desiredRole: row.desired_role,
    bio: row.bio,
  };
}

export async function destroySeekerSession() {
  const jar = await cookies();
  const raw = jar.get(SEEKER_SESSION_COOKIE)?.value;
  if (raw) {
    await db.delete(seekerSessions).where(eq(seekerSessions.tokenHash, sha256(raw)));
  }
  jar.set(SEEKER_SESSION_COOKIE, "", {
    httpOnly: true,
    secure: cookieSecure(),
    sameSite: "lax",
    path: "/",
    expires: new Date(0),
  });
}
