"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Chev, LogoMark, MegaIcon } from "./sprite";

function MegaLink({
  href,
  icon,
  title,
  note,
  drawer,
}: {
  href: string;
  icon: string;
  title: string;
  note: string;
  drawer?: boolean;
}) {
  const className = drawer ? "drawer-link" : "mega-item";
  return (
    <Link className={className} href={href} data-drawer-close={drawer ? true : undefined}>
      <MegaIcon name={icon} />
      <span className="mega-text">
        <strong>{title}</strong>
        <span>{note}</span>
      </span>
    </Link>
  );
}

export function PreviewHeader({ liveCount }: { liveCount?: number }) {
  const pathname = usePathname();
  const [hidden, setHidden] = useState(false);
  const [openMega, setOpenMega] = useState<string | null>(null);
  const [drawer, setDrawer] = useState(false);
  const [acc, setAcc] = useState<string | null>(null);
  const lastY = useRef(0);
  const deltaAccum = useRef(0);
  const leaveTimer = useRef<number>(0);

  useEffect(() => {
    setDrawer(false);
    setOpenMega(null);
    setAcc(null);
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
      if (event.key === "Escape") {
        setOpenMega(null);
        setDrawer(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  function enterMega(id: string) {
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
        className={`site-header${hidden ? " is-hidden" : ""}`}
        onMouseEnter={() => window.clearTimeout(leaveTimer.current)}
        onMouseLeave={leaveHeader}
      >
        <div className="header-inner">
          <Link className="logo" href="/">
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
            <div className="nav-item" onMouseEnter={() => enterMega("jak")}>
              <button
                type="button"
                className="nav-trigger"
                data-mega
                aria-expanded={openMega === "jak"}
                aria-controls="mega-jak"
                aria-haspopup="true"
                onClick={() => setOpenMega((v) => (v === "jak" ? null : "jak"))}
              >
                Jak to funguje <Chev />
              </button>
            </div>
          </nav>
          <div className="header-actions">
            <Link href="/nabidky" className="btn btn-ghost btn-square">
              Hledat
            </Link>
            <Link href="/pro-firmy" className="btn btn-primary btn-square">
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
        >
          <div className="mega-inner">
            <div>
              <p className="mega-col-title">Profese</p>
              <div className="mega-list">
                <MegaLink href="/nabidky?profession=cnc" icon="cnc" title="CNC" note="Operátoři a programátoři obráběcích center" />
                <MegaLink href="/nabidky?profession=welder" icon="welder" title="Svářeči" note="TIG, MIG/MAG a konstrukční svařování" />
                <MegaLink href="/nabidky?profession=setter" icon="setter" title="Seřizovači" note="Seřízení CNC, Fanuc, Heidenhain" />
                <MegaLink href="/nabidky?profession=electrician" icon="electrician" title="Elektrikáři" note="Průmyslová elektro a údržba rozvodů" />
                <MegaLink href="/nabidky?profession=maintenance" icon="maintenance" title="Údržba" note="Strojaři, zámečníci, servis linek" />
              </div>
            </div>
            <div>
              <p className="mega-col-title">Podle kraje</p>
              <div className="mega-list">
                <MegaLink href="/nabidky?city=Ostrava" icon="map" title="Moravskoslezský" note="Ostrava a okolí · MSK" />
                <MegaLink href="/nabidky?city=Brno" icon="map" title="Jihomoravský" note="Brno a jižní Morava" />
                <MegaLink href="/nabidky?city=Plzeň" icon="map" title="Plzeňský" note="Plzeň a západ Čech" />
                <MegaLink href="/nabidky?city=Mladá Boleslav" icon="factory" title="Středočeský" note="Mladá Boleslav a okolí Prahy" />
                <MegaLink href="/nabidky" icon="map" title="Další kraje" note="Olomoucký, Ústecký a další" />
              </div>
            </div>
            <div>
              <p className="mega-col-title">Jak hledat</p>
              <div className="mega-list">
                <MegaLink href="/nabidky" icon="factory" title="Filtry nabídek" note="Profese, kraj, směny a mzda na jednom místě" />
                <MegaLink href="/nabidky" icon="search" title="Odpověď bez registrace" note="Jméno, telefon, volitelně CV — hotovo" />
                <MegaLink href="/" icon="direct" title="Přímo od firem" note="Žádná agentura mezi vámi a dílnou" />
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
        >
          <div className="mega-inner">
            <MegaLink href="/firma/registrace" icon="post" title="Vystavit nabídku" note="Profese, mzda, směny — během pár minut" />
            <MegaLink href="/pro-firmy#cenik" icon="pricing" title="Ceník" note="0 / 2 990 / 8 900 / 19 900 Kč bez DPH" />
            <MegaLink href="/pro-firmy" icon="why" title="Proč DílnaJobs" note="Cílení na výrobní profese, přímý kontakt" />
            <MegaLink href="/pro-firmy" icon="direct" title="Bez agentur" note="Odpovědi jdou rovnou k vám" />
          </div>
        </div>

        <div
          className={`mega-panel${openMega === "jak" ? " is-open" : ""}`}
          id="mega-jak"
          data-cols="2"
          role="region"
          aria-label="Jak to funguje"
        >
          <div className="mega-inner">
            <div>
              <p className="mega-col-title">Pro uchazeče</p>
              <div className="mega-list">
                <MegaLink href="/nabidky" icon="factory" title="1 · Vyberete profesi" note="Filtr podle kraje, směn a mzdy" />
                <MegaLink href="/nabidky" icon="post" title="2 · Odpovíte firmě" note="Bez povinné registrace" />
                <MegaLink href="/" icon="direct" title="3 · Volají přímo oni" note="Žádný prostředník" />
              </div>
            </div>
            <div>
              <p className="mega-col-title">Pro firmy</p>
              <div className="mega-list">
                <MegaLink href="/firma/registrace" icon="post" title="1 · Vystavíte nabídku" note="Jasná specifikace výroby" />
                <MegaLink href="/pro-firmy" icon="factory" title="2 · Přicházejí odpovědi" note="Jméno, telefon, volitelně CV" />
                <MegaLink href="/pro-firmy" icon="factory" title="3 · Voláte vy" note="Jeden klik a jste ve spojení" />
              </div>
            </div>
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
            <MegaLink drawer href="/nabidky?profession=cnc" icon="cnc" title="CNC" note="Operátoři a programátoři" />
            <MegaLink drawer href="/nabidky?profession=welder" icon="welder" title="Svářeči" note="TIG, MIG/MAG" />
            <MegaLink drawer href="/nabidky?profession=setter" icon="setter" title="Seřizovači" note="Fanuc, Heidenhain" />
            <MegaLink drawer href="/nabidky?profession=electrician" icon="electrician" title="Elektrikáři" note="Průmyslová elektro" />
            <MegaLink drawer href="/nabidky?profession=maintenance" icon="maintenance" title="Údržba" note="Strojaři a servis" />
            <p className="drawer-section-label">Podle kraje</p>
            <MegaLink drawer href="/nabidky?city=Ostrava" icon="map" title="Moravskoslezský" note="Ostrava · MSK" />
            <MegaLink drawer href="/nabidky?city=Brno" icon="map" title="Jihomoravský" note="Brno" />
            <MegaLink drawer href="/nabidky?city=Plzeň" icon="map" title="Plzeňský" note="Plzeň" />
            <p className="drawer-section-label">Jak hledat</p>
            <MegaLink drawer href="/nabidky" icon="factory" title="Filtry nabídek" note="Profese, kraj, směny" />
            <MegaLink drawer href="/nabidky" icon="search" title="Odpověď bez registrace" note="Jméno a telefon stačí" />
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
            <MegaLink drawer href="/firma/registrace" icon="post" title="Vystavit nabídku" note="Během pár minut" />
            <MegaLink drawer href="/pro-firmy#cenik" icon="pricing" title="Ceník" note="Transparentní ceny" />
            <MegaLink drawer href="/pro-firmy" icon="why" title="Proč DílnaJobs" note="Cílení na výrobu" />
            <MegaLink drawer href="/pro-firmy" icon="direct" title="Bez agentur" note="Přímý kontakt" />
          </div>

          <button
            type="button"
            className="drawer-acc-btn"
            data-drawer-acc
            aria-expanded={acc === "jak"}
            aria-controls="acc-jak"
            onClick={() => setAcc((v) => (v === "jak" ? null : "jak"))}
          >
            Jak to funguje <Chev />
          </button>
          <div className={`drawer-acc-panel${acc === "jak" ? " is-open" : ""}`} id="acc-jak">
            <p className="drawer-section-label">Pro uchazeče</p>
            <MegaLink drawer href="/nabidky" icon="factory" title="Vyberete · Odpovíte · Volají" note="Tři kroky bez registrace" />
            <p className="drawer-section-label">Pro firmy</p>
            <MegaLink drawer href="/pro-firmy" icon="post" title="Vystavíte · Odpovědi · Voláte" note="Schránka s telefonem" />
          </div>
        </div>
        <div className="drawer-cta">
          <Link href="/nabidky" className="btn btn-secondary btn-block btn-square" data-drawer-close>
            Prohlédnout nabídky
          </Link>
          <Link href="/pro-firmy" className="btn btn-primary btn-block btn-square" data-drawer-close>
            Inzerovat →
          </Link>
        </div>
      </aside>
    </>
  );
}

export function PreviewFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <span>© {new Date().getFullYear()} DílnaJobs · Výrobní pozice · CZ</span>
        <div className="footer-links">
          <Link href="/nabidky">Nabídky</Link>
          <Link href="/pro-firmy">Pro firmy</Link>
          <Link href="/firma/prihlaseni">Přihlášení</Link>
          <Link href="/gdpr">Osobní údaje</Link>
          <Link href="/obchodni-podminky">Podmínky</Link>
          <a href="mailto:ahoj@dilnajobs.cz">ahoj@dilnajobs.cz</a>
        </div>
      </div>
    </footer>
  );
}
