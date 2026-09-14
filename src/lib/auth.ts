import "server-only";

import { randomUUID } from "node:crypto";
import { cookies, headers } from "next/headers";
import { and, eq, gt, isNull } from "drizzle-orm";
import { db } from "@/db/client";
import { employerUsers, employers, magicTokens, sessions } from "@/db/schema";
import { env } from "./env";
import { hashIp, randomToken, sha256 } from "./crypto";
import { sendEmail } from "./email";
import { log } from "./logging";
import { enforceRateLimit } from "./rate-limit";
import { isValidIco, normalizeIco, verifyIcoViaAres } from "./ico";
import { registerEmployerSchema } from "./validation";
import { audit } from "./audit";

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

    const [existingUser] = await db
      .select({ id: employerUsers.id })
      .from(employerUsers)
      .where(eq(employerUsers.email, email))
      .limit(1);
    if (existingUser) {
      return { ok: false, error: "Tento e-mail už máme. Přihlaste se odkazem." };
    }

    const [existingIco] = await db
      .select({ id: employers.id })
      .from(employers)
      .where(eq(employers.ico, ico))
      .limit(1);
    if (existingIco) {
      return { ok: false, error: "Toto IČO už je registrované. Přihlaste se jako uživatel firmy." };
    }

    const employerId = randomUUID();
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
    const [user] = await db
      .select({ id: employerUsers.id })
      .from(employerUsers)
      .where(eq(employerUsers.email, email))
      .limit(1);
    if (!user) {
      log("info", "magic.unknown_email");
      return { ok: true };
    }
  }

  const token = randomToken(32);
  const tokenHash = sha256(token);
  const expiresAt = new Date(Date.now() + env.MAGIC_LINK_MINUTES * 60 * 1000);

  await db.insert(magicTokens).values({ email, tokenHash, expiresAt });

  const url = `${env.APP_URL}/firma/prihlaseni/overit?token=${encodeURIComponent(token)}`;
  await sendEmail({
    to: email,
    subject: "Přihlášení na DílnaJobs",
    text: `Odkaz platí ${env.MAGIC_LINK_MINUTES} minut a jde použít jen jednou.\n\n${url}\n\nPokud jste o něj nežádali, ignorujte ho.`,
  });

  log("info", "magic.sent", { minutes: env.MAGIC_LINK_MINUTES });
  return { ok: true };
}

export async function consumeMagicLink(token: string): Promise<boolean> {
  if (!token || token.length < 20) return false;
  const tokenHash = sha256(token);
  const ip = await clientIp();
  const ua = (await headers()).get("user-agent")?.slice(0, 240);

  const [row] = await db
    .select()
    .from(magicTokens)
    .where(and(eq(magicTokens.tokenHash, tokenHash), isNull(magicTokens.consumedAt), gt(magicTokens.expiresAt, new Date())))
    .limit(1);

  if (!row) return false;

  await db
    .update(magicTokens)
    .set({ consumedAt: new Date() })
    .where(eq(magicTokens.id, row.id));

  const [user] = await db
    .select()
    .from(employerUsers)
    .where(eq(employerUsers.email, row.email))
    .limit(1);
  if (!user) return false;

  const sessionToken = randomToken(32);
  const expiresAt = new Date(Date.now() + env.SESSION_DAYS * 86400000);
  await db.insert(sessions).values({
    employerUserId: user.id,
    tokenHash: sha256(sessionToken),
    expiresAt,
    userAgent: ua,
    ipHash: hashIp(ip),
  });

  const jar = await cookies();
  jar.set(SESSION_COOKIE, sessionToken, {
    httpOnly: true,
    secure: cookieSecure(),
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });

  await audit({
    actorType: "employer_user",
    actorId: user.id,
    employerId: user.employerId,
    action: "session.created",
    ipHash: hashIp(ip),
  });

  return true;
}

export async function getSession(): Promise<EmployerSession | null> {
  const jar = await cookies();
  const raw = jar.get(SESSION_COOKIE)?.value;
  if (!raw) return null;
  const tokenHash = sha256(raw);

  const [row] = await db
    .select({
      sessionId: sessions.id,
      expiresAt: sessions.expiresAt,
      userId: employerUsers.id,
      employerId: employerUsers.employerId,
      email: employerUsers.email,
      name: employerUsers.name,
      companyName: employers.companyName,
      planCode: employers.planCode,
      adsPostedYear: employers.adsPostedYear,
      verificationStatus: employers.verificationStatus,
    })
    .from(sessions)
    .innerJoin(employerUsers, eq(sessions.employerUserId, employerUsers.id))
    .innerJoin(employers, eq(employerUsers.employerId, employers.id))
    .where(and(eq(sessions.tokenHash, tokenHash), gt(sessions.expiresAt, new Date())))
    .limit(1);

  return row ?? null;
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
