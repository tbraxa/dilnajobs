import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ApplyForm } from "@/components/apply-form";
import { CatalogUnavailable } from "@/components/catalog-unavailable";
import { loadPublishedJobBySlug } from "@/lib/jobs/search";
import { formatSalary } from "@/lib/pricing";
import { EMPLOYMENT_TYPES, professionByDb } from "@/lib/catalog";

type Props = { params: Promise<{ slug: string }> };

export const dynamic = "force-dynamic";

function empLabel(code: string) {
  if (code === "full_time") return "HPP";
  return EMPLOYMENT_TYPES.find((t) => t.slug === code)?.label ?? code;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const catalog = await loadPublishedJobBySlug(slug);
  const row = catalog.ok ? catalog.rows : null;
  if (!row) return { title: "Nabídka" };
  return { title: `${row.job.title} — ${row.job.city}` };
}

function toList(text: string | null | undefined) {
  if (!text) return [];
  return text
    .split(/\n+/)
    .map((line) => line.replace(/^\s*[-•]\s*/, "").trim())
    .filter(Boolean);
}

export default async function JobPage({ params }: Props) {
  const { slug } = await params;
  const catalog = await loadPublishedJobBySlug(slug);
  if (!catalog.ok) {
    return (
      <main>
        <div className="page-hero">
          <CatalogUnavailable />
        </div>
      </main>
    );
  }
  const row = catalog.rows;
  if (!row) notFound();
  const { job, companyName, companyCity } = row;
  const profession = professionByDb(job.profession);
  const requirements = toList(job.requirements);
  const benefits = toList(job.benefits);
  const description = toList(job.description);

  return (
    <main>
      <div className="detail-split">
        <article className="detail-spec">
          <div className="spec-block">
            <p className="spec-label">
              {job.isTop ? <span className="label-box is-blue">Nové</span> : null}{" "}
              <span className="label-box">{empLabel(job.employmentType)}</span>{" "}
              <span className="label-box">
                LIVE · {job.city}
              </span>
            </p>
            <h1>{job.title}</h1>
            <p className="spec-company">
              {companyName}
              {companyCity ? ` · ${companyCity}` : job.region ? ` · ${job.region}` : ""}
            </p>
            <dl className="spec-meta-grid">
              <div>
                <dt>Mzda</dt>
                <dd className="is-pay">{formatSalary(job.salaryMin, job.salaryMax, job.salaryNote).replace(" / měsíc", "")}</dd>
              </div>
              <div>
                <dt>Směny</dt>
                <dd>{job.shiftNote || "—"}</dd>
              </div>
              <div>
                <dt>Úvazek</dt>
                <dd>{empLabel(job.employmentType)}</dd>
              </div>
              <div>
                <dt>Profese</dt>
                <dd>{profession?.label ?? job.profession}</dd>
              </div>
            </dl>
          </div>

          <div className="spec-block">
            <p className="spec-label">01 · Popis</p>
            <div className="spec-body">
              {description.length > 1 ? (
                <ul>
                  {description.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p>{job.description}</p>
              )}
            </div>
          </div>

          {requirements.length ? (
            <div className="spec-block">
              <p className="spec-label">03 · Požadujeme</p>
              <div className="spec-body">
                <ul>
                  {requirements.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          ) : null}

          {benefits.length ? (
            <div className="spec-block">
              <p className="spec-label">04 · Nabízíme</p>
              <div className="spec-body">
                <ul>
                  {benefits.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          ) : null}

          <div className="spec-block">
            <p className="spec-label">05 · Firma</p>
            <div className="spec-body">
              <p>
                {companyName}
                {job.city ? `, ${job.city}` : ""}.
              </p>
            </div>
          </div>
        </article>
        <ApplyForm jobId={job.id} companyName={companyName} />
      </div>
    </main>
  );
}
