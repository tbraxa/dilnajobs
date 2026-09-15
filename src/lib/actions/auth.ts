"use server";

import { redirect } from "next/navigation";
import { destroySession, requestMagicLink } from "@/lib/auth";
import { magicLinkSchema } from "@/lib/validation";

export type AuthState = { ok: true; message: string } | { ok: false; error: string };

export async function requestLinkAction(_prev: AuthState | null, formData: FormData): Promise<AuthState> {
  const intent = formData.get("intent") === "register" ? "register" : "login";
  const firstName = String(formData.get("firstName") ?? "").trim();
  const lastName = String(formData.get("lastName") ?? "").trim();
  const combinedName = [firstName, lastName].filter(Boolean).join(" ") || String(formData.get("name") ?? "") || undefined;
  const parsed = magicLinkSchema.safeParse({
    email: String(formData.get("email") ?? ""),
    intent,
    ico: String(formData.get("ico") ?? "") || undefined,
    companyName: String(formData.get("companyName") ?? "") || undefined,
    name: combinedName,
    firstName: firstName || undefined,
    lastName: lastName || undefined,
    dic: String(formData.get("dic") ?? "") || undefined,
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Zkontrolujte údaje." };
  }

  const result = await requestMagicLink({
    email: parsed.data.email,
    intent: parsed.data.intent,
    ico: String(formData.get("ico") ?? "") || undefined,
    companyName: parsed.data.companyName,
    name: combinedName,
    city: String(formData.get("city") ?? "") || undefined,
    dic: parsed.data.dic,
    phone: String(formData.get("phone") ?? "") || undefined,
  });

  if (!result.ok) return result;
  return {
    ok: true,
    message:
      intent === "register"
        ? "Účet je založený. Odkaz pro přihlášení jsme poslali na e-mail."
        : "Odkaz jsme poslali. Podívejte se do schránky.",
  };
}

export async function logoutAction() {
  await destroySession();
  redirect("/firma/prihlaseni");
}
