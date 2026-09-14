import { NextResponse } from "next/server";
import {
  SESSION_COOKIE,
  createSessionFromMagicToken,
  sessionCookieOptions,
} from "@/lib/auth";
import { env } from "@/lib/env";

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (origin && origin !== env.APP_URL) {
    return NextResponse.json({ error: "bad_origin" }, { status: 403 });
  }

  const form = await request.formData();
  const token = String(form.get("token") ?? "");
  const created = await createSessionFromMagicToken(token);
  if (!created) {
    return NextResponse.redirect(new URL("/firma/prihlaseni?chyba=odkaz", env.APP_URL), 303);
  }

  const res = NextResponse.redirect(new URL("/firma", env.APP_URL), 303);
  res.cookies.set(SESSION_COOKIE, created.sessionToken, sessionCookieOptions(created.expiresAt));
  return res;
}
