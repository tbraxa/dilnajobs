import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { withEmployerRls } from "@/db/rls";
import { applications, jobs } from "@/db/schema";
import { toAppUrl } from "@/lib/app-url";
import { getSession } from "@/lib/auth";
import { presignDownload, readCv } from "@/lib/storage/cv";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string; appId: string }> },
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.redirect(toAppUrl("/firma/prihlaseni"));
  }
  const { id, appId } = await params;

  const app = await withEmployerRls(session.employerId, async (tx) => {
    const [job] = await tx
      .select()
      .from(jobs)
      .where(and(eq(jobs.id, id), eq(jobs.employerId, session.employerId)))
      .limit(1);
    if (!job) return null;
    const [row] = await tx
      .select()
      .from(applications)
      .where(and(eq(applications.id, appId), eq(applications.jobId, job.id)))
      .limit(1);
    return row ?? null;
  });

  if (!app?.cvObjectKey) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const signed = await presignDownload(app.cvObjectKey);
  if (signed) {
    return NextResponse.redirect(signed.url);
  }

  const file = await readCv(app.cvObjectKey);
  if (!file) return NextResponse.json({ error: "missing_object" }, { status: 404 });

  return new NextResponse(new Uint8Array(file.body), {
    headers: {
      "Content-Type": file.contentType,
      "Content-Disposition": `attachment; filename="${app.cvFileName ?? "zivotopis"}"`,
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
