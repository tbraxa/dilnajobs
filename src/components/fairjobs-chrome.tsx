import Link from "next/link";
import { FairJobsLockup } from "./fairjobs-brand";
import { FairJobsNavigation } from "./fairjobs-navigation";

export function FairJobsHeader() {
  return (
    <header className="fj-header">
      <FairJobsNavigation />
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
          <Link href="/poradna">Poradna</Link>
          <Link href="/kurzy">Kurzy</Link>
          <Link href="/nastroje">Nástroje</Link>
        </div>

        <div>
          <p className="fj-footer-heading">Pro firmy</p>
          <Link href="/pro-firmy">Pro firmy</Link>
          <Link href="/pro-firmy#cenik">Ceník</Link>
          <Link href="/firma/prihlaseni">Přihlášení firem</Link>
        </div>

        <div>
          <p className="fj-footer-heading">FairJobs</p>
          <Link href="/zivotopis">Vytvořit životopis</Link>
          <Link href="/obchodni-podminky">Obchodní podmínky</Link>
          <Link href="/gdpr">Ochrana údajů</Link>
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
