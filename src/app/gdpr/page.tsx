import type { Metadata } from "next";

export const metadata: Metadata = { title: "Osobní údaje" };

export default function GdprPage() {
  return (
    <main className="fj-legal-page">
      <p className="fj-eyebrow">FairJobs</p>
      <h1 className="fj-display">Osobní údaje</h1>
      <p>
        Správce: provozovatel FairJobs na fairjobs.cz. Kontakt: ahoj@fairjobs.cz.
      </p>
      <h2>Uchazeči</h2>
      <p>
        Účet nezakládáte. Při přihlášce bereme jméno, telefon, volitelně e-mail, životopis a zprávu. Právní základy:
        váš souhlas a kroky k možné pracovní smlouvě se zaměstnavatelem.
      </p>
      <p>
        Údaje předáváme jen firmě u dané nabídky. IP ukládáme jako otisk, ne v čitelné podobě. Životopisy jsou v
        soukromém úložišti, adresa souboru není hádací.
      </p>
      <p>
        Uchování: do smazání firmou, nebo 12 měsíců po konci inzerátu (úklid je v1 částečně ruční). Výmaz a přístup:
        napište na kontakt výše. Samoobslužný výmaz zatím není dostupný.
      </p>
      <h2>Zaměstnavatelé</h2>
      <p>
        E-mail, jméno, IČO, název firmy, relace po přihlášení odkazem. Hesla nesbíráme.
      </p>
    </main>
  );
}
