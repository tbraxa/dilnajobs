import "server-only";

import { randomUUID } from "node:crypto";
import { cookies, headers } from "next/headers";
import { and, eq, gt, isNull } from "drizzle-orm";
import { db, sql } from "@/db/client";
import { employerUsers, employers, magicTokens, sessions } from "@/db/schema";
import { env } from "./env";
import { hashIp, randomToken, sha256 } from "./crypto";
import { sendEmail } from "./email";
import { log } from "./logging";
import { enforceRateLimit } from "./rate-limit";
import { isValidIco, normalizeIco, verifyIcoViaAres } from "./ico";
import { registerEmployerSchema } from "./validation";
import { audit } from "./audit";
import { captureException } from "./observability";
import { getRequestId } from "./request-id";

export const SESSION_COOKIE = "dj_session";

export type EmployerSession = {
  sessionId: string;
  userId: string;
  employerId: string;
  email: string;
  name: string;
  companyName: string;
  planCode: string;
  adsPostedYear: number;
  verificationStatus: string;
};

function cookieSecure() {
  return env.NODE_ENV === "production";
}

export async function clientIp(): Promise<string> {
  const h = await headers();
  if (env.TRUST_PROXY) {
    const xff = h.get("x-forwarded-for");
    if (xff) return xff.split(",")[0]?.trim() || "0.0.0.0";
  }
  return h.get("x-real-ip") ?? "127.0.0.1";
}

