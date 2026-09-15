import type { Metadata } from "next";

export const metadata: Metadata = { title: "Obchodní podmínky" };

export default function TosPage() {
  return (
    <main className="legal-page">
      <div className="wrap">
        <h1 className="h1">Obchodní podmínky</h1>
        <p>Návrh v1. Finální verzi schválí právník před ostrým provozem.</p>
        <h2>Koho bereme</h2>
        <p>
          Zákazník je přímý zaměstnavatel s českým IČO, který hledá lidi do vlastního provozu. Agentury práce, personální
          agentury a zprostředkovatelé jsou zakázaní. Účet agentury můžeme odmítnout nebo zrušit bez náhrady.
        </p>
        <h2>Inzerce</h2>
        <p>První inzerát podléhá kontrole. Ceny na /pro-firmy jsou bez DPH. Nevyžádané hromadné inzeráty mažeme.</p>
        <h2>Odpovědnost</h2>
        <p>
          FairJobs zprostředkuje kontakt. Pracovní smlouva je mezi firmou a uchazečem. Nejsme agentura podle zákona o
          zaměstnanosti.
        </p>
      </div>
    </main>
  );
}
