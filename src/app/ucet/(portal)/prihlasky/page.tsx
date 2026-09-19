import Link from "next/link";
import { redirect } from "next/navigation";
import { loadSeekerAccountData } from "@/lib/seeker-account";
import { getSeekerSession } from "@/lib/seeker-auth";

const dateFormatter = new Intl.DateTimeFormat("cs-CZ", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export default async function SeekerApplicationsPage() {
  const session = await getSeekerSession();
  if (!session) redirect("/ucet/prihlaseni?next=/ucet/prihlasky");
  const { applicationHistory } = await loadSeekerAccountData(session.userId);

  return (
    <main className="py-8">
      <p className="label">Historie</p>
      <h1 className="display mt-2 text-3xl font-semibold">Moje přihlášky</h1>
      <p className="mt-2 text-sm text-steel">
        Přihlášky odeslané v době, kdy jste byli přihlášení.
      </p>
      <section className="mt-6 border border-line bg-paper">
        {applicationHistory.length ? (
          <div className="divide-y divide-line">
            {applicationHistory.map((application) => (
              <article key={application.id} className="flex flex-wrap items-center justify-between gap-4 p-4">
                <div>
                  <p className="text-xs text-steel">
                    {application.companyName} · {application.city}
                  </p>
                  <h2 className="mt-1 font-semibold">
                    {application.status === "published" &&
                    (!application.expiresAt || application.expiresAt > new Date()) ? (
                      <Link href={`/nabidka/${application.slug}`} className="hover:underline">
                        {application.title}
                      </Link>
                    ) : (
                      application.title
                    )}
                  </h2>
                  {application.status !== "published" ||
                  (application.expiresAt && application.expiresAt <= new Date()) ? (
                    <p className="mt-1 text-xs text-steel">Nabídka už není aktivní.</p>
                  ) : null}
                </div>
                <div className="text-right text-sm">
                  <p>Odesláno</p>
                  <time className="text-steel" dateTime={application.createdAt.toISOString()}>
                    {dateFormatter.format(application.createdAt)}
                  </time>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="p-4 text-sm">
            <p>Z přihlášeného účtu jste zatím žádnou přihlášku neposlali.</p>
            <Link href="/nabidky" className="mt-2 inline-block underline">Najít práci</Link>
          </div>
        )}
      </section>
    </main>
  );
}
