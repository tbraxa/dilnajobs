import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  createAdminSessionFromToken,
  sessionCookieOptions,
} from "@/lib/admin-auth";
import { env } from "@/lib/env";

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (origin && origin !== env.APP_URL) {
    return NextResponse.json({ error: "bad_origin" }, { status: 403 });
  }

  const form = await request.formData();
  const token = String(form.get("token") ?? "");
  const created = await createAdminSessionFromToken(token);
  if (!created) {
    return NextResponse.redirect(new URL("/admin/prihlaseni?chyba=odkaz", env.APP_URL), 303);
  }

  const res = NextResponse.redirect(new URL("/admin", env.APP_URL), 303);
  res.cookies.set(ADMIN_COOKIE, created.sessionToken, sessionCookieOptions(created.expiresAt));
  return res;
}
