import Link from "next/link";
import type { searchJobs } from "@/lib/jobs/search";
import { professionByDb } from "@/lib/catalog";
import { formatSalary } from "@/lib/pricing";
import { cleanUiText } from "@/lib/fairjobs-visual";
import { CompanyLogo } from "./company-logo";
import { FavoriteJobButton } from "./favorite-controls";

export type PublicJob = Awaited<ReturnType<typeof searchJobs>>[number];

function publishedLabel(value: Date | null) {
  if (!value) return "Nová nabídka";
  const days = Math.max(0, Math.floor((Date.now() - value.getTime()) / 86_400_000));
  if (days === 0) return "Dnes";
  if (days === 1) return "Včera";
  if (days < 5) return `Před ${days} dny`;
  return `Před ${days} dny`;
}

function employmentLabel(value: string) {
  if (value === "part_time") return "Zkrácený úvazek";
  if (value === "shift") return "Směnný provoz";
  return "Hlavní pracovní poměr";
}

function workModeLabel(value: string) {
  if (value === "remote") return "Na dálku";
  if (value === "hybrid") return "Hybrid";
  return "Na místě";
}

export function JobResultRow({
  job,
  isFavorite = false,
  returnTo = "/nabidky",
}: {
  job: PublicJob;
  isFavorite?: boolean;
  returnTo?: string;
}) {
  const verified = job.verificationStatus === "verified";
  const directEmployer = !job.isAgency;
  const profession = professionByDb(job.profession)?.label ?? cleanUiText(job.profession);

  return (
    <article className={`fj-v6-job-row${job.isTop ? " is-promoted" : ""}`}>
      <div className="fj-v6-job-mark">
        <CompanyLogo companyName={job.companyName} className="fj-v6-company-logo" />
      </div>

      <div className="fj-v6-job-identity">
        <div className="fj-v6-job-company">
          <span>{cleanUiText(job.companyName)}</span>
          {verified ? (
            <span className="fj-verified-badge">
              <span aria-hidden="true">✓</span>
              Ověřeno
            </span>
          ) : null}
          {job.isTop ? <span className="fj-top-badge">Doporučujeme</span> : null}
          <time dateTime={job.publishedAt?.toISOString()}>{publishedLabel(job.publishedAt)}</time>
        </div>
        <h2>
          <Link href={`/nabidka/${job.slug}`}>{cleanUiText(job.title)}</Link>
        </h2>
        <div className="fj-v6-job-facets">
          <span className="fj-job-meta-chip">{workModeLabel(job.workMode)}</span>
          <span className="fj-job-meta-chip">{employmentLabel(job.employmentType)}</span>
          <span className="fj-job-meta-text">{profession}</span>
          {directEmployer ? <span className="fj-job-meta-text">Přímo od firmy</span> : null}
        </div>
      </div>

      <div className="fj-v6-job-place">
        <span>Lokalita</span>
        <strong>{cleanUiText(job.city)}</strong>
        <small>{cleanUiText(job.region)}</small>
      </div>

      <div className="fj-v6-job-compensation">
        <span>Měsíční mzda</span>
        <strong>{cleanUiText(formatSalary(job.salaryMin, job.salaryMax, job.salaryNote))}</strong>
        <small>hrubá · před zdaněním</small>
      </div>

      <FavoriteJobButton
        jobId={job.id}
        initialSaved={isFavorite}
        returnTo={returnTo}
        label={`nabídku ${cleanUiText(job.title)}`}
      />
    </article>
  );
}

export function HomeJobLine({ job }: { job: PublicJob }) {
  return (
    <article className="fj-home-job-line">
      <CompanyLogo companyName={job.companyName} className="fj-home-company-logo" />
      <div>
        <p>
          {cleanUiText(job.companyName)}
          {job.verificationStatus === "verified" ? <span>Ověřeno</span> : null}
        </p>
        <h3>
          <Link href={`/nabidka/${job.slug}`}>{cleanUiText(job.title)}</Link>
        </h3>
        <small>{cleanUiText(job.city)} · {workModeLabel(job.workMode)}</small>
      </div>
      <strong>{cleanUiText(formatSalary(job.salaryMin, job.salaryMax, job.salaryNote))}</strong>
      <Link href={`/nabidka/${job.slug}`} className="fj-home-job-arrow" aria-label="Detail nabídky">
        →
      </Link>
    </article>
  );
}
