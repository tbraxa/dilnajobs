import { NextResponse } from "next/server";
import { CV_ALLOWLIST, putLocalFromTicket } from "@/lib/storage/cv";
import { env } from "@/lib/env";
import { log } from "@/lib/logging";

export async function PUT(request: Request) {
  const url = new URL(request.url);
  const ticket = url.searchParams.get("ticket");
  if (!ticket) return NextResponse.json({ error: "missing_ticket" }, { status: 400 });

  const contentType = request.headers.get("content-type") ?? "";
  if (!CV_ALLOWLIST[contentType]) {
    return NextResponse.json({ error: "unsupported_type" }, { status: 415 });
  }

  const buf = Buffer.from(await request.arrayBuffer());
  if (buf.length > env.CV_MAX_BYTES) {
    return NextResponse.json({ error: "too_large" }, { status: 413 });
  }

  try {
    const objectKey = await putLocalFromTicket(ticket, contentType, buf);
    log("info", "cv.local_upload", { bytes: buf.length });
    return NextResponse.json({ objectKey });
  } catch {
    return NextResponse.json({ error: "bad_ticket" }, { status: 403 });
  }
}
