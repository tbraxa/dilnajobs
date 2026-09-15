import "server-only";

import { eq } from "drizzle-orm";
import { sql } from "@/db/client";
import { withEmployerRls } from "@/db/rls";
import { orders, packages } from "@/db/schema";
import { resolveAppUrl } from "@/lib/app-url";
import { copy } from "@/lib/copy";
import { env, paymentsEnabled } from "@/lib/env";
import { log } from "@/lib/logging";
import { audit } from "@/lib/audit";
import { captureException } from "@/lib/observability";
import { getRequestId } from "@/lib/request-id";

export type CheckoutResult =
  | { kind: "redirect"; url: string }
  | { kind: "stub"; orderId: string }
  | { kind: "activated"; orderId: string };

async function fulfillOrder(orderId: string, providerRef: string | null) {
  await sql`select fulfill_paid_order(${orderId}::uuid, ${providerRef})`;
}

export async function applyPaidOrder(orderId: string, providerRef: string | null): Promise<boolean> {
  const rows = await sql<{ fulfill_paid_order: boolean | string }[]>`
    select fulfill_paid_order(${orderId}::uuid, ${providerRef})
  `;
  const v = rows[0]?.fulfill_paid_order;
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
  params.set("success_url", `${origin}/firma?objednavka=ok`);
  params.set("cancel_url", `${origin}/firma?objednavka=zruseno`);
  params.set("client_reference_id", input.orderId);
  params.set("customer_email", input.email);
  params.set("metadata[orderId]", input.orderId);
  params.set("line_items[0][quantity]", "1");
  params.set("line_items[0][price_data][currency]", "czk");
  params.set("line_items[0][price_data][unit_amount]", String(input.amountCzkExVat * 100));
  params.set("line_items[0][price_data][product_data][name]", `${copy.brand} · ${input.packageName}`);

  const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.STRIPE_SECRET_KEY}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params,
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`stripe_checkout_${res.status}:${body.slice(0, 160)}`);
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

    const stripeOn = paymentsEnabled();
    const free = pkg.priceCzkExVat === 0;
    const status = free ? "pending" : stripeOn ? "pending" : "stub";
    const provider = free || stripeOn ? "stripe" : "stub";

    const order = await withEmployerRls(input.employerId, async (tx) => {
      const [row] = await tx
        .insert(orders)
        .values({
          employerId: input.employerId,
          packageCode: pkg.code,
          status,
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
      metadata: { packageCode: pkg.code, stub: !stripeOn && !free, free, requestId },
    });

    if (free) {
      await fulfillOrder(order.id, "free");
      log("info", "payments.activated_free", { packageCode: pkg.code, requestId });
      return { kind: "activated", orderId: order.id };
    }

    if (!stripeOn) {
      log("info", "payments.checkout", { stub: true, packageCode: pkg.code, requestId });
      return { kind: "stub", orderId: order.id };
    }

    const session = await createStripeCheckout({
      orderId: order.id,
      packageName: pkg.name,
      amountCzkExVat: pkg.priceCzkExVat,
      email: input.email,
    });

    await withEmployerRls(input.employerId, async (tx) => {
      await tx.update(orders).set({ providerRef: session.id }).where(eq(orders.id, order.id));
    });

    log("info", "payments.checkout", { stub: false, packageCode: pkg.code, requestId });
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
