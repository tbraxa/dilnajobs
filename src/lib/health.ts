import { sql } from "@/db/client";
import { env, paymentsEnabled, s3Enabled, stripeWebhookConfigured } from "@/lib/env";
import { getMailerStatus } from "@/lib/email";
import fs from "node:fs/promises";
import path from "node:path";
import type { CheckStatus, HealthCheck, HealthReport } from "@/lib/health-types";
import { rollupStatus } from "@/lib/health-types";

export type { CheckStatus, HealthCheck, HealthReport } from "@/lib/health-types";
export { rollupStatus };

const LOCAL_CV_DIR = path.join(process.cwd(), "storage", "cvs");

const EXPECTED_MIGRATIONS = [
  "0001_init.sql",
  "0002_employers_public_read.sql",
  "0003_employer_user_lookup.sql",
  "0004_admin_ops.sql",
  "0005_payments_email.sql",
  "0006_enterprise_mvp.sql",
  "0007_app_role_grants.sql",
];

async function timed<T>(fn: () => Promise<T>, ms = 1500): Promise<{ ok: true; value: T; latencyMs: number } | { ok: false; error: string; latencyMs: number }> {
  const start = Date.now();
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    const value = await Promise.race([
      fn(),
      new Promise<never>((_, reject) => {
        timer = setTimeout(() => reject(new Error("timeout")), ms);
      }),
    ]);
    return { ok: true, value, latencyMs: Date.now() - start };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "fail",
      latencyMs: Date.now() - start,
    };
  } finally {
    if (timer) clearTimeout(timer);
  }
}

function nowIso() {
  return new Date().toISOString();
}

function sanitizeDetail(detail?: string) {
  if (!detail) return detail;
  return detail
    .replace(/postgres:\/\/\S+/gi, "postgres://***")
    .replace(/smtp:\/\/\S+/gi, "smtp://***")
    .replace(/Bearer\s+\S+/gi, "Bearer ***");
}

export async function pingPostgres(): Promise<{ ok: boolean; latencyMs: number; error?: string }> {
  const result = await timed(async () => {
    await sql`select 1 as n`;
  });
  if (result.ok) return { ok: true, latencyMs: result.latencyMs };
  return { ok: false, latencyMs: result.latencyMs, error: result.error };
}

