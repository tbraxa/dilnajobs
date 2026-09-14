import { createHmac, timingSafeEqual } from "node:crypto";

export function verifyStripeSignature(input: {
  payload: string;
  header: string;
  secret: string;
  nowMs?: number;
  toleranceSec?: number;
}): { ok: true } | { ok: false; error: string } {
  if (!input.secret) return { ok: false, error: "missing_secret" };
  if (!input.header) return { ok: false, error: "missing_header" };

  const items = input.header.split(",").map((p) => p.trim());
  const timestampPart = items.find((p) => p.startsWith("t="));
  const signatures = items.filter((p) => p.startsWith("v1=")).map((p) => p.slice(3));
  if (!timestampPart || signatures.length === 0) return { ok: false, error: "malformed_header" };

  const timestamp = Number(timestampPart.slice(2));
  if (!Number.isFinite(timestamp)) return { ok: false, error: "malformed_header" };

  const nowMs = input.nowMs ?? Date.now();
  const toleranceSec = input.toleranceSec ?? 300;
  if (Math.abs(nowMs / 1000 - timestamp) > toleranceSec) {
    return { ok: false, error: "timestamp" };
  }

  const expected = createHmac("sha256", input.secret)
    .update(`${timestamp}.${input.payload}`, "utf8")
    .digest("hex");
  const expectedBuf = Buffer.from(expected, "utf8");

  for (const sig of signatures) {
    const got = Buffer.from(sig, "utf8");
    if (got.length === expectedBuf.length && timingSafeEqual(got, expectedBuf)) {
      return { ok: true };
    }
  }
  return { ok: false, error: "bad_signature" };
}
