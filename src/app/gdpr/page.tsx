import type { Metadata } from "next";
import { PageHero } from "@/components/preview/board";

export const metadata: Metadata = { title: "Osobní údaje" };

export default function GdprPage() {
  return (
    <main>
      <PageHero
        eyebrow="Právní"
        title="Osobní údaje"
        lead="Správce: provozovatel DílnaJobs (doplní se před spuštěním na dilnajobs.cz). Kontakt: zdenek@dilnajobs.cz (zástupný e-mail)."
      />
      <section className="section-band">
        <div className="board-pad legal-copy">
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
            napište na kontakt výše — v1 nemáte samoobsluhu.
          </p>
          <h2>Zaměstnavatelé</h2>
          <p>E-mail, jméno, IČO, název firmy, relace po přihlášení odkazem. Hesla nesbíráme.</p>
        </div>
      </section>
    </main>
  );
}
