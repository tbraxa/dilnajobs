import type { Metadata } from "next";
import { LoginForm, RegisterForm } from "@/components/auth-forms";

export const metadata: Metadata = { title: "Přihlášení firmy" };

export default function LoginPage() {
  return (
    <main className="auth-shell">
      <div className="auth-layout">
        <aside className="auth-trust">
          <p className="eyebrow">Pro firmy</p>
          <h1>Účet zaměstnavatele</h1>
          <ul>
            <li>Přímí zaměstnavatelé, bez agentur</li>
            <li>Přihlášení odkazem. Heslo nepoužíváme.</li>
            <li>Transparentní ceník</li>
          </ul>
        </aside>

        <div className="auth-stack">
          <article className="auth-card" aria-labelledby="login-title">
            <h2 id="login-title">Přihlášení firmy</h2>
            <LoginForm />
            <p className="auth-helper">Odkaz platí 15 minut. Heslo nepoužíváme.</p>
            <p className="auth-links">
              <a href="#registrace">Založit účet</a>
              <a href="/pro-firmy">Ceník</a>
            </p>
          </article>

          <article className="auth-card" id="registrace" aria-labelledby="register-title">
            <h2 id="register-title">Nová firma</h2>
            <RegisterForm />
          </article>
        </div>
      </div>
    </main>
  );
}
