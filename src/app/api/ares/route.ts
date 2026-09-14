import { NextResponse } from "next/server";
import { lookupAresCompany } from "@/lib/ico";
import { enforceRateLimit, RateLimitError } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

function clientIp(request: Request): string {
  const xff = request.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]?.trim() || "0.0.0.0";
  return request.headers.get("x-real-ip") ?? "127.0.0.1";
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const ico = url.searchParams.get("ico") ?? "";

  try {
    await enforceRateLimit({ bucket: "ares:ip", key: clientIp(request), limit: 20, windowMs: 60 * 60 * 1000 });
  } catch (err) {
    if (err instanceof RateLimitError) {
      return NextResponse.json({ ok: false, error: "Příliš mnoho pokusů. Zkuste to za chvíli." }, { status: 429 });
    }
    return NextResponse.json({ ok: false, error: "ARES teď neodpověděl. Vyplňte údaje ručně." }, { status: 503 });
  }

  const result = await lookupAresCompany(ico);
  if (!result.ok) {
    const status = result.notFound ? 404 : result.error.includes("osm číslic") ? 400 : 502;
    return NextResponse.json({ ok: false, error: result.error }, { status });
  }

  return NextResponse.json({
    ok: true,
    companyName: result.company.companyName,
    city: result.company.city,
    address: result.company.address,
    dic: result.company.dic,
    ico: result.company.ico,
  });
}
