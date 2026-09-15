import Link from "next/link";
import { copy } from "@/lib/copy";
import { ButtonLink } from "./ui";

export function SiteHeader({ compact = false }: { compact?: boolean }) {
  return (
    <header className="border-b border-line bg-paper">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link href="/" className="text-ink">
          <span className="text-lg font-semibold sm:text-xl">{copy.brand}</span>
        </Link>
        <nav className="flex items-center gap-1 sm:gap-3" aria-label={copy.nav.ariaMain}>
          <Link href="/nabidky" className="px-2 py-1 text-sm text-ink hover:underline">
            {copy.nav.nabidky}
          </Link>
          <Link href="/pro-firmy" className="hidden px-2 py-1 text-sm text-ink hover:underline sm:inline">
            {copy.nav.proFirmy}
          </Link>
          {!compact ? (
            <ButtonLink href="/firma/prihlaseni" variant="ghost" className="px-3 py-2 text-xs sm:text-sm">
              {copy.nav.login}
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
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-6 sm:px-6">
        <p className="text-sm text-steel">{copy.footer}</p>
        <nav className="flex flex-wrap gap-4 text-sm">
          <a href="/nabidky" className="hover:underline">
            {copy.nav.nabidky}
          </a>
          <a href="/pro-firmy" className="hover:underline">
            {copy.nav.proFirmy}
          </a>
          <a href="/firma/prihlaseni" className="hover:underline">
            {copy.nav.login}
          </a>
          <a href="/gdpr" className="hover:underline">
            Osobní údaje
          </a>
        </nav>
      </div>
    </footer>
  );
}
