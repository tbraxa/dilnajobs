import { redirect } from "next/navigation";
import { PageHero } from "@/components/preview/board";

export default async function OveritPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const token = typeof params.token === "string" ? params.token : "";
  if (!token) redirect("/firma/prihlaseni?chyba=odkaz");

  return (
    <main>
      <PageHero
        eyebrow="Přihlášení"
        title="Odkaz je v pořádku"
        lead="Prohlížeče občas odkaz přednačtou. Přihlášení proto potvrdíte tlačítkem — token se spotřebuje až teď."
      />
      <section className="section-band">
        <div className="board-pad">
          <form action="/firma/prihlaseni/overit/akce" method="post">
            <input type="hidden" name="token" value={token} />
            <button type="submit" className="btn btn-accent btn-lg btn-square">
              Vstoupit do firmy →
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
