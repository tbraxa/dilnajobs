import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pro firmy",
  description: "Inzerujte CNC, svářeče, operátory a údržbu u lidí, kteří hledají práci ve výrobě.",
};

export default function ProFirmyPage() {
  return (
    <main>
      <section className="page-hero">
        <div className="wrap">
          <h1>Inzerce výrobních pozic</h1>
          <p>Zveřejněte CNC, svářeče, operátory a údržbu u uchazečů, kteří hledají práci ve výrobě.</p>
          <div className="actions">
            <Link className="btn btn-primary" href="/firma/registrace">
              Založit účet firmy
            </Link>
            <Link className="btn btn-ghost" href="/firma/prihlaseni">
              Přihlásit se
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <h2>Proč DílnaJobs</h2>
          <div className="benefits">
            <article className="benefit">
              <h3>Cílení na výrobu</h3>
              <p>Filtry a jazyk pro CNC, sváření, lisovny a údržbu. Uchazeči vidí, co nabízíte.</p>
            </article>
            <article className="benefit">
              <h3>Přehledný inzerát</h3>
              <p>Plat, směna, město a typ úvazku hned vidět. Méně zbytečných odpovědí.</p>
            </article>
            <article className="benefit">
              <h3>Rychlé spuštění</h3>
              <p>Registrace firmy a první inzerát během pár minut.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="section section-pricing">
        <div className="wrap">
          <h2 id="cenik">Ceník</h2>
          <p className="lead">Jednoduché balíčky. Ceny bez DPH, orientační náhled.</p>
          <div className="pricing">
            <article className="price-card">
              <h3>Jednorázový</h3>
              <p className="plan-desc">Jeden inzerát na 30 dní</p>
              <div className="price">
                2 490 Kč <span>/ inzerát</span>
              </div>
              <ul>
                <li>1 aktivní nabídka</li>
                <li>Zvýraznění ve výsledcích</li>
                <li>E-mailové notifikace</li>
              </ul>
              <Link className="btn btn-ghost btn-block" href="/firma/registrace">
                Vybrat
              </Link>
            </article>
            <article className="price-card featured">
              <h3>Firemní</h3>
              <p className="plan-desc">Pro průběžný nábor</p>
              <div className="price">
                6 990 Kč <span>/ měsíc</span>
              </div>
              <ul>
                <li>Až 5 aktivních nabídek</li>
                <li>Priorita ve výpisu</li>
                <li>Firemní profil</li>
                <li>Základní statistiky</li>
              </ul>
              <Link className="btn btn-primary btn-block" href="/firma/registrace">
                Vybrat
              </Link>
            </article>
            <article className="price-card">
              <h3>Provoz</h3>
              <p className="plan-desc">Více závodů, více rolí</p>
              <div className="price">na míru</div>
              <ul>
                <li>Neomezené nabídky</li>
                <li>Více uživatelů</li>
                <li>Dedikovaná podpora</li>
                <li>API / export (brzy)</li>
              </ul>
              <Link className="btn btn-ghost btn-block" href="/firma/registrace">
                Domluvit se
              </Link>
            </article>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap" style={{ textAlign: "center" }}>
          <h2>Začít inzerovat</h2>
          <p className="lead" style={{ marginInline: "auto" }}>
            Založte účet firmy a zveřejněte první nabídku.
          </p>
          <Link className="btn btn-primary" href="/firma/registrace">
            Vystavit nabídku
          </Link>
        </div>
      </section>
    </main>
  );
}
