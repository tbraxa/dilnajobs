"use client";

import { useActionState } from "react";
import { updateSeekerProfileAction } from "@/lib/actions/seeker";
import { Button, Field, inputClass } from "@/components/ui";

type State = Awaited<ReturnType<typeof updateSeekerProfileAction>> | null;

export function SeekerProfileForm({
  profile,
}: {
  profile: {
    name: string;
    email: string;
    phone: string | null;
    city: string | null;
    desiredRole: string | null;
    bio: string | null;
  };
}) {
  const [state, action, pending] = useActionState(
    async (_previous: State, formData: FormData) => updateSeekerProfileAction(formData),
    null as State,
  );

  return (
    <form action={action} className="mt-5 space-y-4">
      <Field label="Jméno a příjmení" name="name">
        <input
          id="name"
          name="name"
          required
          defaultValue={profile.name}
          autoComplete="name"
          className={inputClass}
        />
      </Field>
      <Field label="Přihlašovací e-mail" name="accountEmail" hint="E-mail teď nelze změnit.">
        <input
          id="accountEmail"
          value={profile.email}
          disabled
          className={`${inputClass} opacity-70`}
        />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Telefon" name="phone">
          <input
            id="phone"
            name="phone"
            defaultValue={profile.phone ?? ""}
            autoComplete="tel"
            inputMode="tel"
            className={inputClass}
          />
        </Field>
        <Field label="Město nebo kraj" name="city">
          <input
            id="city"
            name="city"
            defaultValue={profile.city ?? ""}
            autoComplete="address-level2"
            className={inputClass}
          />
        </Field>
      </div>
      <Field label="Jakou práci hledáte" name="desiredRole">
        <input
          id="desiredRole"
          name="desiredRole"
          defaultValue={profile.desiredRole ?? ""}
          className={inputClass}
        />
      </Field>
      <Field label="Krátce o vás" name="bio">
        <textarea
          id="bio"
          name="bio"
          rows={5}
          defaultValue={profile.bio ?? ""}
          className={inputClass}
        />
      </Field>
      {state?.ok ? <p className="text-sm text-ok" role="status">Profil je uložený.</p> : null}
      {state && !state.ok ? <p className="text-sm text-danger" role="alert">{state.error}</p> : null}
      <Button type="submit" disabled={pending}>
        {pending ? "Ukládám…" : "Uložit profil"}
      </Button>
    </form>
  );
}
