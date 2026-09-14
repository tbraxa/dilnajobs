import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pro firmy",
  description: "Inzerujte CNC, svářeče, operátory a údržbu u lidí, kteří hledají práci ve výrobě.",
};

export default function ProFirmyPage() {
  return (
    <main className="page">
      <h1>Inzerce výrobních pozic</h1>
      <p className="lede">
        Zveřejněte CNC, svářeče, operátory a údržbu u uchazečů, kteří hledají práci ve výrobě. Ceny bez DPH.
      </p>

      <div className="prices" id="cenik">
        <article className="price">
          <span>Zkušební</span>
          <strong>0 Kč</strong>
          <p>Jeden inzerát. Ověříte, jestli sem lidi chodí.</p>
          <a className="btn btn-outline" href="/firma/registrace">
            Začít
          </a>
        </article>
        <article className="price">
          <span>Inzerát · 30 dní</span>
          <strong>2 990 Kč</strong>
          <p>Jedna pozice, bez předplatného.</p>
          <a className="btn btn-outline" href="/firma/registrace">
            Koupit
          </a>
        </article>
        <article className="price">
          <span>Basic · měsíc</span>
          <strong>8 900 Kč</strong>
          <p>Více pozic, faktura na firmu.</p>
          <a className="btn btn-outline" href="/firma/registrace">
            Vybrat
          </a>
        </article>
        <article className="price">
          <span>Standard · měsíc</span>
          <strong>19 900 Kč</strong>
          <p>Pro dílny, které nabírají průběžně.</p>
          <a className="btn btn-accent" href="/firma/registrace" style={{ width: "auto" }}>
            Vybrat
          </a>
        </article>
      </div>
    </main>
  );
}
