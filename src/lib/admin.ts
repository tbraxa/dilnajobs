import "server-only";

import { adminEmails, env, paymentsEnabled, s3Enabled } from "@/lib/env";

export { maskPhone } from "@/lib/mask";

export function integrationFlags() {
  return {
    resend: Boolean(env.RESEND_API_KEY),
    smtp: Boolean(env.SMTP_URL),
    mailer: Boolean(env.RESEND_API_KEY || env.SMTP_URL),
    s3: s3Enabled(),
    stripe: Boolean(env.STRIPE_SECRET_KEY),
    stripeWebhook: Boolean(env.STRIPE_WEBHOOK_SECRET),
    paymentsLive: paymentsEnabled(),
    sentry: Boolean(env.SENTRY_DSN),
    autoPublish: env.FEATURE_AUTO_PUBLISH_FIRST_JOB,
    adminEmailCount: adminEmails().length,
    adminEmails: adminEmails(),
  };
}
