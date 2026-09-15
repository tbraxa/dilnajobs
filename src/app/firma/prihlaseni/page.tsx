import type { Metadata } from "next";
import { LoginForm } from "@/components/auth-forms";
import { AuthSplit } from "@/components/auth-split";
import { copy } from "@/lib/copy";

export const metadata: Metadata = {
  title: { absolute: copy.login.metaTitle },
  description: copy.login.metaDescription,
};

export default function LoginPage() {
  return (
    <AuthSplit
      title={copy.login.claim}
      helper={copy.login.helper}
      switchText={copy.login.helperSecondary}
      switchHref="/firma/registrace"
      switchLabel={copy.login.ctaSecondary}
    >
      <LoginForm />
    </AuthSplit>
  );
}
