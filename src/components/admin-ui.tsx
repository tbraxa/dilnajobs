"use client";

import { useActionState, useEffect, useState } from "react";
import type { CheckStatus, HealthReport } from "@/lib/health-types";
import { HEALTH_LABELS, STATUS_LABELS } from "@/lib/health-types";
import { requestAdminLinkAction, type AdminAuthState } from "@/lib/actions/admin-login";
import { Button, Field, inputClass } from "./ui";

const pillClass: Record<CheckStatus, string> = {
  ok: "bg-ok text-white",
  degraded: "border border-ink bg-paper-2 text-ink",
  down: "bg-danger text-white",
  unconfigured: "border border-line bg-paper text-steel",
};

export function StatusPill({ status }: { status: CheckStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-[2px] px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider ${pillClass[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}

export function AdminLoginForm() {
  const [state, action, pending] = useActionState(requestAdminLinkAction, null as AdminAuthState | null);
  return (
    <form action={action} className="space-y-4">
      <Field label="E-mail správce" name="email">
        <input id="email" name="email" type="email" required className={inputClass} autoComplete="email" />
      </Field>
      {state?.ok ? <p className="auth-flash is-ok">{state.message}</p> : null}
      {state && !state.ok ? <p className="auth-flash is-err">{state.error}</p> : null}
      <Button type="submit" variant="accent" disabled={pending}>
        {pending ? "Posílám odkaz…" : "Poslat přihlašovací odkaz"}
      </Button>
    </form>
  );
}

export function HealthCards({ initial }: { initial: HealthReport }) {
  const [report, setReport] = useState(initial);

  useEffect(() => {
    const tick = async () => {
      const res = await fetch("/api/admin/health", { credentials: "same-origin" });
      if (res.ok) setReport((await res.json()) as HealthReport);
    };
    const id = setInterval(() => {
      void tick();
    }, 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <StatusPill status={report.status} />
        <p className="text-xs text-steel">Kontrola {new Date(report.checkedAt).toLocaleString("cs-CZ")} · obnovení každých 30 s</p>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {report.checks.map((check) => (
          <article key={check.name} className="border border-line bg-paper p-4">
            <div className="flex items-start justify-between gap-2">
              <h2 className="font-semibold">{HEALTH_LABELS[check.name] ?? check.name}</h2>
              <StatusPill status={check.status} />
            </div>
            {check.latencyMs != null ? <p className="mt-1 text-xs text-steel">{check.latencyMs} ms</p> : null}
            {check.detail ? <p className="mt-2 text-sm text-steel">{check.detail}</p> : null}
          </article>
        ))}
      </div>
    </div>
  );
}
