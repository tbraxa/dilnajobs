import Link from "next/link";
import { redirect } from "next/navigation";
import {
  FavoriteCompanyButton,
  FavoriteJobButton,
} from "@/components/favorite-controls";
import { loadSeekerAccountData } from "@/lib/seeker-account";
import { getSeekerSession } from "@/lib/seeker-auth";
import { formatSalary } from "@/lib/pricing";

export default async function SeekerFavoritesPage() {
  const session = await getSeekerSession();
  if (!session) redirect("/ucet/prihlaseni?next=/ucet/oblibene");
  const data = await loadSeekerAccountData(session.userId);

  return (
    <main className="py-8">
      <p className="label">Váš výběr</p>
      <h1 className="display mt-2 text-3xl font-semibold">Oblíbené</h1>
      <p className="mt-2 text-sm text-steel">Uložené nabídky a firmy na jednom místě.</p>

      <section className="mt-6 border border-line bg-paper" id="nabidky">
        <header className="border-b border-line p-4">
          <h2 className="display text-xl font-semibold">Nabídky ({data.savedJobs.length})</h2>
        </header>
        {data.savedJobs.length ? (
          <div className="divide-y divide-line">
            {data.savedJobs.map((job) => (
              <article key={job.id} className="flex flex-wrap items-center justify-between gap-4 p-4">
                <div>
                  <p className="text-xs text-steel">{job.companyName} · {job.city}</p>
                  <h3 className="mt-1 font-semibold">
                    <Link href={`/nabidka/${job.slug}`} className="hover:underline">
                      {job.title}
                    </Link>
                  </h3>
                  <p className="mt-1 text-sm">
                    {formatSalary(job.salaryMin, job.salaryMax, job.salaryNote)}
                  </p>
                </div>
                <FavoriteJobButton
                  jobId={job.id}
                  initialSaved
                  returnTo="/ucet/oblibene"
                  label={`nabídku ${job.title}`}
                  showText
                />
              </article>
            ))}
          </div>
        ) : (
          <div className="p-4 text-sm">
            <p>Zatím nemáte uloženou nabídku.</p>
            <Link href="/nabidky" className="mt-2 inline-block underline">Projít nabídky</Link>
          </div>
        )}
      </section>

      <section className="mt-6 border border-line bg-paper" id="firmy">
        <header className="border-b border-line p-4">
          <h2 className="display text-xl font-semibold">Firmy ({data.savedCompanies.length})</h2>
        </header>
        {data.savedCompanies.length ? (
          <div className="divide-y divide-line">
            {data.savedCompanies.map((company) => (
              <article key={company.id} className="flex flex-wrap items-center justify-between gap-4 p-4">
                <div>
                  <h3 className="font-semibold">{company.companyName}</h3>
                  <p className="mt-1 text-sm text-steel">
                    {company.city || "Česko"} · {company.liveJobs} aktivních nabídek
                  </p>
                </div>
                <FavoriteCompanyButton
                  employerId={company.id}
                  initialSaved
                  returnTo="/ucet/oblibene#firmy"
                  label={`firmu ${company.companyName}`}
                  showText
                />
              </article>
            ))}
          </div>
        ) : (
          <div className="p-4 text-sm">
            <p>Zatím nemáte uloženou firmu.</p>
            <Link href="/nabidky" className="mt-2 inline-block underline">Procházet nabídky</Link>
          </div>
        )}
      </section>
    </main>
  );
}
