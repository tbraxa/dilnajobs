import { describe, expect, it } from "vitest";
import { LOCAL_APP_URL } from "./app-url";
import { emptyToUndefined, parseEnv } from "./env";

const secret = "ci-session-secret-not-for-production-use-32";
const db = "postgres://dilna_app:dilna@localhost:5432/dilnajobs";

/** Keys Vercel often stores as empty strings when the dashboard field is blank. */
const vercelBlanks = {
  APP_URL: "",
  NEXT_PUBLIC_APP_URL: "",
  SESSION_DAYS: "",
  MAGIC_LINK_MINUTES: "",
  CV_MAX_BYTES: "",
  DATABASE_ADMIN_URL: "",
  S3_ENDPOINT: "",
  S3_ACCESS_KEY: "",
  S3_SECRET_KEY: "",
  STRIPE_SECRET_KEY: "",
  STRIPE_WEBHOOK_SECRET: "",
  RESEND_API_KEY: "",
  SMTP_URL: "",
  CRON_SECRET: "",
  SENTRY_DSN: "",
  S3_FORCE_PATH_STYLE: "",
  FEATURE_AUTO_PUBLISH_FIRST_JOB: "",
  TRUST_PROXY: "",
  ADMIN_EMAILS: "",
  EMAIL_FROM: "",
  S3_REGION: "",
  S3_BUCKET: "",
};

describe("emptyToUndefined", () => {
  it("treats blank and whitespace as missing", () => {
    expect(emptyToUndefined("")).toBeUndefined();
    expect(emptyToUndefined("  ")).toBeUndefined();
    expect(emptyToUndefined("14")).toBe("14");
  });
});

describe("parseEnv", () => {
  it("accepts a Vercel Hobby first-deploy env (blanks + DATABASE_URL + SESSION_SECRET)", () => {
    const env = parseEnv(
      {
        ...vercelBlanks,
        NODE_ENV: "production",
        DATABASE_URL: db,
        SESSION_SECRET: secret,
        ADMIN_EMAILS: "tomas@dilnajobs.test",
      },
      { runtime: true },
    );
    expect(env.SESSION_DAYS).toBe(14);
    expect(env.MAGIC_LINK_MINUTES).toBe(15);
    expect(env.CV_MAX_BYTES).toBe(5_242_880);
    expect(env.APP_URL).toBe(LOCAL_APP_URL);
    expect(env.SENTRY_DSN).toBeUndefined();
    expect(env.STRIPE_SECRET_KEY).toBeUndefined();
    expect(env.FEATURE_AUTO_PUBLISH_FIRST_JOB).toBe(false);
    expect(env.ADMIN_EMAILS).toBe("tomas@dilnajobs.test");
  });

  it("does not coerce empty numeric strings to 0", () => {
    const env = parseEnv({ SESSION_DAYS: "", MAGIC_LINK_MINUTES: "", CV_MAX_BYTES: "" });
    expect(env.SESSION_DAYS).toBeGreaterThan(0);
    expect(env.MAGIC_LINK_MINUTES).toBeGreaterThan(0);
    expect(env.CV_MAX_BYTES).toBeGreaterThan(0);
  });

  it("falls back to defaults for invalid numeric strings", () => {
    const env = parseEnv({ SESSION_DAYS: "nope", MAGIC_LINK_MINUTES: "0", CV_MAX_BYTES: "-1" });
    expect(env.SESSION_DAYS).toBe(14);
    expect(env.MAGIC_LINK_MINUTES).toBe(15);
    expect(env.CV_MAX_BYTES).toBe(5_242_880);
  });

  it("uses https://VERCEL_URL when APP_URL is blank", () => {
    const env = parseEnv({ APP_URL: "", VERCEL_URL: "dilnajobs.vercel.app" });
    expect(env.APP_URL).toBe("https://dilnajobs.vercel.app");
  });

  it("ignores invalid optional URLs instead of throwing", () => {
    const env = parseEnv({ SENTRY_DSN: "not-a-url", SMTP_URL: "also-bad", S3_ENDPOINT: "" });
    expect(env.SENTRY_DSN).toBeUndefined();
    expect(env.SMTP_URL).toBeUndefined();
    expect(env.S3_ENDPOINT).toBeUndefined();
  });

  it("skips production SESSION_SECRET checks during next build", () => {
    expect(() =>
      parseEnv(
        { NODE_ENV: "production", SESSION_SECRET: "dev", DATABASE_URL: db },
        { runtime: false },
      ),
    ).not.toThrow();
  });

  it("requires SESSION_SECRET at production runtime", () => {
    expect(() =>
      parseEnv({ NODE_ENV: "production", SESSION_SECRET: "", DATABASE_URL: db }, { runtime: true }),
    ).toThrow(/SESSION_SECRET is required/);
  });
});
