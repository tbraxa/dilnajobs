import { headers } from "next/headers";
import type { JsonLdData } from "@/lib/structured-data";

function serializeJsonLd(data: JsonLdData) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export async function JsonLd({
  data,
  id,
  nonce: suppliedNonce,
}: {
  data: JsonLdData;
  id: string;
  nonce?: string;
}) {
  const nonce = suppliedNonce ?? (await headers()).get("x-nonce") ?? undefined;

  return (
    <script
      id={id}
      type="application/ld+json"
      nonce={nonce}
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  );
}
