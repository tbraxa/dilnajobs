import "server-only";

import { env } from "./env";
import { log } from "./logging";

export async function sendEmail(input: { to: string; subject: string; text: string }) {
  // STUB: SMTP_URL is unused in v1. Dev: print to stdout. Prod: still log, never include secrets beyond the recipient.
  log("info", "email.stub", {
    to: env.NODE_ENV === "development" ? input.to : "redacted",
    subject: input.subject,
    smtpConfigured: Boolean(env.SMTP_URL),
  });
  if (env.NODE_ENV !== "production") {
    console.log(`\n--- EMAIL STUB ---\nTo: ${input.to}\nSubject: ${input.subject}\n\n${input.text}\n------------------\n`);
  }
}
