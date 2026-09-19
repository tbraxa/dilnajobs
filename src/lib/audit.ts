import "server-only";

import { auditEvents } from "@/db/schema";
import { db } from "@/db/client";

export async function audit(input: {
  actorType: "system" | "employer_user" | "candidate" | "seeker" | "admin";
  actorId?: string;
  employerId?: string;
  action: string;
  resourceType?: string;
  resourceId?: string;
  metadata?: Record<string, unknown>;
  ipHash?: string;
}) {
  await db.insert(auditEvents).values({
    actorType: input.actorType,
    actorId: input.actorId,
    employerId: input.employerId,
    action: input.action,
    resourceType: input.resourceType,
    resourceId: input.resourceId,
    metadata: input.metadata ?? {},
    ipHash: input.ipHash,
  });
}
