import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ApplyForm } from "@/components/apply-form";
import { CatalogUnavailable } from "@/components/catalog-unavailable";
import { loadPublishedJobBySlug } from "@/lib/jobs/search";
import { formatSalary } from "@/lib/pricing";
import { professionByDb } from "@/lib/catalog";
import { contractLabel, copy } from "@/lib/copy";

type Props = { params: Promise<{ slug: string }> };

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const catalog = await loadPublishedJobBySlug(slug);
  const row = catalog.ok ? catalog.rows : null;
  if (!row) return { title: "Nabídka" };
  return { title: `${row.job.title} · ${row.job.city}` };
}

function splitLines(text: string | null | undefined) {
  if (!text) return [];
  return text
    .split(/\n+/)
    .map((line) => line.replace(/^[-*•]\s*/, "").trim())
    .filter(Boolean);
}

export default async function JobPage({ params }: Props) {
  const { slug } = await params;
  const catalog = await loadPublishedJobBySlug(slug);
  if (!catalog.ok) {
    return (
      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
        <CatalogUnavailable title={copy.nabidky.emptyErrorTitle} detail={copy.nabidky.emptyErrorBody} />
      </main>
    );
  }
  const row = catalog.rows;
  if (!row) notFound();
  const { job } = row;
  const category = professionByDb(job.category) ?? professionByDb(job.profession);
  const contract = contractLabel(job.contractType || job.employmentType);
  const verified = row.verificationStatus === "verified";
  const requirements = splitLines(job.requirements);

  return (
    <main className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-12">
      <article className="lg:col-span-7">
        <div className="flex flex-wrap items-center gap-2 text-sm text-steel">
          <span>{copy.card.metaCompany(row.companyName)}</span>
          {verified ? (
            <span className="rounded-[2px] bg-ok px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-white">
              {copy.card.badgeVerified}
            </span>
          ) : (
            <span className="rounded-[2px] border border-line px-1.5 py-0.5 text-[10px] font-semibold">
              {copy.card.badgePending}
            </span>
          )}
        </div>
        <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">{job.title}</h1>
        <p className="mt-3 text-sm text-steel">
          {category?.label} · {job.city}
          {job.region ? `, ${job.region}` : ""} · {formatSalary(job.salaryMin, job.salaryMax, job.salaryType === "negotiable" ? copy.card.salaryNegotiable : job.salaryNote)}
          {contract ? ` · ${contract}` : ""}
        </p>
        <p className="mt-4 lg:hidden">
          <a
            href="#odpovedet"
            className="inline-flex items-center justify-center rounded-[2px] bg-accent px-4 py-2.5 text-sm font-semibold text-white"
          >
            {copy.detail.ctaApply}
          </a>
        </p>
        <section className="mt-8 space-y-6 text-[15px] leading-relaxed">
          <div>
            <h2 className="label mb-2">{copy.detail.sectionAbout}</h2>
            <p className="whitespace-pre-wrap">{job.description}</p>
          </div>
          {requirements.length ? (
            <div>
              <h2 className="label mb-2">{copy.detail.sectionRequirements}</h2>
              <ul className="list-disc space-y-1 pl-5">
                {requirements.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ) : null}
          {job.benefits ? (
            <div>
              <h2 className="label mb-2">{copy.detail.sectionOffer}</h2>
              <p className="whitespace-pre-wrap">{job.benefits}</p>
            </div>
          ) : null}
          <div>
            <h2 className="label mb-2">{copy.detail.sectionCompany}</h2>
            <p>{row.companyLegalName || row.companyName}</p>
            <p className="mt-1 text-sm text-steel">
              {row.companyCity}
              {row.ico ? ` · IČO ${row.ico}` : ""}
            </p>
          </div>
        </section>
      </article>
      <aside id="odpovedet" className="lg:col-span-5">
        <ApplyForm jobId={job.id} companyName={row.companyName} />
      </aside>
    </main>
  );
}
