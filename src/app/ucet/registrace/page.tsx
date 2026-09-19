import type { Metadata } from "next";
import Link from "next/link";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = { title: "Registrace" };

export default function UcetRegistracePage() {
  return (
    <main className="page" id="main" style={{ maxWidth: 480 }}>
      <h1 className="page-title">Registrace</h1>
      <p className="muted" style={{ fontSize: 17 }}>
        Založte účet odkazem z e-mailu. Oblíbené a odpovědi na jednom místě.
      </p>
      <form className="chart" style={{ padding: 20, marginTop: 20 }} action="/ucet" method="get">
        <div className="field">
          <label htmlFor="firstName">Jméno</label>
          <input id="firstName" name="firstName" required />
        </div>
        <div className="field">
          <label htmlFor="lastName">Příjmení</label>
          <input id="lastName" name="lastName" required />
        </div>
        <div className="field">
          <label htmlFor="email">E-mail</label>
          <input id="email" name="email" type="email" required placeholder="vas@email.cz" />
        </div>
        <button className="btn btn-primary" type="submit" style={{ marginTop: 12 }}>
          Založit účet a poslat odkaz
        </button>
      </form>
      <p className="muted" style={{ marginTop: 24, fontSize: 13 }}>
        <Link href="/ucet/prihlaseni">Už máte účet? Přihlaste se</Link>
        {" · "}
        <Link href="/firma/registrace">Jste firma? Registrace firmy</Link>
        {" · "}
        {BRAND}
      </p>
    </main>
  );
}
