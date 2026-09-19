"use client";

import { useActionState } from "react";
import { updateSeekerProfileAction } from "@/lib/actions/seeker";

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
    <form action={action} className="fj-seeker-profile-form">
      <div className="fj-seeker-form-grid">
        <label className="fj-form-field">
          <span>Jméno a příjmení</span>
          <input name="name" required defaultValue={profile.name} autoComplete="name" />
        </label>
        <label className="fj-form-field">
          <span>E-mail</span>
          <input value={profile.email} disabled aria-describedby="email-help" />
        </label>
        <p id="email-help" className="fj-seeker-field-note">
          Přihlašovací e-mail teď nelze změnit.
        </p>
        <label className="fj-form-field">
          <span>Telefon</span>
          <input
            name="phone"
            defaultValue={profile.phone ?? ""}
            autoComplete="tel"
            inputMode="tel"
            placeholder="+420 777 000 000"
          />
        </label>
        <label className="fj-form-field">
          <span>Město nebo kraj</span>
          <input
            name="city"
            defaultValue={profile.city ?? ""}
            autoComplete="address-level2"
            placeholder="Brno"
          />
        </label>
        <label className="fj-form-field fj-seeker-field-wide">
          <span>Jakou práci hledáte</span>
          <input
            name="desiredRole"
            defaultValue={profile.desiredRole ?? ""}
            placeholder="Například účetní, technik nebo vedoucí prodejny"
          />
        </label>
        <label className="fj-form-field fj-seeker-field-wide">
          <span>Krátce o vás</span>
          <textarea
            name="bio"
            rows={5}
            defaultValue={profile.bio ?? ""}
            placeholder="Zkušenosti, dostupnost nebo co je pro vás v práci důležité."
          />
        </label>
      </div>
      {state?.ok ? <p className="fj-form-success">Profil je uložený.</p> : null}
      {state && !state.ok ? <p className="fj-form-error">{state.error}</p> : null}
      <footer>
        <span>Údaje se nepřenášejí firmě, dokud neodešlete odpověď.</span>
        <button type="submit" className="fj-primary-button fj-primary-button-blue" disabled={pending}>
          {pending ? "Ukládám..." : "Uložit profil"}
        </button>
      </footer>
    </form>
  );
}
