"use client";

import Link from "next/link";
import { useActionState } from "react";
import {
  requestSeekerLinkAction,
  type SeekerAuthState,
} from "@/lib/actions/seeker-auth";
import { Button, Field, inputClass } from "@/components/ui";

export function SeekerLoginForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState(
    requestSeekerLinkAction,
    null as SeekerAuthState | null,
  );
  return (
    <form action={action} className="mt-6 space-y-4">
      <input type="hidden" name="intent" value="login" />
      <input type="hidden" name="next" value={next} />
      <Field label="E-mail" name="email" hint="Pošleme jednorázový odkaz platný 15 minut.">
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="vy@priklad.cz"
          className={inputClass}
        />
      </Field>
      {state?.ok ? <p className="text-sm text-ok" role="status">{state.message}</p> : null}
      {state && !state.ok ? <p className="text-sm text-danger" role="alert">{state.error}</p> : null}
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Odesílám…" : "Poslat přihlašovací odkaz"}
      </Button>
      <p className="text-sm text-steel">
        Ještě účet nemáte?{" "}
        <Link className="text-ink underline" href={`/ucet/registrace?next=${encodeURIComponent(next)}`}>
          Zaregistrovat se
        </Link>
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
    <form action={action} className="mt-6 space-y-4">
      <input type="hidden" name="intent" value="register" />
      <input type="hidden" name="next" value={next} />
      <Field label="Jméno a příjmení" name="name">
        <input
          id="name"
          name="name"
          required
          autoComplete="name"
          placeholder="Jana Nováková"
          className={inputClass}
        />
      </Field>
      <Field label="E-mail" name="email">
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="jana@priklad.cz"
          className={inputClass}
        />
      </Field>
      <label className="flex items-start gap-2 text-sm">
        <input type="checkbox" name="consentGdpr" required className="mt-1" />
        <span>
          Souhlasím se zpracováním údajů pro vedení účtu. Více v{" "}
          <Link className="underline" href="/gdpr">zásadách ochrany údajů</Link>.
        </span>
      </label>
      {state?.ok ? <p className="text-sm text-ok" role="status">{state.message}</p> : null}
      {state && !state.ok ? <p className="text-sm text-danger" role="alert">{state.error}</p> : null}
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Zakládám účet…" : "Založit účet"}
      </Button>
      <p className="text-sm text-steel">
        Už účet máte?{" "}
        <Link className="text-ink underline" href={`/ucet/prihlaseni?next=${encodeURIComponent(next)}`}>
          Přihlásit se
        </Link>
      </p>
    </form>
  );
}
