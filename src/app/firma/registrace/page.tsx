import type { Metadata } from "next";
import { RegisterForm } from "@/components/auth-forms";
import { AuthShell } from "@/components/auth-shell";

export const metadata: Metadata = {
  title: "Registrace firmy",
  description: "Založte účet firmy. Přihlašovací odkaz přijde na e-mail.",
};

export default function RegisterPage() {
  return (
    <AuthShell title="Registrace firmy" note="Nejdřív IČO. Údaje doplníme z ARES, zkontrolujte je.">
      <RegisterForm />
      <p className="auth-links">
        <a href="/firma/prihlaseni">Už účet máte? Přihlášení</a>
      </p>
    </AuthShell>
  );
}
