import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { webPageJsonLd } from "@/lib/structured-data";

const description = "Připravovaný editor FairJobs pro přehledný životopis bez povinného účtu.";

export const metadata: Metadata = { title: "Vytvořit životopis", description };

export default function CvBuilderShellPage() {
  return (
    <main className="fj-cv-page">
      <JsonLd
        id="fairjobs-cv-builder-page"
        data={webPageJsonLd({
          name: "Vytvořit životopis",
          description,
          path: "/zivotopis",
        })}
      />
      <section className="fj-cv-copy">
        <p className="fj-eyebrow">Životopis FairJobs</p>
        <h1 className="fj-display">Životopis, který se dá přečíst za minutu.</h1>
        <p>Čistá struktura, jasné zkušenosti a žádné zbytečné grafy. Editor připravujeme pro PDF i tisk.</p>
        <div>
          <Link href="/nabidky" className="fj-primary-button fj-primary-button-blue">Zatím projít nabídky</Link>
          <Link href="/poradna" className="fj-secondary-button">Rady k životopisu</Link>
        </div>
        <small>Vytvoření životopisu bude zdarma a bez povinného účtu.</small>
      </section>
      <div className="fj-cv-preview" aria-label="Ukázka životopisu">
        <div className="fj-cv-preview-head">
          <div><strong>Jana Nováková</strong><span>Specialistka zákaznické péče</span></div>
          <span>JN</span>
        </div>
        <div className="fj-cv-preview-body">
          <aside>
            <p>Kontakt</p><span>Praha</span><span>jana@priklad.cz</span>
            <p>Dovednosti</p><span>Komunikace</span><span>CRM systémy</span><span>Angličtina B2</span>
          </aside>
          <section>
            <p>Profil</p>
            <span>Šest let zkušeností se zákaznickou péčí a vedením menšího týmu.</span>
            <p>Zkušenosti</p>
            <strong>Vedoucí zákaznické péče</strong>
            <small>2022 až současnost</small>
            <span>Vedení týmu, kvalita odpovědí, nastavení procesů.</span>
            <strong>Specialistka podpory</strong>
            <small>2019 až 2022</small>
          </section>
        </div>
        <div className="fj-cv-preview-tag">Náhled připravovaného editoru</div>
      </div>
    </main>
  );
}
