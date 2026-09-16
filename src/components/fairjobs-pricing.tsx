"use client";

import Link from "next/link";
import { useState } from "react";
import { formatCzk, PUBLIC_PLANS } from "@/lib/pricing";

export function FairJobsPricing() {
  const [selectedCode, setSelectedCode] = useState<(typeof PUBLIC_PLANS)[number]["code"]>("standard");
  const selected = PUBLIC_PLANS.find((plan) => plan.code === selectedCode) ?? PUBLIC_PLANS[0];

  return (
    <section className="fj-pricing-section" id="cenik">
      <div className="fj-pricing-heading">
        <div>
          <p className="fj-eyebrow">Ceník bez překvapení</p>
          <h2 className="fj-display">Vyberte si tempo náboru.</h2>
        </div>
        <p>Ceny jsou bez DPH. Každý plán obsahuje firemní profil, přehled odpovědí a ověření IČO.</p>
      </div>

      <div className="fj-pricing-product">
        <div className="fj-pricing-product-head">
          <strong>Nová náborová kampaň</strong>
          <span>Ceny bez DPH</span>
        </div>

        <div className="fj-pricing-layout">
          <div className="fj-plan-picker">
            <p className="fj-plan-picker-label">1. Vyberte balíček</p>
            <div role="tablist" aria-label="Balíčky inzerce">
            {PUBLIC_PLANS.map((plan) => (
              <button
                type="button"
                role="tab"
                aria-selected={plan.code === selectedCode}
                aria-controls="fj-plan-summary"
                key={plan.code}
                className={`fj-plan-row${plan.code === selectedCode ? " fj-plan-row-selected" : ""}`}
                onClick={() => setSelectedCode(plan.code)}
              >
                <span className="fj-plan-radio" aria-hidden="true">
                  {plan.code === selectedCode ? <span /> : null}
                </span>
                <div className="fj-plan-copy">
                  <div>
                    <h3>{plan.name}</h3>
                    {plan.code === "standard" ? <small>Nejčastější volba</small> : null}
                  </div>
                  <p>{plan.note}</p>
                </div>
                <strong>{formatCzk(plan.priceCzk)}</strong>
              </button>
            ))}
            </div>

            <div className="fj-pricing-addon">
              <span>+</span>
              <div>
                <strong>Potřebujete větší balíček?</strong>
                <p>Pro průběžný nábor připravíme objemovou cenu.</p>
              </div>
              <a href="mailto:ahoj@fairjobs.cz">Napsat nám</a>
            </div>
          </div>

          <aside className="fj-order-summary" id="fj-plan-summary" aria-live="polite">
            <p className="fj-plan-picker-label">2. Co získáte</p>
            <div className="fj-order-plan">
              <span>Plán</span>
              <strong>{selected.name}</strong>
            </div>
            <ul>
              {selected.features.map((feature) => (
                <li key={feature}>
                  <span aria-hidden="true">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
            <div className="fj-order-price">
              <span>Celkem bez DPH</span>
              <strong>{formatCzk(selected.priceCzk)}</strong>
            </div>
            <Link href={`/firma/registrace?plan=${selected.code}`} className="fj-primary-button fj-primary-button-blue">
              Pokračovat s plánem {selected.name}
              <span aria-hidden="true">→</span>
            </Link>
            <p>Platbu dokončíte až po registraci a kontrole firmy.</p>
          </aside>
        </div>
      </div>
    </section>
  );
}
