import { JobCreateForm } from "@/components/job-create-form";

export default function NovaNabidkaPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
      <p className="label">Inzerát</p>
      <h1 className="display mt-2 text-3xl font-semibold">Nová nabídka</h1>
      <p className="mt-2 text-sm text-steel">
        Pište, jak by to řekl mistr na hale. První inzerát čeká na kontrolu.
      </p>
      <div className="mt-6 border border-line bg-paper p-5">
        <JobCreateForm />
      </div>
    </main>
  );
}
