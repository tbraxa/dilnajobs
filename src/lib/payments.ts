import "server-only";

import { eq } from "drizzle-orm";
import { sql } from "@/db/client";
import { withEmployerRls } from "@/db/rls";
import { orders, packages } from "@/db/schema";
import { resolveAppUrl } from "@/lib/app-url";
import { env, paymentsEnabled } from "@/lib/env";
import { log } from "@/lib/logging";
import { audit } from "@/lib/audit";
import { captureException } from "@/lib/observability";
import { getRequestId } from "@/lib/request-id";

export type CheckoutResult =
  | { kind: "redirect"; url: string }
  | { kind: "unavailable" }
  | { kind: "activated"; orderId: string };

export function resolveCheckoutMode(
  amountCzkExVat: number,
  stripeReady: boolean,
): "free" | "stripe" | "unavailable" {
  if (amountCzkExVat === 0) return "free";
  return stripeReady ? "stripe" : "unavailable";
}

async function fulfillOrder(orderId: string, providerRef: string | null) {
  await sql`select fulfill_paid_order(${orderId}::uuid, ${providerRef})`;
}

export async function applyPaidOrder(input: {
  orderId: string;
  providerRef: string;
  amountTotal: number;
  currency: string;
}): Promise<boolean> {
  const rows = await sql<{ fulfill_stripe_order: boolean | string }[]>`
    select fulfill_stripe_order(
      ${input.orderId}::uuid,
      ${input.providerRef},
      ${input.amountTotal},
      ${input.currency}
    )
  `;
  const v = rows[0]?.fulfill_stripe_order;
  return v === true || v === "t";
}

async function createStripeCheckout(input: {
  orderId: string;
  packageName: string;
  amountCzkExVat: number;
  email: string;
}) {
  const params = new URLSearchParams();
  params.set("mode", "payment");
  const origin = resolveAppUrl();
  params.set("success_url", `${origin}/firma?objednavka=ok&session_id={CHECKOUT_SESSION_ID}`);
  params.set("cancel_url", `${origin}/firma?objednavka=zruseno`);
  params.set("locale", "cs");
  params.set("billing_address_collection", "required");
  params.set("tax_id_collection[enabled]", "true");
  params.set("submit_type", "pay");
  params.set("client_reference_id", input.orderId);
  params.set("customer_email", input.email);
  params.set("metadata[orderId]", input.orderId);
  params.set("line_items[0][quantity]", "1");
  params.set("line_items[0][price_data][currency]", "czk");
  params.set("line_items[0][price_data][unit_amount]", String(input.amountCzkExVat * 100));
  params.set("line_items[0][price_data][product_data][name]", `FairJobs: ${input.packageName}`);

  const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.STRIPE_SECRET_KEY}`,
      "Content-Type": "application/x-www-form-urlencoded",
      "Idempotency-Key": `fairjobs-order-${input.orderId}`,
    },
    body: params,
  });
  if (!res.ok) {
    throw new Error(`stripe_checkout_${res.status}`);
  }
  const session = (await res.json()) as { id: string; url?: string };
  if (!session.url) throw new Error("stripe_checkout_missing_url");
  return { id: session.id, url: session.url };
}

export async function startCheckout(input: {
  employerId: string;
  email: string;
  packageCode: string;
}): Promise<CheckoutResult> {
  const requestId = await getRequestId();
  try {
    const pkg = await withEmployerRls(input.employerId, async (tx) => {
      const found = await tx.select().from(packages).where(eq(packages.code, input.packageCode)).limit(1);
      return found[0];
    });
    if (!pkg) throw new Error("Neznámý balíček.");

    const mode = resolveCheckoutMode(pkg.priceCzkExVat, paymentsEnabled());
    const free = mode === "free";
    if (mode === "unavailable") {
      await audit({
        actorType: "employer_user",
        employerId: input.employerId,
        action: "payments.checkout.unavailable",
        metadata: { packageCode: pkg.code, requestId },
      });
      log("warn", "payments.checkout.unavailable", { packageCode: pkg.code, requestId });
      return { kind: "unavailable" };
    }

    const provider = free ? "stub" : "stripe";

    const order = await withEmployerRls(input.employerId, async (tx) => {
      const [row] = await tx
        .insert(orders)
        .values({
          employerId: input.employerId,
          packageCode: pkg.code,
          status: "pending",
          provider,
          amountCzkExVat: pkg.priceCzkExVat,
          paidAt: null,
        })
        .returning();
      return row;
    });

    await audit({
      actorType: "employer_user",
      employerId: input.employerId,
      action: "order.created",
      resourceType: "order",
      resourceId: order.id,
      metadata: { packageCode: pkg.code, provider, free, requestId },
    });

    if (free) {
      await fulfillOrder(order.id, "free");
      log("info", "payments.activated_free", { packageCode: pkg.code, requestId });
      return { kind: "activated", orderId: order.id };
    }

    let session: Awaited<ReturnType<typeof createStripeCheckout>>;
    try {
      session = await createStripeCheckout({
        orderId: order.id,
        packageName: pkg.name,
        amountCzkExVat: pkg.priceCzkExVat,
        email: input.email,
      });
    } catch (error) {
      await withEmployerRls(input.employerId, async (tx) => {
        await tx.update(orders).set({ status: "failed" }).where(eq(orders.id, order.id));
      });
      throw error;
    }

    await withEmployerRls(input.employerId, async (tx) => {
      await tx.update(orders).set({ providerRef: session.id }).where(eq(orders.id, order.id));
    });

    log("info", "payments.checkout", { provider: "stripe", packageCode: pkg.code, requestId });
    return { kind: "redirect", url: session.url };
  } catch (err) {
    captureException(err, {
      event: "payments.checkout.failed",
      employerId: input.employerId,
      packageCode: input.packageCode,
      requestId,
    });
    await audit({
      actorType: "system",
      employerId: input.employerId,
      action: "payments.checkout.failed",
      metadata: { packageCode: input.packageCode, requestId },
    });
    throw err;
  }
}
