"use client";

import { useActionState } from "react";
import { requestLinkAction, type AuthState } from "@/lib/actions/auth";
import { Button, Field, inputClass } from "./ui";

export function LoginForm() {
  const [state, action, pending] = useActionState(requestLinkAction, null as AuthState | null);
  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="intent" value="login" />
      <Field label="Firemní e-mail" name="email">
        <input id="email" name="email" type="email" required className={inputClass} autoComplete="email" />
      </Field>
      {state?.ok ? <p className="text-sm text-ok">{state.message}</p> : null}
      {state && !state.ok ? <p className="text-sm text-danger">{state.error}</p> : null}
      <Button type="submit" disabled={pending}>
        {pending ? "Posílám odkaz…" : "Poslat přihlašovací odkaz"}
      </Button>
    </form>
  );
}

export function RegisterForm() {
  const [state, action, pending] = useActionState(requestLinkAction, null as AuthState | null);
  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="intent" value="register" />
      <Field label="Vaše jméno" name="name">
        <input id="name" name="name" required className={inputClass} autoComplete="name" />
      </Field>
      <Field label="Název firmy" name="companyName">
        <input id="companyName" name="companyName" required className={inputClass} />
      </Field>
      <Field label="IČO" name="ico" hint="Osm číslic. Agentury neregistrujeme.">
        <input id="ico" name="ico" required inputMode="numeric" className={inputClass} />
      </Field>
      <Field label="Sídlo / provoz (město)" name="city">
        <input id="city" name="city" className={inputClass} />
      </Field>
      <Field label="Firemní e-mail" name="reg-email">
        <input id="reg-email" name="email" type="email" required className={inputClass} autoComplete="email" />
      </Field>
      {state?.ok ? <p className="text-sm text-ok">{state.message}</p> : null}
      {state && !state.ok ? <p className="text-sm text-danger">{state.error}</p> : null}
      <Button type="submit" disabled={pending}>
        {pending ? "Zakládám…" : "Založit účet a poslat odkaz"}
      </Button>
    </form>
  );
}
