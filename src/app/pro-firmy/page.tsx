import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui";
import { copy } from "@/lib/copy";

export const metadata: Metadata = {
  title: copy.employers.metaTitle,
  description: copy.employers.metaDescription,
};

export default function ProFirmyPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
      <h1 className="text-3xl font-semibold sm:text-5xl">{copy.employers.claim}</h1>
      <p className="mt-4 text-steel">{copy.employers.helper}</p>
      <div className="mt-6 flex flex-wrap gap-3">
        <ButtonLink href="/firma/registrace">{copy.employers.ctaPrimary}</ButtonLink>
        <ButtonLink href="/firma/prihlaseni" variant="ghost">
          {copy.employers.ctaSecondary}
        </ButtonLink>
      </div>

      <h2 className="mt-12 text-2xl font-semibold">{copy.employers.sectionWhy}</h2>
      <ul className="mt-4 grid gap-3">
        <li className="border border-line p-4">
          <p className="font-semibold">{copy.employers.why1Title}</p>
          <p className="mt-1 text-sm text-steel">{copy.employers.why1Body}</p>
        </li>
        <li className="border border-line p-4">
          <p className="font-semibold">{copy.employers.why2Title}</p>
          <p className="mt-1 text-sm text-steel">{copy.employers.why2Body}</p>
        </li>
        <li className="border border-line p-4">
          <p className="font-semibold">{copy.employers.why3Title}</p>
          <p className="mt-1 text-sm text-steel">{copy.employers.why3Body}</p>
        </li>
      </ul>
      <p className="mt-8 text-sm text-steel">{copy.employers.bottomHelper}</p>
    </main>
  );
}
