import { NextResponse } from "next/server";
import { CV_ALLOWLIST, putLocalFromTicket } from "@/lib/storage/cv";
import { env } from "@/lib/env";
import { log } from "@/lib/logging";
import { captureException } from "@/lib/observability";
import { getRequestId } from "@/lib/request-id";
import { clientIp } from "@/lib/auth";
import { enforceRateLimit, RateLimitError } from "@/lib/rate-limit";

async function readBody(request: Request, maxBytes: number) {
  const declared = Number(request.headers.get("content-length") ?? 0);
  if (declared > maxBytes) throw new Error("too_large");
  if (!request.body) return Buffer.alloc(0);
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > maxBytes) {
      await reader.cancel();
      throw new Error("too_large");
    }
    chunks.push(value);
  }
  return Buffer.concat(chunks.map((chunk) => Buffer.from(chunk)), total);
}

export async function PUT(request: Request) {
  try {
    await enforceRateLimit({
      bucket: "cv-local-upload:ip",
      key: await clientIp(),
      limit: 30,
      windowMs: 60 * 60 * 1000,
    });
  } catch (error) {
    if (error instanceof RateLimitError) {
      return NextResponse.json({ error: "rate_limited" }, { status: 429 });
    }
    throw error;
  }

  const url = new URL(request.url);
  const ticket = url.searchParams.get("ticket");
  if (!ticket) return NextResponse.json({ error: "missing_ticket" }, { status: 400 });

  const contentType = request.headers.get("content-type") ?? "";
  if (!CV_ALLOWLIST[contentType]) {
    return NextResponse.json({ error: "unsupported_type" }, { status: 415 });
  }

  let buf: Buffer;
  try {
    buf = await readBody(request, env.CV_MAX_BYTES);
  } catch {
    return NextResponse.json({ error: "too_large" }, { status: 413 });
  }

  try {
    const objectKey = await putLocalFromTicket(ticket, contentType, buf);
    log("info", "cv.local_upload", { bytes: buf.length, requestId: await getRequestId() });
    return NextResponse.json({ objectKey });
  } catch (err) {
    captureException(err, { event: "cv.local_upload.failed", requestId: await getRequestId() });
    return NextResponse.json({ error: "bad_ticket" }, { status: 403 });
  }
}
