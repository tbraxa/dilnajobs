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
      <AuthShell
        title="Přihlášení firmy"
        note="Na e-mail pošleme odkaz pro přihlášení."
        footer={
          <p className="auth-footer">
            Nemáte účet? <a href="/firma/registrace">Zaregistrujte firmu</a>
          </p>
        }
      >
        <LoginForm />
      </AuthShell>
    </>
  );
}
