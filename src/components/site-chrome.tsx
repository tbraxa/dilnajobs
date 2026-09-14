import Link from "next/link";
import { SiteHeader } from "./site-header";
import { LogoMark } from "./icons";

export { SiteHeader };

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-line bg-paper">
      <div className="shell grid gap-8 py-10 sm:grid-cols-12">
        <div className="sm:col-span-5">
          <Link href="/" className="inline-flex items-center gap-2 text-ink">
            <LogoMark className="h-7 w-7" />
            <span className="display text-lg">DílnaJobs</span>
          </Link>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-steel">
            Práce ve výrobě, napřímo od firem. Agentury neregistrujeme. Cílová doména dilnajobs.cz.
          </p>
        </div>
        <div className="text-sm sm:col-span-3">
          <p className="label mb-3">Uchazeči</p>
          <ul className="space-y-2">
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
        <div className="text-sm sm:col-span-4">
          <p className="label mb-3">Firmy</p>
          <ul className="space-y-2">
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
