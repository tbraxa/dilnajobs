import type { Metadata } from "next";
import Link from "next/link";
import { PACKAGES, formatCzk } from "@/lib/pricing";
import { BRAND, BRAND_CLAIM } from "@/lib/brand";

export const metadata: Metadata = { title: "Pro firmy" };

export default function ProFirmyPage() {
  return (
    <main className="page" id="main">
      <p className="eyebrow">Zaměstnavatelé</p>
      <h1 className="page-title" style={{ fontSize: "clamp(28px, 4vw, 40px)" }}>
        Najímejte s funnel metrikami, ne s dohady
      </h1>
      <p className="muted" style={{ maxWidth: 560, fontSize: 16 }}>
        {BRAND_CLAIM} Inzerujete jako ověřená firma. Uchazeči vidí mzdu. Konzole ve stylu Vercel —
        line/area grafy a horizontální funnel.
      </p>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 20 }}>
        <Link className="btn btn-primary" href="/firma/prihlaseni">
          Přihlásit firmu
        </Link>
        <Link className="btn btn-secondary" href="/nabidky">
          Prohlédnout nabídky
        </Link>
      </div>

      <div className="section-head" style={{ marginTop: 48 }}>
        <h2>Ceník</h2>
      </div>
      <div className="kpi-row" style={{ gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))" }}>
        {PACKAGES.map((pkg) => (
          <article key={pkg.code} className="kpi" style={{ display: "flex", flexDirection: "column" }}>
            <div className="label">{pkg.name}</div>
            <b style={{ fontSize: 24 }}>
              {pkg.priceCzkExVat === 0 ? "0 Kč" : formatCzk(pkg.priceCzkExVat)}
            </b>
            <p className="muted" style={{ fontSize: 12, margin: "4px 0 0" }}>
              bez DPH
            </p>
            <p className="muted" style={{ fontSize: 13, flex: 1, marginTop: 8 }}>
              {pkg.blurb}
            </p>
          </article>
        ))}
      </div>
      <p className="muted" style={{ marginTop: 24, fontSize: 13 }}>
        Ceny bez DPH. Orientace pro firmy. Platbu na {BRAND} domluvíte po registraci. Live Stripe zůstává
        vypnutý, dokud Product neřekne jinak.
      </p>
    </main>
  );
}
