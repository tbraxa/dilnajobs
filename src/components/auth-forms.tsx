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
      <Field label={copy.login.labelEmail} name="email">
        <input
          id="email"
          name="email"
          type="email"
          required
          className={inputClass}
          autoComplete="email"
          placeholder={copy.login.placeholderEmail}
        />
      </Field>
      {state?.ok ? <p className="text-sm text-ok">{state.message}</p> : null}
      {state && !state.ok ? <p className="text-sm text-danger">{state.error}</p> : null}
      <Button type="submit" disabled={pending}>
        {pending ? "Posílám odkaz…" : copy.login.ctaPrimary}
      </Button>
    </form>
  );
}

export function RegisterForm() {
  const [state, action, pending] = useActionState(requestLinkAction, null as AuthState | null);
  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="intent" value="register" />
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label={copy.register.labelFirstName} name="firstName">
          <input id="firstName" name="firstName" required className={inputClass} autoComplete="given-name" />
        </Field>
        <Field label={copy.register.labelLastName} name="lastName">
          <input id="lastName" name="lastName" required className={inputClass} autoComplete="family-name" />
        </Field>
      </div>
      <Field label={copy.register.labelCompany} name="companyName">
        <input
          id="companyName"
          name="companyName"
          required
          className={inputClass}
          placeholder={copy.register.placeholderCompany}
        />
      </Field>
      <Field label={copy.register.labelIco} name="ico" hint={copy.register.helperAres}>
        <input
          id="ico"
          name="ico"
          required
          inputMode="numeric"
          className={inputClass}
          placeholder={copy.register.placeholderIco}
        />
      </Field>
      <Field label={copy.register.labelDic} name="dic">
        <input id="dic" name="dic" className={inputClass} />
      </Field>
      <Field label={copy.register.labelCity} name="city">
        <input
          id="city"
          name="city"
          className={inputClass}
          placeholder={copy.register.placeholderCity}
        />
      </Field>
      <Field label={copy.register.labelEmail} name="email">
        <input
          id="reg-email"
          name="email"
          type="email"
          required
          className={inputClass}
          autoComplete="email"
          placeholder={copy.register.placeholderEmail}
        />
      </Field>
      {state?.ok ? <p className="text-sm text-ok">{state.message}</p> : null}
      {state && !state.ok ? <p className="text-sm text-danger">{state.error}</p> : null}
      <Button type="submit" disabled={pending}>
        {pending ? "Zakládám…" : copy.register.ctaPrimary}
      </Button>
    </form>
  );
}
