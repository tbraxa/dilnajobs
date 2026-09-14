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
          {on ? "nastaveno" : "stub"}
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
        Jen čtení z prostředí. Tajemství (DSN, klíče, connection string) se sem nevypisují.
      </p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <Flag on={flags.smtp} label="SMTP / pošta" hint="Bez SMTP_URL se odkazy a oznámení vypíší do konzole." />
        <Flag on={flags.s3} label="S3 úložiště CV" hint="Bez klíčů se soubory ukládají do storage/cvs/." />
        <Flag on={flags.paymentsLive} label="Platby" hint={flags.stripe ? "Stripe klíče přítomné." : flags.gopay ? "GoPay klíče přítomné." : "Checkout zakládá objednávku ve stavu stub."} />
        <Flag on={flags.sentry} label="Sentry" hint="Bez SENTRY_DSN jdou výjimky jen do strukturovaných logů." />
        <Flag
          on={!flags.autoPublish}
          label="Schvalování prvního inzerátu"
          hint={flags.autoPublish ? "FEATURE_AUTO_PUBLISH_FIRST_JOB=true — inzeráty jdou rovnou ven." : "Nové inzeráty čekají ve pending_review."}
        />
        <article className="border border-line bg-paper p-4">
          <h2 className="font-semibold">ADMIN_EMAILS</h2>
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
