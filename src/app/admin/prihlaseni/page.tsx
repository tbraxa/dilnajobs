import type { Metadata } from "next";
import { AdminLoginChrome } from "@/components/admin-chrome";
import { AdminLoginForm } from "@/components/admin-ui";
import { PageHero } from "@/components/preview/board";
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
      <main>
        <PageHero
          eyebrow="Provozovatel"
          title="Přihlášení správce"
          lead="Oddělené od firemního portálu. Odkaz posíláme jen na adresy v ADMIN_EMAILS. Platí 15 minut a spotřebuje se až po potvrzení tlačítkem."
        />
        <section className="section-band">
          <div className="board-pad" style={{ maxWidth: "28rem" }}>
            <AdminLoginForm />
          </div>
        </section>
      </main>
    </AdminLoginChrome>
  );
}
