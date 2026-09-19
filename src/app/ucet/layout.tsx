import type { ReactNode } from "react";

/** Seeker console — no public site chrome (root layout skips header/footer for /ucet). */
export default function UcetLayout({ children }: { children: ReactNode }) {
  return children;
}
