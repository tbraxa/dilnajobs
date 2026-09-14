import type { Metadata } from "next";

export const metadata: Metadata = { title: "Obchodní podmínky" };

export default function TosPage() {
  return (
    <main className="page">
      <h1>Obchodní podmínky</h1>
      <p className="lede">Návrh v1. Finální verzi schválí právník před ostrým provozem.</p>
      <div className="legal-copy">
        <h2>Koho bereme</h2>
        <p>
          Zákazník je přímý zaměstnavatel s českým IČO, který hledá lidi do vlastního provozu. Agentury práce, personální
          agentury a zprostředkovatelé jsou zakázaní. Účet agentury můžeme odmítnout nebo zrušit bez náhrady.
        </p>
        <h2>Inzerce</h2>
        <p>První inzerát podléhá kontrole. Ceny na /pro-firmy jsou bez DPH. Nevyžádané hromadné inzeráty mažeme.</p>
        <h2>Odpovědnost</h2>
        <p>
          DílnaJobs zprostředkuje kontakt. Pracovní smlouva je mezi firmou a uchazečem. Nejsme agentura podle zákona o
          zaměstnanosti.
        </p>
      </div>
    </main>
  );
}
