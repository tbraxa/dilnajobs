"use client";

import { useActionState } from "react";
import { createJobAction, type JobFormState } from "@/lib/actions/jobs";
import { CITIES, EMPLOYMENT_TYPES, PROFESSIONS, WORK_MODES } from "@/lib/catalog";

export function JobCreateForm() {
  const [state, action, pending] = useActionState(createJobAction, null as JobFormState);

  return (
    <form action={action} className="fj-console-job-form">
      <section className="fj-console-form-section">
        <header><span>1</span><div><h2>Základ nabídky</h2><p>Pojmenujte jednu konkrétní roli a její režim.</p></div></header>
        <div className="fj-console-form-grid">
          <label className="wide"><span>Název pozice</span><input name="title" required placeholder="Vedoucí zákaznické péče" /></label>
          <label>
            <span>Profese</span>
            <select name="profession" required defaultValue="other">
              {PROFESSIONS.map((profession) => <option key={profession.db} value={profession.db}>{profession.label}</option>)}
              <option value="other">Jiná profese</option>
            </select>
          </label>
          <label>
            <span>Typ úvazku</span>
            <select name="employmentType" required defaultValue="full_time">
              {EMPLOYMENT_TYPES.map((type) => <option key={type.slug} value={type.slug}>{type.label}</option>)}
            </select>
          </label>
          <fieldset className="wide">
            <legend>Režim práce</legend>
            <div className="fj-console-choice-row">
              {WORK_MODES.map((mode) => (
                <label key={mode.value}>
                  <input type="radio" name="workMode" value={mode.value} defaultChecked={mode.value === "onsite"} />
                  <span>{mode.label}</span>
                </label>
              ))}
            </div>
          </fieldset>
        </div>
      </section>

      <section className="fj-console-form-section">
        <header><span>2</span><div><h2>Místo a mzda</h2><p>Nejdůležitější údaje pro rozhodnutí uchazeče.</p></div></header>
        <div className="fj-console-form-grid">
          <label><span>Město</span><input name="city" required list="console-city-list" placeholder="Praha" /></label>
          <datalist id="console-city-list">{CITIES.map((city) => <option key={city.slug} value={city.label} />)}</datalist>
          <label><span>Kraj</span><input name="region" required placeholder="Hlavní město Praha" /></label>
          <label><span>Mzda od, Kč za měsíc</span><input name="salaryMin" type="number" min={1} placeholder="45 000" /></label>
          <label><span>Mzda do, Kč za měsíc</span><input name="salaryMax" type="number" min={1} placeholder="58 000" /></label>
          <label className="wide"><span>Směny nebo časový režim, volitelné</span><input name="shiftNote" placeholder="Pružná pracovní doba" /></label>
          <label className="wide"><span>Poznámka ke mzdě, volitelné</span><input name="salaryNote" placeholder="Bonus podle výsledků týmu" /></label>
        </div>
      </section>

      <section className="fj-console-form-section">
        <header><span>3</span><div><h2>Obsah pozice</h2><p>Konkrétní práce, požadavky a to, co firma nabízí.</p></div></header>
        <div className="fj-console-form-grid">
          <label className="wide"><span>Co bude člověk dělat</span><textarea name="description" required rows={7} placeholder="Popište běžný pracovní den a hlavní odpovědnost." /></label>
          <label className="wide"><span>Co má umět</span><textarea name="requirements" rows={5} placeholder="Oddělte nutné zkušenosti od toho, co lze doučit." /></label>
          <label className="wide"><span>Co nabízíte</span><textarea name="benefits" rows={4} placeholder="Dovolená, flexibilita, vybavení nebo další konkrétní podmínky." /></label>
        </div>
      </section>

      {state?.ok === false ? <p className="fj-console-form-error">{state.error}</p> : null}

      <footer className="fj-console-form-submit">
        <div><strong>Před odesláním</strong><span>První nabídku zkontrolujeme. Na webu se objeví po schválení.</span></div>
        <button type="submit" className="fj-console-button primary" disabled={pending}>
          {pending ? "Ukládám..." : "Odeslat ke kontrole"}
        </button>
      </footer>
    </form>
  );
}
