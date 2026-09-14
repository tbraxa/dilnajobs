import { z } from "zod";
import { resolveAppUrl } from "./app-url";

/**
 * Vercel stores unset dashboard keys as `""`. Zod’s `z.coerce.number()` then
 * turns `""` into `0` (`Number("") === 0`) and `.positive()` fails. Treat
 * blank/whitespace as missing so `.default()` can apply.
 */
export function emptyToUndefined(value: unknown): unknown {
  if (value == null) return undefined;
  if (typeof value === "string" && value.trim() === "") return undefined;
  if (typeof value === "string") return value.trim();
  return value;
}

export function blankStringsToUndefined(
  source: NodeJS.Dict<string>,
): Record<string, string | undefined> {
  const out: Record<string, string | undefined> = {};
  for (const [key, value] of Object.entries(source)) {
    const next = emptyToUndefined(value);
    out[key] = typeof next === "string" ? next : undefined;
  }
  return out;
}

function isNextBuildPhase(): boolean {
  const phase = process.env.NEXT_PHASE;
  return phase === "phase-production-build" || phase === "phase-production-compile";
}

const optionalString = z.preprocess(emptyToUndefined, z.string().min(1).optional());

/** Empty or invalid URLs become undefined — never throw at import / `next build`. */
const optionalUrl = z.preprocess((value) => {
  const v = emptyToUndefined(value);
  if (typeof v !== "string") return undefined;
  try {
    new URL(v);
    return v;
  } catch {
    return undefined;
  }
}, z.string().optional());

function positiveInt(defaultValue: number) {
  return z.preprocess((value) => {
    const v = emptyToUndefined(value);
    if (v === undefined) return undefined;
    const n = typeof v === "number" ? v : Number(v);
    if (!Number.isFinite(n) || n <= 0) return undefined;
    return n;
  }, z.number().int().positive().default(defaultValue));
}

function boolFlag(defaultValue = false) {
  return z.preprocess((value) => {
    const v = emptyToUndefined(value);
    if (v === undefined) return defaultValue;
    if (typeof v === "boolean") return v;
    if (typeof v === "string") {
      const s = v.toLowerCase();
      if (s === "true" || s === "1") return true;
      if (s === "false" || s === "0") return false;
    }
    return defaultValue;
  }, z.boolean());
}

function makeSchema(softBuild: boolean) {
  return z.object({
    NODE_ENV: z.preprocess((value) => {
      const v = emptyToUndefined(value);
      if (v === "development" || v === "test" || v === "production") return v;
      return undefined;
    }, z.enum(["development", "test", "production"]).default("development")),
    DATABASE_URL: z.preprocess(
      emptyToUndefined,
      z.string().min(1).default("postgres://dilna_app:dilna@localhost:5432/dilnajobs"),
    ),
    DATABASE_ADMIN_URL: optionalString,
    SESSION_SECRET: z.preprocess((value) => {
      const v = emptyToUndefined(value);
      if (typeof v !== "string") return undefined;
      // `next build` must not crash on a placeholder secret; runtime still requires ≥32.
      if (softBuild && v.length < 32) return undefined;
      return v;
    }, z.string().min(16).default("dev-only-not-for-production-32ch")),
    SESSION_DAYS: positiveInt(14),
    MAGIC_LINK_MINUTES: positiveInt(15),
    S3_ENDPOINT: optionalUrl,
    S3_REGION: z.preprocess(emptyToUndefined, z.string().min(1).default("eu-central-1")),
    S3_BUCKET: z.preprocess(emptyToUndefined, z.string().min(1).default("dilnajobs-cvs")),
    S3_ACCESS_KEY: optionalString,
    S3_SECRET_KEY: optionalString,
    S3_FORCE_PATH_STYLE: boolFlag(false),
    CV_MAX_BYTES: positiveInt(5_242_880),
    STRIPE_SECRET_KEY: optionalString,
    STRIPE_WEBHOOK_SECRET: optionalString,
    EMAIL_FROM: z.preprocess(
      emptyToUndefined,
      z.string().min(1).default("DílnaJobs <noreply@dilnajobs.cz>"),
    ),
    RESEND_API_KEY: optionalString,
    SMTP_URL: optionalUrl,
    CRON_SECRET: optionalString,
    FEATURE_AUTO_PUBLISH_FIRST_JOB: boolFlag(false),
    TRUST_PROXY: boolFlag(false),
    ADMIN_EMAILS: z.preprocess(emptyToUndefined, z.string().default("")),
    SENTRY_DSN: optionalUrl,
  });
}

export type ParsedEnv = z.infer<ReturnType<typeof makeSchema>>;
export type Env = ParsedEnv & { APP_URL: string };

export function parseEnv(
  source: NodeJS.Dict<string> = process.env,
  options: { runtime?: boolean } = {},
): Env {
  const sanitized = blankStringsToUndefined(source);
  const runtime = options.runtime ?? !isNextBuildPhase();
  const parsed = makeSchema(!runtime).safeParse(sanitized);
  if (!parsed.success) {
    throw new Error(`Invalid environment: ${parsed.error.message}`);
  }
  const data = parsed.data;
  if (runtime && data.NODE_ENV === "production") {
    if (emptyToUndefined(source.SESSION_SECRET) === undefined) {
      throw new Error("SESSION_SECRET is required in production");
    }
    if (data.SESSION_SECRET.length < 32) {
      throw new Error("SESSION_SECRET must be at least 32 characters in production");
    }
  }
  return {
    ...data,
    APP_URL: resolveAppUrl(sanitized),
  };
}

function loadEnv(): Env {
  return parseEnv(process.env);
}

export const env = loadEnv();

export function paymentsEnabled(): boolean {
  return Boolean(env.STRIPE_SECRET_KEY);
}

export function stripeWebhookConfigured(): boolean {
  return Boolean(env.STRIPE_SECRET_KEY && env.STRIPE_WEBHOOK_SECRET);
}

export function s3Enabled(): boolean {
  return Boolean(env.S3_ACCESS_KEY && env.S3_SECRET_KEY);
}

export function adminEmails(): string[] {
  return env.ADMIN_EMAILS.split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email: string): boolean {
  return adminEmails().includes(email.trim().toLowerCase());
}
