import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui";
import { IconArrow, IconCheck } from "@/components/icons";
import { PACKAGES, formatCzk } from "@/lib/pricing";

export const metadata: Metadata = { title: "Pro firmy" };

export default function ProFirmyPage() {
  return (
    <main>
      <section className="rule-grid border-b border-line">
        <div className="shell grid gap-0 lg:grid-cols-12">
          <div className="border-line py-10 sm:py-14 lg:col-span-7 lg:border-r lg:py-16 lg:pr-10">
            <p className="label">Zaměstnavatelé</p>
            <h1 className="display mt-3 max-w-[14ch] text-3xl leading-[0.95] sm:text-5xl lg:text-6xl">
              Najdete lidi z dílny. Ne z agentury.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-steel">
              Inzerujete vy — výrobní firma s IČO. Ceny jsou bez DPH. První inzerát kontrolujeme. Heslo nechceme:
              přihlášení jde odkazem na e-mail.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/firma/prihlaseni">
                Přihlásit firmu
                <IconArrow className="h-4 w-4" />
              </ButtonLink>
              <ButtonLink href="/nabidky" variant="ghost">
                Podívat se na nástěnku
              </ButtonLink>
            </div>
          </div>
          <div className="border-t border-line bg-paper py-8 lg:col-span-5 lg:border-t-0 lg:py-16 lg:pl-10">
            <p className="label mb-4">Co bereme</p>
            <ul className="space-y-3 text-sm">
              {[
                "Přímý zaměstnavatel s českým IČO",
                "Pozice na hale, v dílně, ve skladu",
                "Mzda na inzerátu, ne „dle dohody“ jako výmluva",
              ].map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="icon-tile h-8 w-8">
                    <IconCheck className="h-4 w-4" />
                  </span>
                  <span className="pt-1.5">{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm text-steel">Agentury práce v podmínkách zakazujeme.</p>
          </div>
        </div>
      </section>

      <section className="shell py-10 sm:py-12">
        <p className="label">Ceník</p>
        <h2 className="display mt-2 text-2xl sm:text-4xl">Platíte inzerát. Ne náborovou daň.</h2>
        <div className="mt-6 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {PACKAGES.map((pkg) => (
            <article
              key={pkg.code}
              className={`flex flex-col p-5 ${pkg.code === "standard" ? "bg-ink text-paper-0" : "bg-paper-0"}`}
            >
              <p className={`label ${pkg.code === "standard" ? "!text-white/70" : ""}`}>{pkg.name}</p>
              <p className="display mt-2 text-3xl">
                {pkg.priceCzkExVat === 0 ? "0 Kč" : formatCzk(pkg.priceCzkExVat)}
              </p>
              <p className={`text-xs ${pkg.code === "standard" ? "text-white/70" : "text-steel"}`}>bez DPH</p>
              <p className={`mt-3 flex-1 text-sm ${pkg.code === "standard" ? "text-white/90" : "text-steel"}`}>
                {pkg.blurb}
              </p>
            </article>
          ))}
        </div>
        <p className="mt-6 text-sm text-steel">
          Platba kartou jde přes Stripe Checkout, až bude <code>STRIPE_SECRET_KEY</code> v prostředí. Do té doby je
          objednávka evidovaná jako stub — ozveme se.
        </p>
      </section>
    </main>
  );
}
