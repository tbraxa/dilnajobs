import "server-only";

import { eq } from "drizzle-orm";
import { withEmployerRls } from "@/db/rls";
import { orders, packages } from "@/db/schema";
import { paymentsEnabled } from "@/lib/env";
import { log } from "@/lib/logging";
import { audit } from "@/lib/audit";
import { captureException } from "@/lib/observability";
import { getRequestId } from "@/lib/request-id";

export async function createOrderStub(employerId: string, packageCode: string) {
  const requestId = await getRequestId();
  try {
    const pkg = await withEmployerRls(employerId, async (tx) => {
      const found = await tx.select().from(packages).where(eq(packages.code, packageCode)).limit(1);
      return found[0];
    });
    if (!pkg) throw new Error("Neznámý balíček.");

    const enabled = paymentsEnabled();
    const order = await withEmployerRls(employerId, async (tx) => {
      const [row] = await tx
        .insert(orders)
        .values({
          employerId,
          packageCode: pkg.code,
          status: enabled ? "pending" : "stub",
          provider: enabled ? "stripe" : "stub",
          amountCzkExVat: pkg.priceCzkExVat,
        })
        .returning();
      return row;
    });

    await audit({
      actorType: "employer_user",
      employerId,
      action: "order.created",
      resourceType: "order",
      resourceId: order.id,
      metadata: { packageCode, stub: !enabled, requestId },
    });

    log("info", "payments.checkout", { stub: !enabled, packageCode, requestId });
    return { order, stub: !enabled };
  } catch (err) {
    captureException(err, { event: "payments.checkout.failed", employerId, packageCode, requestId });
    await audit({
      actorType: "system",
      employerId,
      action: "payments.checkout.failed",
      metadata: { packageCode, requestId },
    });
    throw err;
  }
}
