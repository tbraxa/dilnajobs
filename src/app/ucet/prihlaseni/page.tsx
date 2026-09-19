import type { Metadata } from "next";
import Link from "next/link";
import { BRAND } from "@/lib/brand";
import { copy } from "@/lib/copy";

export const metadata: Metadata = { title: copy.authSeeker.claim };

export default function UcetLoginPage() {
  return (
    <main className="auth-shell" id="main">
      <h1 className="page-title">{copy.authSeeker.claim}</h1>
      <p className="muted" style={{ fontSize: 17 }}>
        {copy.authSeeker.helper}
      </p>
      <form className="auth-card" action="/ucet" method="get">
        <div className="field">
          <label htmlFor="email">E-mail</label>
          <input id="email" name="email" type="email" required placeholder="vas@email.cz" />
        </div>
        <button className="btn btn-primary" type="submit" style={{ marginTop: 12 }}>
          {copy.authSeeker.cta}
        </button>
        <p className="seed" style={{ marginTop: 12 }}>
          {copy.authSeeker.after}
        </p>
      </form>
      <p className="muted" style={{ marginTop: 24, fontSize: 13 }}>
        <Link href="/firma/prihlaseni">{copy.authSeeker.linkEmployer}</Link>
        {" · "}
        <Link href="/ucet/registrace">Registrace</Link>
        {" · "}
        {BRAND}
      </p>
    </main>
  );
}
