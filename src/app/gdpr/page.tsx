import type { Metadata } from "next";

export const metadata: Metadata = { title: "Osobní údaje" };

export default function GdprPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-8 text-[15px] leading-relaxed sm:px-6">
      <h1 className="display text-3xl font-semibold">Osobní údaje</h1>
      <p className="mt-4 text-steel">
        Správce: provozovatel FairJobs (fairjobs.cz). Kontakt: zdenek@dilnajobs.cz (zástupný e-mail).
      </p>
      <h2 className="display mt-8 text-xl font-semibold">Uchazeči</h2>
      <p className="mt-2">
        Účet nezakládáte. Při přihlášce bereme jméno, telefon, volitelně e-mail, životopis a zprávu. Právní základy:
        váš souhlas a kroky k možné pracovní smlouvě se zaměstnavatelem.
      </p>
      <p className="mt-2">
        Údaje předáváme jen firmě u dané nabídky. IP ukládáme jako otisk, ne v čitelné podobě. Životopisy jsou v
        soukromém úložišti, adresa souboru není hádací.
      </p>
      <p className="mt-2">
        Uchování: do smazání firmou, nebo 12 měsíců po konci inzerátu (úklid je v1 částečně ruční). Výmaz a přístup:
        napište na kontakt výše — v1 nemáte samoobsluhu.
      </p>
      <h2 className="display mt-8 text-xl font-semibold">Zaměstnavatelé</h2>
      <p className="mt-2">
        E-mail, jméno, IČO, název firmy, relace po přihlášení odkazem. Hesla nesbíráme.
      </p>
    </main>
  );
}
