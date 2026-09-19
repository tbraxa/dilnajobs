"use server";

import { redirect } from "next/navigation";
import {
  destroySeekerSession,
  requestSeekerMagicLink,
  safeAccountNext,
} from "@/lib/seeker-auth";
import { seekerMagicLinkSchema } from "@/lib/validation";

export type SeekerAuthState =
  | { ok: true; message: string }
  | { ok: false; error: string };

export async function requestSeekerLinkAction(
  _previous: SeekerAuthState | null,
  formData: FormData,
): Promise<SeekerAuthState> {
  const intent = formData.get("intent") === "register" ? "register" : "login";
  const parsed = seekerMagicLinkSchema.safeParse({
    email: formData.get("email"),
    name: intent === "register" ? formData.get("name") : undefined,
    intent,
    next: formData.get("next"),
  });
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Zkontrolujte údaje.",
    };
  }

  if (intent === "register" && formData.get("consentGdpr") !== "on") {
    return {
      ok: false,
      error: "Bez souhlasu se zpracováním údajů účet nezaložíme.",
    };
  }

  const result = await requestSeekerMagicLink({
    email: parsed.data.email,
    name: parsed.data.name,
    intent,
    next: safeAccountNext(parsed.data.next),
  });
  if (!result.ok) return result;
  return {
    ok: true,
    message:
      intent === "register"
        ? "Účet je připravený. Přihlašovací odkaz najdete v e-mailu."
        : "Pokud účet existuje, přihlašovací odkaz je na cestě.",
  };
}

export async function logoutSeekerAction() {
  await destroySeekerSession();
  redirect("/ucet/prihlaseni");
}
