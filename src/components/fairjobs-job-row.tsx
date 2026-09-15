import Link from "next/link";
import type { searchJobs } from "@/lib/jobs/search";
import { professionByDb } from "@/lib/catalog";
import { formatSalary } from "@/lib/pricing";
import { cleanUiText } from "@/lib/fairjobs-visual";
import { CompanyLogo } from "./company-logo";

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

export function JobResultRow({ job }: { job: PublicJob }) {
  const verified = job.verificationStatus === "verified";
  const directEmployer = !job.isAgency;
  const profession = professionByDb(job.profession)?.label ?? cleanUiText(job.profession);

  return (
    <article className={`fj-job-row${job.isTop ? " fj-job-row-top" : ""}`}>
      <div className="fj-job-logo-cell">
        <CompanyLogo companyName={job.companyName} className="fj-company-logo" />
      </div>

      <div className="fj-job-main-cell">
        <div className="fj-job-company-line">
          <span>{cleanUiText(job.companyName)}</span>
          {verified ? (
            <span className="fj-verified-badge">
              <span aria-hidden="true">✓</span>
              Ověřeno
            </span>
          ) : null}
          {job.isTop ? <span className="fj-top-badge">Doporučujeme</span> : null}
        </div>
        <h2>
          <Link href={`/nabidka/${job.slug}`}>{cleanUiText(job.title)}</Link>
        </h2>
        <div className="fj-job-small-meta">
          <span>{profession}</span>
          <span>{employmentLabel(job.employmentType)}</span>
          {directEmployer ? <span>Přímo od firmy</span> : null}
          <span>Na místě</span>
        </div>
      </div>

      <div className="fj-job-place-cell">
        <span className="fj-row-label">Lokalita</span>
        <strong>{cleanUiText(job.city)}</strong>
        <span>{cleanUiText(job.region)}</span>
      </div>

      <div className="fj-job-salary-cell">
        <span className="fj-row-label">Mzda</span>
        <strong>{cleanUiText(formatSalary(job.salaryMin, job.salaryMax, job.salaryNote))}</strong>
        <span>{publishedLabel(job.publishedAt)}</span>
      </div>

      <Link href={`/nabidka/${job.slug}`} className="fj-job-row-arrow" aria-label={`Otevřít nabídku ${cleanUiText(job.title)}`}>
        <span aria-hidden="true">→</span>
      </Link>
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
        <small>{cleanUiText(job.city)} · Na místě</small>
      </div>
      <strong>{cleanUiText(formatSalary(job.salaryMin, job.salaryMax, job.salaryNote))}</strong>
      <Link href={`/nabidka/${job.slug}`} className="fj-home-job-arrow" aria-label="Detail nabídky">
        →
      </Link>
    </article>
  );
}
