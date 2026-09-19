import type { Metadata } from "next";
import Link from "next/link";
import { PACKAGES, formatCzk } from "@/lib/pricing";
import { BRAND, BRAND_CLAIM } from "@/lib/brand";
import { copy } from "@/lib/copy";

export const metadata: Metadata = {
  title: "Pro firmy",
  description: copy.employers.metaDescription,
};

export default function ProFirmyPage() {
  const plans = PACKAGES.filter((pkg) => pkg.code !== "top").slice(0, 3);

  return (
    <main className="page" id="main">
      <h1 className="page-title" style={{ fontSize: "clamp(30px, 4vw, 42px)" }}>
        {copy.employers.claim}
      </h1>
      <p className="muted" style={{ maxWidth: 560, fontSize: 18, lineHeight: 1.55 }}>
        {copy.employers.helper}
      </p>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 24 }}>
        <Link className="btn btn-primary" href="/firma/prihlaseni">
          {copy.employers.ctaPrimary}
        </Link>
        <Link className="btn btn-secondary" href="/firma/prihlaseni">
          {copy.employers.ctaSecondary}
        </Link>
      </div>

      <div className="section-head" style={{ marginTop: 56 }}>
        <h2>{copy.employers.sectionWhy}</h2>
      </div>
      <div className="facts" aria-label={copy.employers.sectionWhy}>
        <div className="fact">
          <b>{copy.employers.why1Title}</b>
          <span>{copy.employers.why1Body}</span>
        </div>
        <div className="fact">
          <b>{copy.employers.why2Title}</b>
          <span>{copy.employers.why2Body}</span>
        </div>
        <div className="fact">
          <b>{copy.employers.why3Title}</b>
          <span>{copy.employers.why3Body}</span>
        </div>
      </div>

      <div className="band band-pad" style={{ marginTop: 40 }}>
        <h2 className="h2" style={{ fontSize: 20, margin: "0 0 8px" }}>
          {copy.employers.sectionHow}
        </h2>
        <ol style={{ margin: 0, paddingLeft: 20, fontSize: 17, lineHeight: 1.7 }}>
          <li>{copy.employers.how1}</li>
          <li>{copy.employers.how2}</li>
          <li>{copy.employers.how3}</li>
        </ol>
      </div>

      <div className="section-head" style={{ marginTop: 56 }}>
        <h2>{copy.employers.pricingSection}</h2>
        <Link href="/cenik">{copy.employers.linkCenik} →</Link>
      </div>
      <p className="muted" style={{ marginTop: 0, fontSize: 16 }}>
        {copy.employers.pricingHelper}
      </p>
      <div className="pricing-grid">
        {plans.map((pkg, i) => (
          <article key={pkg.code} className={`pricing-card${i === 1 ? " featured" : ""}`}>
            <div className="label">{pkg.name}</div>
            <div className="price">
              {pkg.priceCzkExVat === 0 ? "0 Kč" : formatCzk(pkg.priceCzkExVat)}
            </div>
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
        {copy.employers.pricingNote} Ceny bez DPH. FairJobs.
      </p>

      <div className="band band-pad" style={{ marginTop: 40 }}>
        <div className="employer-cta">
          <div>
            <h2 className="h2" style={{ fontSize: 22, marginBottom: 6 }}>
              {copy.employers.bottomHelper}
            </h2>
            <p className="muted" style={{ margin: 0 }}>
              {BRAND_CLAIM} · {BRAND}
            </p>
          </div>
          <Link className="btn btn-primary" href="/firma/prihlaseni">
            {copy.employers.ctaPost}
          </Link>
        </div>
      </div>
    </main>
  );
}
