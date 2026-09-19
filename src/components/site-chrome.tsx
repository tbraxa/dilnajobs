"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { BRAND, BRAND_CLAIM, PUBLIC_DOMAIN } from "@/lib/brand";

function BrandMark() {
  return (
    <Link href="/" className="brand" aria-label={`${BRAND} domů`}>
      <span className="brand-mark" aria-hidden="true">
        F
      </span>
      {BRAND}
    </Link>
  );
}

export function SiteHeader({ pathname = "" }: { pathname?: string }) {
  const [megaOpen, setMegaOpen] = useState(false);
  const megaId = useId();
  const btnRef = useRef<HTMLButtonElement>(null);
  const megaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMegaOpen(false);
    }
    function onClick(e: MouseEvent) {
      const t = e.target as Node;
      if (
        megaOpen &&
        megaRef.current &&
        !megaRef.current.contains(t) &&
        btnRef.current &&
        !btnRef.current.contains(t)
      ) {
        setMegaOpen(false);
      }
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClick);
    };
  }, [megaOpen]);

  const nabidkyActive = pathname.startsWith("/nabidky") || pathname.startsWith("/nabidka");

  return (
    <div className="top-wrap">
      <header className="top" role="banner">
        <BrandMark />
        <nav className="nav" aria-label="Hlavní">
          <Link
            href="/nabidky"
            className={nabidkyActive ? "active" : undefined}
            aria-current={nabidkyActive ? "page" : undefined}
          >
            Nabídky
          </Link>
          <button
            ref={btnRef}
            type="button"
            aria-expanded={megaOpen}
            aria-controls={megaId}
            onClick={() => setMegaOpen((v) => !v)}
          >
            Průvodce
          </button>
          <Link href="/pro-firmy">Pro firmy</Link>
          <Link href="/ucet">Vytvořit životopis</Link>
        </nav>
        <div className="top-actions">
          <Link className="btn btn-secondary btn-sm" href="/ucet/prihlaseni">
            Přihlásit se
          </Link>
          <Link className="btn btn-primary btn-sm" href="/firma/prihlaseni">
            Přihlášení firem
          </Link>
        </div>
      </header>

      <div ref={megaRef} className={`mega${megaOpen ? " open" : ""}`} id={megaId} hidden={!megaOpen}>
        <div className="mega-inner">
          <div>
            <h3>Poradna</h3>
            <Link href="/#poradna" onClick={() => setMegaOpen(false)}>
              Jak hledat práci
            </Link>
            <Link href="/#poradna" onClick={() => setMegaOpen(false)}>
              Mzda a vyjednávání
            </Link>
            <Link href="/#poradna" onClick={() => setMegaOpen(false)}>
              Všechny články →
            </Link>
          </div>
          <div>
            <h3>Kurzy</h3>
            <Link href="/#kurzy" onClick={() => setMegaOpen(false)}>
              Rekvalifikace
            </Link>
            <Link href="/#kurzy" onClick={() => setMegaOpen(false)}>
              Online kurzy
            </Link>
            <Link href="/#kurzy" onClick={() => setMegaOpen(false)}>
              Všechny kurzy →
            </Link>
          </div>
          <div>
            <h3>Nástroje</h3>
            <Link href="/#nastroje" onClick={() => setMegaOpen(false)}>
              Kalkulačka čisté mzdy
            </Link>
            <Link href="/#nastroje" onClick={() => setMegaOpen(false)}>
              Srovnání platů
            </Link>
          </div>
          <div className="rail-card">
            <p>Uložte nabídky do účtu. Sledujte odpovědi v čase.</p>
            <Link className="btn btn-primary btn-sm" href="/ucet/prihlaseni" onClick={() => setMegaOpen(false)}>
              Přihlásit se
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div>
          <div className="brand-mini">{BRAND}</div>
          <p style={{ margin: "6px 0 0" }}>{BRAND_CLAIM}</p>
          <p className="muted" style={{ margin: "4px 0 0", fontSize: 12 }}>
            {PUBLIC_DOMAIN}
          </p>
        </div>
        <nav aria-label="Patička">
          <Link href="/nabidky">Nabídky</Link>
          <Link href="/#poradna">Poradna</Link>
          <Link href="/#kurzy">Kurzy</Link>
          <Link href="/pro-firmy">Pro firmy</Link>
          <Link href="/ucet">Účet</Link>
          <Link href="/gdpr">Ochrana soukromí</Link>
          <Link href="/obchodni-podminky">Obchodní podmínky</Link>
        </nav>
      </div>
    </footer>
  );
}

export function ConsoleTop({ children }: { children?: ReactNode }) {
  return (
    <div className="top-wrap">
      <header className="top" role="banner" style={{ minHeight: 56 }}>
        <BrandMark />
        <nav className="nav" aria-label="Veřejná">
          <Link href="/nabidky">Nabídky</Link>
          <Link href="/pro-firmy">Pro firmy</Link>
          <Link href="/ucet">Vytvořit životopis</Link>
        </nav>
        <div className="top-actions">{children}</div>
      </header>
    </div>
  );
}
