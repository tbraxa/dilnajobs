import type { Metadata } from "next";
import { RegisterForm } from "@/components/auth-forms";
import { AuthSplit } from "@/components/auth-split";
import { copy } from "@/lib/copy";

export const metadata: Metadata = {
  title: { absolute: copy.register.metaTitle },
  description: copy.register.metaDescription,
};

export default function RegisterPage() {
  return (
    <AuthSplit
      title={copy.register.claim}
      helper={copy.register.helper}
      switchText={copy.register.helperSecondary}
      switchHref="/firma/prihlaseni"
      switchLabel={copy.register.ctaSecondary}
      wide
    >
      <RegisterForm />
    </AuthSplit>
  );
}
