import { redirect } from "next/navigation";
import { AdminLoginChrome } from "@/components/admin-chrome";

export default async function AdminOveritPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const token = typeof params.token === "string" ? params.token : "";
  if (!token) redirect("/admin/prihlaseni?chyba=odkaz");

  return (
    <AdminLoginChrome>
      <main className="auth-shell">
        <div className="auth-stack">
          <article className="auth-card">
            <h1>Odkaz je v pořádku</h1>
            <p className="auth-helper" style={{ marginTop: 0, marginBottom: "1.15rem" }}>
              Přihlášení potvrďte tlačítkem. Odkaz platí jednou.
            </p>
            <form action="/admin/prihlaseni/overit/akce" method="post">
              <input type="hidden" name="token" value={token} />
              <button type="submit" className="btn btn-accent btn-square auth-submit">
                Vstoupit do správy →
              </button>
            </form>
          </article>
        </div>
      </main>
    </AdminLoginChrome>
  );
}
