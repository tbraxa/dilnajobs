import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CandidateApplyForm } from "@/components/candidate-apply-form";
import { CompanyLogo } from "@/components/company-logo";
import {
  FavoriteCompanyButton,
  FavoriteJobButton,
} from "@/components/favorite-controls";
import { JsonLd } from "@/components/json-ld";
import { FavoriteLoginContinuation } from "@/components/favorite-login-continuation";
import { loadPublishedJobBySlug } from "@/lib/jobs/search";
import { formatSalary } from "@/lib/pricing";
import { professionByDb } from "@/lib/catalog";
import { cleanUiBlock, cleanUiText, photoForProfession } from "@/lib/fairjobs-visual";
import {
  getFavoriteCompanyIds,
  getFavoriteJobIds,
} from "@/lib/seeker-account";
import { getSeekerSession } from "@/lib/seeker-auth";
import { breadcrumbsJsonLd, jobPostingJsonLd } from "@/lib/structured-data";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const catalog = await loadPublishedJobBySlug(slug);
  const row = catalog.ok ? catalog.rows : null;
  if (!row) return { title: "Nabídka" };
  return {
    title: `${cleanUiText(row.job.title)} v ${cleanUiText(row.job.city)}`,
    description: cleanUiText(row.job.description).slice(0, 155),
  };
}

