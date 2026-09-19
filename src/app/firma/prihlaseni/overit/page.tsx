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
    <main className="mx-auto max-w-md px-4 py-16">
      <p className="label">Přihlášení</p>
      <h1 className="display mt-2 text-3xl font-semibold">Odkaz je v pořádku</h1>
      <p className="mt-3 text-sm text-steel">
        Prohlížeče občas odkaz přednačtou. Přihlášení proto potvrdíte tlačítkem  ·  token se spotřebuje až teď.
      </p>
      <form action="/firma/prihlaseni/overit/akce" method="post" className="mt-6">
        <input type="hidden" name="token" value={token} />
        <Button type="submit">Vstoupit do firmy</Button>
      </form>
    </main>
  );
}
