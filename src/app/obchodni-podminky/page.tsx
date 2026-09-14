import type { Metadata } from "next";

export const metadata: Metadata = { title: "Obchodní podmínky" };

export default function TosPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-8 text-[15px] leading-relaxed sm:px-6">
      <h1 className="display text-3xl font-semibold">Obchodní podmínky</h1>
      <p className="mt-4 text-steel">Návrh v1. Finální verzi schválí právník před ostrým provozem.</p>
      <h2 className="display mt-8 text-xl font-semibold">Koho bereme</h2>
      <p className="mt-2">
        Zákazník je přímý zaměstnavatel s českým IČO, který hledá lidi do vlastního provozu. Agentury práce, personální
        agentury a zprostředkovatelé jsou zakázaní. Účet agentury můžeme odmítnout nebo zrušit bez náhrady.
      </p>
      <h2 className="display mt-8 text-xl font-semibold">Inzerce</h2>
      <p className="mt-2">
        První inzerát podléhá kontrole. Ceny na /pro-firmy jsou bez DPH. Nevyžádané hromadné inzeráty mažeme.
      </p>
      <h2 className="display mt-8 text-xl font-semibold">Odpovědnost</h2>
      <p className="mt-2">
        DílnaJobs zprostředkuje kontakt. Pracovní smlouva je mezi firmou a uchazečem. Nejsme agentura podle zákona o
        zaměstnanosti.
      </p>
    </main>
  );
}
