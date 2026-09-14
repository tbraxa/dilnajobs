import type { Metadata } from "next";
import { RegisterForm } from "@/components/auth-forms";
import { AuthShell } from "@/components/auth-shell";

export const metadata: Metadata = { title: "Založení účtu firmy" };

export default function RegisterPage() {
  return (
    <AuthShell
      eyebrow="Pro firmy"
      heading="Najděte lidi do výroby"
      bullets={[
        "Přímí zaměstnavatelé, bez agentur",
        "Odpovědi jdou k vám — jméno a telefon",
        "Ceník bez DPH, zkušební inzerát zdarma",
      ]}
    >
      <article className="auth-card" aria-labelledby="register-title">
        <h2 id="register-title">Založení účtu firmy</h2>
        <RegisterForm />
        <p className="auth-links">
          <a href="/firma/prihlaseni">Už máte účet? Přihlásit se</a>
        </p>
      </article>
    </AuthShell>
  );
}
