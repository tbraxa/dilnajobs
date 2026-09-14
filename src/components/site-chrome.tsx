import Link from "next/link";
import { ButtonLink } from "./ui";
import { LogoMark } from "./icons";

export function SiteHeader({ compact = false }: { compact?: boolean }) {
  return (
    <header className="border-b border-line bg-paper/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2 text-ink">
          <LogoMark className="h-8 w-8" />
          <span className="display text-lg font-semibold sm:text-xl">DílnaJobs</span>
        </Link>
        <nav className="flex items-center gap-1 sm:gap-3">
          <Link href="/nabidky" className="px-2 py-1 text-sm text-ink hover:underline">
            Nabídky
          </Link>
          <Link href="/pro-firmy" className="hidden px-2 py-1 text-sm text-ink hover:underline sm:inline">
            Pro firmy
          </Link>
          {!compact ? (
            <ButtonLink href="/firma/prihlaseni" className="px-3 py-2 text-xs sm:text-sm">
              Přidat nabídku
            </ButtonLink>
          ) : null}
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-line">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 sm:grid-cols-3 sm:px-6">
        <div>
          <p className="display text-lg font-semibold">DílnaJobs</p>
          <p className="mt-2 max-w-xs text-sm text-steel">
            Práce ve výrobě, napřímo od firem. Agentury neregistrujeme. Cílová doména dilnajobs.cz.
          </p>
        </div>
        <div className="text-sm">
          <p className="label mb-2">Uchazeči</p>
          <ul className="space-y-1">
            <li>
              <a href="/nabidky" className="hover:underline">
                Nabídky práce
              </a>
            </li>
            <li>
              <a href="/gdpr" className="hover:underline">
                Osobní údaje
              </a>
            </li>
          </ul>
        </div>
        <div className="text-sm">
          <p className="label mb-2">Firmy</p>
          <ul className="space-y-1">
            <li>
              <a href="/pro-firmy" className="hover:underline">
                Ceník
              </a>
            </li>
            <li>
              <a href="/obchodni-podminky" className="hover:underline">
                Obchodní podmínky
              </a>
            </li>
            <li>
              <a href="/firma/prihlaseni" className="hover:underline">
                Přihlášení
              </a>
            </li>
          </ul>
        </div>
      </div>
      <p className="border-t border-line px-4 py-3 text-center text-xs text-steel">
        © {new Date().getFullYear()} DílnaJobs. Provozovatel bude doplněn před spuštěním.
      </p>
    </footer>
  );
}
