import type { Metadata } from "next";
import Link from "next/link";
import { ConsoleTop } from "@/components/site-chrome";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = { title: "Přihlášení uchazeče" };

export default function UcetLoginPage() {
  return (
    <>
      <ConsoleTop>
        <Link className="btn btn-secondary btn-sm" href="/nabidky">
          Hledat práci
        </Link>
      </ConsoleTop>
      <main className="page" id="main" style={{ maxWidth: 480 }}>
        <p className="eyebrow">Účet uchazeče</p>
        <h1 className="page-title">Přihlášení</h1>
        <p className="muted">
          Magic link na e-mail — bez hesla. Účet je volitelný; na nabídku se můžete hlásit i jako host.
        </p>
        <form className="chart" style={{ padding: 20, marginTop: 20 }} action="/ucet" method="get">
          <div className="field">
            <label htmlFor="email">E-mail</label>
            <input id="email" name="email" type="email" required placeholder="vas@email.cz" />
          </div>
          <button className="btn btn-primary" type="submit" style={{ marginTop: 12 }}>
            Poslat odkaz
          </button>
          <p className="seed" style={{ marginTop: 12 }}>
            Odeslání magického odkazu napojíme na seeker auth v další iteraci. Pro náhled UI pokračujte na{" "}
            <Link href="/ucet">ukázkový přehled</Link>.
          </p>
        </form>
        <p className="muted" style={{ marginTop: 24, fontSize: 13 }}>
          Firma? <Link href="/firma/prihlaseni">Přihlášení firem</Link> · {BRAND}
        </p>
      </main>
    </>
  );
}
