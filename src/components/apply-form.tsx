"use client";

import { useActionState, useState } from "react";
import { applyToJob, type ActionState } from "@/lib/actions/apply";
import { presignCvAction } from "@/lib/actions/cv";
import { copy } from "@/lib/copy";
import { Button, Field, inputClass } from "./ui";

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
      <div className="border border-line bg-paper-2 p-4 text-sm">
        <p className="font-semibold">{copy.detail.successTitle}</p>
        <p className="mt-1">{copy.detail.successBody}</p>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-4 border border-line bg-paper p-4">
      <input type="hidden" name="jobId" value={jobId} />
      <input type="hidden" name="cvObjectKey" />
      <input type="hidden" name="cvFileName" />
      <input type="hidden" name="cvContentType" />
      <p className="label">{copy.detail.applyClaim}</p>
      <p className="text-sm text-steel">{copy.detail.applyHelper(companyName ?? "firmy")}</p>
      <Field label={copy.detail.labelName} name="fullName">
        <input id="fullName" name="fullName" required className={inputClass} autoComplete="name" />
      </Field>
      <Field label={copy.detail.labelPhone} name="phone">
        <input id="phone" name="phone" required className={inputClass} autoComplete="tel" inputMode="tel" />
      </Field>
      <Field label={copy.detail.labelEmail} name="email">
        <input id="email" name="email" type="email" className={inputClass} autoComplete="email" />
      </Field>
      <Field label={copy.detail.labelCv} name="cv">
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
      <Field label={copy.detail.labelNote} name="message">
        <textarea id="message" name="message" rows={4} className={inputClass} />
      </Field>
      <label className="flex items-start gap-2 text-sm">
        <input type="checkbox" name="consentGdpr" className="mt-1" required />
        <span>
          Souhlasím se zpracováním osobních údajů za účelem této odpovědi. Podrobnosti na stránce{" "}
          <a href="/gdpr" className="underline">
            {copy.nav.personalData}
          </a>
          .
        </span>
      </label>
      <div className="hidden" aria-hidden>
        <input name="website" tabIndex={-1} autoComplete="off" />
      </div>
      {state && !state.ok ? <p className="text-sm text-danger">{state.error}</p> : null}
      <Button type="submit" disabled={pending}>
        {pending ? "Odesílám…" : copy.detail.ctaSubmit}
      </Button>
    </form>
  );
}
