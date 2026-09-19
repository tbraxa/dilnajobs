import { NextResponse, type NextRequest } from "next/server";
import { consumeSeekerMagicLink, safeAccountNext } from "@/lib/seeker-auth";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const token = String(formData.get("token") ?? "");
  const next = safeAccountNext(String(formData.get("next") ?? ""));
  const ok = await consumeSeekerMagicLink(token);
  if (!ok) {
    return NextResponse.redirect(new URL("/ucet/prihlaseni?chyba=odkaz", request.url), 303);
  }
  return NextResponse.redirect(new URL(next, request.url), 303);
}
