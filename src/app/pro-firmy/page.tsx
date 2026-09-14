import type { Metadata } from "next";
import { PACKAGES, formatCzk } from "@/lib/pricing";

export const metadata: Metadata = { title: "Pro firmy" };

export default function ProFirmyPage() {
  return (
    <main>
      <section className="hero wrap">
        <div className="hero-copy">
          <p className="micro">Zaměstnavatelé</p>
          <h1 className="display">Najdete lidi z dílny. Ne z agentury.</h1>
          <p className="lead">
            Inzerujete vy — výrobní firma s IČO. Ceny jsou bez DPH. První inzerát kontrolujeme. Heslo nechceme:
            přihlášení jde odkazem na e-mail.
          </p>
          <div className="hero-actions">
            <a className="btn btn-square btn-primary" href="/firma/prihlaseni">
              Přihlásit firmu
            </a>
            <a className="btn btn-square btn-ghost" href="/nabidky">
              Podívat se na nástěnku
            </a>
          </div>
        </div>
        <div className="hero-aside">
          <p className="micro">Co bereme</p>
          <div className="how" style={{ marginTop: "0.75rem" }}>
            <div className="how-step">
              <p className="micro">01</p>
              <h3>Přímý zaměstnavatel s českým IČO</h3>
            </div>
            <div className="how-step">
              <p className="micro">02</p>
              <h3>Pozice na hale, v dílně, ve skladu</h3>
            </div>
            <div className="how-step">
              <p className="micro">03</p>
              <h3>Mzda na inzerátu, ne jako výmluva</h3>
            </div>
          </div>
        </div>
      </section>
      <section className="section wrap">
        <p className="micro">Ceník</p>
        <h2 className="display">Platíte inzerát. Ne náborovou daň.</h2>
        <div className="pricing-grid" style={{ marginTop: "1.25rem" }}>
          {PACKAGES.map((pkg) => (
            <article key={pkg.code} className={`price-card${pkg.code === "standard" ? " is-ink" : ""}`}>
              <p className="micro">{pkg.name}</p>
              <p className="price">{pkg.priceCzkExVat === 0 ? "0 Kč" : formatCzk(pkg.priceCzkExVat)}</p>
              <p className="vat">bez DPH</p>
              <p className="blurb">{pkg.blurb}</p>
            </article>
          ))}
        </div>
        <p className="empty" style={{ marginTop: "1.25rem" }}>
          Platba kartou jde přes Stripe Checkout, až bude STRIPE_SECRET_KEY v prostředí. Do té doby je objednávka
          evidovaná jako stub — ozveme se.
        </p>
      </section>
    </main>
  );
}
