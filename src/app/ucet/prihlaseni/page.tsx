import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SeekerLoginForm } from "@/components/seeker-auth-forms";
import { getSeekerSession, safeAccountNext } from "@/lib/seeker-auth";

export const metadata: Metadata = {
  title: "Přihlášení uchazeče",
  robots: { index: false, follow: false },
};

export default async function SeekerLoginPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const next = safeAccountNext(typeof params.next === "string" ? params.next : undefined);
  const invalidLink = params.chyba === "odkaz";
  const session = await getSeekerSession();
  if (session) redirect(next);

  return (
    <main className="mx-auto w-full max-w-lg px-4 py-10 sm:px-6">
      <section className="border border-line bg-paper p-5 sm:p-7">
        <p className="label">Účet uchazeče</p>
        <h1 className="display mt-2 text-3xl font-semibold">Přihlášení bez hesla</h1>
        <p className="mt-3 text-sm text-steel">
          Jednorázový odkaz přijde na váš e-mail. Firemní přihlášení zůstává oddělené.
        </p>
        {invalidLink ? (
          <p className="mt-4 border border-danger p-3 text-sm text-danger" role="alert">
            Odkaz je neplatný nebo už byl použitý. Vyžádejte si nový.
          </p>
        ) : null}
        <SeekerLoginForm next={next} />
        <p className="mt-6 border-t border-line pt-4 text-xs text-steel">
          Přihlášení používá zabezpečenou HttpOnly cookie.
        </p>
      </section>
      <Link href="/nabidky" className="mt-4 inline-block text-sm underline">
        Zpět na nabídky
      </Link>
    </main>
  );
}
