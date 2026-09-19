import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { BRAND, DEFAULT_EMAIL_FROM, PUBLIC_DOMAIN } from "./brand";

const OLD_BRAND = /DílnaJobs|DilnaJobs|OpenJobs/;
const SECRET_OR_IMPL = /STRIPE_SECRET_KEY|STRIPE_WEBHOOK_SECRET|SESSION_SECRET|SENTRY_DSN|RESEND_API_KEY|SMTP_URL|ADMIN_EMAILS/;
const DEV_CONSOLE_LEAK = /konzol[ei] serveru|do konzole/i;

function collectFiles(dir: string, match: RegExp, acc: string[] = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) collectFiles(path, match, acc);
    else if (match.test(entry.name)) acc.push(path);
  }
  return acc;
}

describe("public FairJobs copy", () => {
  it("locks the public brand and domain", () => {
    expect(BRAND).toBe("FairJobs");
    expect(PUBLIC_DOMAIN).toBe("fairjobs.cz");
    expect(DEFAULT_EMAIL_FROM).toBe("FairJobs <noreply@fairjobs.cz>");
  });

  it("keeps DílnaJobs / OpenJobs and env-var names out of UI modules", () => {
    const files = [
      ...collectFiles("src/app", /\.(ts|tsx)$/).filter((file) => !file.includes("/api/")),
      ...collectFiles("src/components", /\.(ts|tsx)$/),
    ];
    const hits: string[] = [];
    for (const file of files) {
      const text = readFileSync(file, "utf8");
      if (OLD_BRAND.test(text) || SECRET_OR_IMPL.test(text)) hits.push(file);
    }
    expect(hits).toEqual([]);
  });

  it("does not tell users about the local email console stub", () => {
    const files = [
      ...collectFiles("src/app", /\.(ts|tsx)$/),
      ...collectFiles("src/components", /\.(ts|tsx)$/),
      ...collectFiles("src/lib/actions", /\.(ts|tsx)$/),
    ];
    const hits: string[] = [];
    for (const file of files) {
      const text = readFileSync(file, "utf8");
      if (DEV_CONSOLE_LEAK.test(text)) hits.push(file);
    }
    expect(hits).toEqual([]);
  });

  it("does not mention Stripe env vars or stub checkout on /pro-firmy", () => {
    const text = readFileSync("src/app/pro-firmy/page.tsx", "utf8");
    expect(text).not.toMatch(/STRIPE_|stub/i);
    expect(text).toMatch(/FairJobs|Ceny bez DPH/);
  });
});
