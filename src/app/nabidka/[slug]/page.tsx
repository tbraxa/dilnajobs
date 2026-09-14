import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ApplyForm } from "@/components/apply-form";
import { professionIcon } from "@/components/icons";
import { CatalogUnavailable } from "@/components/catalog-unavailable";
import { loadPublishedJobBySlug } from "@/lib/jobs/search";
import { formatSalary } from "@/lib/pricing";
import { professionByDb } from "@/lib/catalog";

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
      <main className="shell py-8 sm:py-10">
        <CatalogUnavailable />
      </main>
    );
  }
  const row = catalog.rows;
  if (!row) notFound();
  const { job, companyName } = row;
  const Icon = professionIcon(job.profession);
  const profession = professionByDb(job.profession);

  return (
    <main className="shell grid gap-8 py-8 sm:py-10 lg:grid-cols-12 lg:gap-12">
      <article className="lg:col-span-7">
        <p className="label">{companyName}</p>
        <h1 className="display mt-3 text-3xl leading-[0.95] sm:text-5xl">{job.title}</h1>
        <p className="mt-4 text-xl font-semibold">{formatSalary(job.salaryMin, job.salaryMax, job.salaryNote)}</p>
        <p className="mt-2 flex flex-wrap items-center gap-2 text-sm text-steel">
          <span className="icon-tile h-8 w-8">
            <Icon className="h-4 w-4 text-ink" />
          </span>
          {profession?.label}
          <span aria-hidden>·</span>
          {job.city}
          {job.shiftNote ? (
            <>
              <span aria-hidden>·</span>
              {job.shiftNote}
            </>
          ) : null}
        </p>
        <section className="mt-10 space-y-8 text-[15px] leading-relaxed">
          <div>
            <h2 className="label mb-3">Práce</h2>
            <p className="whitespace-pre-wrap">{job.description}</p>
          </div>
          {job.requirements ? (
            <div>
              <h2 className="label mb-3">Koho hledáme</h2>
              <p className="whitespace-pre-wrap">{job.requirements}</p>
            </div>
          ) : null}
          {job.benefits ? (
            <div>
              <h2 className="label mb-3">Co je na stole</h2>
              <p className="whitespace-pre-wrap">{job.benefits}</p>
            </div>
          ) : null}
        </section>
      </article>
      <aside className="lg:col-span-5">
        <div className="lg:sticky lg:top-20">
          <ApplyForm jobId={job.id} />
        </div>
      </aside>
    </main>
  );
}
