import { JobCreateForm } from "@/components/job-create-form";
import { PageHero } from "@/components/preview/board";

export default function NovaNabidkaPage() {
  return (
    <main>
      <PageHero
        eyebrow="Inzerát"
        title="Nová nabídka"
        lead="Pište, jak by to řekl mistr na hale. První inzerát čeká na kontrolu."
      >
        <a href="/firma" className="btn btn-secondary btn-square">
          Zpět →
        </a>
      </PageHero>
      <section className="section-band">
        <div className="board-pad" style={{ maxWidth: "42rem" }}>
          <JobCreateForm />
        </div>
      </section>
    </main>
  );
}
