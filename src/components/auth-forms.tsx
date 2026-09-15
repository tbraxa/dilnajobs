"use client";

import { useActionState } from "react";
import { requestLinkAction, type AuthState } from "@/lib/actions/auth";
import { copy } from "@/lib/copy";
import { Button, Field } from "./ui";

export function LoginForm() {
  const [state, action, pending] = useActionState(requestLinkAction, null as AuthState | null);
  return (
    <form action={action}>
      <input type="hidden" name="intent" value="login" />
      <Field label={copy.login.labelEmail} name="email">
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder={copy.login.placeholderEmail}
        />
      </Field>
      {state?.ok ? <p className="form-ok">{state.message}</p> : null}
      {state && !state.ok ? <p className="form-error">{state.error}</p> : null}
      <Button className="btn-block" type="submit" disabled={pending}>
        {pending ? "Posílám odkaz" : copy.login.ctaPrimary}
      </Button>
    </form>
  );
}

export function RegisterForm() {
  const [state, action, pending] = useActionState(requestLinkAction, null as AuthState | null);
  return (
    <form action={action}>
      <input type="hidden" name="intent" value="register" />
      <div className="form-row-2">
        <Field label={copy.register.labelFirstName} name="firstName">
          <input id="firstName" name="firstName" required autoComplete="given-name" />
        </Field>
        <Field label={copy.register.labelLastName} name="lastName">
          <input id="lastName" name="lastName" required autoComplete="family-name" />
        </Field>
      </div>
      <Field label={copy.register.labelCompany} name="companyName">
        <input id="companyName" name="companyName" required placeholder={copy.register.placeholderCompany} />
      </Field>
      <Field label={copy.register.labelIco} name="ico" hint={copy.register.helperAres}>
        <input id="ico" name="ico" required inputMode="numeric" placeholder={copy.register.placeholderIco} />
      </Field>
      <Field label={copy.register.labelDic} name="dic">
        <input id="dic" name="dic" />
      </Field>
      <Field label={copy.register.labelCity} name="city">
        <input id="city" name="city" placeholder={copy.register.placeholderCity} />
      </Field>
      <Field label={copy.register.labelEmail} name="email">
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder={copy.register.placeholderEmail}
        />
      </Field>
      {state?.ok ? <p className="form-ok">{state.message}</p> : null}
      {state && !state.ok ? <p className="form-error">{state.error}</p> : null}
      <Button className="btn-block" type="submit" disabled={pending}>
        {pending ? "Zakládám" : copy.register.ctaPrimary}
      </Button>
    </form>
  );
}
