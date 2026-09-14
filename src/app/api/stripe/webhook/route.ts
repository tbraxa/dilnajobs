import { NextResponse } from "next/server";
import { env } from "@/lib/env";
import { applyPaidOrder } from "@/lib/payments";
import { verifyStripeSignature } from "@/lib/stripe";
import { audit } from "@/lib/audit";
import { log } from "@/lib/logging";
import { captureException } from "@/lib/observability";
import { getRequestId } from "@/lib/request-id";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const requestId = await getRequestId();
  if (!env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "unconfigured" }, { status: 503 });
  }

  const payload = await request.text();
  const header = request.headers.get("stripe-signature") ?? "";
  const verified = verifyStripeSignature({
    payload,
    header,
    secret: env.STRIPE_WEBHOOK_SECRET,
  });
  if (!verified.ok) {
    log("warn", "stripe.webhook.rejected", { requestId, error: verified.error });
    return NextResponse.json({ error: "invalid_signature" }, { status: 400 });
  }

  let event: { type?: string; data?: { object?: Record<string, unknown> } };
  try {
    event = JSON.parse(payload) as typeof event;
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  if (event.type !== "checkout.session.completed") {
    return NextResponse.json({ received: true });
  }

  const obj = event.data?.object ?? {};
  const metadata = (obj.metadata ?? {}) as Record<string, string>;
  const orderId =
    metadata.orderId ||
    (typeof obj.client_reference_id === "string" ? obj.client_reference_id : "");
  const providerRef = typeof obj.id === "string" ? obj.id : null;
  const paymentStatus = obj.payment_status;

  if (!orderId || !/^[0-9a-f-]{36}$/i.test(orderId)) {
    log("warn", "stripe.webhook.missing_order", { requestId });
    return NextResponse.json({ received: true });
  }
  if (paymentStatus && paymentStatus !== "paid" && paymentStatus !== "no_payment_required") {
    return NextResponse.json({ received: true });
  }

  try {
    const newlyPaid = await applyPaidOrder(orderId, providerRef);
    if (newlyPaid) {
      await audit({
        actorType: "system",
        action: "order.paid",
        resourceType: "order",
        resourceId: orderId,
        metadata: { requestId, provider: "stripe" },
      });
    }
    log("info", "stripe.webhook.ok", { requestId, orderId, newlyPaid });
    return NextResponse.json({ received: true });
  } catch (err) {
    captureException(err, { event: "stripe.webhook.failed", requestId, orderId });
    return NextResponse.json({ error: "fulfill_failed" }, { status: 500 });
  }
}