export async function runDeepHealth(): Promise<HealthReport> {
  const checkedAt = nowIso();
  const checks: HealthCheck[] = [];

  const pg = await pingPostgres();
  checks.push({
    name: "postgres",
    status: pg.ok ? "ok" : "down",
    latencyMs: pg.latencyMs,
    detail: sanitizeDetail(pg.ok ? "SELECT 1" : pg.error),
    checkedAt,
    critical: true,
  });

  const mig = await timed(async () => {
    return sql<{ id: string }[]>`select id from schema_migrations order by id`;
  });
  if (!mig.ok) {
    checks.push({
      name: "migrations",
      status: "down",
      latencyMs: mig.latencyMs,
      detail: sanitizeDetail(mig.error),
      checkedAt,
      critical: true,
    });
  } else {
    const have = new Set(mig.value.map((r) => r.id));
    const missing = EXPECTED_MIGRATIONS.filter((id) => !have.has(id));
    checks.push({
      name: "migrations",
      status: missing.length ? "degraded" : "ok",
      latencyMs: mig.latencyMs,
      detail: missing.length ? `Chybí: ${missing.join(", ")}` : `${have.size} migrací`,
      checkedAt,
    });
  }

  if (s3Enabled()) {
    checks.push({
      name: "object_storage",
      status: "ok",
      detail: `S3-compatible bucket ${env.S3_BUCKET} (klíče nastavené, hloubkový HeadBucket není v1)`,
      checkedAt,
    });
  } else {
    const probe = path.join(LOCAL_CV_DIR, ".health");
    const write = await timed(async () => {
      await fs.mkdir(LOCAL_CV_DIR, { recursive: true });
      await fs.writeFile(probe, checkedAt, { mode: 0o600 });
      await fs.unlink(probe);
      return LOCAL_CV_DIR;
    });
    checks.push({
      name: "object_storage",
      status: write.ok ? "ok" : "down",
      latencyMs: write.latencyMs,
      detail: sanitizeDetail(write.ok ? `Lokální stub ${LOCAL_CV_DIR}` : write.error),
      checkedAt,
    });
  }

  const mail = getMailerStatus();
  const mailDetail = mail.lastError
    ? `Poslední chyba: ${mail.lastError}`
    : mail.provider === "resend"
      ? "Resend API"
      : mail.provider === "smtp"
        ? "SMTP_URL"
        : "Stub: výpis do konzole. Nastavte RESEND_API_KEY (nebo SMTP_URL).";
  checks.push({
    name: "mailer",
    status: mail.lastError ? "degraded" : mail.configured ? "ok" : "unconfigured",
    detail: mailDetail,
    checkedAt,
  });

  let paymentsStatus: CheckStatus = "unconfigured";
  let paymentsDetail = "Stub checkout. Nastavte STRIPE_SECRET_KEY a STRIPE_WEBHOOK_SECRET.";
  if (paymentsEnabled() && stripeWebhookConfigured()) {
    paymentsStatus = "ok";
    paymentsDetail = "Stripe Checkout + webhook secret";
  } else if (paymentsEnabled()) {
    paymentsStatus = "degraded";
    paymentsDetail = "STRIPE_SECRET_KEY je nastavené, chybí STRIPE_WEBHOOK_SECRET";
  }
  checks.push({
    name: "payments",
    status: paymentsStatus,
    detail: paymentsDetail,
    checkedAt,
  });

  const hb = await timed(async () => {
    return sql<{ name: string; status: string; detail: string | null; checked_at: Date }[]>`
      select name, status, detail, checked_at from system_heartbeats where name = 'job_expiry' limit 1
    `;
  });
  if (!hb.ok) {
    checks.push({
      name: "worker",
      status: "degraded",
      latencyMs: hb.latencyMs,
      detail: sanitizeDetail(hb.error),
      checkedAt,
    });
  } else if (!hb.value[0]) {
    checks.push({
      name: "worker",
      status: "unconfigured",
      detail: "Žádný heartbeat. Spusťte `npm run worker` (nebo cron na expiraci inzerátů).",
      checkedAt,
    });
  } else {
    const ageMs = Date.now() - new Date(hb.value[0].checked_at).getTime();
    const stale = ageMs > 26 * 60 * 60 * 1000;
    checks.push({
      name: "worker",
      status: stale ? "degraded" : (hb.value[0].status as CheckStatus),
      detail: stale
        ? `Poslední běh je starší než 26 h (${hb.value[0].detail ?? ""})`
        : hb.value[0].detail ?? "ok",
      checkedAt,
    });
  }

  const rl = await timed(async () => {
    await sql`select count(*)::int as n from rate_limit_events`;
  });
  checks.push({
    name: "rate_limiter",
    status: rl.ok ? "ok" : "down",
    latencyMs: rl.latencyMs,
    detail: sanitizeDetail(rl.ok ? "Tabulka rate_limit_events" : rl.error),
    checkedAt,
    critical: true,
  });

  const auth = await timed(async () => {
    await sql`select 1 from magic_tokens limit 1`;
    await sql`select 1 from employer_user_by_email('health-probe@invalid.test')`;
    if (env.SESSION_SECRET.length < 16) throw new Error("SESSION_SECRET too short");
  });
  checks.push({
    name: "auth",
    status: auth.ok ? "ok" : "down",
    latencyMs: auth.latencyMs,
    detail: sanitizeDetail(auth.ok ? "magic_tokens + lookup funkce" : auth.error),
    checkedAt,
    critical: true,
  });

  if (!s3Enabled()) {
    checks.push({
      name: "cv_disk",
      status: checks.find((c) => c.name === "object_storage")?.status ?? "unconfigured",
      detail: LOCAL_CV_DIR,
      checkedAt,
    });
  }

  checks.push({
    name: "sentry",
    status: env.SENTRY_DSN ? "ok" : "unconfigured",
      detail: env.SENTRY_DSN ? "DSN nastavené" : "SENTRY_DSN chybí. Výjimky jdou do strukturovaných logů",
    checkedAt,
  });

  return { status: rollupStatus(checks), checkedAt, checks };
}
