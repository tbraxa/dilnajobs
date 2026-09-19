"use client";

import Link from "next/link";
import { useActionState } from "react";
import {
  requestSeekerLinkAction,
  type SeekerAuthState,
} from "@/lib/actions/seeker-auth";

export function SeekerLoginForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState(
    requestSeekerLinkAction,
    null as SeekerAuthState | null,
  );
  return (
    <form action={action} className="fj-auth-form">
      <input type="hidden" name="intent" value="login" />
      <input type="hidden" name="next" value={next} />
      <label className="fj-form-field">
        <span>E-mail</span>
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="vy@priklad.cz"
        />
      </label>
      <p className="fj-field-help">Pošleme vám jednorázový odkaz platný 15 minut.</p>
      {state?.ok ? <p className="fj-form-success">{state.message}</p> : null}
      {state && !state.ok ? <p className="fj-form-error">{state.error}</p> : null}
      <button
        type="submit"
        className="fj-primary-button fj-primary-button-blue fj-auth-submit"
        disabled={pending}
      >
        {pending ? "Odesílám..." : "Poslat přihlašovací odkaz"}
        <span aria-hidden="true">→</span>
      </button>
      <p className="fj-auth-switch">
        Ještě účet nemáte?{" "}
        <Link href={`/ucet/registrace?next=${encodeURIComponent(next)}`}>Zaregistrovat se</Link>
      </p>
    </form>
  );
}

export function SeekerRegisterForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState(
    requestSeekerLinkAction,
    null as SeekerAuthState | null,
  );
  return (
    <form action={action} className="fj-auth-form">
      <input type="hidden" name="intent" value="register" />
      <input type="hidden" name="next" value={next} />
      <label className="fj-form-field">
        <span>Jméno a příjmení</span>
        <input name="name" required autoComplete="name" placeholder="Jana Nováková" />
      </label>
      <label className="fj-form-field">
        <span>E-mail</span>
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="jana@priklad.cz"
        />
      </label>
      <label className="fj-consent-field">
        <input type="checkbox" name="consentGdpr" required />
        <span>
          Souhlasím se zpracováním údajů pro vedení účtu. Více v{" "}
          <Link href="/gdpr">zásadách ochrany údajů</Link>.
        </span>
      </label>
      {state?.ok ? <p className="fj-form-success">{state.message}</p> : null}
      {state && !state.ok ? <p className="fj-form-error">{state.error}</p> : null}
      <button
        type="submit"
        className="fj-primary-button fj-primary-button-blue fj-auth-submit"
        disabled={pending}
      >
        {pending ? "Zakládám účet..." : "Založit účet"}
        <span aria-hidden="true">→</span>
      </button>
      <p className="fj-auth-switch">
        Už účet máte?{" "}
        <Link href={`/ucet/prihlaseni?next=${encodeURIComponent(next)}`}>Přihlásit se</Link>
      </p>
    </form>
  );
}
