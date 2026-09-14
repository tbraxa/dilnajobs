import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  createAdminSessionFromToken,
  sessionCookieOptions,
} from "@/lib/admin-auth";
import { resolveAppUrl, toAppUrl } from "@/lib/app-url";

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  const appUrl = resolveAppUrl();
  if (origin && origin !== appUrl) {
    return NextResponse.json({ error: "bad_origin" }, { status: 403 });
  }

  const form = await request.formData();
  const token = String(form.get("token") ?? "");
  const created = await createAdminSessionFromToken(token);
  if (!created) {
    return NextResponse.redirect(toAppUrl("/admin/prihlaseni?chyba=odkaz"), 303);
  }

  const res = NextResponse.redirect(toAppUrl("/admin"), 303);
  res.cookies.set(ADMIN_COOKIE, created.sessionToken, sessionCookieOptions(created.expiresAt));
  return res;
}
