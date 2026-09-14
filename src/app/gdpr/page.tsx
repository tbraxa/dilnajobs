import type { Metadata } from "next";

export const metadata: Metadata = { title: "Osobní údaje" };

export default function GdprPage() {
  return (
    <main className="page">
      <h1>Osobní údaje</h1>
      <p className="lede">
        Správce: provozovatel DílnaJobs (doplní se před spuštěním na dilnajobs.cz). Kontakt:
        zdenek@dilnajobs.cz (zástupný e-mail).
      </p>
      <div className="legal-copy">
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
          napište na kontakt výše. V1 nemáte samoobsluhu.
        </p>
        <h2>Zaměstnavatelé</h2>
        <p>
          Firemní e-mail, jméno a příjmení kontaktní osoby, telefon, IČO, volitelně DIČ, název firmy a sídlo. Relace po
          přihlášení odkazem. Hesla nesbíráme.
        </p>
      </div>
    </main>
  );
}
