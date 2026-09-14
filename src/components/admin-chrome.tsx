import Link from "next/link";
import type { ReactNode } from "react";
import { LogoMark } from "@/components/preview/sprite";
import { logoutAdminAction } from "@/lib/actions/admin-login";
import { AdminNav } from "./admin-nav";

export function AdminChrome({ email, children }: { email: string; children: ReactNode }) {
  return (
    <>
      <div className="top-strip">
        <span className="strip-code">ADMIN</span>
        <span>Provozní konzole · oddělené od firemního portálu</span>
      </div>
      <header className="site-header">
        <div className="header-inner">
          <Link className="logo" href="/admin">
            <LogoMark />
            DílnaJobs
          </Link>
          <div className="header-actions">
            <span className="admin-email">{email}</span>
            <form action={logoutAdminAction}>
              <button className="btn btn-ghost btn-square" type="submit">
                Odhlásit
              </button>
            </form>
          </div>
        </div>
      </header>
      <AdminNav />
      <div className="section-band">
        <div className="board-pad">{children}</div>
      </div>
    </>
  );
}

export function AdminLoginChrome({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="top-strip">
        <span className="strip-code">ADMIN</span>
        <span>Přihlášení správce · jen adresy v ADMIN_EMAILS</span>
      </div>
      <header className="site-header">
        <div className="header-inner">
          <span className="logo">
            <LogoMark />
            DílnaJobs
          </span>
        </div>
      </header>
      {children}
    </>
  );
}
