import type { Metadata } from "next";
import Link from "next/link";
import { ConsoleTop } from "@/components/site-chrome";
import { BRAND } from "@/lib/brand";
import { copy } from "@/lib/copy";

export const metadata: Metadata = { title: copy.authSeeker.claim };

export default function UcetLoginPage() {
  return (
    <>
      <ConsoleTop>
        <Link className="btn btn-secondary btn-sm" href="/nabidky">
          Hledat práci
        </Link>
      </ConsoleTop>
      <main className="page" id="main" style={{ maxWidth: 480 }}>
        <h1 className="page-title">{copy.authSeeker.claim}</h1>
        <p className="muted" style={{ fontSize: 17 }}>
          {copy.authSeeker.helper}
        </p>
        <p className="muted" style={{ fontSize: 15 }}>
          {copy.authSeeker.softHint}
        </p>
        <form className="chart" style={{ padding: 20, marginTop: 20 }} action="/ucet" method="get">
          <div className="field">
            <label htmlFor="email">E-mail</label>
            <input id="email" name="email" type="email" required placeholder="vas@email.cz" />
          </div>
          <button className="btn btn-primary" type="submit" style={{ marginTop: 12 }}>
            {copy.authSeeker.cta}
          </button>
          <p className="seed" style={{ marginTop: 12 }}>
            {copy.authSeeker.after} Pro náhled UI pokračujte na <Link href="/ucet">ukázkový přehled</Link>.
          </p>
        </form>
        <p className="muted" style={{ marginTop: 24, fontSize: 13 }}>
          <Link href="/firma/prihlaseni">{copy.authSeeker.linkEmployer}</Link>
          {" · "}
          {BRAND}
        </p>
      </main>
    </>
  );
}
