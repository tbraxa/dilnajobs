import { integrationFlags } from "@/lib/admin";

export const dynamic = "force-dynamic";

function Flag({ on, label, hint }: { on: boolean; label: string; hint: string }) {
  return (
    <article className="border border-line bg-paper p-4">
      <div className="flex items-start justify-between gap-3">
        <h2 className="font-semibold">{label}</h2>
        <span
          className={`inline-flex items-center rounded-[2px] px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider ${
            on ? "bg-ok text-white" : "border border-line text-steel"
          }`}
        >
          {on ? "nastaveno" : "nenastaveno"}
        </span>
      </div>
      <p className="mt-2 text-sm text-steel">{hint}</p>
    </article>
  );
}

export default function AdminSettingsPage() {
  const flags = integrationFlags();
  return (
    <main>
      <p className="label">Provoz</p>
      <h1 className="display mt-1 text-3xl font-semibold">Integrace</h1>
      <p className="mt-2 text-sm text-steel">
        Jen čtení z prostředí. Tajemství (klíče, connection string) se sem nevypisují.
      </p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <Flag
          on={flags.mailer}
          label="Pošta"
          hint={
            flags.resend
              ? "Resend API klíč je nastavený."
              : flags.smtp
                ? "SMTP je nastavené (záloha za Resend)."
                : "Bez nastavené pošty se odkazy vypíší jen do provozního logu."
          }
        />
        <Flag on={flags.s3} label="S3 úložiště CV" hint="Bez klíčů se soubory ukládají do storage/cvs/." />
        <Flag
          on={flags.paymentsLive && flags.stripeWebhook}
          label="Platby (Stripe)"
          hint={
            flags.stripe && flags.stripeWebhook
              ? "Checkout i potvrzení plateb jsou nastavené."
              : flags.stripe
                ? "Checkout je nastavený, chybí potvrzení plateb (webhook)."
                : "Checkout eviduje objednávku. Ozveme se firmě e-mailem."
          }
        />
        <Flag on={flags.sentry} label="Sentry" hint="Bez sledování výjimek jdou chyby jen do strukturovaných logů." />
        <Flag
          on={!flags.autoPublish}
          label="Schvalování prvního inzerátu"
          hint={flags.autoPublish ? "První inzeráty jdou rovnou ven." : "Nové inzeráty čekají ve pending_review."}
        />
        <article className="border border-line bg-paper p-4">
          <h2 className="font-semibold">Adresy správců</h2>
          <p className="mt-2 text-sm text-steel">
            {flags.adminEmailCount === 0
              ? "Seznam je prázdný — do správy se nikdo nepřihlásí."
              : flags.adminEmails.join(", ")}
          </p>
        </article>
      </div>
    </main>
  );
}
