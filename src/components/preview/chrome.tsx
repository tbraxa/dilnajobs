"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { PROFESSIONS } from "@/lib/catalog";
import { LogoMark, SpriteIcon } from "./sprite";

const PROFESSION_ICON: Record<string, string> = {
  cnc: "cnc",
  welder: "welder",
  setter: "setter",
  electrician: "electrician",
  maintenance: "maintenance",
  locksmith: "locksmith",
  operator: "operator",
};

export function PreviewHeader() {
  const pathname = usePathname();
  const [hidden, setHidden] = useState(false);
  const [isTop, setIsTop] = useState(true);
  const [openMega, setOpenMega] = useState<string | null>(null);
  const [drawer, setDrawer] = useState(false);
  const lastY = useRef(0);
  const deltaAccum = useRef(0);
  const leaveTimer = useRef<number>(0);

  useEffect(() => {
    setDrawer(false);
    setOpenMega(null);
  }, [pathname]);

  useEffect(() => {
    document.body.classList.toggle("drawer-open", drawer);
    document.body.style.overflow = drawer ? "hidden" : "";
    return () => {
      document.body.classList.remove("drawer-open");
      document.body.style.overflow = "";
    };
  }, [drawer]);

  useEffect(() => {
    document.body.classList.toggle("mega-open", Boolean(openMega));
    return () => document.body.classList.remove("mega-open");
  }, [openMega]);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || 0;
      const delta = y - lastY.current;
      if (y < 16) {
        setHidden(false);
        setIsTop(true);
        lastY.current = y;
        return;
      }
      setIsTop(false);
      deltaAccum.current += delta;
      if (Math.abs(deltaAccum.current) < 8) {
        lastY.current = y;
        return;
      }
      if (document.body.classList.contains("drawer-open")) {
        setHidden(false);
        lastY.current = y;
        deltaAccum.current = 0;
        return;
      }
      if (deltaAccum.current > 0 && y > 80) {
        setHidden(true);
        setOpenMega(null);
      } else if (deltaAccum.current < 0) {
        setHidden(false);
      }
      deltaAccum.current = 0;
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenMega(null);
        setDrawer(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  function enterMega(id: string) {
    window.clearTimeout(leaveTimer.current);
    setOpenMega(id);
  }
  function leaveHeader() {
    leaveTimer.current = window.setTimeout(() => setOpenMega(null), 200);
  }

  const headerClass = `site-header${hidden ? " is-hidden" : ""}${isTop ? " is-top" : ""}`;

  return (
    <>
      <div className="top-strip">
        <span className="top-strip__dot" aria-hidden="true" />
        LIVE · nabídky z výrobních firem · bez agentur
      </div>
      <header className={headerClass} onMouseEnter={() => window.clearTimeout(leaveTimer.current)} onMouseLeave={leaveHeader}>
        <div className="wrap header-inner">
          <Link className="logo" href="/">
            <LogoMark />
            DílnaJobs
          </Link>
          <nav className="nav-desktop" aria-label="Hlavní">
            <div className="nav-item" onMouseEnter={() => enterMega("nabidky")}>
              <button
                className="nav-trigger"
                type="button"
                data-mega="nabidky"
                aria-expanded={openMega === "nabidky"}
                aria-controls="mega-nabidky"
                onClick={() => setOpenMega((v) => (v === "nabidky" ? null : "nabidky"))}
              >
                Nabídky
              </button>
              <div className={`mega-panel${openMega === "nabidky" ? " is-open" : ""}`} id="mega-nabidky">
                <div className="mega-grid">
                  {PROFESSIONS.slice(0, 6).map((p) => (
                    <Link key={p.db} className="mega-item" href={`/nabidky?profession=${p.db}`}>
                      <span className="mega-icon">
                        <SpriteIcon name={PROFESSION_ICON[p.db] ?? "operator"} />
                      </span>
                      {p.label}
                    </Link>
                  ))}
                </div>
                <p className="mega-note">Živý katalog. Agentury neregistrujeme.</p>
              </div>
            </div>
            <div className="nav-item" onMouseEnter={() => enterMega("firmy")}>
              <button
                className="nav-trigger"
                type="button"
                data-mega="firmy"
                aria-expanded={openMega === "firmy"}
                aria-controls="mega-firmy"
                onClick={() => setOpenMega((v) => (v === "firmy" ? null : "firmy"))}
              >
                Pro firmy
              </button>
              <div className={`mega-panel${openMega === "firmy" ? " is-open" : ""}`} id="mega-firmy">
                <div className="mega-grid">
                  <Link className="mega-item" href="/pro-firmy">
                    <span className="mega-icon">
                      <SpriteIcon name="building" />
                    </span>
                    Ceník
                  </Link>
                  <Link className="mega-item" href="/firma/prihlaseni">
                    <span className="mega-icon">
                      <SpriteIcon name="steps" />
                    </span>
                    Přihlásit firmu
                  </Link>
                </div>
                <p className="mega-note">Jen přímí zaměstnavatelé s IČO.</p>
              </div>
            </div>
            <div className="nav-item">
              <Link className="nav-trigger" href="/#jak">
                Jak to funguje
              </Link>
            </div>
          </nav>
          <Link className="btn btn-square btn-accent header-cta" href="/firma/prihlaseni">
            Přidat nabídku
          </Link>
          <button
            className="nav-toggle"
            type="button"
            aria-expanded={drawer}
            aria-controls="mobile-drawer"
            onClick={() => setDrawer((v) => !v)}
          >
            <span />
            <span className="sr-only">Menu</span>
          </button>
        </div>
      </header>
      <button
        className={`drawer-backdrop${drawer ? " is-open" : ""}`}
        type="button"
        aria-label="Zavřít"
        onClick={() => setDrawer(false)}
      />
      <aside className={`mobile-drawer${drawer ? " is-open" : ""}`} id="mobile-drawer" aria-hidden={!drawer}>
        <div className="drawer-head">
          Menu
          <button className="close" type="button" data-drawer-close onClick={() => setDrawer(false)}>
            ×
          </button>
        </div>
        <nav className="drawer-nav">
          <Link href="/nabidky" data-drawer-close>
            <span className="mega-icon">
              <SpriteIcon name="search" />
            </span>
            Nabídky
          </Link>
          <Link href="/pro-firmy" data-drawer-close>
            <span className="mega-icon">
              <SpriteIcon name="building" />
            </span>
            Pro firmy
          </Link>
          <Link href="/#jak" data-drawer-close>
            <span className="mega-icon">
              <SpriteIcon name="steps" />
            </span>
            Jak to funguje
          </Link>
          <p className="micro" style={{ margin: "1.25rem 0 0.5rem" }}>
            Profese
          </p>
          {PROFESSIONS.map((p) => (
            <Link key={p.db} href={`/nabidky?profession=${p.db}`} data-drawer-close>
              <span className="mega-icon">
                <SpriteIcon name={PROFESSION_ICON[p.db] ?? "operator"} />
              </span>
              {p.label}
            </Link>
          ))}
        </nav>
        <div className="drawer-cta">
          <Link className="btn btn-square btn-accent" href="/firma/prihlaseni" style={{ width: "100%" }} data-drawer-close>
            Přidat nabídku
          </Link>
        </div>
      </aside>
    </>
  );
}

export function PreviewFooter() {
  return (
    <footer className="site-footer">
      <div className="wrap footer-grid">
        <div>
          <Link className="logo" href="/">
            <LogoMark />
            DílnaJobs
          </Link>
          <p>Práce ve výrobě, napřímo od firem. Agentury neregistrujeme. Cílová doména dilnajobs.cz.</p>
        </div>
        <div>
          <p className="micro">Uchazeči</p>
          <ul>
            <li>
              <a href="/nabidky">Nabídky práce</a>
            </li>
            <li>
              <a href="/gdpr">Osobní údaje</a>
            </li>
          </ul>
        </div>
        <div>
          <p className="micro">Firmy</p>
          <ul>
            <li>
              <a href="/pro-firmy">Ceník</a>
            </li>
            <li>
              <a href="/obchodni-podminky">Obchodní podmínky</a>
            </li>
            <li>
              <a href="/firma/prihlaseni">Přihlášení</a>
            </li>
          </ul>
        </div>
      </div>
      <p className="legal">© {new Date().getFullYear()} DílnaJobs. Provozovatel bude doplněn před spuštěním.</p>
    </footer>
  );
}
