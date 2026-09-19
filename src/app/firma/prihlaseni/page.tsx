import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/auth-forms";
import { copy } from "@/lib/copy";

export const metadata: Metadata = { title: copy.authFirma.loginClaim };

export default function FirmaLoginPage() {
  return (
    <main className="auth-shell" id="main">
      <h1 className="page-title">{copy.authFirma.loginClaim}</h1>
      <p className="muted" style={{ fontSize: 17 }}>
        {copy.authFirma.loginHelper}
      </p>
      <div className="auth-card">
        <LoginForm />
      </div>
      <p className="muted" style={{ marginTop: 24, fontSize: 14 }}>
        {copy.authFirma.loginSecondaryQ}{" "}
        <Link href="/firma/registrace">{copy.authFirma.loginSecondaryCta}</Link>
      </p>
    </main>
  );
}
