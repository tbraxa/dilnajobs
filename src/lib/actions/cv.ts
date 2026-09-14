"use server";

import { CV_ALLOWLIST, presignUpload } from "@/lib/storage/cv";
import { getSession, clientIp } from "@/lib/auth";
import { enforceRateLimit, RateLimitError } from "@/lib/rate-limit";
import { env } from "@/lib/env";
import { captureException } from "@/lib/observability";
import { getRequestId } from "@/lib/request-id";

export async function presignCvAction(contentType: string) {
  const ip = await clientIp();
  const requestId = await getRequestId();
  try {
    await enforceRateLimit({ bucket: "upload:ip", key: ip, limit: 20, windowMs: 60 * 60 * 1000 });
  } catch (err) {
    if (err instanceof RateLimitError) return { ok: false as const, error: "Příliš mnoho nahrávání." };
    captureException(err, { event: "cv.presign.rate_limit", requestId });
    throw err;
  }
  if (!CV_ALLOWLIST[contentType]) {
    return { ok: false as const, error: "Povolené jsou PDF, DOC a DOCX." };
  }
  try {
    const signed = await presignUpload(contentType);
    return { ok: true as const, ...signed, maxBytes: env.CV_MAX_BYTES };
  } catch (err) {
    captureException(err, { event: "cv.presign.failed", requestId });
    return { ok: false as const, error: "Nahrání se teď nepodařilo připravit." };
  }
}

export async function requireEmployer() {
  const session = await getSession();
  return session;
}
