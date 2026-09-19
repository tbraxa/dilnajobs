import Link from "next/link";
import { redirect } from "next/navigation";
import { loadSeekerAccountData } from "@/lib/seeker-account";
import { getSeekerSession } from "@/lib/seeker-auth";

export default async function SeekerOverviewPage() {
  const session = await getSeekerSession();
  if (!session) redirect("/ucet/prihlaseni?next=/ucet/prehled");
  const data = await loadSeekerAccountData(session.userId);
  const fields = [
    data.profile?.name,
    data.profile?.phone,
    data.profile?.city,
    data.profile?.desiredRole,
    data.profile?.bio,
  ];
  const completeness = Math.round((fields.filter(Boolean).length / fields.length) * 100);

  return (
    <main className="py-8">
      <p className="label">Dobrý den, {session.name.split(/\s+/)[0]}</p>
      <h1 className="display mt-2 text-3xl font-semibold">Přehled účtu</h1>
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <Link href="/ucet/oblibene" className="border border-line bg-paper p-4 hover:bg-paper-2">
          <p className="text-sm text-steel">Uložené nabídky</p>
          <p className="display mt-2 text-3xl font-semibold">{data.savedJobs.length}</p>
        </Link>
        <Link href="/ucet/prihlasky" className="border border-line bg-paper p-4 hover:bg-paper-2">
          <p className="text-sm text-steel">Odeslané přihlášky</p>
          <p className="display mt-2 text-3xl font-semibold">{data.applicationHistory.length}</p>
        </Link>
        <Link href="/ucet/profil" className="border border-line bg-paper p-4 hover:bg-paper-2">
          <p className="text-sm text-steel">Dokončení profilu</p>
          <p className="display mt-2 text-3xl font-semibold">{completeness} %</p>
        </Link>
      </div>

      <section className="mt-6 border border-line bg-paper p-4 sm:p-6">
        <h2 className="display text-xl font-semibold">Další krok</h2>
        <p className="mt-2 text-sm text-steel">
          {completeness < 100
            ? "Doplňte kontakt a zaměření. Odpověď na nabídku pak jen zkontrolujete."
            : "Profil je připravený. Můžete pokračovat k nabídkám."}
        </p>
        <Link
          href={completeness < 100 ? "/ucet/profil" : "/nabidky"}
          className="mt-4 inline-flex rounded-[2px] border border-accent bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:border-accent-hover hover:bg-accent-hover"
        >
          {completeness < 100 ? "Doplnit profil" : "Hledat práci"}
        </Link>
      </section>
    </main>
  );
}
