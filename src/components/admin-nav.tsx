"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/admin", label: "Přehled" },
  { href: "/admin/health", label: "Zdraví" },
  { href: "/admin/employers", label: "Firmy" },
  { href: "/admin/jobs", label: "Inzeráty" },
  { href: "/admin/applications", label: "Přihlášky" },
  { href: "/admin/audit", label: "Audit" },
  { href: "/admin/settings", label: "Nastavení" },
];

export function AdminNav() {
  const pathname = usePathname();
  return (
    <nav className="filter-bar" aria-label="Správa">
      <span className="filter-label">Menu</span>
      {NAV.map((item) => {
        const on = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
        return (
          <Link key={item.href} href={item.href} className={`filter-chip${on ? " is-active" : ""}`}>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
