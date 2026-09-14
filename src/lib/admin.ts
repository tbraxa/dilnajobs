import "server-only";

import { adminEmails, env, paymentsEnabled, s3Enabled } from "@/lib/env";

export { maskPhone } from "@/lib/mask";

export function integrationFlags() {
  return {
    smtp: Boolean(env.SMTP_URL),
    s3: s3Enabled(),
    stripe: Boolean(env.STRIPE_SECRET_KEY),
    gopay: Boolean(env.GOPAY_CLIENT_SECRET),
    paymentsLive: paymentsEnabled(),
    sentry: Boolean(env.SENTRY_DSN),
    autoPublish: env.FEATURE_AUTO_PUBLISH_FIRST_JOB,
    adminEmailCount: adminEmails().length,
    adminEmails: adminEmails(),
  };
}
