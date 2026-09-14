import Link from "next/link";
import type { searchJobs } from "@/lib/jobs/search";
import { formatSalary } from "@/lib/pricing";
import { professionByDb } from "@/lib/catalog";
import { SpriteIcon } from "./sprite";

type JobRow = Awaited<ReturnType<typeof searchJobs>>[number];

const ICONS: Record<string, string> = {
  cnc: "cnc",
  welder: "welder",
  setter: "setter",
  electrician: "electrician",
  maintenance: "maintenance",
  locksmith: "locksmith",
  operator: "operator",
};

export function PreviewJobRow({ job }: { job: JobRow }) {
  const profession = professionByDb(job.profession);
  return (
    <article className="job-row">
      <span className="mega-icon">
        <SpriteIcon name={ICONS[job.profession] ?? "operator"} />
      </span>
      <div className="job-row__body">
        <div className="job-row__company">
          {job.companyName}
          {job.isTop ? <span className="badge-top">TOP</span> : null}
        </div>
        <h2 className="job-title">
          <Link href={`/nabidka/${job.slug}`}>{job.title}</Link>
        </h2>
        <p className="job-pay">{formatSalary(job.salaryMin, job.salaryMax, job.salaryNote)}</p>
        <p className="job-meta">
          {job.city} · {profession?.label ?? job.profession}
        </p>
      </div>
    </article>
  );
}