export async function requestMagicLink(input: {
  email: string;
  intent: "login" | "register";
  ico?: string;
  companyName?: string;
  name?: string;
  city?: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const email = input.email.trim().toLowerCase();
  const ip = await clientIp();
  const requestId = await getRequestId();

  try {
    await enforceRateLimit({ bucket: "magic:ip", key: ip, limit: 10, windowMs: 60 * 60 * 1000 });
    await enforceRateLimit({ bucket: "magic:email", key: email, limit: 5, windowMs: 60 * 60 * 1000 });
  } catch {
    return { ok: false, error: "Příliš mnoho pokusů. Zkuste to za chvíli." };
  }

  if (input.intent === "register") {
    const parsed = registerEmployerSchema.safeParse({
      email,
      name: input.name,
      companyName: input.companyName,
      ico: input.ico,
      city: input.city,
    });
    if (!parsed.success) {
      return { ok: false, error: parsed.error.issues[0]?.message ?? "Zkontrolujte údaje." };
    }
    const ico = normalizeIco(parsed.data.ico);
    if (!isValidIco(ico)) {
      return { ok: false, error: "IČO nemá platný kontrolní součet. Zkontrolujte osm číslic." };
    }
    const ares = await verifyIcoViaAres(ico);
    if (!ares.ok) {
      return { ok: false, error: "IČO se nepodařilo ověřit." };
    }

    const existingUser = await sql<{ id: string }[]>`select id from employer_user_by_email(${email})`;
    if (existingUser[0]) {
      return { ok: false, error: "Tento e-mail už máme. Přihlaste se odkazem." };
    }

    const employerId = randomUUID();
    try {
      await db.insert(employers).values({
        id: employerId,
        ico,
        companyName: parsed.data.companyName,
        legalName: parsed.data.companyName,
        city: parsed.data.city,
        verificationStatus: "pending",
        planCode: "trial",
        planRenewsAt: new Date(Date.now() + 365 * 86400000).toISOString().slice(0, 10),
      });
    } catch {
      return { ok: false, error: "Toto IČO už je registrované. Přihlaste se jako uživatel firmy." };
    }

    await db.insert(employerUsers).values({
      employerId,
      email,
      name: parsed.data.name,
      role: "owner",
    });

    await audit({
      actorType: "employer_user",
      employerId,
      action: "employer.registered",
      metadata: { ico, aresStub: true },
      ipHash: hashIp(ip),
    });
  } else {
    const user = await sql<{ id: string }[]>`select id from employer_user_by_email(${email})`;
    if (!user[0]) {
      log("info", "magic.unknown_email", { requestId });
      return { ok: true };
    }
  }

  try {
    const token = randomToken(32);
    const tokenHash = sha256(token);
    const expiresAt = new Date(Date.now() + env.MAGIC_LINK_MINUTES * 60 * 1000);

    await db.insert(magicTokens).values({ email, tokenHash, purpose: "employer", expiresAt });

    const url = `${env.APP_URL}/firma/prihlaseni/overit?token=${encodeURIComponent(token)}`;
    await sendEmail({
      to: email,
      subject: "Přihlášení na DílnaJobs",
      text: `Odkaz platí ${env.MAGIC_LINK_MINUTES} minut a jde použít jen jednou.\n\n${url}\n\nPokud jste o něj nežádali, ignorujte ho.`,
    });

    log("info", "magic.sent", { requestId, minutes: env.MAGIC_LINK_MINUTES });
    return { ok: true };
  } catch (err) {
    captureException(err, { event: "magic.send_failed", requestId });
    await audit({
      actorType: "system",
      action: "auth.magic.failed",
      metadata: { requestId },
      ipHash: hashIp(ip),
    });
    return { ok: false, error: "Odkaz se teď nepodařilo odeslat." };
  }
}

export async function consumeMagicLink(token: string): Promise<boolean> {
  const created = await createSessionFromMagicToken(token);
  if (!created) return false;
  const jar = await cookies();
  jar.set(SESSION_COOKIE, created.sessionToken, {
    httpOnly: true,
    secure: cookieSecure(),
    sameSite: "lax",
    path: "/",
    expires: created.expiresAt,
  });
  return true;
}

export async function createSessionFromMagicToken(token: string): Promise<{
  sessionToken: string;
  expiresAt: Date;
} | null> {
  if (!token || token.length < 20) return null;
  const tokenHash = sha256(token);
  const ip = await clientIp();
  const ua = (await headers()).get("user-agent")?.slice(0, 240);

  const [row] = await db
    .select()
    .from(magicTokens)
    .where(and(eq(magicTokens.tokenHash, tokenHash), isNull(magicTokens.consumedAt), gt(magicTokens.expiresAt, new Date())))
    .limit(1);

  if (!row) return null;
  if (row.purpose !== "employer") {
    const requestId = await getRequestId();
    log("warn", "magic.wrong_purpose", { requestId });
    await audit({
      actorType: "system",
      action: "auth.magic.wrong_purpose",
      metadata: { requestId, purpose: row.purpose },
      ipHash: hashIp(ip),
    });
    return null;
  }

  await db
    .update(magicTokens)
    .set({ consumedAt: new Date() })
    .where(eq(magicTokens.id, row.id));

  const users = await sql<
    { id: string; employer_id: string; email: string; name: string; role: string }[]
  >`select id, employer_id, email, name, role from employer_user_by_email(${row.email})`;
  const user = users[0];
  if (!user) return null;

  const sessionToken = randomToken(32);
  const expiresAt = new Date(Date.now() + env.SESSION_DAYS * 86400000);
  await db.insert(sessions).values({
    employerUserId: user.id,
    tokenHash: sha256(sessionToken),
    expiresAt,
    userAgent: ua,
    ipHash: hashIp(ip),
  });

  await audit({
    actorType: "employer_user",
    actorId: user.id,
    employerId: user.employer_id,
    action: "session.created",
    ipHash: hashIp(ip),
  });

  return { sessionToken, expiresAt };
}

export function sessionCookieOptions(expiresAt: Date) {
  return {
    httpOnly: true,
    secure: cookieSecure(),
    sameSite: "lax" as const,
    path: "/",
    expires: expiresAt,
  };
}

export async function getSession(): Promise<EmployerSession | null> {
  const jar = await cookies();
  const raw = jar.get(SESSION_COOKIE)?.value;
  if (!raw) return null;
  const tokenHash = sha256(raw);

  const rows = await sql<
    {
      session_id: string;
      expires_at: Date;
      user_id: string;
      employer_id: string;
      email: string;
      name: string;
      company_name: string;
      plan_code: string;
      ads_posted_year: number;
      verification_status: string;
    }[]
  >`select * from session_by_token_hash(${tokenHash})`;
  const row = rows[0];
  if (!row) return null;
  return {
    sessionId: row.session_id,
    userId: row.user_id,
    employerId: row.employer_id,
    email: row.email,
    name: row.name,
    companyName: row.company_name,
    planCode: row.plan_code,
    adsPostedYear: row.ads_posted_year,
    verificationStatus: row.verification_status,
  };
}

export async function requireSession(): Promise<EmployerSession> {
  const session = await getSession();
  if (!session) {
    throw new Error("unauthenticated");
  }
  return session;
}

export async function destroySession() {
  const jar = await cookies();
  const raw = jar.get(SESSION_COOKIE)?.value;
  if (raw) {
    await db.delete(sessions).where(eq(sessions.tokenHash, sha256(raw)));
  }
  jar.set(SESSION_COOKIE, "", {
    httpOnly: true,
    secure: cookieSecure(),
    sameSite: "lax",
    path: "/",
    expires: new Date(0),
  });
}
