"use server";

import { redirect } from "next/navigation";
import { destroyAdminSession, safeAdminLinkRequest } from "@/lib/admin-auth";

export type AdminAuthState = { ok: true; message: string } | { ok: false; error: string };

export async function requestAdminLinkAction(
  _prev: AdminAuthState | null,
  formData: FormData,
): Promise<AdminAuthState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!email.includes("@")) {
    return { ok: false, error: "Zadejte platný e-mail." };
  }
  const result = await safeAdminLinkRequest(email);
  if (!result.ok) return result;
  return {
    ok: true,
    message:
      "Když je adresa v seznamu správců, odkaz je na cestě.",
  };
}

export async function logoutAdminAction() {
  await destroyAdminSession();
  redirect("/admin/prihlaseni");
}
