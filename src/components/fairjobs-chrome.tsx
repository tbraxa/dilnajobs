import Link from "next/link";
import { FairJobsLockup } from "./fairjobs-brand";

const candidateLinks = [
  { href: "/nabidky", label: "Nabídky práce" },
  { href: "/pro-firmy", label: "Pro firmy" },
  { href: "/pro-firmy#cenik", label: "Ceník" },
];

export function FairJobsHeader() {
  return (
    <header className="fj-header">
      <div className="fj-header-inner">
        <Link href="/" className="fj-brand-link" aria-label="FairJobs, úvodní stránka">
          <FairJobsLockup />
        </Link>

        <nav className="fj-desktop-nav" aria-label="Hlavní navigace">
          {candidateLinks.map((item) => (
            <Link key={item.href} href={item.href} className="fj-nav-link">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="fj-header-actions">
          <Link href="/firma/prihlaseni" className="fj-company-login">
            Přihlášení firem
          </Link>
          <Link href="/firma/registrace" className="fj-header-cta">
            Vložit nabídku
          </Link>
        </div>

        <details className="fj-mobile-menu">
          <summary aria-label="Otevřít navigaci">
            <span />
            <span />
            <span />
          </summary>
          <div className="fj-mobile-menu-panel">
            {candidateLinks.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
            <Link href="/firma/prihlaseni">Přihlášení firem</Link>
            <Link href="/firma/registrace" className="fj-mobile-menu-cta">
              Vložit nabídku
            </Link>
          </div>
        </details>
      </div>
    </header>
  );
}

export function FairJobsFooter() {
  return (
    <footer className="fj-footer">
      <div className="fj-footer-top">
        <div className="fj-footer-promise">
          <p className="fj-eyebrow fj-eyebrow-light">FairJobs pro celé Česko</p>
          <h2>Práce nemá být hádanka.</h2>
          <p>Jasná mzda, skutečná firma a podmínky, které znáte před odpovědí.</p>
        </div>
        <Link href="/nabidky" className="fj-footer-search-link">
          Projít nabídky
          <span aria-hidden="true">→</span>
        </Link>
      </div>

      <div className="fj-footer-grid">
        <div className="fj-footer-brand">
          <Link href="/" aria-label="FairJobs, úvodní stránka">
            <FairJobsLockup inverse />
          </Link>
          <p>Český pracovní portál pro všechny profese. Odpovídáte přímo zaměstnavateli.</p>
        </div>

        <div>
          <p className="fj-footer-heading">Pro uchazeče</p>
          <Link href="/nabidky">Nabídky práce</Link>
          <Link href="/nabidky?sort=salary">Práce podle mzdy</Link>
          <Link href="/gdpr">Ochrana údajů</Link>
        </div>

        <div>
          <p className="fj-footer-heading">Pro firmy</p>
          <Link href="/pro-firmy">Jak FairJobs funguje</Link>
          <Link href="/pro-firmy#cenik">Ceník inzerce</Link>
          <Link href="/firma/prihlaseni">Přihlášení firem</Link>
        </div>

        <div>
          <p className="fj-footer-heading">FairJobs</p>
          <Link href="/obchodni-podminky">Obchodní podmínky</Link>
          <a href="mailto:ahoj@fairjobs.cz">ahoj@fairjobs.cz</a>
          <p className="fj-footer-domain">fairjobs.cz</p>
        </div>
      </div>

      <div className="fj-footer-bottom">
        <span>© {new Date().getFullYear()} FairJobs</span>
        <span>Práce s jasnými podmínkami</span>
      </div>
    </footer>
  );
}
