import type { Metadata } from "next";
import { LoginForm, RegisterForm } from "@/components/auth-forms";
import { PageHero } from "@/components/preview/board";

export const metadata: Metadata = { title: "Přihlášení firmy" };

export default function LoginPage() {
  return (
    <main>
      <PageHero
        eyebrow="Firmy"
        title="Přihlášení e-mailem"
        lead="Odkaz platí 15 minut. Heslo neposíláme — a nechceme ho znát. V lokálním vývoji odkaz vypíšeme do konzole serveru."
      >
        <a href="/pro-firmy" className="btn btn-secondary btn-square">
          Ceník →
        </a>
      </PageHero>
      <div className="detail-split">
        <section className="apply-panel" aria-labelledby="login-title">
          <h2 id="login-title">Existující firma</h2>
          <LoginForm />
        </section>
        <section className="apply-panel" aria-labelledby="register-title">
          <h2 id="register-title">Nová firma · IČO</h2>
          <p className="form-hint" style={{ marginTop: 0, marginBottom: "1rem" }}>
            Jen přímí zaměstnavatelé. Agentury práce v podmínkách zakazujeme. IČO kontrolujeme checksumem.
          </p>
          <RegisterForm />
        </section>
      </div>
    </main>
  );
}
