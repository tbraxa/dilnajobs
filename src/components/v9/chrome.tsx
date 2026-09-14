"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { NAV } from "@/lib/nav-cta";

export function LogoMark() {
  return (
    <span className="logo-mark" aria-hidden="true">
      <span />
      <span />
      <span />
      <span />
    </span>
  );
}

type HeaderKind = "seeker" | "employer" | "login" | "register" | "portal";

function headerKind(pathname: string): HeaderKind {
  if (pathname === NAV.login || pathname.startsWith(`${NAV.login}/`)) return "login";
  if (pathname === NAV.register) return "register";
  if (pathname.startsWith("/firma")) return "portal";
  if (pathname.startsWith("/pro-firmy")) return "employer";
  return "seeker";
}

export function SiteHeader({ postHref }: { postHref: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const kind = headerKind(pathname);
  const nabidkyOn = pathname.startsWith("/nabidky") || pathname.startsWith("/nabidka") || pathname.startsWith("/prace") || pathname === "/";
  const firmyOn = pathname.startsWith("/pro-firmy");
  const signedIn = postHref === NAV.createJob;
  const employerPrimaryHref = signedIn ? NAV.createJob : NAV.register;
  const employerPrimaryLabel = signedIn ? "Nová nabídka" : "Založit účet firmy";

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="site-header">
      <div className="wrap header-inner">
        <Link className="logo" href={NAV.home} aria-label="DílnaJobs">
          <LogoMark />
          DílnaJobs
        </Link>
        <nav className="nav-main" aria-label="Hlavní">
          <Link href={NAV.nabidky} className={nabidkyOn && kind === "seeker" ? "is-active" : undefined}>
            Nabídky
          </Link>
          {kind !== "seeker" ? (
            <Link href={NAV.proFirmy} className={firmyOn ? "is-active" : undefined}>
              Pro firmy
            </Link>
          ) : null}
        </nav>
        <div className="header-actions">
          {kind === "seeker" ? (
            <>
              <Link className="link-quiet" href={NAV.proFirmy}>
                Pro firmy
              </Link>
              <Link className="btn btn-outline btn-sm" href={postHref}>
                Inzerovat
              </Link>
            </>
          ) : null}
          {kind === "employer" || kind === "portal" ? (
            <>
              {kind === "employer" ? (
                <Link className="btn btn-ghost btn-sm" href={NAV.login}>
                  Přihlásit se
                </Link>
              ) : (
                <Link className="btn btn-ghost btn-sm" href="/firma">
                  Firma
                </Link>
              )}
              <Link className="btn btn-primary btn-sm" href={employerPrimaryHref}>
                {employerPrimaryLabel}
              </Link>
            </>
          ) : null}
          {kind === "login" ? (
            <Link className="btn btn-ghost btn-sm" href={NAV.register}>
              Registrace firmy
            </Link>
          ) : null}
          {kind === "register" ? (
            <Link className="btn btn-ghost btn-sm" href={NAV.login}>
              Přihlášení firem
            </Link>
          ) : null}
        </div>
        <button
          type="button"
          className="menu-toggle"
          aria-label="Menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
      <nav className={`nav-drawer wrap${open ? " is-open" : ""}`} aria-label="Mobilní">
        <Link href={NAV.nabidky}>Nabídky</Link>
        <Link href={NAV.proFirmy}>Pro firmy</Link>
        {kind === "login" ? (
          <Link href={NAV.register}>Registrace firmy</Link>
        ) : kind === "register" ? (
          <Link href={NAV.login}>Přihlášení firem</Link>
        ) : kind === "employer" ? (
          <>
            <Link href={NAV.login}>Přihlášení firem</Link>
            <Link href={NAV.register}>Registrace firmy</Link>
          </>
        ) : (
          <>
            <Link href={NAV.login}>Přihlášení firem</Link>
            <Link href={postHref}>{kind === "seeker" ? "Inzerovat nabídku" : employerPrimaryLabel}</Link>
          </>
        )}
      </nav>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="wrap footer-inner">
        <span>© 2026 DílnaJobs · nabídky práce ve výrobě</span>
        <div className="footer-links">
          <Link href={NAV.nabidky}>Nabídky</Link>
          <Link href={NAV.proFirmy}>Pro firmy</Link>
          <Link href={NAV.login}>Přihlášení</Link>
        </div>
      </div>
    </footer>
  );
}

export function FilterToggle() {
  return (
    <button
      type="button"
      className="btn btn-ghost btn-sm filter-toggle"
      onClick={() => document.getElementById("filtry")?.classList.toggle("is-open")}
    >
      Zobrazit filtry
    </button>
  );
}
