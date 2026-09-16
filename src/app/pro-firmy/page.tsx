import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { EmployerDashboardPreview } from "@/components/employer-dashboard-preview";
import { FairJobsPricing } from "@/components/fairjobs-pricing";
import { JsonLd } from "@/components/json-ld";
import { FAIRJOBS_PHOTOS } from "@/lib/fairjobs-visual";
import { faqPageJsonLd, webPageJsonLd } from "@/lib/structured-data";

const description = "Firemní inzerce FairJobs s jasným ceníkem, ověřením IČO a odpověďmi uchazečů na jednom místě.";
const employerFaq = [
  {
    question: "Kdy se nabídka zveřejní?",
    answer: "První nabídku po registraci zkontrolujeme. Jakmile ověříme firmu a obsah, zveřejníme ji.",
  },
  {
    question: "Kam chodí odpovědi uchazečů?",
    answer: "Do firemního přehledu. U každé odpovědi vidíte kontakt, zprávu a případný životopis.",
  },
  {
    question: "Mohou inzerovat personální agentury?",
    answer: "Ne. FairJobs je určený přímým zaměstnavatelům, kteří nabírají do vlastních týmů.",
  },
];

export const metadata: Metadata = { title: "Pro firmy", description };

export default function ProFirmyPage() {
  return (
    <main className="fj-employer-page">
      <JsonLd
        id="fairjobs-employer-page"
        data={webPageJsonLd({
          name: "FairJobs pro firmy",
          description,
          path: "/pro-firmy",
          type: "AboutPage",
        })}
      />
      <JsonLd
        id="fairjobs-employer-faq"
        data={faqPageJsonLd({
          name: "Nejčastější otázky zaměstnavatelů",
          path: "/pro-firmy",
          questions: employerFaq,
        })}
      />
      <section className="fj-employer-hero">
        <div className="fj-employer-hero-copy">
          <p className="fj-eyebrow">FairJobs pro zaměstnavatele</p>
          <h1 className="fj-display">Ukažte práci tak, jak opravdu vypadá.</h1>
          <p>
            Jasná mzda, vlastní firemní profil a odpovědi uchazečů v jednom přehledu. Bez agenturního šumu.
          </p>
          <div className="fj-employer-actions">
            <Link href="/firma/registrace" className="fj-primary-button fj-primary-button-blue">
              Vložit první nabídku
              <span aria-hidden="true">→</span>
            </Link>
            <Link href="#cenik" className="fj-secondary-button">Prohlédnout ceník</Link>
            <Link href="/firma/demo" className="fj-tertiary-button">Otevřít ukázkovou konzoli →</Link>
          </div>
          <div className="fj-employer-hero-note">
            <span>✓</span>
            <p>Registrace na IČO. První nabídku před zveřejněním zkontrolujeme.</p>
          </div>
        </div>

        <EmployerDashboardPreview />
      </section>

      <section className="fj-employer-proof">
        <div><strong>Jasná cena</strong><span>víte ji před registrací</span></div>
        <div><strong>Jedno místo</strong><span>pro nabídky i odpovědi</span></div>
        <div><strong>Ověřené IČO</strong><span>důvěra pro obě strany</span></div>
        <div><strong>Bez agentur</strong><span>kontakt přímo s uchazečem</span></div>
      </section>

      <section className="fj-employer-flow">
        <div className="fj-employer-flow-intro">
          <p className="fj-eyebrow fj-eyebrow-light">Od textu k odpovědím</p>
          <h2 className="fj-display">Nábor držíte v ruce od prvního dne.</h2>
          <p>FairJobs vás provede zveřejněním a pak ukáže jen to, co potřebujete k rozhodnutí.</p>
        </div>
        <div className="fj-employer-flow-steps">
          <article>
            <span>01</span>
            <div>
              <h3>Popíšete práci</h3>
              <p>Pozice, mzda, místo, režim a to, co člověka čeká první den.</p>
            </div>
          </article>
          <article>
            <span>02</span>
            <div>
              <h3>Ukážete firmu</h3>
              <p>Logo, fotografie pracoviště a ověřené firemní údaje zvýší důvěru.</p>
            </div>
          </article>
          <article>
            <span>03</span>
            <div>
              <h3>Řídíte odpovědi</h3>
              <p>Kontakty i životopisy najdete v přehledu. Uchazeči neodcházejí do cizího systému.</p>
            </div>
          </article>
        </div>
      </section>

      <section className="fj-employer-photo-story">
        <div className="fj-employer-photo">
          <Image
            src={FAIRJOBS_PHOTOS.employer.src}
            alt={FAIRJOBS_PHOTOS.employer.alt}
            fill
            sizes="(max-width: 900px) 100vw, 55vw"
          />
          <span>Skutečný rozhovor místo anonymního formuláře</span>
        </div>
        <div className="fj-employer-photo-copy">
          <p className="fj-eyebrow">Lepší první dojem</p>
          <h2 className="fj-display">Dobrá nabídka odpoví dřív, než se uchazeč zeptá.</h2>
          <blockquote>
            „Kolik si vydělám, kde budu pracovat a kdo mi odpoví?“
          </blockquote>
          <p>FairJobs staví tyto odpovědi na první místo. Firma tak získá méně náhodných a více relevantních reakcí.</p>
        </div>
      </section>

      <FairJobsPricing />

      <section className="fj-employer-faq">
        <div>
          <p className="fj-eyebrow">Nejčastější otázky</p>
          <h2 className="fj-display">Než začnete</h2>
        </div>
        <div className="fj-faq-list">
          {employerFaq.map((item) => (
            <details key={item.question}>
              <summary>{item.question}</summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </section>
    </main>
  );
}
