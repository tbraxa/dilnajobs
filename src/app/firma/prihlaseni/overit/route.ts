import { NextResponse } from "next/server";
import { consumeMagicLink } from "@/lib/auth";

export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get("token") ?? "";
  const ok = await consumeMagicLink(token);
  if (!ok) {
    return NextResponse.redirect(new URL("/firma/prihlaseni?chyba=odkaz", request.url));
  }
  return NextResponse.redirect(new URL("/firma", request.url));
}