export default async function JobPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const query = searchParams ? await searchParams : {};
  const pendingCompanyId =
    typeof query.ulozitFirmu === "string" && /^[0-9a-f-]{36}$/i.test(query.ulozitFirmu)
      ? query.ulozitFirmu
      : null;
  const catalog = await loadPublishedJobBySlug(slug);
  if (!catalog.ok) {
    return (
      <main className="fj-detail-unavailable">
        <strong>Nabídku se teď nepodařilo načíst.</strong>
        <p>Zkuste stránku obnovit za chvíli.</p>
        <Link href="/nabidky" className="fj-secondary-button">Zpět na nabídky</Link>
      </main>
    );
  }
  const row = catalog.rows;
  if (!row) notFound();
  const { job, companyName, ico, verificationStatus, isAgency } = row;
  const seeker = await getSeekerSession();
  const [favoriteJobs, favoriteCompanies] = seeker
    ? await Promise.all([
        getFavoriteJobIds(seeker.userId, [job.id]),
        getFavoriteCompanyIds(seeker.userId, [job.employerId]),
      ])
    : [new Set<string>(), new Set<string>()];
  const profession = professionByDb(job.profession);
  const photo = photoForProfession(job.profession);
  const employment =
    job.employmentType === "part_time"
      ? "Zkrácený úvazek"
      : job.employmentType === "shift"
        ? "Směnný provoz"
        : "Hlavní pracovní poměr";
  const workMode = job.workMode === "remote" ? "Na dálku" : job.workMode === "hybrid" ? "Hybrid" : "Na místě";

  return (
    <main className="fj-job-detail">
      {pendingCompanyId ? (
        <FavoriteLoginContinuation
          id={pendingCompanyId}
          kind="company"
          returnTo={`/nabidka/${job.slug}`}
        />
      ) : null}
      <JsonLd
        id="fairjobs-job-posting"
        data={jobPostingJsonLd({ job, companyName, ico })}
      />
      <JsonLd
        id="fairjobs-job-breadcrumbs"
        data={breadcrumbsJsonLd([
          { name: "FairJobs", path: "/" },
          { name: "Nabídky práce", path: "/nabidky" },
          { name: cleanUiText(job.title), path: `/nabidka/${job.slug}` },
        ])}
      />
      <nav className="fj-breadcrumbs" aria-label="Drobečková navigace">
        <Link href="/">FairJobs</Link>
        <span>›</span>
        <Link href="/nabidky">Nabídky práce</Link>
        <span>›</span>
        <span>{cleanUiText(job.title)}</span>
      </nav>

      <section className="fj-job-identity">
        <div className="fj-job-identity-main">
          <CompanyLogo companyName={companyName} className="fj-detail-company-logo" />
          <div className="fj-detail-company-line">
            <strong>{cleanUiText(companyName)}</strong>
            {verificationStatus === "verified" ? (
              <span className="fj-verified-badge"><span aria-hidden="true">✓</span> Ověřeno</span>
            ) : null}
            {!isAgency ? <span className="fj-direct-badge">Přímý zaměstnavatel</span> : null}
          </div>
          <h1 className="fj-display">{cleanUiText(job.title)}</h1>
          <div className="fj-detail-tags">
            <span>{cleanUiText(job.city)}</span>
            <span>{workMode}</span>
            <span>{employment}</span>
          </div>
        </div>

        <div className="fj-detail-salary">
          <span>Měsíční mzda</span>
          <strong>{cleanUiText(formatSalary(job.salaryMin, job.salaryMax, job.salaryNote))}</strong>
          <small>Hrubá mzda před zdaněním</small>
          <a href="#odpovedet" className="fj-primary-button fj-primary-button-blue">
            Odpovědět na nabídku
          </a>
          <FavoriteJobButton
            jobId={job.id}
            initialSaved={favoriteJobs.has(job.id)}
            returnTo={`/nabidka/${job.slug}`}
            label={`nabídku ${cleanUiText(job.title)}`}
            showText
          />
        </div>
      </section>

      <figure className="fj-detail-photo">
        <Image src={photo.src} alt={photo.alt} fill priority sizes="(max-width: 1280px) 100vw, 1240px" />
        <figcaption>
          <span>Pracovní prostředí</span>
          <small>Ilustrační fotografie oboru</small>
        </figcaption>
      </figure>

      <section className="fj-job-facts">
        <div>
          <span>Profese</span>
          <strong>{profession?.label ?? cleanUiText(job.profession)}</strong>
        </div>
        <div>
          <span>Lokalita</span>
          <strong>{cleanUiText(job.city)}, {cleanUiText(job.region)}</strong>
        </div>
        <div>
          <span>Režim</span>
          <strong>{workMode}</strong>
        </div>
        <div>
          <span>Nástup</span>
          <strong>Dohodou</strong>
        </div>
      </section>

      <div className="fj-job-detail-layout">
        <article className="fj-job-description">
          <div>
            <p className="fj-eyebrow">O pozici</p>
            <h2 className="fj-display">Co vás v práci čeká</h2>
            <p className="fj-job-copy">{cleanUiBlock(job.description)}</p>
          </div>
          {job.requirements ? (
            <div>
              <p className="fj-eyebrow">Koho firma hledá</p>
              <h2 className="fj-display">Co se vám bude hodit</h2>
              <p className="fj-job-copy">{cleanUiBlock(job.requirements)}</p>
            </div>
          ) : null}
          {job.benefits ? (
            <div className="fj-benefits-block">
              <p className="fj-eyebrow">Co firma nabízí</p>
              <h2 className="fj-display">Výhody a benefity</h2>
              <p className="fj-job-copy">{cleanUiBlock(job.benefits)}</p>
            </div>
          ) : null}
        </article>

        <aside className="fj-company-profile">
          <p className="fj-eyebrow">O zaměstnavateli</p>
          <CompanyLogo companyName={companyName} className="fj-profile-company-logo" />
          <h2>{cleanUiText(companyName)}</h2>
          <p>Firma zveřejňuje nabídku přímo a odpověď posíláte jejímu náborovému týmu.</p>
          <FavoriteCompanyButton
            employerId={job.employerId}
            initialSaved={favoriteCompanies.has(job.employerId)}
            returnTo={`/nabidka/${job.slug}`}
            label={`firmu ${cleanUiText(companyName)}`}
            showText
          />
          <dl>
            <div>
              <dt>IČO</dt>
              <dd>{ico}</dd>
            </div>
            <div>
              <dt>Sídlo</dt>
              <dd>{cleanUiText(row.companyCity) || cleanUiText(job.city)}</dd>
            </div>
            <div>
              <dt>Identita</dt>
              <dd>{verificationStatus === "verified" ? "Ověřena" : "Čeká na ověření"}</dd>
            </div>
          </dl>
        </aside>
      </div>

      <section className="fj-apply-section">
        <div className="fj-apply-aside">
          <p className="fj-eyebrow">Odpověď bez účtu</p>
          <h2 className="fj-display">Stačí dvě minuty.</h2>
          <p>Kontakt vyplníte jednou. Životopis je volitelný a dostane ho pouze tato firma.</p>
          <ul>
            <li><span>1</span> Vyplníte kontakt</li>
            <li><span>2</span> Odpověď jde přímo firmě</li>
            <li><span>3</span> Firma se ozve vám</li>
          </ul>
        </div>
        <CandidateApplyForm
          jobId={job.id}
          defaults={
            seeker
              ? {
                  fullName: seeker.name,
                  email: seeker.email,
                  phone: seeker.phone ?? "",
                }
              : undefined
          }
        />
      </section>
    </main>
  );
}
