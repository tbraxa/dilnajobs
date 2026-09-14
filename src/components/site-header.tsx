"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ButtonLink } from "./ui";
import {
  IconArrow,
  IconBuilding,
  IconClose,
  IconFactory,
  IconMenu,
  IconSearch,
  LogoMark,
  professionIcon,
} from "./icons";
import { PROFESSIONS } from "@/lib/catalog";

const NAV = [
  { href: "/nabidky", label: "Nabídky", Icon: IconSearch },
  { href: "/pro-firmy", label: "Pro firmy", Icon: IconBuilding },
];

export function SiteHeader({ compact = false }: { compact?: boolean }) {
  const pathname = usePathname();
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (open) {
        setHidden(false);
        lastY.current = y;
        return;
      }
      const goingDown = y > lastY.current;
      setHidden(y > 72 && goingDown);
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [open]);

  return (
    <>
      <header
        className={`sticky top-0 z-40 border-b border-line bg-paper transition-transform duration-200 ${
          hidden ? "-translate-y-full" : "translate-y-0"
        }`}
      >
        <div className="shell flex h-14 items-center justify-between gap-3 sm:h-16">
          <Link href="/" className="flex items-center gap-2 text-ink">
            <LogoMark className="h-7 w-7 sm:h-8 sm:w-8" />
            <span className="display text-lg sm:text-xl">DílnaJobs</span>
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 text-sm font-medium ${
                  pathname === item.href || pathname.startsWith(`${item.href}/`)
                    ? "text-ink underline decoration-2 underline-offset-4"
                    : "text-ink hover:underline"
                }`}
              >
                {item.label}
              </Link>
            ))}
            {!compact ? (
              <ButtonLink href="/firma/registrace" variant="accent" className="ml-2 px-3 py-2 text-sm">
                Přidat nabídku
              </ButtonLink>
            ) : null}
          </nav>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center border border-line bg-paper-0 text-ink md:hidden"
            aria-expanded={open}
            aria-controls="mobilni-menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <IconClose className="h-5 w-5" /> : <IconMenu className="h-5 w-5" />}
            <span className="sr-only">{open ? "Zavřít menu" : "Otevřít menu"}</span>
          </button>
        </div>
      </header>

      {open ? (
        <div className="fixed inset-0 z-50 md:hidden" id="mobilni-menu">
          <button
            type="button"
            className="absolute inset-0 bg-ink/40"
            aria-label="Zavřít menu"
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-y-0 right-0 flex w-[min(100%,20.5rem)] flex-col border-l border-line bg-paper shadow-[0_0_0_1px_var(--line)]">
            <div className="flex h-14 items-center justify-between border-b border-line px-4">
              <span className="display text-lg">Menu</span>
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center border border-line bg-paper-0"
                onClick={() => setOpen(false)}
              >
                <IconClose className="h-5 w-5" />
                <span className="sr-only">Zavřít</span>
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto px-4 py-5">
              <ul className="space-y-2">
                {NAV.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="flex items-center gap-3 border border-line bg-paper-0 px-3 py-3 text-sm font-semibold"
                    >
                      <span className="icon-tile">
                        <item.Icon className="h-4 w-4" />
                      </span>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <p className="label mt-8 mb-3">Profese</p>
              <ul className="grid grid-cols-1 gap-2">
                {PROFESSIONS.map((p) => {
                  const Icon = professionIcon(p.db);
                  return (
                    <li key={p.db}>
                      <Link
                        href={`/nabidky?profession=${p.db}`}
                        className="flex items-center gap-3 px-1 py-1.5 text-sm"
                      >
                        <span className="icon-tile h-9 w-9">
                          <Icon className="h-4 w-4" />
                        </span>
                        {p.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
            <div className="border-t border-line p-4">
              <ButtonLink href="/firma/registrace" variant="accent" className="w-full">
                Přidat nabídku
                <IconArrow className="h-4 w-4" />
              </ButtonLink>
              <Link href="/" className="mt-3 flex items-center gap-2 text-sm text-steel">
                <IconFactory className="h-4 w-4" />
                Úvod
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
