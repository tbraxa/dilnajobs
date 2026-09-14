import { z } from "zod";

const optionalUrl = z
  .string()
  .optional()
  .transform((v) => (v && v.length > 0 ? v : undefined));

const schema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  APP_URL: z.string().url().default("http://localhost:3000"),
  DATABASE_URL: z.string().min(1).default("postgres://dilna_app:dilna@localhost:5432/dilnajobs"),
  DATABASE_ADMIN_URL: z
    .string()
    .optional()
    .transform((v) => v || undefined),
  SESSION_SECRET: z.string().min(16).default("dev-only-not-for-production-32ch"),
  SESSION_DAYS: z.coerce.number().int().positive().default(14),
  MAGIC_LINK_MINUTES: z.coerce.number().int().positive().default(15),
  S3_ENDPOINT: optionalUrl,
  S3_REGION: z.string().default("eu-central-1"),
  S3_BUCKET: z.string().default("dilnajobs-cvs"),
  S3_ACCESS_KEY: z.string().optional().transform((v) => v || undefined),
  S3_SECRET_KEY: z.string().optional().transform((v) => v || undefined),
  S3_FORCE_PATH_STYLE: z
    .string()
    .optional()
    .transform((v) => v === "true"),
  CV_MAX_BYTES: z.coerce.number().int().positive().default(5_242_880),
  STRIPE_SECRET_KEY: z.string().optional().transform((v) => v || undefined),
  GOPAY_CLIENT_SECRET: z.string().optional().transform((v) => v || undefined),
  EMAIL_FROM: z.string().default("DílnaJobs <noreply@dilnajobs.cz>"),
  SMTP_URL: optionalUrl,
  FEATURE_AUTO_PUBLISH_FIRST_JOB: z
    .string()
    .optional()
    .transform((v) => v === "true"),
  TRUST_PROXY: z
    .string()
    .optional()
    .transform((v) => v === "true"),
  ADMIN_EMAILS: z
    .string()
    .optional()
    .transform((v) => v || ""),
  SENTRY_DSN: optionalUrl,
});

export type Env = z.infer<typeof schema>;

function loadEnv(): Env {
  const parsed = schema.safeParse(process.env);
  if (!parsed.success) {
    throw new Error(`Invalid environment: ${parsed.error.message}`);
  }
  const env = parsed.data;
  if (env.NODE_ENV === "production" && env.SESSION_SECRET.length < 32) {
    throw new Error("SESSION_SECRET must be at least 32 characters in production");
  }
  return env;
}

export const env = loadEnv();

export function paymentsEnabled(): boolean {
  return Boolean(env.STRIPE_SECRET_KEY || env.GOPAY_CLIENT_SECRET);
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
