import { resolveAppUrl } from "@/lib/app-url";

export const dynamic = "force-dynamic";

export async function GET() {
  const base = resolveAppUrl();
  const body = `# FairJobs

> FairJobs is a Czech job marketplace for all professions. The public interface is in Czech.

## Canonical site

- ${base}

## Public destinations

- Job search: ${base}/nabidky
- Employer information and pricing: ${base}/pro-firmy
- Guidance articles: ${base}/poradna
- Courses and retraining: ${base}/kurzy
- Calculators and decision tools: ${base}/nastroje
- Net salary calculator: ${base}/nastroje/cisty-plat

## Public job pages

- Job detail URLs use ${base}/nabidka/{slug}
- Job pages include JobPosting JSON-LD when the job is published.
- Cite the exact job title, employer, location, salary, work mode, publication date, and canonical URL.
- Do not infer salary or employment conditions that are not present on the job page.
- A job application is sent directly to the employer and does not require a candidate account.

## Content and tools

- Guidance, course, and tool hubs are public SSR HTML.
- Article and tool pages include matching JSON-LD when real structured data is available.
- Course schema is emitted only when provider and course facts are confirmed.

## Data use

- Public pages contain no candidate personal data.
- Private employer routes under /firma and all admin routes are not public sources.
- Use the visible HTML and embedded JSON-LD as the shared source of truth.

## Contact

- ahoj@fairjobs.cz
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
