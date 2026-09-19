"use client";

import { useActionState } from "react";
import { requestLinkAction, type AuthState } from "@/lib/actions/auth";
import { copy } from "@/lib/copy";
import { Button, Field, inputClass } from "./ui";

export function LoginForm() {
  const [state, action, pending] = useActionState(requestLinkAction, null as AuthState | null);
  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="intent" value="login" />
      <Field label={copy.authFirma.loginLabelEmail} name="email">
        <input
          id="email"
          name="email"
          type="email"
          required
          className={inputClass}
          autoComplete="email"
          placeholder={copy.authFirma.loginPlaceholder}
        />
      </Field>
      {state?.ok ? <p className="text-sm text-ok">{state.message}</p> : null}
      {state && !state.ok ? <p className="text-sm text-danger">{state.error}</p> : null}
      <Button type="submit" disabled={pending}>
        {pending ? "Posílám odkaz…" : copy.authFirma.loginCta}
      </Button>
    </form>
  );
}

export function RegisterForm() {
  const [state, action, pending] = useActionState(requestLinkAction, null as AuthState | null);
  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="intent" value="register" />
      <Field label={copy.authFirma.regLabelName} name="name">
        <input id="name" name="name" required className={inputClass} autoComplete="name" />
      </Field>
      <Field label="Příjmení" name="lastName">
        <input id="lastName" name="lastName" required className={inputClass} autoComplete="family-name" />
      </Field>
      <Field label={copy.authFirma.regLabelCompany} name="companyName">
        <input id="companyName" name="companyName" required className={inputClass} />
      </Field>
      <Field label={copy.authFirma.regLabelIco} name="ico" hint={copy.authFirma.regHelperAres}>
        <input id="ico" name="ico" required inputMode="numeric" className={inputClass} placeholder="12345678" />
      </Field>
      <Field label={copy.authFirma.regLabelCity} name="city">
        <input id="city" name="city" className={inputClass} />
      </Field>
      <Field label={copy.authFirma.regLabelEmail} name="email">
        <input id="reg-email" name="email" type="email" required className={inputClass} autoComplete="email" />
      </Field>
      <label className="flex items-start gap-2 text-sm">
        <input type="checkbox" name="consentGdpr" className="mt-1" required />
        <span>
          Souhlasím se zpracováním údajů za účelem založení firemního účtu. Podrobnosti na stránce{" "}
          <a href="/gdpr" className="underline">
            Osobní údaje
          </a>
          .
        </span>
      </label>
      {state?.ok ? <p className="text-sm text-ok">{state.message}</p> : null}
      {state && !state.ok ? <p className="text-sm text-danger">{state.error}</p> : null}
      <Button type="submit" disabled={pending}>
        {pending ? "Zakládám…" : copy.authFirma.regCta}
      </Button>
    </form>
  );
}
