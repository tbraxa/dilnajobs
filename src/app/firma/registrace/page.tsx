import type { Metadata } from "next";
import Link from "next/link";
import { RegisterForm } from "@/components/auth-forms";
import { copy } from "@/lib/copy";

export const metadata: Metadata = { title: copy.authFirma.regClaim };

export default function FirmaRegistracePage() {
  return (
    <main className="page" id="main" style={{ maxWidth: 520 }}>
      <h1 className="page-title">{copy.authFirma.regClaim}</h1>
      <p className="muted" style={{ fontSize: 17 }}>
        {copy.authFirma.regHelper}
      </p>
      <p className="muted" style={{ fontSize: 15 }}>
        {copy.authFirma.regHelperAres}
      </p>
      <div className="chart" style={{ padding: 20, marginTop: 20 }}>
        <RegisterForm />
      </div>
      <p className="muted" style={{ marginTop: 24, fontSize: 14 }}>
        {copy.authFirma.regSecondaryQ}{" "}
        <Link href="/firma/prihlaseni">{copy.authFirma.regSecondaryCta}</Link>
      </p>
    </main>
  );
}
