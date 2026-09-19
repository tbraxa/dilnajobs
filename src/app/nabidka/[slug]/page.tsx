import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ApplyForm } from "@/components/apply-form";
import {
  FavoriteCompanyButton,
  FavoriteJobButton,
} from "@/components/favorite-controls";
import { professionIcon } from "@/components/icons";
import { CatalogUnavailable } from "@/components/catalog-unavailable";
import { loadPublishedJobBySlug } from "@/lib/jobs/search";
import { formatSalary } from "@/lib/pricing";
import { professionByDb } from "@/lib/catalog";
import {
  getFavoriteCompanyIds,
  getFavoriteJobIds,
} from "@/lib/seeker-account";
import { getSeekerSession } from "@/lib/seeker-auth";

type Props = { params: Promise<{ slug: string }> };

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const catalog = await loadPublishedJobBySlug(slug);
  const row = catalog.ok ? catalog.rows : null;
  if (!row) return { title: "Nabídka" };
  return { title: `${row.job.title} — ${row.job.city}` };
}

export default async function JobPage({ params }: Props) {
  const { slug } = await params;
  const catalog = await loadPublishedJobBySlug(slug);
  if (!catalog.ok) {
    return (
      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
        <CatalogUnavailable />
      </main>
    );
  }
  const row = catalog.rows;
  if (!row) notFound();
  const { job, companyName } = row;
  const Icon = professionIcon(job.profession);
  const profession = professionByDb(job.profession);
  const seeker = await getSeekerSession();
  const [favoriteJobs, favoriteCompanies] = seeker
    ? await Promise.all([
        getFavoriteJobIds(seeker.userId, [job.id]),
        getFavoriteCompanyIds(seeker.userId, [job.employerId]),
      ])
    : [new Set<string>(), new Set<string>()];

  return (
    <main className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-12">
      <article className="lg:col-span-7">
        <p className="label">{companyName}</p>
        <h1 className="display mt-2 text-3xl font-semibold sm:text-4xl">{job.title}</h1>
        <p className="mt-3 flex flex-wrap items-center gap-2 text-sm text-steel">
          <Icon className="h-4 w-4 text-ink" />
          {profession?.label} · {job.city} · {formatSalary(job.salaryMin, job.salaryMax, job.salaryNote)}
          {job.shiftNote ? ` · ${job.shiftNote}` : null}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <FavoriteJobButton
            jobId={job.id}
            initialSaved={favoriteJobs.has(job.id)}
            returnTo={`/nabidka/${job.slug}`}
            label={`nabídku ${job.title}`}
            showText
          />
          <FavoriteCompanyButton
            employerId={job.employerId}
            initialSaved={favoriteCompanies.has(job.employerId)}
            returnTo={`/nabidka/${job.slug}`}
            label={`firmu ${companyName}`}
            showText
          />
        </div>
        <section className="mt-8 space-y-6 text-[15px] leading-relaxed">
          <div>
            <h2 className="label mb-2">Práce</h2>
            <p className="whitespace-pre-wrap">{job.description}</p>
          </div>
          {job.requirements ? (
            <div>
              <h2 className="label mb-2">Koho hledáme</h2>
              <p className="whitespace-pre-wrap">{job.requirements}</p>
            </div>
          ) : null}
          {job.benefits ? (
            <div>
              <h2 className="label mb-2">Co je na stole</h2>
              <p className="whitespace-pre-wrap">{job.benefits}</p>
            </div>
          ) : null}
        </section>
      </article>
      <aside className="lg:col-span-5">
        <ApplyForm
          jobId={job.id}
          defaults={
            seeker
              ? {
                  fullName: seeker.name,
                  email: seeker.email,
                  phone: seeker.phone ?? "",
                }
              : undefined
          }
        />
      </aside>
    </main>
  );
}
