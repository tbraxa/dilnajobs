import { redirect } from "next/navigation";

/** Canonical seeker overview is /ucet (P0-02 single chrome). */
export default function UcetPrehledRedirect() {
  redirect("/ucet");
}
