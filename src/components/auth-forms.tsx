"use client";

import { useActionState, useState } from "react";
import { requestLinkAction, type AuthState } from "@/lib/actions/auth";
import { Button, Field, inputClass } from "./ui";

export function LoginForm() {
  const [state, action, pending] = useActionState(requestLinkAction, null as AuthState | null);
  return (
    <form action={action}>
      <input type="hidden" name="intent" value="login" />
      <Field label="Pracovní e-mail" name="email">
        <input
          id="email"
          name="email"
          type="email"
          required
          className={inputClass}
          autoComplete="username"
          inputMode="email"
          placeholder="jmeno@firma.cz"
        />
      </Field>
      {state?.ok ? <p className="auth-flash is-ok">{state.message}</p> : null}
      {state && !state.ok ? <p className="auth-flash is-err">{state.error}</p> : null}
      <Button type="submit" variant="accent" className="btn-block" disabled={pending}>
        {pending ? "Posílám odkaz…" : "Poslat přihlašovací odkaz"}
      </Button>
      <p className="auth-helper">Odkaz platí 15 minut. Heslo nepoužíváme.</p>
    </form>
  );
}

type AresNote = { kind: "ok" | "err"; text: string } | null;
type VatPayer = "nonpayer" | "payer";

export function RegisterForm() {
  const [state, action, pending] = useActionState(requestLinkAction, null as AuthState | null);
  const [ico, setIco] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [dic, setDic] = useState("");
  const [city, setCity] = useState("");
  const [vatPayer, setVatPayer] = useState<VatPayer>("nonpayer");
  const [aresBusy, setAresBusy] = useState(false);
  const [aresNote, setAresNote] = useState<AresNote>(null);
  const [revealed, setRevealed] = useState(false);

  async function loadFromAres() {
    setAresBusy(true);
    setAresNote(null);
    try {
      const res = await fetch(`/api/ares?ico=${encodeURIComponent(ico)}`, { credentials: "same-origin" });
      const body = (await res.json()) as {
        ok?: boolean;
        error?: string;
        companyName?: string;
        city?: string | null;
        address?: string | null;
        dic?: string | null;
      };
      if (!res.ok || !body.ok) {
        setAresNote({ kind: "err", text: body.error ?? "ARES teď neodpověděl. Vyplňte údaje ručně." });
        setRevealed(true);
        return;
      }
      if (body.companyName) setCompanyName(body.companyName);
      const seat = body.address || body.city;
      if (seat) setCity(seat);
      if (body.dic) {
        setDic(body.dic);
        setVatPayer("payer");
      } else {
        setVatPayer("nonpayer");
      }
      setAresNote({ kind: "ok", text: "Údaje z ARES jsme doplnili. Zkontrolujte je." });
      setRevealed(true);
    } catch {
      setAresNote({ kind: "err", text: "ARES teď neodpověděl. Vyplňte údaje ručně." });
      setRevealed(true);
    } finally {
      setAresBusy(false);
    }
  }

  return (
    <form action={action}>
      <input type="hidden" name="intent" value="register" />

      <fieldset className="auth-section">
        <legend>Firma</legend>
        <div className="form-group">
          <label htmlFor="ico">IČO</label>
          <div className="input-with-action">
            <input
              id="ico"
              name="ico"
              required
              inputMode="numeric"
              autoComplete="off"
              maxLength={8}
              placeholder="12345678"
              className={`${inputClass} auth-ico-input`.trim()}
              value={ico}
              onChange={(e) => setIco(e.target.value)}
            />
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => void loadFromAres()}
              disabled={aresBusy}
            >
              {aresBusy ? "Načítám…" : "Načíst z ARES"}
            </button>
          </div>
          {aresNote ? <p className={`ares-note is-${aresNote.kind}`}>{aresNote.text}</p> : null}
          {!revealed ? (
            <button type="button" className="auth-manual" onClick={() => setRevealed(true)}>
              Vyplnit ručně
            </button>
          ) : null}
        </div>

        {revealed ? (
          <>
            <Field label="Obchodní název" name="companyName">
              <input
                id="companyName"
                name="companyName"
                required
                className={inputClass}
                autoComplete="organization"
                placeholder="např. Moravia Precision s.r.o."
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
            </Field>
            <div className="form-group">
              <label id="dph-label" htmlFor="dph-platce">
                DPH
              </label>
              <div className="segmented" role="radiogroup" aria-labelledby="dph-label">
                <label className="segmented-option">
                  <input
                    type="radio"
                    name="vatPayer"
                    value="nonpayer"
                    checked={vatPayer === "nonpayer"}
                    onChange={() => setVatPayer("nonpayer")}
                  />
                  <span>Neplátce</span>
                </label>
                <label className="segmented-option">
                  <input
                    type="radio"
                    name="vatPayer"
                    value="payer"
                    id="dph-platce"
                    checked={vatPayer === "payer"}
                    onChange={() => setVatPayer("payer")}
                  />
                  <span>Plátce</span>
                </label>
              </div>
            </div>
            {vatPayer === "payer" ? (
              <Field label="DIČ" name="dic">
                <input
                  id="dic"
                  name="dic"
                  className={inputClass}
                  autoComplete="off"
                  placeholder="CZ12345678"
                  value={dic}
                  onChange={(e) => setDic(e.target.value)}
                />
              </Field>
            ) : null}
            <Field label="Sídlo" name="city">
              <input
                id="city"
                name="city"
                className={inputClass}
                autoComplete="street-address"
                placeholder="ulice, PSČ, město"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </Field>
          </>
        ) : null}
      </fieldset>

      {revealed ? (
        <>
          <fieldset className="auth-section">
            <legend>Kontaktní osoba</legend>
            <div className="form-row">
              <Field label="Jméno" name="firstName">
                <input id="firstName" name="firstName" required className={inputClass} autoComplete="given-name" />
              </Field>
              <Field label="Příjmení" name="lastName">
                <input id="lastName" name="lastName" required className={inputClass} autoComplete="family-name" />
              </Field>
            </div>
            <Field label="Telefon" name="phone">
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                className={inputClass}
                autoComplete="tel"
                inputMode="tel"
                placeholder="+420 …"
              />
            </Field>
            <Field label="Pracovní e-mail" name="reg-email">
              <input
                id="reg-email"
                name="email"
                type="email"
                required
                className={inputClass}
                autoComplete="email"
                inputMode="email"
                placeholder="personalista@firma.cz"
              />
            </Field>
          </fieldset>

          <div className="form-group form-check">
            <label>
              <input type="checkbox" name="consentTerms" value="on" required />
              <span>
                Souhlasím s <a href="/obchodni-podminky">obchodními podmínkami</a> a{" "}
                <a href="/gdpr">zpracováním osobních údajů</a>.
              </span>
            </label>
          </div>

          {state?.ok ? <p className="auth-flash is-ok">{state.message}</p> : null}
          {state && !state.ok ? <p className="auth-flash is-err">{state.error}</p> : null}
          <Button type="submit" variant="accent" className="btn-block" disabled={pending}>
            {pending ? "Zakládám účet…" : "Založit účet a poslat odkaz"}
          </Button>
          <p className="auth-helper">Po odeslání vám pošleme přihlašovací odkaz na e-mail. Heslo nepoužíváme.</p>
        </>
      ) : null}
    </form>
  );
}
