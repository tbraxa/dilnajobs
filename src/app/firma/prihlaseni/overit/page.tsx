import { redirect } from "next/navigation";
import { Button } from "@/components/ui";

export default async function OveritPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const token = typeof params.token === "string" ? params.token : "";
  if (!token) redirect("/firma/prihlaseni?chyba=odkaz");

  return (
    <main className="auth-form-col" style={{ minHeight: "calc(100vh - var(--header-h))" }}>
      <div className="auth-card">
        <h1 className="h1">Odkaz je v pořádku</h1>
        <p className="auth-helper">
          Prohlížeče občas odkaz přednačtou. Přihlášení proto potvrdíte tlačítkem. Token se spotřebuje až teď.
        </p>
        <form action="/firma/prihlaseni/overit/akce" method="post">
          <input type="hidden" name="token" value={token} />
          <Button className="btn-block" type="submit">
            Vstoupit do firmy
          </Button>
        </form>
      </div>
    </main>
  );
}
