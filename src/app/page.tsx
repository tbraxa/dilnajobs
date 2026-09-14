import { JobCard } from "@/components/job-card";
import { FilterChips } from "@/components/job-filters";
import { CatalogUnavailable } from "@/components/catalog-unavailable";
import { ButtonLink } from "@/components/ui";
import { IconArrow, IconFactory, professionIcon } from "@/components/icons";
import { PROFESSIONS } from "@/lib/catalog";
import { loadFeaturedJobs } from "@/lib/jobs/search";
import { PACKAGES, formatCzk } from "@/lib/pricing";

export const dynamic = "force-dynamic";

const tease = PACKAGES.filter((p) => p.code === "trial" || p.code === "single" || p.code === "basic");

export default async function HomePage() {
  const catalog = await loadFeaturedJobs(6);
  const jobs = catalog.ok ? catalog.rows : [];
  return (
    <main>
      <section className="rule-grid border-b border-line">
        <div className="shell grid gap-0 lg:grid-cols-12">
          <div className="flex flex-col justify-end border-line py-10 sm:py-14 lg:col-span-7 lg:border-r lg:py-16 lg:pr-10">
            <p className="label">Výroba · ČR · bez agentur</p>
            <h1 className="display mt-4 max-w-[11ch] text-[2.75rem] leading-[0.92] sm:text-6xl lg:text-[4.25rem]">
              Práce ve výrobě.
              <br />
              Napřímo z dílny.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-steel sm:text-lg">
              CNC, svářeči, seřizovači, průmysloví elektrikáři, údržba. Inzerují výrobní firmy. Uchazeč se hlásí
              jménem a telefonem — účet zakládat nemusíte.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/nabidky">
                Hledat nabídky
                <IconArrow className="h-4 w-4" />
              </ButtonLink>
              <ButtonLink href="/pro-firmy" variant="ghost">
                Jste firma?
              </ButtonLink>
            </div>
          </div>
          <div className="border-t border-line bg-paper-0 py-8 lg:col-span-5 lg:border-t-0 lg:py-16 lg:pl-10">
            <p className="label mb-4">Profese</p>
            <ul className="grid grid-cols-2 gap-px border border-line bg-line">
              {PROFESSIONS.slice(0, 6).map((p) => {
                const Icon = professionIcon(p.db);
                return (
                  <li key={p.db} className="bg-paper-0">
                    <a
                      href={`/nabidky?profession=${p.db}`}
                      className="flex h-full items-center gap-3 px-3 py-4 hover:bg-paper"
                    >
                      <span className="icon-tile">
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="text-sm font-semibold leading-tight">{p.label}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
            <p className="mt-5 text-sm text-steel">Hledání jde proti živé databázi, ne proti statickému seznamu.</p>
          </div>
        </div>
      </section>

      <section className="shell py-10 sm:py-12">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="label">Nástěnka</p>
            <h2 className="display mt-2 text-2xl sm:text-3xl">Aktuální nabídky</h2>
          </div>
          <a href="/nabidky" className="inline-flex items-center gap-1 text-sm font-semibold underline decoration-2 underline-offset-4">
            Všechny
            <IconArrow className="h-3.5 w-3.5" />
          </a>
        </div>
        <div className="mt-5">
          <FilterChips />
        </div>
        <div className="mt-5 grid gap-2">
          {!catalog.ok ? (
            <CatalogUnavailable />
          ) : jobs.length === 0 ? (
            <p className="border border-line bg-paper p-4 text-sm text-steel">
              Na nástěnce teď nic není. Zkuste to později.
            </p>
          ) : (
            jobs.map((job) => <JobCard key={job.id} job={job} />)
          )}
        </div>
      </section>

      <section className="bg-accent text-white">
        <div className="shell flex flex-col gap-6 py-10 sm:flex-row sm:items-end sm:justify-between sm:py-12">
          <div className="max-w-xl">
            <p className="font-mono text-[0.6875rem] font-medium tracking-[0.16em] uppercase text-white/80">
              Zaměstnavatelé
            </p>
            <h2 className="display mt-3 text-3xl leading-[1.05] sm:text-4xl">Nabíráte do výroby?</h2>
            <p className="mt-3 text-sm leading-relaxed text-white/90 sm:text-base">
              Inzerují jen firmy s IČO. Agentury neregistrujeme. Ceny bez DPH. Přihlášení odkazem na e-mail — heslo
              nechceme.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href="/firma/prihlaseni"
              className="inline-flex items-center justify-center gap-2 border border-paper-0 bg-paper-0 px-4 py-2.5 text-sm font-semibold text-ink hover:bg-white"
            >
              Přihlásit firmu
            </a>
            <a
              href="/pro-firmy"
              className="inline-flex items-center justify-center gap-2 border border-white bg-transparent px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/10"
            >
              Ceník
            </a>
          </div>
        </div>
      </section>

      <section className="shell py-10 sm:py-12">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="label">Ceník</p>
            <h2 className="display mt-2 text-2xl sm:text-3xl">Tři vstupy. Žádný balíček navíc.</h2>
          </div>
          <a href="/pro-firmy" className="text-sm font-semibold underline decoration-2 underline-offset-4">
            Celý ceník
          </a>
        </div>
        <div className="mt-6 grid gap-px border border-line bg-line sm:grid-cols-3">
          {tease.map((pkg) => (
            <article key={pkg.code} className="bg-paper-0 p-5">
              <p className="label">{pkg.name}</p>
              <p className="display mt-2 text-3xl">
                {pkg.priceCzkExVat === 0 ? "0 Kč" : formatCzk(pkg.priceCzkExVat)}
              </p>
              <p className="text-xs text-steel">bez DPH</p>
              <p className="mt-3 text-sm leading-relaxed text-steel">{pkg.blurb}</p>
            </article>
          ))}
        </div>
        <p className="mt-4 flex items-center gap-2 text-sm text-steel">
          <IconFactory className="h-4 w-4" />
          <span>Standard a Top 7 dní jsou na stránce Pro firmy.</span>
        </p>
      </section>
    </main>
  );
}
