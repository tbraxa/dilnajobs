import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ApplyForm } from "@/components/apply-form";
import { CatalogUnavailable } from "@/components/catalog-unavailable";
import { SpriteIcon } from "@/components/preview/sprite";
import { loadPublishedJobBySlug } from "@/lib/jobs/search";
import { formatSalary } from "@/lib/pricing";
import { professionByDb } from "@/lib/catalog";

type Props = { params: Promise<{ slug: string }> };

export const dynamic = "force-dynamic";

const ICONS: Record<string, string> = {
  cnc: "cnc",
  welder: "welder",
  setter: "setter",
  electrician: "electrician",
  maintenance: "maintenance",
  locksmith: "locksmith",
  operator: "operator",
};

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
      <main className="wrap" style={{ padding: "2rem 0" }}>
        <CatalogUnavailable />
      </main>
    );
  }
  const row = catalog.rows;
  if (!row) notFound();
  const { job, companyName } = row;
  const profession = professionByDb(job.profession);

  return (
    <main className="wrap detail">
      <article>
        <p className="micro">{companyName}</p>
        <h1 className="display">{job.title}</h1>
        <p className="job-pay">{formatSalary(job.salaryMin, job.salaryMax, job.salaryNote)}</p>
        <p className="detail-meta">
          <span className="mega-icon">
            <SpriteIcon name={ICONS[job.profession] ?? "operator"} />
          </span>
          {profession?.label} · {job.city}
          {job.shiftNote ? ` · ${job.shiftNote}` : null}
        </p>
        <section className="prose">
          <h2 className="micro">Práce</h2>
          <p>{job.description}</p>
          {job.requirements ? (
            <>
              <h2 className="micro">Koho hledáme</h2>
              <p>{job.requirements}</p>
            </>
          ) : null}
          {job.benefits ? (
            <>
              <h2 className="micro">Co je na stole</h2>
              <p>{job.benefits}</p>
            </>
          ) : null}
        </section>
      </article>
      <aside>
        <ApplyForm jobId={job.id} />
      </aside>
    </main>
  );
}
