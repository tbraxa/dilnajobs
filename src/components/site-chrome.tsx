"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
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
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const offersActive =
    pathname === "/nabidky" || pathname.startsWith("/nabidka/") || pathname.startsWith("/prace/");
  const employersActive = pathname === "/pro-firmy";

  return (
    <header className="site-header">
      <div className="wrap nav">
        <Logo />
        <nav className={`nav-links${menuOpen ? " is-open" : ""}`} id="main-navigation" aria-label={copy.nav.ariaMain}>
          <Link href="/nabidky" aria-current={offersActive ? "page" : undefined} onClick={() => setMenuOpen(false)}>
            {copy.nav.nabidky}
          </Link>
          <Link href="/pro-firmy" aria-current={employersActive ? "page" : undefined} onClick={() => setMenuOpen(false)}>
            {copy.nav.proFirmy}
          </Link>
          <Link className="nav-cta nav-cta-mobile" href="/firma/prihlaseni" onClick={() => setMenuOpen(false)}>
            {copy.nav.login}
          </Link>
        </nav>
        <Link className="nav-cta nav-desktop" href="/firma/prihlaseni">
          {copy.nav.login}
        </Link>
        <button
          className="nav-toggle"
          type="button"
          aria-expanded={menuOpen}
          aria-controls="main-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {copy.nav.ariaMenu}
        </button>
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
          <Link href="/pro-firmy#cenik">{copy.nav.cenik}</Link>
        </div>
      </div>
    </footer>
  );
}
