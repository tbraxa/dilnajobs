import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SeekerRegisterForm } from "@/components/seeker-auth-forms";
import { getSeekerSession, safeAccountNext } from "@/lib/seeker-auth";

export const metadata: Metadata = {
  title: "Registrace uchazeče",
  robots: { index: false, follow: false },
};

export default async function SeekerRegistrationPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const next = safeAccountNext(typeof params.next === "string" ? params.next : undefined);
  const session = await getSeekerSession();
  if (session) redirect(next);

  return (
    <main className="mx-auto w-full max-w-lg px-4 py-10 sm:px-6">
      <section className="border border-line bg-paper p-5 sm:p-7">
        <p className="label">Nový účet uchazeče</p>
        <h1 className="display mt-2 text-3xl font-semibold">Uložte si práci na později</h1>
        <p className="mt-3 text-sm text-steel">
          Účet je zdarma. Na nabídky můžete dál odpovídat i bez přihlášení.
        </p>
        <SeekerRegisterForm next={next} />
      </section>
      <Link href="/nabidky" className="mt-4 inline-block text-sm underline">
        Zpět na nabídky
      </Link>
    </main>
  );
}
