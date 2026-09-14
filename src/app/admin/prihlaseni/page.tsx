import type { Metadata } from "next";
import { AdminLoginChrome } from "@/components/admin-chrome";
import { AdminLoginForm } from "@/components/admin-ui";
import { getAdminSession } from "@/lib/admin-auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Přihlášení správce",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  const session = await getAdminSession();
  if (session) redirect("/admin");

  return (
    <AdminLoginChrome>
      <main className="auth-shell">
        <div className="auth-stack">
          <article className="auth-card">
            <h1>Přihlášení správce</h1>
            <p className="auth-helper" style={{ marginTop: 0, marginBottom: "1.1rem" }}>
              Oddělené od firemního portálu. Odkaz platí 15 minut.
            </p>
            <AdminLoginForm />
          </article>
        </div>
      </main>
    </AdminLoginChrome>
  );
}
