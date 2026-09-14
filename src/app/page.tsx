import { JobCard } from "@/components/job-card";
import { JobFilters } from "@/components/job-filters";
import { ButtonLink } from "@/components/ui";
import {
  IconArrow,
  IconBolt,
  IconCnc,
  IconFactory,
  IconSetter,
  IconWeld,
  IconWrench,
} from "@/components/icons";
import { featuredJobs } from "@/lib/jobs/search";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const jobs = await featuredJobs(6);
  return (
    <main>
      <section className="border-b border-line">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-12 lg:py-16">
          <div className="lg:col-span-7">
            <p className="label">Výroba · ČR · bez agentur</p>
            <h1 className="display mt-3 text-4xl font-semibold leading-[0.95] sm:text-6xl">
              Práce ve výrobě.
              <br />
              Napřímo z dílny.
            </h1>
            <p className="mt-5 max-w-xl text-base text-steel sm:text-lg">
              CNC, svářeči, seřizovači, průmysloví elektrikáři, údržba. Inzerují výrobní firmy. Uchazeč se hlásí
              jménem a telefonem — účet zakládat nemusíte.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/nabidky">
                Hledat nabídky
                <IconArrow className="h-4 w-4" />
              </ButtonLink>
              <ButtonLink href="/pro-firmy" variant="ghost">
                Jste firma?
              </ButtonLink>
            </div>
          </div>
          <div className="border border-line bg-paper p-5 lg:col-span-5">
            <p className="label mb-3">Profese</p>
            <ul className="grid grid-cols-2 gap-3 text-sm">
              <li className="flex items-center gap-2">
                <IconCnc className="h-5 w-5" /> CNC
              </li>
              <li className="flex items-center gap-2">
                <IconWeld className="h-5 w-5" /> Svářeč
              </li>
              <li className="flex items-center gap-2">
                <IconSetter className="h-5 w-5" /> Seřizovač
              </li>
              <li className="flex items-center gap-2">
                <IconBolt className="h-5 w-5" /> Elektrikář
              </li>
              <li className="flex items-center gap-2">
                <IconWrench className="h-5 w-5" /> Údržba
              </li>
              <li className="flex items-center gap-2">
                <IconFactory className="h-5 w-5" /> Zámečník
              </li>
            </ul>
            <p className="mt-6 text-sm text-steel">Hledání jde proti živé databázi, ne proti statickému seznamu.</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <JobFilters />
        <div className="mt-8 flex items-end justify-between gap-4">
          <h2 className="display text-2xl font-semibold">Aktuální nabídky</h2>
          <a href="/nabidky" className="text-sm underline">
            Všechny
          </a>
        </div>
        <div className="mt-4 grid gap-3">
          {jobs.length === 0 ? (
            <p className="border border-line p-4 text-sm text-steel">Na nástěnce teď nic není. Zkuste to později.</p>
          ) : (
            jobs.map((job) => <JobCard key={job.id} job={job} />)
          )}
        </div>
      </section>
    </main>
  );
}
