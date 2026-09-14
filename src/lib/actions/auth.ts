"use server";

import { redirect } from "next/navigation";
import { destroySession, requestMagicLink } from "@/lib/auth";
import { magicLinkSchema, registerEmployerSchema } from "@/lib/validation";

export type AuthState = { ok: true; message: string } | { ok: false; error: string };

const CHECK_EMAIL = "Zkontrolujte e-mail";

export async function requestLinkAction(_prev: AuthState | null, formData: FormData): Promise<AuthState> {
  const intent = formData.get("intent") === "register" ? "register" : "login";

  if (intent === "register") {
    const parsed = registerEmployerSchema.safeParse({
      email: String(formData.get("email") ?? ""),
      firstName: String(formData.get("firstName") ?? ""),
      lastName: String(formData.get("lastName") ?? ""),
      companyName: String(formData.get("companyName") ?? ""),
      ico: String(formData.get("ico") ?? ""),
      vatPayer: formData.get("vatPayer") === "payer" ? "payer" : "nonpayer",
      dic: String(formData.get("dic") ?? "") || undefined,
      city: String(formData.get("city") ?? "") || undefined,
      phone: String(formData.get("phone") ?? ""),
      consentTerms: formData.get("consentTerms"),
    });
    if (!parsed.success) {
      return { ok: false, error: parsed.error.issues[0]?.message ?? "Zkontrolujte údaje." };
    }

    const result = await requestMagicLink({
      email: parsed.data.email,
      intent: "register",
      ico: parsed.data.ico,
      companyName: parsed.data.companyName,
      name: parsed.data.name,
      firstName: parsed.data.firstName,
      lastName: parsed.data.lastName,
      dic: parsed.data.dic,
      city: parsed.data.city,
      phone: parsed.data.phone,
      vatPayer: parsed.data.vatPayer,
    });
    if (!result.ok) return result;
    return { ok: true, message: CHECK_EMAIL };
  }

  const parsed = magicLinkSchema.safeParse({
    email: String(formData.get("email") ?? ""),
    intent: "login",
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Zkontrolujte údaje." };
  }

  const result = await requestMagicLink({
    email: parsed.data.email,
    intent: "login",
  });
  if (!result.ok) return result;
  return { ok: true, message: CHECK_EMAIL };
}

export async function logoutAction() {
  await destroySession();
  redirect("/firma/prihlaseni");
}
