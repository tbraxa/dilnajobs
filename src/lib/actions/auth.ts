"use server";

import { redirect } from "next/navigation";
import { destroySession, requestMagicLink } from "@/lib/auth";
import { magicLinkSchema } from "@/lib/validation";

export type AuthState = { ok: true; message: string } | { ok: false; error: string };

export async function requestLinkAction(_prev: AuthState | null, formData: FormData): Promise<AuthState> {
  const intent = formData.get("intent") === "register" ? "register" : "login";
  const parsed = magicLinkSchema.safeParse({
    email: String(formData.get("email") ?? ""),
    intent,
    ico: String(formData.get("ico") ?? "") || undefined,
    companyName: String(formData.get("companyName") ?? "") || undefined,
    name: String(formData.get("name") ?? "") || undefined,
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Zkontrolujte údaje." };
  }

  const result = await requestMagicLink({
    email: parsed.data.email,
    intent: parsed.data.intent,
    ico: String(formData.get("ico") ?? "") || undefined,
    companyName: parsed.data.companyName,
    name: parsed.data.name,
    city: String(formData.get("city") ?? "") || undefined,
  });

  if (!result.ok) return result;
  return {
    ok: true,
    message:
      intent === "register"
        ? "Když je IČO v pořádku, poslali jsme odkaz na e-mail. V dev režimu ho najdete v konzoli serveru."
        : "Když u nás e-mail evidujeme, odkaz je na cestě. V dev režimu ho vypíšeme do konzole.",
  };
}

export async function logoutAction() {
  await destroySession();
  redirect("/firma/prihlaseni");
}
