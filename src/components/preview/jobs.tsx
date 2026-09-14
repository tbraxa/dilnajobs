import Link from "next/link";
import type { searchJobs } from "@/lib/jobs/search";
import { formatSalary } from "@/lib/pricing";
import { EMPLOYMENT_TYPES } from "@/lib/catalog";

type Job = Awaited<ReturnType<typeof searchJobs>>[number];

function employmentLabel(code: string) {
  return EMPLOYMENT_TYPES.find((t) => t.slug === code)?.label ?? code;
}

function compactPay(job: Job) {
  if (job.salaryNote) return job.salaryNote;
  if (job.salaryMin && job.salaryMax) {
    return `${Math.round(job.salaryMin / 1000)}–${Math.round(job.salaryMax / 1000)}k`;
  }
  return formatSalary(job.salaryMin, job.salaryMax, job.salaryNote);
}

function JobTags({ job }: { job: Job }) {
  return (
    <div className="tags">
      {job.isTop ? <span className="chip is-blue">Nové</span> : null}
      <span className="chip">{employmentLabel(job.employmentType) === "Hlavní pracovní poměr" ? "HPP" : employmentLabel(job.employmentType)}</span>
      <span className="chip">{job.companyName}</span>
    </div>
  );
}

export function LiveRows({ jobs }: { jobs: Job[] }) {
  return (
    <div className="live-list">
      {jobs.map((job, i) => (
        <Link key={job.id} className="live-row" href={`/nabidka/${job.slug}`}>
          <span className={`live-dot${i > 2 ? " is-idle" : ""}`} aria-hidden="true" />
          <span className="live-title">
            <strong>{job.title}</strong>
            <span>
              {employmentLabel(job.employmentType) === "Hlavní pracovní poměr" ? "HPP" : employmentLabel(job.employmentType)}
              {" · "}
              {job.city}
              {job.shiftNote ? ` · ${job.shiftNote}` : ""}
            </span>
          </span>
          <span className="live-pay">{compactPay(job)}</span>
        </Link>
      ))}
    </div>
  );
}

export function JobsTable({ jobs, goLabel = "→" }: { jobs: Job[]; goLabel?: string }) {
  return (
    <>
      <table className="jobs-table">
        <thead>
          <tr>
            <th>Profese</th>
            <th className="hide-sm">Kraj</th>
            <th>Mzda</th>
            <th className="hide-sm">Směny</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <tr key={job.id}>
              <td className="col-role">
                <Link href={`/nabidka/${job.slug}`}>{job.title}</Link>
                <JobTags job={job} />
              </td>
              <td className="hide-sm">
                {job.region}
                {job.city ? ` · ${job.city}` : ""}
              </td>
              <td className="col-pay">{formatSalary(job.salaryMin, job.salaryMax, job.salaryNote).replace(" / měsíc", "")}</td>
              <td className="hide-sm">{job.shiftNote || "—"}</td>
              <td className="col-go">
                <Link href={`/nabidka/${job.slug}`}>{goLabel}</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="jobs-cards">
        {jobs.map((job) => (
          <Link key={job.id} className="job-card" href={`/nabidka/${job.slug}`}>
            <div className="job-card-top">
              <div className="job-card-title">{job.title}</div>
              <div className="job-card-pay">{formatSalary(job.salaryMin, job.salaryMax, job.salaryNote).replace(" / měsíc", "")}</div>
            </div>
            <div className="job-card-meta">
              {job.region} · {job.city}
              {job.shiftNote ? ` · ${job.shiftNote}` : ""}
            </div>
            <div className="tags" style={{ marginBottom: "0.5rem" }}>
              {job.isTop ? <span className="chip is-blue">Nové</span> : null}
              <span className="chip">{employmentLabel(job.employmentType) === "Hlavní pracovní poměr" ? "HPP" : employmentLabel(job.employmentType)}</span>
              <span className="chip">{job.companyName}</span>
            </div>
            <span className="job-card-go">Otevřít nabídku →</span>
          </Link>
        ))}
      </div>
    </>
  );
}
