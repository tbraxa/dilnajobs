import type { Metadata } from "next";
import { LoginForm } from "@/components/auth-forms";
import { copy } from "@/lib/copy";

export const metadata: Metadata = {
  title: { absolute: copy.login.metaTitle },
  description: copy.login.metaDescription,
};

export default function LoginPage() {
  return (
    <main className="mx-auto max-w-md px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-semibold">{copy.login.claim}</h1>
      <p className="mt-3 text-sm text-steel">{copy.login.helper}</p>
      <div className="mt-6 border border-line bg-paper p-5">
        <LoginForm />
      </div>
      <p className="mt-6 text-sm text-steel">
        {copy.login.helperSecondary}{" "}
        <a href="/firma/registrace" className="underline">
          {copy.login.ctaSecondary}
        </a>
      </p>
    </main>
  );
}
