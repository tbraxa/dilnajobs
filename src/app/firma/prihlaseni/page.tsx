import type { Metadata } from "next";
import { LoginForm, RegisterForm } from "@/components/auth-forms";

export const metadata: Metadata = { title: "Přihlášení firmy" };

export default function LoginPage() {
  return (
    <main className="mx-auto grid w-full max-w-5xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-2">
      <section>
        <p className="label">Firmy</p>
        <h1 className="display mt-2 text-3xl font-semibold">Přihlášení e-mailem</h1>
        <p className="mt-3 text-sm text-steel">
          Odkaz platí 15 minut. Heslo neposíláme — a nechceme ho znát.
        </p>
        <div className="mt-6 border border-line bg-paper p-5">
          <LoginForm />
        </div>
      </section>
      <section>
        <p className="label">Nová firma</p>
        <h1 className="display mt-2 text-3xl font-semibold">Registrace s IČO</h1>
        <p className="mt-3 text-sm text-steel">
          Jen přímí zaměstnavatelé. Agentury práce v podmínkách zakazujeme. IČO kontrolujeme.
        </p>
        <div className="mt-6 border border-line bg-paper p-5">
          <RegisterForm />
        </div>
      </section>
    </main>
  );
}
