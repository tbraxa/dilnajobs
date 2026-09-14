import "server-only";

import { eq } from "drizzle-orm";
import { withEmployerRls } from "@/db/rls";
import { orders, packages } from "@/db/schema";
import { paymentsEnabled } from "@/lib/env";
import { log } from "@/lib/logging";
import { audit } from "@/lib/audit";

export async function createOrderStub(employerId: string, packageCode: string) {
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
    metadata: { packageCode, stub: !enabled },
  });

  log("info", "payments.checkout", { stub: !enabled, packageCode });
  return { order, stub: !enabled };
}
