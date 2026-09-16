import Image from "next/image";
import Link from "next/link";
import { CompanyLogo } from "@/components/company-logo";
import { HomeJobLine } from "@/components/fairjobs-job-row";
import { loadFeaturedJobs } from "@/lib/jobs/search";
import { formatSalary } from "@/lib/pricing";
import { cleanUiText, FAIRJOBS_PHOTOS } from "@/lib/fairjobs-visual";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const catalog = await loadFeaturedJobs(7);
  const jobs = catalog.ok ? catalog.rows : [];
  const leadJob = jobs[0];
  const moreJobs = jobs.slice(1);

  return (
    <main className="fj-home">
      <section className="fj-home-cover">
        <div className="fj-home-cover-copy">
          <p className="fj-eyebrow fj-eyebrow-light">Práce pro celé Česko</p>
          <h1 className="fj-display">Práce, která sedí vašemu životu.</h1>
          <p className="fj-home-lead">
            Mzda, místo a podmínky dřív, než odpovíte. Od kanceláře přes nemocnici až po provoz.
          </p>

          <form action="/nabidky" method="get" className="fj-home-finder">
            <label>
              <span>Co chcete dělat</span>
              <input name="q" placeholder="Pozice, obor nebo firma" />
            </label>
            <label>
              <span>Kde chcete pracovat</span>
              <input name="city" list="home-cities" placeholder="Město nebo kraj" />
            </label>
            <button type="submit">
              Najít práci
              <span aria-hidden="true">→</span>
            </button>
          </form>
          <datalist id="home-cities">
            <option value="Praha" />
            <option value="Brno" />
            <option value="Ostrava" />
            <option value="Plzeň" />
            <option value="Olomouc" />
          </datalist>

          <div className="fj-home-quicklinks">
            <span>Teď se hledá</span>
            <Link href="/nabidky?q=administrativa">Administrativa</Link>
            <Link href="/nabidky?q=zdravotnictvi">Zdravotnictví</Link>
            <Link href="/nabidky?workMode=remote">Na dálku</Link>
          </div>
        </div>

        <div className="fj-home-cover-photo">
          <Image
            src={FAIRJOBS_PHOTOS.homeCover.src}
            alt={FAIRJOBS_PHOTOS.homeCover.alt}
            fill
            priority
            sizes="(max-width: 900px) 100vw, 44vw"
          />
          <div className="fj-photo-caption">
            <span>01</span>
            <p>Skutečné firmy. Skutečná pracoviště.</p>
          </div>
        </div>
      </section>

      <section className="fj-market-pulse" aria-label="Výhody FairJobs">
        <p><strong>Mzda</strong> tam, kde ji hledáte</p>
        <p><strong>Ověřená firma</strong> podle IČO</p>
        <p><strong>Odpověď bez účtu</strong> přímo zaměstnavateli</p>
      </section>

      <section className="fj-live-board">
        <div className="fj-section-heading">
          <div>
            <p className="fj-eyebrow">Nové příležitosti</p>
            <h2 className="fj-display">Dnes na FairJobs</h2>
          </div>
          <Link href="/nabidky" className="fj-text-link">
            Všechny nabídky <span aria-hidden="true">→</span>
          </Link>
        </div>

        {!catalog.ok ? (
          <div className="fj-catalog-message">
            <strong>Nabídky teď nejde načíst.</strong>
            <span>Zkuste stránku obnovit za chvíli.</span>
          </div>
        ) : jobs.length === 0 ? (
          <div className="fj-catalog-message">
            <strong>Teď tu nejsou nové nabídky.</strong>
            <span>Zkuste se vrátit později.</span>
          </div>
        ) : (
          <div className="fj-live-board-layout">
            {leadJob ? (
              <article className="fj-lead-job">
                <div className="fj-lead-job-head">
                  <CompanyLogo companyName={leadJob.companyName} className="fj-lead-company-logo" />
                  {leadJob.verificationStatus === "verified" ? (
                    <span className="fj-verified-badge fj-verified-badge-light">✓ Ověřeno</span>
                  ) : null}
                </div>
                <div className="fj-lead-job-body">
                  <p>Doporučená nabídka</p>
                  <h3 className="fj-display">
                    <Link href={`/nabidka/${leadJob.slug}`}>{cleanUiText(leadJob.title)}</Link>
                  </h3>
                  <span>{cleanUiText(leadJob.companyName)} · {cleanUiText(leadJob.city)}</span>
                  <strong>{cleanUiText(formatSalary(leadJob.salaryMin, leadJob.salaryMax, leadJob.salaryNote))}</strong>
                </div>
                <Link href={`/nabidka/${leadJob.slug}`} className="fj-lead-job-link">
                  Detail nabídky <span aria-hidden="true">→</span>
                </Link>
              </article>
            ) : null}
            <div className="fj-home-job-list">
              {moreJobs.map((job) => (
                <HomeJobLine key={job.id} job={job} />
              ))}
            </div>
          </div>
        )}
      </section>

      <section className="fj-advice-module">
        <div className="fj-section-heading">
          <div>
            <p className="fj-eyebrow">Z poradny</p>
            <h2 className="fj-display">Rozhodujte se s jistotou.</h2>
          </div>
          <Link href="/poradna" className="fj-text-link">
            Všechny články <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div className="fj-editorial-layout">
          <article className="fj-editorial-lead">
            <Link href="/poradna" className="fj-editorial-image">
              <Image
                src={FAIRJOBS_PHOTOS.healthcare.src}
                alt={FAIRJOBS_PHOTOS.healthcare.alt}
                fill
                sizes="(max-width: 800px) 100vw, 50vw"
              />
            </Link>
            <div>
              <span>Téma poradny</span>
              <h3 className="fj-display">
                <Link href="/poradna">Mzda a vyjednávání</Link>
              </h3>
              <p>Orientace v odměně a příprava na otevřený rozhovor s firmou.</p>
            </div>
          </article>

          <div className="fj-editorial-stack">
            <article>
              <div className="fj-editorial-thumb">
                <Image src={FAIRJOBS_PHOTOS.service.src} alt={FAIRJOBS_PHOTOS.service.alt} fill sizes="180px" />
              </div>
              <div>
                <span>Téma poradny</span>
                <h3><Link href="/poradna">Jak hledat práci</Link></h3>
                <p>Životopis, pohovor a první dny v nové práci.</p>
              </div>
            </article>
            <article>
              <div className="fj-editorial-thumb">
                <Image src={FAIRJOBS_PHOTOS.engineering.src} alt={FAIRJOBS_PHOTOS.engineering.alt} fill sizes="180px" />
              </div>
              <div>
                <span>Téma poradny</span>
                <h3><Link href="/poradna">Změna oboru</Link></h3>
                <p>Rekvalifikace a převod zkušeností do nové role.</p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="fj-courses-module">
        <div className="fj-courses-heading">
          <p className="fj-eyebrow">Kurzy a rekvalifikace</p>
          <h2 className="fj-display">Další krok může začít kurzem.</h2>
          <p>Vybrané možnosti pro změnu oboru, doplnění kvalifikace i návrat do práce.</p>
        </div>
        <div className="fj-course-empty">
          <div>
            <strong>Kurzy připravujeme</strong>
            <p>Katalog otevřeme až s ověřenými poskytovateli, cenou a jasnými výsledky kurzu.</p>
          </div>
          <Link href="/kurzy" className="fj-secondary-button">Prohlédnout sekci kurzů</Link>
        </div>
      </section>

      <section className="fj-tools-module">
        <div className="fj-tools-copy">
          <p className="fj-eyebrow fj-eyebrow-light">Nástroje FairJobs</p>
          <h2 className="fj-display">Kolik vám zůstane z výplaty?</h2>
          <p>Spočítejte si čistou mzdu během minuty. Bez registrace a bez ukládání osobních údajů.</p>
          <Link href="/nastroje/cisty-plat" className="fj-secondary-button fj-tools-primary">
            Otevřít kalkulačku čisté mzdy <span aria-hidden="true">→</span>
          </Link>
          <Link href="/nastroje" className="fj-tools-hub-link">Všechny nástroje</Link>
        </div>
        <div className="fj-salary-calculator" aria-label="Ukázka kalkulačky čisté mzdy">
          <div className="fj-calculator-head">
            <span>Kalkulačka čisté mzdy</span>
            <small>2026</small>
          </div>
          <label><span>Hrubá mzda</span><strong>45 000 Kč</strong></label>
          <div className="fj-calculator-rule" />
          <div className="fj-calculator-result">
            <span>Odhad čisté mzdy</span>
            <strong>35 920 Kč</strong>
            <small>Orientační výpočet bez dalších slev</small>
          </div>
        </div>
      </section>

      <section className="fj-workplace-story">
        <div className="fj-workplace-image">
          <Image
            src={FAIRJOBS_PHOTOS.workplace.src}
            alt={FAIRJOBS_PHOTOS.workplace.alt}
            fill
            sizes="(max-width: 900px) 100vw, 64vw"
          />
        </div>
        <div className="fj-workplace-copy">
          <p className="fj-eyebrow">Místo je součást práce</p>
          <h2 className="fj-display">Nevolíte jen pozici. Volíte si celý pracovní den.</h2>
          <p>
            FairJobs dává vedle náplně práce prostor i týmu, prostředí, režimu a tomu, jak firma odpovídá.
          </p>
          <Link href="/nabidky" className="fj-secondary-button">
            Podívat se dovnitř firem
          </Link>
          <div className="fj-workplace-note">
            <span>02</span>
            <p>Fotografie pracoviště, jasná mzda a ověřená identita na jednom místě.</p>
          </div>
        </div>
      </section>

      <section className="fj-employer-invite">
        <div>
          <p className="fj-eyebrow">Nabíráte?</p>
          <h2 className="fj-display">Ukažte lidem, proč má smysl pracovat právě u vás.</h2>
        </div>
        <div>
          <p>Firemní profil, jasný ceník a odpovědi uchazečů na jednom místě.</p>
          <Link href="/pro-firmy" className="fj-primary-button">FairJobs pro firmy</Link>
        </div>
      </section>
    </main>
  );
}
