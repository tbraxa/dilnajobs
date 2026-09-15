import Link from "next/link";
import type { searchJobs } from "@/lib/jobs/search";
import { displayJobSalary } from "@/lib/pricing";
import { professionByDb } from "@/lib/catalog";
import { contractLabel, copy, workModeLabel } from "@/lib/copy";

type JobRow = Awaited<ReturnType<typeof searchJobs>>[number];

function jobContractLabel(job: JobRow) {
  return contractLabel(job.contractType || job.employmentType);
}

export function JobCard({ job }: { job: JobRow }) {
  const category = professionByDb(job.category) ?? professionByDb(job.profession);
  const verified = job.verificationStatus === "verified";
  const contract = jobContractLabel(job);
  const mode = workModeLabel(job.workMode);
  return (
    <article className="border border-line bg-paper p-4 sm:p-5">
      <div className="flex flex-wrap items-center gap-2 text-xs text-steel">
        <span>{copy.card.metaCompany(job.companyName)}</span>
        {verified ? (
          <span className="rounded-[2px] bg-ok px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-white">
            {copy.card.badgeVerified}
          </span>
        ) : job.verificationStatus === "pending" || job.verificationStatus === "manual" ? (
          <span className="rounded-[2px] border border-line px-1.5 py-0.5 text-[10px] font-semibold tracking-wide">
            {copy.card.badgePending}
          </span>
        ) : null}
        {job.isAgency ? (
          <span className="rounded-[2px] border border-line px-1.5 py-0.5 text-[10px] font-semibold tracking-wide">
            {copy.card.badgeAgency}
          </span>
        ) : null}
        {job.isTop ? (
          <span className="rounded-[2px] bg-accent px-1.5 py-0.5 text-[10px] font-semibold tracking-wider text-white">
            {copy.card.badgeFeatured}
          </span>
        ) : null}
      </div>
      <h2 className="mt-1 text-xl font-semibold leading-tight">
        <Link href={`/nabidka/${job.slug}`} className="hover:underline">
          {job.title}
        </Link>
      </h2>
      <p className="mt-2 text-sm text-steel">
        {category?.label ?? job.category} · {job.city}
        {job.region ? `, ${job.region}` : ""} · {displayJobSalary(job)}
        {mode ? ` · ${mode}` : ""}
        {contract ? ` · ${contract}` : ""}
      </p>
      <p className="mt-3">
        <Link href={`/nabidka/${job.slug}`} className="text-sm font-semibold underline">
          {copy.card.ctaOpen}
        </Link>
      </p>
    </article>
  );
}
