import type { Metadata } from "next";
import { RegisterForm } from "@/components/auth-forms";
import { AuthShell } from "@/components/auth-shell";

export const metadata: Metadata = {
  title: "Registrace firmy",
  description: "Založte účet firmy. Přihlašovací odkaz přijde na e-mail.",
};

export default function RegisterPage() {
  return (
    <AuthShell
      title="Registrace firmy"
      note="Založte účet. Přihlašovací odkaz přijde na e-mail."
      wide
      footer={
        <p className="auth-footer">
          Už máte účet? <a href="/firma/prihlaseni">Přihlaste se</a>
        </p>
      }
    >
      <RegisterForm />
    </AuthShell>
  );
}
