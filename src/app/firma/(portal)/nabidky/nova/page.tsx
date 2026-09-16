import { JobCreateForm } from "@/components/job-create-form";

export default function NovaNabidkaPage() {
  return (
    <main className="fj-console-page fj-console-create-page">
      <header className="fj-console-page-head">
        <div>
          <p>Nový nábor</p>
          <h1>Vytvořit nabídku</h1>
          <span>Jasná mzda, místo a podmínky na jedné stránce.</span>
        </div>
      </header>
      <JobCreateForm />
    </main>
  );
}
