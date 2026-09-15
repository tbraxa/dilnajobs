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
      <main className="mx-auto max-w-md px-4 py-16">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-600">Provozovatel</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Přihlášení správce</h1>
        <p className="mt-3 text-sm text-slate-600">
          Oddělené od firemního portálu. Odkaz posíláme jen na schválené provozní adresy. Platí 15 minut a spotřebuje se
          až po potvrzení tlačítkem.
        </p>
        <div className="mt-6 border border-slate-200 bg-white p-5">
          <AdminLoginForm />
        </div>
      </main>
    </AdminLoginChrome>
  );
}
