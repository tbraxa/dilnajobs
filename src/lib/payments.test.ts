import { createHmac } from "node:crypto";
import { describe, expect, it } from "vitest";
import { verifyStripeSignature } from "@/lib/stripe";
import { resolveMailerProvider } from "@/lib/mailer-config";
import { POST as stripeWebhook } from "@/app/api/stripe/webhook/route";

function sign(payload: string, secret: string, t: number) {
  const v1 = createHmac("sha256", secret).update(`${t}.${payload}`, "utf8").digest("hex");
  return `t=${t},v1=${v1}`;
}

describe("resolveMailerProvider", () => {
  it("is stub when nothing is set", () => {
    expect(resolveMailerProvider({})).toBe("stub");
  });

  it("prefers Resend over SMTP", () => {
    expect(
      resolveMailerProvider({ resendApiKey: "re_test", smtpUrl: "smtp://localhost:587" }),
    ).toBe("resend");
  });

  it("uses SMTP when Resend is absent", () => {
    expect(resolveMailerProvider({ smtpUrl: "smtp://localhost:587" })).toBe("smtp");
  });
});

describe("verifyStripeSignature", () => {
  const secret = "whsec_test_secret";
  const payload = JSON.stringify({ type: "checkout.session.completed" });
  const t = 1_700_000_000;

  it("accepts a valid v1 signature", () => {
    expect(
      verifyStripeSignature({
        payload,
        header: sign(payload, secret, t),
        secret,
        nowMs: t * 1000,
      }),
    ).toEqual({ ok: true });
  });

  it("rejects a bad signature", () => {
    expect(
      verifyStripeSignature({
        payload,
        header: `t=${t},v1=${"a".repeat(64)}`,
        secret,
        nowMs: t * 1000,
      }).ok,
    ).toBe(false);
  });

  it("rejects a stale timestamp", () => {
    expect(
      verifyStripeSignature({
        payload,
        header: sign(payload, secret, t),
        secret,
        nowMs: (t + 301) * 1000,
      }),
    ).toEqual({ ok: false, error: "timestamp" });
  });
});

describe("POST /api/stripe/webhook", () => {
  it("rejects missing signature when webhook secret is unset", async () => {
    const res = await stripeWebhook(
      new Request("http://localhost:3000/api/stripe/webhook", {
        method: "POST",
        body: "{}",
      }),
    );
    expect([400, 503]).toContain(res.status);
  });
});
