import { getSession } from "@/lib/auth";
import { loadEmployerConsoleData, planLabel } from "@/lib/employer-console";
import { updateEmployerProfileAction } from "@/lib/actions/employer-console";
import { startCheckoutAction } from "@/lib/actions/jobs";
import { paymentsEnabled } from "@/lib/env";
import { formatCzk, PACKAGES } from "@/lib/pricing";

export default async function EmployerSettingsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const session = await getSession();
  if (!session) return null;
  const [params, data] = await Promise.all([
    searchParams,
    loadEmployerConsoleData(session.employerId),
  ]);
  const company = data.company;
  if (!company) return null;
  const saved = params.ulozeno === "1";
  const invalid = params.chyba === "1";
  const stripeOn = paymentsEnabled();

  return (
    <main className="fj-console-page">
      <header className="fj-console-page-head">
        <div>
          <p>Firemní účet</p>
          <h1>Nastavení</h1>
          <span>Veřejný profil, ověření a plán inzerce.</span>
        </div>
      </header>

      {saved ? <div className="fj-console-notice success">Změny jsou uložené.</div> : null}
      {invalid ? <div className="fj-console-notice error">Zkontrolujte název firmy a město.</div> : null}

      <div className="fj-console-settings-grid">
        <section className="fj-console-panel fj-console-settings-form">
          <div className="fj-console-panel-head">
            <div><h2>Veřejný profil firmy</h2><p>Tyto údaje lidé uvidí u vašich nabídek.</p></div>
          </div>
          <form action={updateEmployerProfileAction}>
            <label><span>Název firmy</span><input name="companyName" defaultValue={company.companyName} required /></label>
            <label><span>Město</span><input name="city" defaultValue={company.city ?? ""} /></label>
            <div className="fj-console-readonly-grid">
              <div><span>IČO</span><strong>{company.ico}</strong></div>
              <div><span>Stav ověření</span><strong>{company.verificationStatus === "verified" ? "Ověřeno" : "Čeká na ověření"}</strong></div>
              <div><span>Vlastník účtu</span><strong>{session.email}</strong></div>
            </div>
            <button type="submit" className="fj-console-button primary">Uložit profil</button>
          </form>
        </section>

        <aside className="fj-console-panel fj-console-account-card">
          <h2>Účet a bezpečnost</h2>
          <div><span>Přihlášení</span><strong>Jednorázový odkaz na e-mail</strong></div>
          <div><span>Uživatel</span><strong>{session.name}</strong></div>
          <div><span>Role</span><strong>Vlastník</strong></div>
          <p>Přístup je svázaný s firemním e-mailem. Heslo na FairJobs neukládáme.</p>
        </aside>
      </div>

      <section className="fj-console-panel fj-console-billing">
        <div className="fj-console-panel-head">
          <div>
            <h2>Plán a inzerce</h2>
            <p>Aktivní plán: <strong>{planLabel(session.planCode)}</strong>. Ceny jsou bez DPH.</p>
          </div>
        </div>
        <div className="fj-console-package-grid">
          {PACKAGES.filter((item) => item.code !== "top").map((item) => {
            const action = startCheckoutAction.bind(null, item.code);
            const current = item.code === session.planCode;
            return (
              <form action={action} className={current ? "current" : ""} key={item.code}>
                <div><strong>{item.name}</strong>{current ? <span>Aktivní</span> : null}</div>
                <p>{item.blurb}</p>
                <b>{item.priceCzkExVat ? formatCzk(item.priceCzkExVat) : "Zdarma"}</b>
                <button type="submit" disabled={current}>
                  {current ? "Váš plán" : item.priceCzkExVat && stripeOn ? "Vybrat a zaplatit" : "Vybrat plán"}
                </button>
              </form>
            );
          })}
        </div>
      </section>
    </main>
  );
}
