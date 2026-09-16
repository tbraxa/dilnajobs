"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { GUIDE_NAV_COLUMNS, PUBLIC_DESTINATION_HUBS } from "@/lib/public-navigation";
import { FairJobsLockup } from "./fairjobs-brand";

function trapTab(event: KeyboardEvent, container: HTMLElement | null) {
  if (event.key !== "Tab" || !container) return;
  const focusable = Array.from(
    container.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ),
  );
  if (!focusable.length) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

export function FairJobsNavigation() {
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const megaRef = useRef<HTMLDivElement>(null);
  const mobileRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMegaOpen(false);
        setMobileOpen(false);
        triggerRef.current?.focus();
        return;
      }
      trapTab(event, mobileOpen ? mobileRef.current : megaOpen ? megaRef.current : null);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [megaOpen, mobileOpen]);

  useEffect(() => {
    if (megaOpen) megaRef.current?.querySelector<HTMLElement>("a")?.focus();
  }, [megaOpen]);

  useEffect(() => {
    if (!mobileOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    mobileRef.current?.querySelector<HTMLElement>("a")?.focus();
    return () => {
      document.body.style.overflow = previous;
    };
  }, [mobileOpen]);

  function closeAll() {
    setMegaOpen(false);
    setMobileOpen(false);
  }

  return (
    <>
      <div className="fj-header-inner">
        <Link href="/" className="fj-brand-link" aria-label="FairJobs, úvodní stránka" onClick={closeAll}>
          <FairJobsLockup />
        </Link>

        <nav className="fj-desktop-nav" aria-label="Hlavní navigace">
          <Link href="/nabidky" className="fj-nav-link">Nabídky</Link>
          <button
            ref={triggerRef}
            type="button"
            className="fj-nav-link fj-guide-trigger"
            aria-expanded={megaOpen}
            aria-controls="fj-guide-mega"
            onClick={() => setMegaOpen((open) => !open)}
          >
            Průvodce
            <span aria-hidden="true">{megaOpen ? "▴" : "▾"}</span>
          </button>
          <Link href="/pro-firmy" className="fj-nav-link">Pro firmy</Link>
        </nav>

        <div className="fj-header-actions">
          <Link href="/zivotopis" className="fj-cv-link">Vytvořit životopis</Link>
          <Link href="/firma/prihlaseni" className="fj-header-cta">Přihlášení firem</Link>
        </div>

        <div className="fj-mobile-actions">
          <Link href="/zivotopis" className="fj-mobile-cv-link">Životopis</Link>
          <button
            type="button"
            className="fj-mobile-menu-trigger"
            aria-expanded={mobileOpen}
            aria-controls="fj-mobile-sheet"
            aria-label={mobileOpen ? "Zavřít navigaci" : "Otevřít navigaci"}
            onClick={() => setMobileOpen((open) => !open)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      {megaOpen ? (
        <div className="fj-mega-layer" onClick={(event) => {
          if (event.target === event.currentTarget) setMegaOpen(false);
        }}>
          <div className="fj-guide-mega" id="fj-guide-mega" ref={megaRef} role="region" aria-label="Průvodce">
            <div className="fj-mega-columns">
              {GUIDE_NAV_COLUMNS.map((column) => (
                <div className="fj-mega-column" key={column.id}>
                  <h2>{column.title}</h2>
                  {column.links.map(([label, href], index) => (
                    <Link href={href} key={label} onClick={closeAll} className={index === column.links.length - 1 ? "fj-mega-hub-link" : ""}>
                      {label}
                      {index === column.links.length - 1 ? <span aria-hidden="true">→</span> : null}
                    </Link>
                  ))}
                </div>
              ))}
            </div>

            <aside className="fj-mega-rail">
              <p>Rychlé akce</p>
              <div className="fj-mega-quick">
                <Link href="/zivotopis" onClick={closeAll}>Vytvořit životopis</Link>
                <Link href="/pro-firmy" onClick={closeAll}>Pro firmy</Link>
                <Link href="/pro-firmy#cenik" onClick={closeAll}>Ceník</Link>
              </div>
            </aside>
          </div>
        </div>
      ) : null}

      {mobileOpen ? (
        <div className="fj-mobile-sheet-layer" onClick={(event) => {
          if (event.target === event.currentTarget) setMobileOpen(false);
        }}>
          <div className="fj-mobile-sheet" id="fj-mobile-sheet" ref={mobileRef} role="dialog" aria-modal="true" aria-label="Hlavní navigace">
            <div className="fj-mobile-sheet-head">
              <FairJobsLockup />
              <button type="button" onClick={() => setMobileOpen(false)} aria-label="Zavřít navigaci">×</button>
            </div>

            <div className="fj-mobile-sheet-group fj-mobile-sheet-primary">
              <Link href="/nabidky" onClick={closeAll}>Nabídky</Link>
            </div>

            <div className="fj-mobile-sheet-group">
              <p>Průvodce</p>
              {PUBLIC_DESTINATION_HUBS.map((destination) => (
                <Link href={destination.href} key={destination.id} onClick={closeAll}>
                  {destination.label}
                </Link>
              ))}
            </div>

            <div className="fj-mobile-sheet-group">
              <Link href="/pro-firmy" onClick={closeAll}>Pro firmy</Link>
              <Link href="/pro-firmy#cenik" onClick={closeAll}>Ceník</Link>
            </div>

            <div className="fj-mobile-sheet-group fj-mobile-sheet-actions">
              <Link href="/zivotopis" onClick={closeAll}>Vytvořit životopis</Link>
              <Link href="/firma/prihlaseni" onClick={closeAll}>Přihlášení firem</Link>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
