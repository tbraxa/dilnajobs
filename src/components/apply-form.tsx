"use client";

import { useActionState, useState } from "react";
import { applyToJob, type ActionState } from "@/lib/actions/apply";
import { presignCvAction } from "@/lib/actions/cv";
import { Button, Field, inputClass } from "./ui";

const initial: ActionState | null = null;

export function ApplyForm({ jobId }: { jobId: string }) {
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
      <p className="border border-line bg-paper-2 p-4 text-sm">
        Přihláška je u firmy. Ozvou se vám na telefon.
      </p>
    );
  }

  return (
    <form action={action} className="space-y-4 border border-line bg-paper p-4">
      <input type="hidden" name="jobId" value={jobId} />
      <input type="hidden" name="cvObjectKey" />
      <input type="hidden" name="cvFileName" />
      <input type="hidden" name="cvContentType" />
      <p className="label">Přihláška — účet nepotřebujete</p>
      <Field label="Jméno a příjmení" name="fullName">
        <input id="fullName" name="fullName" required className={inputClass} autoComplete="name" />
      </Field>
      <Field label="Telefon" name="phone" hint="Devět číslic, klidně s +420.">
        <input id="phone" name="phone" required className={inputClass} autoComplete="tel" inputMode="tel" />
      </Field>
      <Field label="E-mail (volitelně)" name="email">
        <input id="email" name="email" type="email" className={inputClass} autoComplete="email" />
      </Field>
      <Field label="Životopis PDF / DOC (volitelně)" name="cv">
        <input
          id="cv"
          name="cv"
          type="file"
          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          className={inputClass}
          onChange={(e) => onFile(e.target.files?.[0], e.currentTarget.form!)}
        />
        {cvName ? <span className="text-xs text-steel">Nahráno: {cvName}</span> : null}
        {cvError ? <span className="text-xs text-danger">{cvError}</span> : null}
      </Field>
      <Field label="Zpráva mistrům (volitelně)" name="message">
        <textarea id="message" name="message" rows={4} className={inputClass} />
      </Field>
      <label className="flex items-start gap-2 text-sm">
        <input type="checkbox" name="consentGdpr" className="mt-1" required />
        <span>
          Souhlasím se zpracováním osobních údajů za účelem této přihlášky. Podrobnosti na stránce{" "}
          <a href="/gdpr" className="underline">
            Osobní údaje
          </a>
          .
        </span>
      </label>
      <div className="hidden" aria-hidden>
        <input name="website" tabIndex={-1} autoComplete="off" />
      </div>
      {state && !state.ok ? <p className="text-sm text-danger">{state.error}</p> : null}
      <Button type="submit" disabled={pending}>
        {pending ? "Odesílám…" : "Odeslat přihlášku"}
      </Button>
    </form>
  );
}
