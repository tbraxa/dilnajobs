import { redirect } from "next/navigation";

export default async function JobApplicationsRedirect({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/firma/prihlasky?pozice=${encodeURIComponent(id)}`);
}
