import Link from "next/link";
import { copy } from "@/lib/copy";

export function Logo({ href = "/" }: { href?: string }) {
  return (
    <Link className="logo" href={href} aria-label={copy.brand}>
      <span className="logo-mark" aria-hidden="true" />
      Fair<span>Jobs</span>
    </Link>
  );
}

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="wrap nav">
        <Logo />
        <input id="nav-open" className="nav-checkbox" type="checkbox" />
        <nav className="nav-links" aria-label={copy.nav.ariaMain}>
          <Link href="/nabidky">{copy.nav.nabidky}</Link>
          <Link href="/pro-firmy">{copy.nav.proFirmy}</Link>
          <Link className="nav-cta nav-cta-mobile" href="/firma/prihlaseni">
            {copy.nav.login}
          </Link>
        </nav>
        <Link className="nav-cta" href="/firma/prihlaseni">
          {copy.nav.login}
        </Link>
        <label className="nav-toggle" htmlFor="nav-open">
          {copy.nav.ariaMenu}
        </label>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="wrap footer-inner">
        <div>
          <div className="footer-brand">
            <span className="logo-mark" aria-hidden="true" />
            {copy.brand}
          </div>
          <div>{copy.footer}</div>
        </div>
        <div className="footer-links">
          <Link href="/nabidky">{copy.nav.nabidky}</Link>
          <Link href="/pro-firmy">{copy.nav.proFirmy}</Link>
          <Link href="/firma/prihlaseni">{copy.nav.login}</Link>
          <Link href="/gdpr">{copy.nav.personalData}</Link>
        </div>
      </div>
    </footer>
  );
}
