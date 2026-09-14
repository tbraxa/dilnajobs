import { NextResponse } from "next/server";
import { ADMIN_COOKIE, cookieFromHeader, getAdminSessionFromRaw } from "@/lib/admin-auth";
import { clientIp } from "@/lib/auth";
import { runDeepHealth } from "@/lib/health";
import { enforceRateLimit, RateLimitError } from "@/lib/rate-limit";
import { log } from "@/lib/logging";
import { getRequestId } from "@/lib/request-id";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const requestId = await getRequestId();
  const raw = cookieFromHeader(request.headers.get("cookie"), ADMIN_COOKIE);
  const session = await getAdminSessionFromRaw(raw);
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    await enforceRateLimit({
      bucket: "admin-health:ip",
      key: await clientIp(),
      limit: 60,
      windowMs: 60 * 1000,
    });
  } catch (err) {
    if (err instanceof RateLimitError) {
      return NextResponse.json({ error: "rate_limited" }, { status: 429 });
    }
    throw err;
  }

  const report = await runDeepHealth();
  log("info", "admin.health", { requestId, status: report.status, email: session.email });
  return NextResponse.json(report);
}
