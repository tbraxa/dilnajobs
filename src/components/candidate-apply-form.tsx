"use client";

import { useActionState, useState } from "react";
import { applyToJob, type ActionState } from "@/lib/actions/apply";
import { presignCvAction } from "@/lib/actions/cv";

const initial: ActionState | null = null;

export function CandidateApplyForm({
  jobId,
  defaults,
}: {
  jobId: string;
  defaults?: { fullName: string; email: string; phone: string };
}) {
  const [state, action, pending] = useActionState(
    async (_previous: ActionState | null, formData: FormData) => applyToJob(formData),
    initial,
  );
  const [cvError, setCvError] = useState<string | null>(null);
  const [cvName, setCvName] = useState<string | null>(null);

  async function uploadCv(file: File | undefined, form: HTMLFormElement) {
    setCvError(null);
    if (!file) {
      setCvName(null);
      (form.elements.namedItem("cvObjectKey") as HTMLInputElement).value = "";
      (form.elements.namedItem("cvUploadProof") as HTMLInputElement).value = "";
      (form.elements.namedItem("cvFileName") as HTMLInputElement).value = "";
      (form.elements.namedItem("cvContentType") as HTMLInputElement).value = "";
      return;
    }

    const signed = await presignCvAction(file.type);
    if (!signed.ok) {
      setCvError(signed.error);
      return;
    }
    if (file.size > signed.maxBytes) {
      setCvError("Soubor je větší než 5 MB.");
      return;
    }

    const response = await fetch(signed.url, {
      method: signed.method,
      headers: signed.headers,
      body: file,
    });
    if (!response.ok) {
      setCvError("Životopis se nepodařilo nahrát.");
      return;
    }

    (form.elements.namedItem("cvObjectKey") as HTMLInputElement).value = signed.objectKey;
    (form.elements.namedItem("cvUploadProof") as HTMLInputElement).value = signed.uploadProof;
    (form.elements.namedItem("cvFileName") as HTMLInputElement).value = file.name;
    (form.elements.namedItem("cvContentType") as HTMLInputElement).value = file.type;
    setCvName(file.name);
  }

  if (state?.ok) {
    return (
      <div className="fj-apply-success" id="odpovedet">
        <span aria-hidden="true">✓</span>
        <div>
          <h2>Odpověď je u firmy</h2>
          <p>Zaměstnavatel se vám ozve na uvedený telefon nebo e-mail.</p>
        </div>
      </div>
    );
  }

  return (
    <form action={action} className="fj-apply-form" id="odpovedet">
      <input type="hidden" name="jobId" value={jobId} />
      <input type="hidden" name="cvObjectKey" />
      <input type="hidden" name="cvUploadProof" />
      <input type="hidden" name="cvFileName" />
      <input type="hidden" name="cvContentType" />

      <div className="fj-apply-form-head">
        <p className="fj-eyebrow">Rychlá odpověď</p>
        <h2 className="fj-display">Máte zájem?</h2>
        <p>
          {defaults
            ? "Kontakt jsme předvyplnili z profilu. Před odesláním ho můžete upravit."
            : "Účet nepotřebujete. Stačí kontakt a pár slov o vás."}
        </p>
      </div>

      <div className="fj-form-two-columns">
        <label className="fj-form-field">
          <span>Jméno a příjmení</span>
          <input
            name="fullName"
            required
            autoComplete="name"
            placeholder="Jan Novák"
            defaultValue={defaults?.fullName}
          />
        </label>
        <label className="fj-form-field">
          <span>Telefon</span>
          <input
            name="phone"
            required
            autoComplete="tel"
            inputMode="tel"
            placeholder="+420 777 000 000"
            defaultValue={defaults?.phone}
          />
        </label>
      </div>

      <label className="fj-form-field">
        <span>E-mail <small>volitelné</small></span>
        <input
          name="email"
          type="email"
          autoComplete="email"
          placeholder="jan@priklad.cz"
          defaultValue={defaults?.email}
        />
      </label>

      <label className="fj-form-field">
        <span>Krátká zpráva <small>volitelné</small></span>
        <textarea name="message" rows={4} placeholder="Napište, kdy můžete nastoupit nebo co už umíte." />
      </label>

      <label className="fj-file-field">
        <input
          name="cv"
          type="file"
          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          onChange={(event) => uploadCv(event.target.files?.[0], event.currentTarget.form!)}
        />
        <span className="fj-file-icon" aria-hidden="true">↥</span>
        <span>
          <strong>{cvName ?? "Přidat životopis"}</strong>
          <small>PDF nebo DOC, nejvýše 5 MB</small>
        </span>
      </label>
      {cvError ? <p className="fj-form-error">{cvError}</p> : null}

      <label className="fj-consent-field">
        <input type="checkbox" name="consentGdpr" required />
        <span>
          Souhlasím se zpracováním údajů pro tuto odpověď. Více v{" "}
          <a href="/gdpr">zásadách ochrany údajů</a>.
        </span>
      </label>

      <div className="hidden" aria-hidden="true">
        <input name="website" tabIndex={-1} autoComplete="off" />
      </div>

      {state && !state.ok ? <p className="fj-form-error">{state.error}</p> : null}

      <button type="submit" className="fj-primary-button fj-primary-button-blue fj-apply-submit" disabled={pending}>
        {pending ? "Odesílám..." : "Odeslat odpověď"}
        <span aria-hidden="true">→</span>
      </button>
      <p className="fj-apply-privacy">Vaše údaje dostane pouze tato firma.</p>
    </form>
  );
}
