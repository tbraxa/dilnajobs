import Link from "next/link";
import type { ReactNode } from "react";
import { BRAND } from "@/lib/brand";
import { LogoMark } from "./icons";
import { logoutAdminAction } from "@/lib/actions/admin-login";

const NAV = [
  { href: "/admin", label: "Přehled" },
  { href: "/admin/health", label: "Zdraví" },
  { href: "/admin/employers", label: "Firmy" },
  { href: "/admin/jobs", label: "Inzeráty" },
  { href: "/admin/applications", label: "Přihlášky" },
  { href: "/admin/audit", label: "Audit" },
  { href: "/admin/settings", label: "Nastavení" },
];

export function AdminChrome({ email, children }: { email: string; children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <Link href="/admin" className="flex items-center gap-2 text-slate-950">
            <LogoMark className="h-8 w-8" />
            <span className="text-lg font-semibold tracking-tight">{BRAND} · správa</span>
          </Link>
          <div className="flex items-center gap-3 text-sm">
            <span className="hidden text-slate-600 sm:inline">{email}</span>
            <form action={logoutAdminAction}>
              <button className="rounded-md border border-slate-300 px-3 py-1.5 text-sm" type="submit">
                Odhlásit
              </button>
            </form>
          </div>
        </div>
      </header>
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-8 sm:flex-row sm:px-6">
        <nav className="flex shrink-0 flex-wrap gap-1 sm:w-44 sm:flex-col">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="rounded-md px-3 py-2 text-sm hover:bg-slate-50">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}

export function AdminLoginChrome({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-md items-center gap-2 px-4 py-3">
          <LogoMark className="h-8 w-8" />
          <span className="text-lg font-semibold tracking-tight">{BRAND} · správa</span>
        </div>
      </header>
      {children}
    </div>
  );
}
