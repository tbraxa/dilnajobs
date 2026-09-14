import "server-only";

import { env } from "./env";
import { log } from "./logging";
import { resolveMailerProvider, type MailerProvider } from "./mailer-config";

let lastError: string | null = null;

export function getMailerStatus() {
  const provider = resolveMailerProvider({
    resendApiKey: env.RESEND_API_KEY,
    smtpUrl: env.SMTP_URL,
  });
  return {
    configured: provider !== "stub",
    provider,
    lastError,
    stub: provider === "stub",
  };
}

function redactTo(to: string) {
  return env.NODE_ENV === "development" ? to : "redacted";
}

async function sendViaResend(input: { to: string; subject: string; text: string }) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: env.EMAIL_FROM,
      to: [input.to],
      subject: input.subject,
      text: input.text,
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`resend_http_${res.status}:${body.slice(0, 120)}`);
  }
}

async function sendViaSmtp(input: { to: string; subject: string; text: string }) {
  const smtpUrl = env.SMTP_URL?.trim();
  if (!smtpUrl) {
    throw new Error("SMTP_URL is empty");
  }
  const { default: nodemailer } = await import("nodemailer");
  const url = new URL(smtpUrl);
  const port = Number(url.port || (url.protocol === "smtps:" ? 465 : 587));
  const transport = nodemailer.createTransport({
    host: url.hostname,
    port,
    secure: port === 465 || url.protocol === "smtps:",
    auth:
      url.username || url.password
        ? {
            user: decodeURIComponent(url.username),
            pass: decodeURIComponent(url.password),
          }
        : undefined,
  });
  await transport.sendMail({
    from: env.EMAIL_FROM,
    to: input.to,
    subject: input.subject,
    text: input.text,
  });
}

export async function sendEmail(input: { to: string; subject: string; text: string }) {
  const provider: MailerProvider = resolveMailerProvider({
    resendApiKey: env.RESEND_API_KEY,
    smtpUrl: env.SMTP_URL,
  });
  try {
    if (provider === "resend") {
      await sendViaResend(input);
    } else if (provider === "smtp") {
      await sendViaSmtp(input);
    } else {
      if (env.NODE_ENV !== "production") {
        console.log(
          `\n--- EMAIL STUB ---\nTo: ${input.to}\nSubject: ${input.subject}\n\n${input.text}\n------------------\n`,
        );
      }
    }
    log("info", "email.sent", {
      to: redactTo(input.to),
      subject: input.subject,
      provider,
    });
    lastError = null;
  } catch (err) {
    lastError = err instanceof Error ? err.message.replace(/re_[A-Za-z0-9]+/g, "re_***") : "send_failed";
    throw err;
  }
}

export type { MailerProvider };
