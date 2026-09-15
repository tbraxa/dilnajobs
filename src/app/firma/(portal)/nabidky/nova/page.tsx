import { JobCreateForm } from "@/components/job-create-form";
import { copy } from "@/lib/copy";

export default function NovaNabidkaPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
      <p className="label">Inzerát</p>
      <h1 className="display mt-2 text-3xl font-semibold">{copy.employers.ctaPost}</h1>
      <p className="mt-2 text-sm text-steel">
        {copy.employers.helper} První nabídka čeká na kontrolu.
      </p>
      <div className="mt-6 border border-line bg-paper p-5">
        <JobCreateForm />
      </div>
    </main>
  );
}
