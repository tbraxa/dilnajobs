import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { logoutSeekerAction } from "@/lib/actions/seeker-auth";
import { getSeekerSession } from "@/lib/seeker-auth";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

const navigation = [
  { href: "/ucet/prehled", label: "Přehled" },
  { href: "/ucet/oblibene", label: "Oblíbené" },
  { href: "/ucet/prihlasky", label: "Moje přihlášky" },
  { href: "/ucet/profil", label: "Profil" },
] as const;

export default async function SeekerPortalLayout({ children }: { children: ReactNode }) {
  const session = await getSeekerSession();
  if (!session) redirect("/ucet/prihlaseni?next=/ucet/prehled");

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6">
      <header className="border border-line bg-paper p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="label">Účet uchazeče</p>
            <p className="mt-1 text-sm font-semibold">{session.name}</p>
            <p className="text-xs text-steel">{session.email}</p>
          </div>
          <form action={logoutSeekerAction}>
            <button type="submit" className="rounded-[2px] border border-line px-3 py-2 text-sm hover:bg-paper-2">
              Odhlásit
            </button>
          </form>
        </div>
        <nav className="mt-4 flex flex-wrap gap-2 border-t border-line pt-4" aria-label="Navigace účtu">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-[2px] border border-line px-3 py-2 text-sm hover:bg-paper-2"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </header>
      {children}
    </div>
  );
}
