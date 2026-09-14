"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { NAV } from "@/lib/nav-cta";
import { Chev, LogoMark, MegaIcon } from "./sprite";

function MegaLink({
  href,
  icon,
  title,
  note,
  drawer,
  onNavigate,
}: {
  href: string;
  icon: string;
  title: string;
  note: string;
  drawer?: boolean;
  onNavigate?: () => void;
}) {
  const className = drawer ? "drawer-link" : "mega-item";
  return (
    <Link
      className={className}
      href={href}
      data-drawer-close={drawer ? true : undefined}
      onClick={onNavigate}
    >
      <MegaIcon name={icon} />
      <span className="mega-text">
        <strong>{title}</strong>
        <span>{note}</span>
      </span>
    </Link>
  );
}

export function PreviewHeader({
  liveCount,
  postHref = NAV.register,
}: {
  liveCount?: number;
  postHref?: string;
}) {
  const pathname = usePathname();
  const [hidden, setHidden] = useState(false);
  const [openMega, setOpenMega] = useState<string | null>(null);
  const [drawer, setDrawer] = useState(false);
  const [acc, setAcc] = useState<string | null>(null);
  const lastY = useRef(0);
  const deltaAccum = useRef(0);
  const leaveTimer = useRef<number>(0);
  const hoverLockUntil = useRef(0);
  const headerRef = useRef<HTMLElement | null>(null);

  function dismissOverlays() {
    window.clearTimeout(leaveTimer.current);
    hoverLockUntil.current = Date.now() + 800;
    setOpenMega(null);
    setDrawer(false);
    setAcc(null);
    document.body.classList.remove("mega-open", "drawer-open");
  }

  useEffect(() => {
    dismissOverlays();
  }, [pathname]);

  useEffect(() => {
    document.body.classList.toggle("drawer-open", drawer);
    return () => document.body.classList.remove("drawer-open");
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
        lastY.current = y;
        return;
      }
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
      if (event.key === "Escape") dismissOverlays();
    };
    const onPointer = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (headerRef.current?.contains(target)) return;
      const drawerEl = document.getElementById("mobile-drawer");
      if (drawerEl?.contains(target)) return;
      if (openMega || drawer) dismissOverlays();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [openMega, drawer]);

  function enterMega(id: string) {
    if (Date.now() < hoverLockUntil.current) return;
    if (window.matchMedia("(min-width: 901px)").matches) {
      window.clearTimeout(leaveTimer.current);
      setOpenMega(id);
    }
  }
  function leaveHeader() {
    leaveTimer.current = window.setTimeout(() => setOpenMega(null), 200);
  }

  const nabidkyOn = pathname.startsWith("/nabidky") || pathname.startsWith("/nabidka");
  const firmyOn = pathname.startsWith("/pro-firmy") || pathname.startsWith("/firma");

  const openings =
    liveCount == null
      ? "otevřené pozice"
      : liveCount === 1
        ? "1 otevřená pozice"
        : liveCount >= 2 && liveCount <= 4
          ? `${liveCount} otevřené pozice`
          : `${liveCount} otevřených pozic`;

  let strip: ReactNode = (
    <>
      <span className="strip-code">LIVE</span>
      <span>Ostrava / Brno / Plzeň — {openings}</span>
      <Link href="/nabidky">Zobrazit →</Link>
    </>
  );
  if (pathname.startsWith("/pro-firmy")) {
    strip = (
      <>
        <span className="strip-code">LIVE</span>
        <span>Ceník bez DPH · Zkušební inzerát 0&nbsp;Kč · faktura na firmu</span>
        <a href="#cenik">Ceník →</a>
      </>
    );
  } else if (pathname.startsWith("/nabidka")) {
    strip = (
      <>
        <span className="strip-code">LIVE</span>
        <span>Ostrava / Brno / Plzeň — {openings}</span>
        <Link href="/nabidky">Zobrazit →</Link>
      </>
    );
  } else if (pathname.startsWith("/nabidky")) {
    strip = (
      <>
        <span className="strip-code">LIVE</span>
        <span>Filtrujte podle profese a města · mzda je na inzerátu</span>
        <Link href="/pro-firmy">Pro firmy →</Link>
      </>
    );
  }

  return (
    <>
      <div className="top-strip">{strip}</div>
      <header
        ref={headerRef}
        className={`site-header${hidden ? " is-hidden" : ""}`}
        onMouseEnter={() => window.clearTimeout(leaveTimer.current)}
        onMouseLeave={leaveHeader}
      >
        <div className="header-inner">
          <Link className="logo" href="/" onClick={dismissOverlays}>
            <LogoMark />
            DílnaJobs
          </Link>
          <nav className="nav-desktop" aria-label="Hlavní navigace">
            <div className="nav-item" onMouseEnter={() => enterMega("nabidky")}>
              <button
                type="button"
                className={`nav-trigger${nabidkyOn ? " is-active" : ""}`}
                data-mega
                aria-expanded={openMega === "nabidky"}
                aria-controls="mega-nabidky"
                aria-haspopup="true"
                onClick={() => setOpenMega((v) => (v === "nabidky" ? null : "nabidky"))}
              >
                Nabídky <Chev />
              </button>
            </div>
            <div className="nav-item" onMouseEnter={() => enterMega("firmy")}>
              <button
                type="button"
                className={`nav-trigger${firmyOn ? " is-active" : ""}`}
                data-mega
                aria-expanded={openMega === "firmy"}
                aria-controls="mega-firmy"
                aria-haspopup="true"
                onClick={() => setOpenMega((v) => (v === "firmy" ? null : "firmy"))}
              >
                Pro firmy <Chev />
              </button>
            </div>
            <div
              className="nav-item"
              onMouseEnter={() => {
                if (window.matchMedia("(min-width: 901px)").matches) {
                  window.clearTimeout(leaveTimer.current);
                  setOpenMega(null);
                }
              }}
            >
              <a href={NAV.howItWorks} className="nav-link-plain" onClick={dismissOverlays}>
                Jak to funguje
              </a>
            </div>
          </nav>
          <div className="header-actions">
            <Link href={NAV.nabidky} className="btn btn-ghost btn-square" onClick={dismissOverlays}>
              Hledat
            </Link>
            <Link href={postHref} className="btn btn-primary btn-square" onClick={dismissOverlays}>
              Inzerovat →
            </Link>
            <button
              type="button"
              className="nav-toggle"
              aria-label="Otevřít menu"
              aria-expanded={drawer}
              aria-controls="mobile-drawer"
              onClick={() => setDrawer((v) => !v)}
            >
              <span />
            </button>
          </div>
        </div>

        <div
          className={`mega-panel${openMega === "nabidky" ? " is-open" : ""}`}
          id="mega-nabidky"
          data-cols="3"
          role="region"
          aria-label="Nabídky"
          onClick={(event) => {
            if ((event.target as HTMLElement).closest("a")) dismissOverlays();
          }}
        >
          <div className="mega-inner">
            <div>
              <p className="mega-col-title">Profese</p>
              <div className="mega-list">
                <MegaLink onNavigate={dismissOverlays} href="/nabidky?profession=cnc" icon="cnc" title="CNC" note="Operátoři a programátoři obráběcích center" />
                <MegaLink onNavigate={dismissOverlays} href="/nabidky?profession=welder" icon="welder" title="Svářeči" note="TIG, MIG/MAG a konstrukční svařování" />
                <MegaLink onNavigate={dismissOverlays} href="/nabidky?profession=setter" icon="setter" title="Seřizovači" note="Seřízení CNC, Fanuc, Heidenhain" />
                <MegaLink onNavigate={dismissOverlays} href="/nabidky?profession=electrician" icon="electrician" title="Elektrikáři" note="Průmyslová elektro a údržba rozvodů" />
                <MegaLink onNavigate={dismissOverlays} href="/nabidky?profession=maintenance" icon="maintenance" title="Údržba" note="Strojaři, zámečníci, servis linek" />
              </div>
            </div>
            <div>
              <p className="mega-col-title">Podle kraje</p>
              <div className="mega-list">
                <MegaLink onNavigate={dismissOverlays} href="/nabidky?city=Ostrava" icon="map" title="Moravskoslezský" note="Ostrava a okolí · MSK" />
                <MegaLink onNavigate={dismissOverlays} href="/nabidky?city=Brno" icon="map" title="Jihomoravský" note="Brno a jižní Morava" />
                <MegaLink onNavigate={dismissOverlays} href="/nabidky?city=Plzeň" icon="map" title="Plzeňský" note="Plzeň a západ Čech" />
                <MegaLink onNavigate={dismissOverlays} href="/nabidky?city=Mladá Boleslav" icon="factory" title="Středočeský" note="Mladá Boleslav a okolí Prahy" />
              </div>
            </div>
            <div>
              <p className="mega-col-title">Akce</p>
              <div className="mega-list">
                <MegaLink onNavigate={dismissOverlays} href={NAV.nabidky} icon="factory" title="Všechny nabídky" note="Celý výpis, bez agentur" />
                <MegaLink onNavigate={dismissOverlays} href={NAV.nabidkyFilters} icon="search" title="Hledat / filtry" note="Profese, město, mzda" />
              </div>
            </div>
          </div>
        </div>

        <div
          className={`mega-panel${openMega === "firmy" ? " is-open" : ""}`}
          id="mega-firmy"
          data-cols="4"
          role="region"
          aria-label="Pro firmy"
          onClick={(event) => {
            if ((event.target as HTMLElement).closest("a")) dismissOverlays();
          }}
        >
          <div className="mega-inner">
            <MegaLink onNavigate={dismissOverlays} href={postHref} icon="post" title="Vystavit nabídku" note="Profese, mzda, směny — během pár minut" />
            <MegaLink onNavigate={dismissOverlays} href={NAV.cenik} icon="pricing" title="Ceník" note="0 / 2 990 / 8 900 / 19 900 Kč bez DPH" />
            <MegaLink onNavigate={dismissOverlays} href={NAV.login} icon="direct" title="Přihlášení firmy" note="Odkaz na e-mail. Heslo nepoužíváme." />
            <MegaLink onNavigate={dismissOverlays} href={NAV.proFirmy} icon="why" title="Pro firmy" note="Cílení, postup, balíčky" />
          </div>
        </div>
      </header>

      <div
        className={`drawer-backdrop${drawer ? " is-open" : ""}`}
        aria-hidden={!drawer}
        onClick={() => setDrawer(false)}
      />
      <aside className={`mobile-drawer${drawer ? " is-open" : ""}`} id="mobile-drawer" aria-hidden={!drawer} aria-label="Mobilní menu">
        <div className="drawer-head">
          <Link className="logo" href="/" data-drawer-close onClick={() => setDrawer(false)}>
            <LogoMark />
            DílnaJobs
          </Link>
          <button type="button" className="drawer-close" data-drawer-close aria-label="Zavřít menu" onClick={() => setDrawer(false)}>
            ×
          </button>
        </div>
        <div className="drawer-body">
          <button
            type="button"
            className="drawer-acc-btn"
            data-drawer-acc
            aria-expanded={acc === "nabidky"}
            aria-controls="acc-nabidky"
            onClick={() => setAcc((v) => (v === "nabidky" ? null : "nabidky"))}
          >
            Nabídky <Chev />
          </button>
          <div className={`drawer-acc-panel${acc === "nabidky" ? " is-open" : ""}`} id="acc-nabidky">
            <p className="drawer-section-label">Profese</p>
            <MegaLink onNavigate={dismissOverlays} drawer href="/nabidky?profession=cnc" icon="cnc" title="CNC" note="Operátoři a programátoři" />
            <MegaLink onNavigate={dismissOverlays} drawer href="/nabidky?profession=welder" icon="welder" title="Svářeči" note="TIG, MIG/MAG" />
            <MegaLink onNavigate={dismissOverlays} drawer href="/nabidky?profession=setter" icon="setter" title="Seřizovači" note="Fanuc, Heidenhain" />
            <MegaLink onNavigate={dismissOverlays} drawer href="/nabidky?profession=electrician" icon="electrician" title="Elektrikáři" note="Průmyslová elektro" />
            <MegaLink onNavigate={dismissOverlays} drawer href="/nabidky?profession=maintenance" icon="maintenance" title="Údržba" note="Strojaři a servis" />
            <p className="drawer-section-label">Podle kraje</p>
            <MegaLink onNavigate={dismissOverlays} drawer href="/nabidky?city=Ostrava" icon="map" title="Moravskoslezský" note="Ostrava · MSK" />
            <MegaLink onNavigate={dismissOverlays} drawer href="/nabidky?city=Brno" icon="map" title="Jihomoravský" note="Brno" />
            <MegaLink onNavigate={dismissOverlays} drawer href="/nabidky?city=Plzeň" icon="map" title="Plzeňský" note="Plzeň" />
            <p className="drawer-section-label">Akce</p>
            <MegaLink onNavigate={dismissOverlays} drawer href={NAV.nabidky} icon="factory" title="Všechny nabídky" note="Celý výpis" />
            <MegaLink onNavigate={dismissOverlays} drawer href={NAV.nabidkyFilters} icon="search" title="Hledat / filtry" note="Profese, město, mzda" />
          </div>

          <button
            type="button"
            className="drawer-acc-btn"
            data-drawer-acc
            aria-expanded={acc === "firmy"}
            aria-controls="acc-firmy"
            onClick={() => setAcc((v) => (v === "firmy" ? null : "firmy"))}
          >
            Pro firmy <Chev />
          </button>
          <div className={`drawer-acc-panel${acc === "firmy" ? " is-open" : ""}`} id="acc-firmy">
            <MegaLink onNavigate={dismissOverlays} drawer href={postHref} icon="post" title="Vystavit nabídku" note="Během pár minut" />
            <MegaLink onNavigate={dismissOverlays} drawer href={NAV.cenik} icon="pricing" title="Ceník" note="Transparentní ceny" />
            <MegaLink onNavigate={dismissOverlays} drawer href={NAV.login} icon="direct" title="Přihlášení firmy" note="Odkaz na e-mail" />
            <MegaLink onNavigate={dismissOverlays} drawer href={NAV.proFirmy} icon="why" title="Pro firmy" note="Cílení a balíčky" />
          </div>

          <a href={NAV.howItWorks} className="drawer-acc-btn" data-drawer-close onClick={() => setDrawer(false)}>
            Jak to funguje
          </a>
        </div>
        <div className="drawer-cta">
          <Link href={NAV.nabidky} className="btn btn-secondary btn-block btn-square" data-drawer-close>
            Prohlédnout nabídky
          </Link>
          <Link href={postHref} className="btn btn-primary btn-block btn-square" data-drawer-close>
            Inzerovat →
          </Link>
        </div>
      </aside>
    </>
  );
}

export function PreviewFooter({ postHref = NAV.register }: { postHref?: string }) {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <span>© {new Date().getFullYear()} DílnaJobs · Výrobní pozice · CZ</span>
        <div className="footer-links">
          <Link href={NAV.nabidky}>Nabídky</Link>
          <Link href={NAV.proFirmy}>Pro firmy</Link>
          <Link href={postHref}>Vystavit nabídku</Link>
          <Link href={NAV.login}>Přihlášení</Link>
          <Link href="/gdpr">Osobní údaje</Link>
          <Link href="/obchodni-podminky">Podmínky</Link>
          <a href="mailto:ahoj@dilnajobs.cz">ahoj@dilnajobs.cz</a>
        </div>
      </div>
    </footer>
  );
}
