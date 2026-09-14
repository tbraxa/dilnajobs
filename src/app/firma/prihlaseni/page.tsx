import type { Metadata } from "next";
import { LoginForm } from "@/components/auth-forms";
import { AuthShell } from "@/components/auth-shell";
import { RedirectHashRegistrace } from "@/components/redirect-hash-registrace";

export const metadata: Metadata = {
  title: "Přihlášení firmy",
  description: "Přihlaste se k účtu firmy odkazem z e-mailu. Správa inzerátů a odpovědí uchazečů.",
};

export default function LoginPage() {
  return (
    <>
      <RedirectHashRegistrace />
      <AuthShell title="Přihlášení firmy" note="Na e-mail pošleme odkaz pro přihlášení. Heslo nepoužíváme.">
        <LoginForm />
        <p className="note">Odkaz platí 15 minut. Heslo nepoužíváme.</p>
        <p className="auth-links">
          <a href="/firma/registrace">Zaregistrujte firmu</a>
          <a href="/pro-firmy#cenik">Ceník</a>
        </p>
      </AuthShell>
    </>
  );
}
