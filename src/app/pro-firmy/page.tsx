import type { Metadata } from "next";

export const metadata: Metadata = { title: "Pro firmy" };

export default function ProFirmyPage() {
  return (
    <main>
      <section className="pricing-hero">
        <div className="ph-main">
          <p className="eyebrow">B2B / Výroba</p>
          <h1>
            Najděte lidi
            <br />
            do výroby.
          </h1>
          <p className="lead" style={{ margin: "1.25rem 0 2rem" }}>
            Inzerujte tam, kde uchazeči hledají CNC, svářeče, seřizovače. Odpovědi jdou rovnou k vám — bez agentury mezi
            vámi a telefonátem.
          </p>
          <div className="hero-ctas">
            <a href="/firma/registrace" className="btn btn-primary btn-lg btn-square">
              Vystavit nabídku →
            </a>
            <a href="#cenik" className="btn btn-secondary btn-lg btn-square">
              Zobrazit ceník
            </a>
          </div>
        </div>
        <aside className="ph-side" aria-label="Rychlá fakta">
          <div className="ph-stat">
            <div className="n">0&nbsp;Kč</div>
            <div className="l">Pro uchazeče vždy</div>
          </div>
          <div className="ph-stat">
            <div className="n">100&nbsp;%</div>
            <div className="l">Přímo od firem</div>
          </div>
          <div className="ph-stat">
            <div className="n">14 dní</div>
            <div className="l">Zkušební inzerát zdarma</div>
          </div>
        </aside>
      </section>

      <section className="outcomes-row" aria-label="Proč DílnaJobs">
        <div className="outcome">
          <div className="oc-num">01 / CÍLENÍ</div>
          <h3>Správní uchazeči</h3>
          <p>Na DílnaJobs chodí lidé, kteří umí konkrétní výrobní práci — ne náhodní zájemci o „jakoukoli brigádu“.</p>
        </div>
        <div className="outcome">
          <div className="oc-num">02 / KONTAKT</div>
          <h3>Přímý telefon</h3>
          <p>Odpovědi jdou k vám. Jméno, telefon, volitelně životopis. Žádný prostředník, který drží kandidáty u sebe.</p>
        </div>
        <div className="outcome">
          <div className="oc-num">03 / CENA</div>
          <h3>Jasný ceník</h3>
          <p>Jednorázový inzerát nebo měsíční balíček. Žádné skryté poplatky za „boost“ nebo za každý klik.</p>
        </div>
      </section>

      <section id="cenik" className="modular-grid" aria-labelledby="cenik-title">
        <div className="mod span-12" style={{ padding: "2rem 2.5rem", background: "var(--cream)" }}>
          <p className="eyebrow" style={{ marginBottom: "0.5rem" }}>
            Ceník
          </p>
          <h2 id="cenik-title" className="h2">
            Transparentní ceny. Bez agenturní přirážky.
          </h2>
          <p className="lead" style={{ marginTop: "0.75rem" }}>
            Ceny bez DPH. Faktura na firmu. Začněte zkušebním inzerátem zdarma.
          </p>
        </div>

        <div className="mod span-5">
          <span className="mod-tag">01 · Zkušební</span>
          <h3>Vyzkoušejte kanál</h3>
          <p className="mod-desc">Jedna pozice na 14 dní. Ověříte, jestli na DílnaJobs chodí lidé, které hledáte.</p>
          <div className="price-amt">
            0&nbsp;<small>Kč</small>
          </div>
          <div className="price-period">1 inzerát · 14 dní</div>
          <ul>
            <li>1 aktivní nabídka</li>
            <li>Základní zobrazení ve výpisu</li>
            <li>Odpovědi e-mailem</li>
            <li>Bez automatického obnovení</li>
          </ul>
          <a href="/firma/registrace" className="btn btn-outline-soft btn-square">
            Začít zdarma →
          </a>
        </div>

        <div className="mod span-7">
          <span className="mod-tag">02 · Inzerát</span>
          <h3>Jedna pozice, rychle</h3>
          <p className="mod-desc">
            Když potřebujete doplnit směnu nebo nahradit člověka. Zvýraznění ve výpisu, schránka odpovědí, statistiky.
          </p>
          <div className="price-amt">
            2&nbsp;990&nbsp;<small>Kč</small>
          </div>
          <div className="price-period">1 inzerát · 30 dní</div>
          <ul>
            <li>1 aktivní nabídka</li>
            <li>Zvýraznění ve výpisu</li>
            <li>Schránka odpovědí</li>
            <li>Statistiky zobrazení</li>
          </ul>
          <a href="/firma/registrace" className="btn btn-secondary btn-square">
            Koupit inzerát →
          </a>
        </div>

        <div className="mod span-7 is-dark">
          <span className="mod-tag">03 · Basic · nejčastější</span>
          <h3>Pravidelný nábor</h3>
          <p className="mod-desc">Několik pozic najednou. Priorita ve výpisu, firemní profil, notifikace u každé odpovědi.</p>
          <div className="price-amt">
            8&nbsp;900&nbsp;<small>Kč / měs</small>
          </div>
          <div className="price-period">Až 5 aktivních inzerátů</div>
          <ul>
            <li>Až 5 aktivních nabídek</li>
            <li>Priorita ve výpisu</li>
            <li>Schránka + notifikace</li>
            <li>Firemní profil</li>
            <li>Podpora e-mailem</li>
          </ul>
          <a href="/firma/registrace" className="btn btn-accent btn-square">
            Vybrat Basic →
          </a>
        </div>

        <div className="mod span-5 is-blue-bg">
          <span className="mod-tag">04 · Standard</span>
          <h3>Větší závod</h3>
          <p className="mod-desc" style={{ color: "rgba(255,255,255,0.92)" }}>
            Průběžný nábor, více lokalit, více uživatelů ve firmě.
          </p>
          <div className="price-amt">
            19&nbsp;900&nbsp;<small>Kč / měs</small>
          </div>
          <div className="price-period" style={{ color: "rgba(255,255,255,0.92)" }}>
            Až 15 aktivních inzerátů
          </div>
          <ul>
            <li>Až 15 aktivních nabídek</li>
            <li>Top umístění ve výpisu</li>
            <li>Více uživatelů ve firmě</li>
            <li>Rozšířený firemní profil</li>
            <li>Dedikovaná podpora</li>
          </ul>
          <a href="/firma/registrace" className="btn btn-primary btn-square">
            Vybrat Standard →
          </a>
        </div>

        <div className="mod span-4">
          <span className="mod-tag">Postup · 01</span>
          <h3>Vystavíte</h3>
          <p className="mod-desc">Profese, mzda, směny, lokalita, požadavky. Hotovo během několika minut.</p>
        </div>
        <div className="mod span-4">
          <span className="mod-tag">Postup · 02</span>
          <h3>Odpovídají</h3>
          <p className="mod-desc">Jednoduchý formulář: jméno, telefon, volitelně CV. Žádná povinná registrace uchazeče.</p>
        </div>
        <div className="mod span-4" style={{ borderRight: "none" }}>
          <span className="mod-tag">Postup · 03</span>
          <h3>Voláte vy</h3>
          <p className="mod-desc">Ve schránce máte telefon — jeden klik a jste ve spojení.</p>
        </div>
      </section>

      <section className="cta-panel">
        <div>
          <h2>Připraveni vystavit první nabídku?</h2>
          <p>
            Začněte zkušebním inzerátem zdarma, nebo rovnou vyberte balíček podle toho, kolik pozic potřebujete obsadit.
          </p>
        </div>
        <div className="hero-ctas">
          <a href="/firma/registrace" className="btn btn-accent btn-lg btn-square">
            Začít zdarma →
          </a>
          <a href="mailto:firmy@dilnajobs.cz" className="btn btn-secondary btn-lg btn-square">
            firmy@dilnajobs.cz
          </a>
        </div>
      </section>
    </main>
  );
}
