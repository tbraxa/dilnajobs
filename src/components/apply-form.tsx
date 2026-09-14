"use client";

import { useActionState, useState } from "react";
import { applyToJob, type ActionState } from "@/lib/actions/apply";
import { presignCvAction } from "@/lib/actions/cv";

const initial: ActionState | null = null;

export function ApplyForm({ jobId, companyName }: { jobId: string; companyName?: string }) {
  const [state, action, pending] = useActionState(async (_prev: ActionState | null, formData: FormData) => {
    return applyToJob(formData);
  }, initial);
  const [cvError, setCvError] = useState<string | null>(null);
  const [cvName, setCvName] = useState<string | null>(null);

  async function onFile(file: File | undefined, form: HTMLFormElement) {
    setCvError(null);
    if (!file) return;
    const signed = await presignCvAction(file.type);
    if (!signed.ok) {
      setCvError(signed.error);
      return;
    }
    if (file.size > signed.maxBytes) {
      setCvError("Soubor je větší než 5 MB.");
      return;
    }
    const res = await fetch(signed.url, {
      method: signed.method,
      headers: signed.headers,
      body: file,
    });
    if (!res.ok) {
      setCvError("Životopis se nepodařilo nahrát.");
      return;
    }
    (form.elements.namedItem("cvObjectKey") as HTMLInputElement).value = signed.objectKey;
    (form.elements.namedItem("cvFileName") as HTMLInputElement).value = file.name;
    (form.elements.namedItem("cvContentType") as HTMLInputElement).value = file.type;
    setCvName(file.name);
  }

  if (state?.ok) {
    return (
      <aside className="apply-panel" aria-label="Odpovědět firmě">
        <h2>Odesláno</h2>
        <p className="form-hint">Přihláška je u firmy. Ozvou se vám na telefon.</p>
      </aside>
    );
  }

  return (
    <aside className="apply-panel" aria-label="Odpovědět firmě">
      <h2>Odpovědět firmě</h2>
      <form action={action}>
        <input type="hidden" name="jobId" value={jobId} />
        <input type="hidden" name="cvObjectKey" />
        <input type="hidden" name="cvFileName" />
        <input type="hidden" name="cvContentType" />
        <div className="form-field">
          <label htmlFor="fullName">Jméno a příjmení</label>
          <input id="fullName" name="fullName" type="text" required autoComplete="name" placeholder="Jan Novák" />
        </div>
        <div className="form-field">
          <label htmlFor="phone">Telefon</label>
          <input id="phone" name="phone" type="tel" required autoComplete="tel" placeholder="+420 …" />
        </div>
        <div className="form-field">
          <label htmlFor="email">
            E-mail <span className="opt">(volitelné)</span>
          </label>
          <input id="email" name="email" type="email" autoComplete="email" placeholder="jan@email.cz" />
        </div>
        <div className="form-field">
          <label htmlFor="message">
            Krátká poznámka <span className="opt">(volitelné)</span>
          </label>
          <textarea id="message" name="message" placeholder="Např. zkušenost s Fanuc, dostupnost směn…" />
        </div>
        <div className="form-field">
          <label htmlFor="cv">
            Životopis <span className="opt">(volitelné)</span>
          </label>
          <input
            id="cv"
            name="cv"
            type="file"
            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={(e) => onFile(e.target.files?.[0], e.currentTarget.form!)}
          />
          {cvName ? <p className="form-hint">Nahráno: {cvName}</p> : null}
          {cvError ? <p className="form-hint" style={{ color: "var(--danger, #8b1e1e)" }}>{cvError}</p> : null}
        </div>
        <label className="form-field" style={{ display: "flex", gap: "0.5rem", alignItems: "flex-start" }}>
          <input type="checkbox" name="consentGdpr" required style={{ marginTop: "0.35rem" }} />
          <span>
            Souhlasím se zpracováním osobních údajů. Podrobnosti na stránce <a href="/gdpr">Osobní údaje</a>.
          </span>
        </label>
        <div className="sr-only" aria-hidden>
          <input name="website" tabIndex={-1} autoComplete="off" />
        </div>
        {state && !state.ok ? <p className="form-hint">{state.error}</p> : null}
        <button type="submit" className="btn btn-accent btn-lg btn-block btn-square" disabled={pending}>
          {pending ? "Odesílám…" : "Odeslat firmě"}
        </button>
        <p className="form-hint">
          Odpověď přijde přímo{companyName ? ` na ${companyName}` : " firmě"}. Bez registrace, bez agentury. DílnaJobs údaje
          neprodává.
        </p>
      </form>
    </aside>
  );
}
