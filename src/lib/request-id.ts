import { headers } from "next/headers";

export async function getRequestId(): Promise<string> {
  try {
    const h = await headers();
    return h.get("x-request-id") ?? "unknown";
  } catch {
    return "unknown";
  }
}
