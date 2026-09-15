import { JobCreateForm } from "@/components/job-create-form";

export default function NovaNabidkaPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
      <p className="text-xs font-bold uppercase tracking-wider text-slate-600">Inzerát</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">Nová nabídka</h1>
      <p className="mt-2 text-sm text-slate-600">
        Pište, jak by to řekl mistr na hale. První inzerát čeká na kontrolu.
      </p>
      <div className="mt-6 border border-slate-200 bg-white p-5">
        <JobCreateForm />
      </div>
    </main>
  );
}
