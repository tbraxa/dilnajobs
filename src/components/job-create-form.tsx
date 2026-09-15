"use client";

import { useActionState } from "react";
import { createJobAction, type JobFormState } from "@/lib/actions/jobs";
import { CITIES, CATEGORIES, EMPLOYMENT_TYPES, WORK_MODES } from "@/lib/catalog";
import { copy } from "@/lib/copy";
import { Button, Field, inputClass } from "./ui";

export function JobCreateForm() {
  const [state, action, pending] = useActionState(createJobAction, null as JobFormState);
  return (
    <form action={action} className="space-y-4">
      <Field label="Název pozice" name="title">
        <input id="title" name="title" required className={inputClass} placeholder="Účetní, řidič, vývojář" />
      </Field>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Profese" name="profession">
          <select id="profession" name="profession" required className={inputClass}>
            {CATEGORIES.map((p) => (
              <option key={p.db} value={p.db}>
                {p.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label={copy.card.labelContract} name="employmentType">
          <select id="employmentType" name="employmentType" required className={inputClass}>
            {EMPLOYMENT_TYPES.map((t) => (
              <option key={t.slug} value={t.slug}>
                {t.label}
              </option>
            ))}
          </select>
        </Field>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label={copy.card.labelPlace} name="city">
          <input id="city" name="city" required className={inputClass} list="city-list" />
          <datalist id="city-list">
            {CITIES.map((c) => (
              <option key={c.slug} value={c.label} />
            ))}
          </datalist>
        </Field>
        <Field label="Kraj" name="region">
          <input id="region" name="region" required className={inputClass} placeholder="Jihomoravský" />
        </Field>
      </div>
      <Field label="Režim práce" name="workMode">
        <select id="workMode" name="workMode" required className={inputClass} defaultValue="onsite">
          {WORK_MODES.map((m) => (
            <option key={m.slug} value={m.slug}>
              {m.label}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Směny (volitelně)" name="shiftNote">
        <input id="shiftNote" name="shiftNote" className={inputClass} placeholder="dvousměnný provoz" />
      </Field>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label={copy.nabidky.filtersSalary} name="salaryMin">
          <input id="salaryMin" name="salaryMin" type="number" min={1} className={inputClass} />
        </Field>
        <Field label="Mzda do (Kč / měsíc)" name="salaryMax">
          <input id="salaryMax" name="salaryMax" type="number" min={1} className={inputClass} />
        </Field>
      </div>
      <Field label="Poznámka ke mzdě" name="salaryNote">
        <input
          id="salaryNote"
          name="salaryNote"
          className={inputClass}
          placeholder={copy.card.salaryNegotiable}
        />
      </Field>
      <Field label="Popis práce" name="description">
        <textarea id="description" name="description" required rows={7} className={inputClass} />
      </Field>
      <Field label={copy.detail.sectionRequirements} name="requirements">
        <textarea id="requirements" name="requirements" rows={4} className={inputClass} />
      </Field>
      <Field label={copy.detail.sectionOffer} name="benefits">
        <textarea id="benefits" name="benefits" rows={3} className={inputClass} />
      </Field>
      <p className="text-xs text-steel">
        První inzerát jde ke kontrole. Na nástěnce se objeví až po schválení. Agentury neregistrujeme.
      </p>
      {state?.ok === false ? <p className="text-sm text-danger">{state.error}</p> : null}
      <Button type="submit" disabled={pending}>
        {pending ? "Ukládám…" : "Odeslat ke kontrole"}
      </Button>
    </form>
  );
}
