import { NextResponse } from "next/server";
import { pingPostgres } from "@/lib/health";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const pg = await pingPostgres();
  if (!pg.ok) {
    return NextResponse.json(
      { status: "down", postgres: { ok: false, latencyMs: pg.latencyMs } },
      { status: 503 },
    );
  }
  return NextResponse.json({ status: "ok", postgres: { ok: true, latencyMs: pg.latencyMs } });
}
