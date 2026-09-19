import type { Metadata } from "next";
import Link from "next/link";
import { PACKAGES, formatCzk } from "@/lib/pricing";
import { copy } from "@/lib/copy";

export const metadata: Metadata = {
  title: "Ceník",
  description: copy.cenik.metaDescription,
};

export default function CenikPage() {
  return (
    <main className="page" id="main">
      <h1 className="page-title" style={{ fontSize: "clamp(30px, 4vw, 42px)" }}>
        {copy.cenik.claim}
      </h1>
      <p className="muted" style={{ maxWidth: 560, fontSize: 18 }}>
        {copy.cenik.helper}
      </p>
      <div className="pricing-grid" style={{ marginTop: 36 }}>
        {PACKAGES.map((pkg) => (
          <article key={pkg.code} className="pricing-card">
            <div className="label">{pkg.name}</div>
            <div className="price">{formatCzk(pkg.priceCzkExVat)}</div>
            <p className="muted" style={{ margin: 0, fontSize: 13 }}>
              bez DPH
            </p>
            <ul>
              <li>{pkg.blurb}</li>
            </ul>
            <Link className="btn btn-primary" href="/firma/prihlaseni">
              {copy.employers.pricingCta}
            </Link>
          </article>
        ))}
      </div>
      <p className="muted" style={{ marginTop: 28, fontSize: 14 }}>
        {copy.employers.pricingNote}
      </p>
      <p style={{ marginTop: 16 }}>
        <Link href="/pro-firmy">Zpět na Pro firmy</Link>
      </p>
    </main>
  );
}
