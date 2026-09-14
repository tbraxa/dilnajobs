"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { NAV } from "@/lib/nav-cta";

export function LogoMark() {
  return (
    <span className="logo-mark" aria-hidden="true">
      <i />
      <i />
      <i />
      <i />
    </span>
  );
}

export function SiteHeader({ postHref }: { postHref: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const nabidkyOn = pathname.startsWith("/nabidky") || pathname.startsWith("/nabidka") || pathname.startsWith("/prace");
  const firmyOn = pathname.startsWith("/pro-firmy");

  return (
    <header className="site-header">
      <div className="wrap header-row">
        <Link className="logo" href={NAV.home}>
          <LogoMark />
          DílnaJobs
        </Link>
        <nav className="nav" aria-label="Hlavní">
          <Link href={NAV.nabidky} aria-current={nabidkyOn ? "page" : undefined}>
            Nabídky
          </Link>
          <Link href={NAV.proFirmy} aria-current={firmyOn ? "page" : undefined}>
            Pro firmy
          </Link>
        </nav>
        <span className="spacer" />
        <Link className="link-quiet" href={postHref}>
          Inzerovat
        </Link>
        <button
          type="button"
          className="nav-toggle"
          aria-label="Menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
        </button>
      </div>
      <div className={`nav-mobile${open ? " is-open" : ""}`}>
        <Link href={NAV.nabidky}>Nabídky</Link>
        <Link href={NAV.proFirmy}>Pro firmy</Link>
        <Link href={postHref}>Inzerovat</Link>
        <Link href={NAV.login}>Přihlášení firmy</Link>
      </div>
    </header>
  );
}

export function SiteFooter({ postHref }: { postHref: string }) {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <span>© 2026 DílnaJobs · nabídky práce ve výrobě</span>
        <span>
          <Link href={NAV.login}>Přihlášení firmy</Link>
          {" · "}
          <Link href={postHref}>Inzerovat</Link>
          {" · "}
          <Link href="/gdpr">Osobní údaje</Link>
          {" · "}
          <Link href="/obchodni-podminky">Podmínky</Link>
          {" · "}
          <a href="mailto:ahoj@dilnajobs.cz">ahoj@dilnajobs.cz</a>
        </span>
      </div>
    </footer>
  );
}
