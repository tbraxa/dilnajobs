import type { Metadata } from "next";
import { LoginForm } from "@/components/auth-forms";
import { AuthShell } from "@/components/auth-shell";
import { RedirectHashRegistrace } from "@/components/redirect-hash-registrace";

export const metadata: Metadata = { title: "Přihlášení firmy" };

export default function LoginPage() {
  return (
    <>
      <RedirectHashRegistrace />
      <AuthShell
        eyebrow="Pro firmy"
        heading="Účet zaměstnavatele"
        bullets={[
          "Přímí zaměstnavatelé, bez agentur",
          "Přihlášení odkazem. Heslo nepoužíváme.",
          "Transparentní ceník",
        ]}
      >
        <article className="auth-card" aria-labelledby="login-title">
          <h2 id="login-title">Přihlášení firmy</h2>
          <LoginForm />
          <p className="auth-helper">Odkaz platí 15 minut. Heslo nepoužíváme.</p>
          <p className="auth-links">
            <a href="/firma/registrace">Založit účet firmy</a>
            <a href="/pro-firmy#cenik">Ceník</a>
          </p>
        </article>
      </AuthShell>
    </>
  );
}
