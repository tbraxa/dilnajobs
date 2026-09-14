export type MailerProvider = "resend" | "smtp" | "stub";

export function resolveMailerProvider(input: {
  resendApiKey?: string;
  smtpUrl?: string;
}): MailerProvider {
  if (input.resendApiKey && input.resendApiKey.length > 0) return "resend";
  if (input.smtpUrl && input.smtpUrl.length > 0) return "smtp";
  return "stub";
}
