import type { Metadata } from "next";
import { RegisterForm } from "@/components/auth-forms";
import { copy } from "@/lib/copy";

export const metadata: Metadata = {
  title: copy.register.metaTitle,
  description: copy.register.metaDescription,
};

export default function RegisterPage() {
  return (
    <main className="mx-auto max-w-md px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-semibold">{copy.register.claim}</h1>
      <p className="mt-3 text-sm text-steel">{copy.register.helper}</p>
      <div className="mt-6 border border-line bg-paper p-5">
        <RegisterForm />
      </div>
      <p className="mt-6 text-sm text-steel">
        {copy.register.helperSecondary}{" "}
        <a href="/firma/prihlaseni" className="underline">
          {copy.register.ctaSecondary}
        </a>
      </p>
    </main>
  );
}
