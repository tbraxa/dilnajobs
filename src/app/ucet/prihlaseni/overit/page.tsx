import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { safeAccountNext } from "@/lib/seeker-auth";

export const metadata: Metadata = {
  title: "Potvrzení přihlášení",
  robots: { index: false, follow: false },
};

export default async function VerifySeekerLoginPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const token = typeof params.token === "string" ? params.token : "";
  const next = safeAccountNext(typeof params.next === "string" ? params.next : undefined);
  if (!token) redirect("/ucet/prihlaseni?chyba=odkaz");

  return (
    <main className="mx-auto w-full max-w-lg px-4 py-10 sm:px-6">
      <section className="border border-line bg-paper p-5 sm:p-7">
        <p className="label">Jednorázový odkaz</p>
        <h1 className="display mt-2 text-3xl font-semibold">Potvrďte přihlášení</h1>
        <p className="mt-3 text-sm text-steel">
          Odkaz spotřebujeme až po potvrzení, aby ho nemohl použít náhled e-mailu.
        </p>
        <form action="/ucet/prihlaseni/overit/akce" method="post" className="mt-6">
          <input type="hidden" name="token" value={token} />
          <input type="hidden" name="next" value={next} />
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-[2px] border border-accent bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:border-accent-hover hover:bg-accent-hover"
          >
            Vstoupit do účtu
          </button>
        </form>
      </section>
    </main>
  );
}
