import { redirect } from "next/navigation";
import { safeAccountNext } from "@/lib/seeker-auth";

export default async function VerifySeekerLoginPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const token = typeof params.token === "string" ? params.token : "";
  const next = safeAccountNext(typeof params.next === "string" ? params.next : undefined);
  if (!token) redirect("/ucet/prihlaseni?chyba=odkaz");

  return (
    <main className="fj-auth-page fj-seeker-verify-page">
      <section className="fj-seeker-verify-card">
        <p className="fj-eyebrow">Jednorázový odkaz</p>
        <h1>Potvrďte přihlášení</h1>
        <p>
          Odkaz se spotřebuje až po stisknutí tlačítka. Tím chráníme účet před automatickým
          přednačtením e-mailu.
        </p>
        <form action="/ucet/prihlaseni/overit/akce" method="post">
          <input type="hidden" name="token" value={token} />
          <input type="hidden" name="next" value={next} />
          <button type="submit" className="fj-primary-button fj-primary-button-blue">
            Vstoupit do účtu
          </button>
        </form>
      </section>
    </main>
  );
}
