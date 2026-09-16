"use client";

import Link from "next/link";
import { useActionState } from "react";
import { requestLinkAction, type AuthState } from "@/lib/actions/auth";

export function EmployerLoginForm() {
  const [state, action, pending] = useActionState(requestLinkAction, null as AuthState | null);

  return (
    <form action={action} className="fj-auth-form">
      <input type="hidden" name="intent" value="login" />
      <label className="fj-form-field">
        <span>Firemní e-mail</span>
        <input name="email" type="email" required autoComplete="email" placeholder="vy@firma.cz" />
      </label>
      <p className="fj-field-help">Pošleme vám jednorázový odkaz platný 15 minut.</p>
      {state?.ok ? <p className="fj-form-success">{state.message}</p> : null}
      {state && !state.ok ? <p className="fj-form-error">{state.error}</p> : null}
      <button type="submit" className="fj-primary-button fj-primary-button-blue fj-auth-submit" disabled={pending}>
        {pending ? "Odesílám..." : "Poslat přihlašovací odkaz"}
        <span aria-hidden="true">→</span>
      </button>
      <p className="fj-auth-switch">
        Ještě nemáte firemní účet? <Link href="/firma/registrace">Zaregistrovat firmu</Link>
      </p>
    </form>
  );
}

export function EmployerRegisterForm() {
  const [state, action, pending] = useActionState(requestLinkAction, null as AuthState | null);

  return (
    <form action={action} className="fj-auth-form fj-register-form">
      <input type="hidden" name="intent" value="register" />

      <div className="fj-form-two-columns">
        <label className="fj-form-field">
          <span>Vaše jméno</span>
          <input name="name" required autoComplete="name" placeholder="Jana Nováková" />
        </label>
        <label className="fj-form-field">
          <span>Firemní e-mail</span>
          <input name="email" type="email" required autoComplete="email" placeholder="jana@firma.cz" />
        </label>
      </div>

      <label className="fj-form-field">
        <span>Název firmy</span>
        <input name="companyName" required autoComplete="organization" placeholder="Název společnosti s.r.o." />
      </label>

      <div className="fj-form-two-columns">
        <label className="fj-form-field">
          <span>IČO</span>
          <input name="ico" required inputMode="numeric" placeholder="12345678" />
        </label>
        <label className="fj-form-field">
          <span>Město</span>
          <input name="city" autoComplete="address-level2" placeholder="Praha" />
        </label>
      </div>
      <p className="fj-field-help">IČO ověříme ve veřejném registru. Agentury práce neregistrujeme.</p>

      <label className="fj-consent-field">
        <input type="checkbox" name="consentGdpr" required />
        <span>
          Souhlasím se zpracováním údajů pro založení firemního účtu. Více v{" "}
          <Link href="/gdpr">zásadách ochrany údajů</Link>.
        </span>
      </label>

      {state?.ok ? <p className="fj-form-success">{state.message}</p> : null}
      {state && !state.ok ? <p className="fj-form-error">{state.error}</p> : null}

      <button type="submit" className="fj-primary-button fj-primary-button-blue fj-auth-submit" disabled={pending}>
        {pending ? "Zakládám účet..." : "Založit firemní účet"}
        <span aria-hidden="true">→</span>
      </button>
      <p className="fj-auth-switch">
        Už účet máte? <Link href="/firma/prihlaseni">Přihlásit se</Link>
      </p>
    </form>
  );
}
