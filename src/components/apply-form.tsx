"use client";

import { useActionState, useState } from "react";
import { applyToJob, type ActionState } from "@/lib/actions/apply";
import { presignCvAction } from "@/lib/actions/cv";
import { copy } from "@/lib/copy";
import { Button, Field } from "./ui";

const initial: ActionState | null = null;

export function ApplyForm({
  jobId,
  companyName,
  helper,
}: {
  jobId: string;
  companyName?: string;
  helper?: string;
}) {
  const [state, action, pending] = useActionState(async (_prev: ActionState | null, formData: FormData) => {
    return applyToJob(formData);
  }, initial);
  const [cvError, setCvError] = useState<string | null>(null);
  const [cvName, setCvName] = useState<string | null>(null);
  const company = companyName ?? "firmy";

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
      <div>
        <h3 className="h3">{copy.detail.successTitle}</h3>
        <p className="hint" style={{ margin: 0 }}>
          {copy.detail.successBody}
        </p>
      </div>
    );
  }

  return (
    <form action={action}>
      <input type="hidden" name="jobId" value={jobId} />
      <input type="hidden" name="cvObjectKey" />
      <input type="hidden" name="cvFileName" />
      <input type="hidden" name="cvContentType" />
      <p className="hint">{helper ?? copy.detail.applyHelper(company)}</p>
      <Field label={copy.detail.labelName} name="fullName" required>
        <input id="fullName" name="fullName" required autoComplete="name" />
      </Field>
      <Field label={copy.detail.labelPhone} name="phone" required>
        <input id="phone" name="phone" required autoComplete="tel" inputMode="tel" placeholder="+420" />
      </Field>
      <Field label={copy.detail.labelEmail} name="email">
        <input id="email" name="email" type="email" autoComplete="email" />
      </Field>
      <Field label={copy.detail.labelCv} name="cv">
        <input
          id="cv"
          name="cv"
          type="file"
          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          onChange={(e) => onFile(e.target.files?.[0], e.currentTarget.form!)}
        />
        {cvName ? <p className="hint">Nahráno: {cvName}</p> : null}
        {cvError ? <p className="form-error">{cvError}</p> : null}
      </Field>
      <Field label={copy.detail.labelNote} name="message">
        <textarea id="message" name="message" maxLength={500} placeholder="Krátce, proč máte o pozici zájem" />
      </Field>
      <label className="consent">
        <input type="checkbox" name="consentGdpr" required />
        <span>{copy.detail.consentGdpr}</span>
      </label>
      <div className="hidden" aria-hidden>
        <input name="website" tabIndex={-1} autoComplete="off" />
      </div>
      {state && !state.ok ? <p className="form-error">{state.error}</p> : null}
      <Button className="btn-block" type="submit" disabled={pending}>
        {pending ? "Odesílám" : copy.detail.ctaSubmit}
      </Button>
    </form>
  );
}
