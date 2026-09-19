import type { Metadata } from "next";
import { LoginForm, RegisterForm } from "@/components/auth-forms";
import { copy } from "@/lib/copy";

export const metadata: Metadata = { title: copy.authFirma.loginClaim };

export default function FirmaLoginPage() {
  return (
    <main className="mx-auto grid w-full max-w-5xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-2">
      <section>
        <h1 className="display mt-2 text-3xl font-semibold">{copy.authFirma.loginClaim}</h1>
        <p className="mt-3 text-sm text-steel">{copy.authFirma.loginHelper}</p>
        <div className="mt-6 border border-line bg-paper p-5">
          <LoginForm />
        </div>
        <p className="mt-4 text-sm text-steel">
          {copy.authFirma.loginSecondaryQ}{" "}
          <a href="#registrace">{copy.authFirma.loginSecondaryCta}</a>
        </p>
      </section>
      <section id="registrace">
        <h2 className="display mt-2 text-3xl font-semibold">{copy.authFirma.regClaim}</h2>
        <p className="mt-3 text-sm text-steel">{copy.authFirma.regHelper}</p>
        <p className="mt-2 text-sm text-steel">{copy.authFirma.regHelperAres}</p>
        <div className="mt-6 border border-line bg-paper p-5">
          <RegisterForm />
        </div>
        <p className="mt-4 text-sm text-steel">
          {copy.authFirma.regSecondaryQ}{" "}
          <a href="#main">{copy.authFirma.regSecondaryCta}</a>
        </p>
      </section>
    </main>
  );
}
