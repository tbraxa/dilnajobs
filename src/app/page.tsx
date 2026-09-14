import { CatalogUnavailable } from "@/components/catalog-unavailable";
import { FilterChips } from "@/components/preview/filters";
import { PreviewJobRow } from "@/components/preview/job-row";
import { SpriteIcon } from "@/components/preview/sprite";
import { PROFESSIONS } from "@/lib/catalog";
import { loadFeaturedJobs } from "@/lib/jobs/search";
import { PACKAGES, formatCzk } from "@/lib/pricing";

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

const tease = PACKAGES.filter((p) => p.code === "trial" || p.code === "single" || p.code === "basic");

export default async function HomePage() {
  const catalog = await loadFeaturedJobs(6);
  const jobs = catalog.ok ? catalog.rows : [];
  return (
    <main>
      <section className="hero wrap">
        <div className="hero-copy">
          <p className="micro">Výroba · ČR · bez agentur</p>
          <h1 className="display">
            Práce ve výrobě.
            <br />
            Napřímo z dílny.
          </h1>
          <p className="lead">
            CNC, svářeči, seřizovači, průmysloví elektrikáři, údržba. Inzerují výrobní firmy. Uchazeč se hlásí jménem a
            telefonem — účet zakládat nemusíte.
          </p>
          <div className="hero-actions">
            <a className="btn btn-square btn-primary" href="/nabidky">
              Hledat nabídky
            </a>
            <a className="btn btn-square btn-ghost" href="/pro-firmy">
              Jste firma?
            </a>
          </div>
        </div>
        <div className="hero-aside">
          <p className="micro">Profese</p>
          <div className="profession-tiles">
            {PROFESSIONS.slice(0, 6).map((p) => (
              <a key={p.db} className="profession-tile" href={`/nabidky?profession=${p.db}`}>
                <span className="mega-icon">
                  <SpriteIcon name={ICONS[p.db] ?? "operator"} />
                </span>
                {p.label}
              </a>
            ))}
          </div>
          <p>Hledání jde proti živé databázi, ne proti statickému seznamu.</p>
        </div>
      </section>

      <section className="section wrap">
        <div className="section-head">
          <div>
            <p className="micro">Nástěnka</p>
            <h2 className="display">Aktuální nabídky</h2>
          </div>
          <a href="/nabidky">Všechny</a>
        </div>
        <FilterChips />
        <div className="jobs-live">
          {!catalog.ok ? (
            <CatalogUnavailable />
          ) : jobs.length === 0 ? (
            <p className="empty">Na nástěnce teď nic není. Zkuste to později.</p>
          ) : (
            jobs.map((job) => <PreviewJobRow key={job.id} job={job} />)
          )}
        </div>
      </section>

      <section className="employer-band">
        <div className="wrap employer-band-inner">
          <div>
            <p className="micro">Zaměstnavatelé</p>
            <h2 className="display">Nabíráte do výroby?</h2>
            <p>
              Inzerují jen firmy s IČO. Agentury neregistrujeme. Ceny bez DPH. Přihlášení odkazem na e-mail — heslo
              nechceme.
            </p>
          </div>
          <div className="employer-band-actions">
            <a className="btn btn-square btn-on-accent" href="/firma/prihlaseni">
              Přihlásit firmu
            </a>
            <a className="btn btn-square btn-ghost-on-accent" href="/pro-firmy">
              Ceník
            </a>
          </div>
        </div>
      </section>

      <section className="section wrap" id="jak">
        <div className="section-head">
          <div>
            <p className="micro">Jak to funguje</p>
            <h2 className="display">Tři kroky. Žádný účet navíc.</h2>
          </div>
        </div>
        <div className="how">
          <div className="how-step">
            <p className="micro">01</p>
            <h3>Vyberete nabídku</h3>
            <p>Filtr podle profese a města. Mzda je na inzerátu, ne „dle dohody“ jako výmluva.</p>
          </div>
          <div className="how-step">
            <p className="micro">02</p>
            <h3>Napíšete jméno a telefon</h3>
            <p>Účet zakládat nemusíte. Životopis je volitelný.</p>
          </div>
          <div className="how-step">
            <p className="micro">03</p>
            <h3>Ozve se firma</h3>
            <p>Přihláška jde napřímo zaměstnavateli. Agenturu sem nepouštíme.</p>
          </div>
        </div>
      </section>

      <section className="section wrap">
        <div className="section-head">
          <div>
            <p className="micro">Ceník</p>
            <h2 className="display">Tři vstupy. Žádný balíček navíc.</h2>
          </div>
          <a href="/pro-firmy">Celý ceník</a>
        </div>
        <div className="pricing-tease">
          {tease.map((pkg) => (
            <article key={pkg.code} className="price-card">
              <p className="micro">{pkg.name}</p>
              <p className="price">{pkg.priceCzkExVat === 0 ? "0 Kč" : formatCzk(pkg.priceCzkExVat)}</p>
              <p className="vat">bez DPH</p>
              <p className="blurb">{pkg.blurb}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
