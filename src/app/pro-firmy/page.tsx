import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui";
import { PACKAGES, formatCzk } from "@/lib/pricing";

export const metadata: Metadata = { title: "Pro firmy" };

export default function ProFirmyPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
      <p className="label">Zaměstnavatelé</p>
      <h1 className="display mt-2 max-w-3xl text-3xl font-semibold sm:text-5xl">
        Najdete lidi z dílny. Ne z agentury.
      </h1>
      <p className="mt-4 max-w-2xl text-steel">
        Inzerujete vy — výrobní firma s IČO. Ceny jsou bez DPH. První inzerát kontrolujeme. Heslo nechceme: přihlášení
        jde odkazem na e-mail.
      </p>
      <div className="mt-6">
        <ButtonLink href="/firma/prihlaseni">Přihlásit firmu</ButtonLink>
      </div>

      <h2 className="display mt-12 text-2xl font-semibold">Ceník</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {PACKAGES.map((pkg) => (
          <article key={pkg.code} className="flex flex-col border border-line bg-paper p-5">
            <p className="label">{pkg.name}</p>
            <p className="display mt-2 text-3xl font-semibold">
              {pkg.priceCzkExVat === 0 ? "0 Kč" : formatCzk(pkg.priceCzkExVat)}
            </p>
            <p className="text-xs text-steel">bez DPH</p>
            <p className="mt-3 flex-1 text-sm">{pkg.blurb}</p>
          </article>
        ))}
      </div>
      <p className="mt-6 text-sm text-steel">
        Ceny bez DPH. Orientace pro firmy. Platbu na FairJobs domluvíte po registraci.
      </p>
    </main>
  );
}
