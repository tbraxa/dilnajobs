import { redirect } from "next/navigation";

export default async function OveritPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const token = typeof params.token === "string" ? params.token : "";
  if (!token) redirect("/firma/prihlaseni?chyba=odkaz");

  return (
    <main className="auth-page">
      <div className="auth-card auth-card-narrow">
        <h1>Odkaz je v pořádku</h1>
        <p className="sub">Přihlášení potvrďte tlačítkem. Odkaz platí jednou.</p>
        <form action="/firma/prihlaseni/overit/akce" method="post">
          <input type="hidden" name="token" value={token} />
          <button type="submit" className="btn btn-primary btn-block">
            Vstoupit do firmy
          </button>
        </form>
      </div>
    </main>
  );
}
