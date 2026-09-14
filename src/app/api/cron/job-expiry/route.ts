import { NextResponse } from "next/server";
import { env } from "@/lib/env";
import { expirePublishedJobs, markExpiryFailed } from "@/lib/job-expiry";
import { log } from "@/lib/logging";
import { captureException } from "@/lib/observability";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function authorized(request: Request): boolean {
  const secret = env.CRON_SECRET;
  if (!secret) return false;
  const header = request.headers.get("authorization");
  return header === `Bearer ${secret}`;
}

async function run(request: Request) {
  if (!authorized(request)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  try {
    const count = await expirePublishedJobs();
    log("info", "cron.job_expiry", { count });
    return NextResponse.json({ ok: true, expired: count });
  } catch (err) {
    const message = err instanceof Error ? err.message : "cron_failed";
    captureException(err, { event: "cron.job_expiry.failed" });
    try {
      await markExpiryFailed(message);
    } catch {
      /* ignore */
    }
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}

export const GET = run;
export const POST = run;
