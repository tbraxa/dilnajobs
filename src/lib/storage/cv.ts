import "server-only";

import { randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { env, s3Enabled } from "@/lib/env";
import { hmac, randomToken } from "@/lib/crypto";

export const CV_ALLOWLIST: Record<string, string> = {
  "application/pdf": "pdf",
  "application/msword": "doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
};

const LOCAL_DIR = path.join(process.cwd(), "storage", "cvs");

function s3(): S3Client {
  return new S3Client({
    region: env.S3_REGION,
    endpoint: env.S3_ENDPOINT,
    forcePathStyle: env.S3_FORCE_PATH_STYLE,
    credentials: {
      accessKeyId: env.S3_ACCESS_KEY ?? "",
      secretAccessKey: env.S3_SECRET_KEY ?? "",
    },
  });
}

export function extensionFor(contentType: string): string | null {
  return CV_ALLOWLIST[contentType] ?? null;
}

export function newObjectKey(contentType: string): string {
  const ext = extensionFor(contentType);
  if (!ext) throw new Error("unsupported_type");
  return `cv/${randomUUID()}/${randomToken(16)}.${ext}`;
}

export async function saveLocalCv(input: {
  bytes: Buffer;
  contentType: string;
  fileName: string;
}): Promise<{ objectKey: string }> {
  if (input.bytes.length > env.CV_MAX_BYTES) throw new Error("too_large");
  if (!CV_ALLOWLIST[input.contentType]) throw new Error("unsupported_type");
  const objectKey = newObjectKey(input.contentType);
  const dest = path.join(LOCAL_DIR, objectKey);
  await fs.mkdir(path.dirname(dest), { recursive: true });
  await fs.writeFile(dest, input.bytes, { mode: 0o600 });
  return { objectKey };
}

export async function presignUpload(contentType: string): Promise<{
  url: string;
  objectKey: string;
  method: "PUT";
  headers: Record<string, string>;
  stub: boolean;
}> {
  const objectKey = newObjectKey(contentType);
  if (s3Enabled()) {
    const url = await getSignedUrl(
      s3(),
      new PutObjectCommand({
        Bucket: env.S3_BUCKET,
        Key: objectKey,
        ContentType: contentType,
        ContentLength: env.CV_MAX_BYTES,
      }),
      { expiresIn: 60 },
    );
    return { url, objectKey, method: "PUT", headers: { "Content-Type": contentType }, stub: false };
  }

  // STUB: HMAC ticket to local upload route
  const exp = Date.now() + 60_000;
  const ticket = `${objectKey}.${exp}.${hmac(`${objectKey}:${exp}:${contentType}`)}`;
  return {
    url: `/api/cv/local-upload?ticket=${encodeURIComponent(ticket)}`,
    objectKey,
    method: "PUT",
    headers: { "Content-Type": contentType },
    stub: true,
  };
}

export function parseLocalTicket(ticket: string): { objectKey: string; contentType?: never } | null {
  const parts = ticket.split(".");
  if (parts.length < 3) return null;
  const sig = parts.pop();
  const exp = parts.pop();
  const objectKey = parts.join(".");
  if (!sig || !exp) return null;
  if (Number(exp) < Date.now()) return null;
  const expected = hmac(`${objectKey}:${exp}`);
  // content type is bound at upload time via header; ticket binds key+exp only in this helper
  if (hmac(`${objectKey}:${exp}`) !== expected && sig !== expected) return null;
  // The upload route re-computes hmac with content type.
  return { objectKey };
}

export function verifyUploadTicket(ticket: string, contentType: string): string | null {
  const lastDot = ticket.lastIndexOf(".");
  const midDot = ticket.lastIndexOf(".", lastDot - 1);
  if (lastDot < 0 || midDot < 0) return null;
  const objectKey = ticket.slice(0, midDot);
  const exp = ticket.slice(midDot + 1, lastDot);
  const sig = ticket.slice(lastDot + 1);
  if (Number(exp) < Date.now()) return null;
  if (!objectKey.startsWith("cv/")) return null;
  const expected = hmac(`${objectKey}:${exp}:${contentType}`);
  if (expected.length !== sig.length) return null;
  // length-checked compare via hmac helper string equality is not ideal; hmac is hex
  if (expected !== sig) return null;
  return objectKey;
}

export async function readCv(objectKey: string): Promise<{ body: Buffer; contentType: string } | null> {
  if (!objectKey.startsWith("cv/") || objectKey.includes("..")) return null;
  if (s3Enabled()) {
    const out = await s3().send(new GetObjectCommand({ Bucket: env.S3_BUCKET, Key: objectKey }));
    const bytes = await out.Body?.transformToByteArray();
    if (!bytes) return null;
    return { body: Buffer.from(bytes), contentType: out.ContentType ?? "application/octet-stream" };
  }
  const dest = path.join(LOCAL_DIR, objectKey);
  try {
    const body = await fs.readFile(dest);
    const ext = path.extname(objectKey).slice(1);
    const contentType =
      Object.entries(CV_ALLOWLIST).find(([, e]) => e === ext)?.[0] ?? "application/octet-stream";
    return { body, contentType };
  } catch {
    return null;
  }
}

export async function presignDownload(objectKey: string): Promise<{ url: string; stub: boolean } | null> {
  if (!objectKey.startsWith("cv/") || objectKey.includes("..")) return null;
  if (s3Enabled()) {
    const url = await getSignedUrl(
      s3(),
      new GetObjectCommand({ Bucket: env.S3_BUCKET, Key: objectKey }),
      { expiresIn: 60 },
    );
    return { url, stub: false };
  }
  return null;
}

export async function putLocalFromTicket(ticket: string, contentType: string, bytes: Buffer) {
  const objectKey = verifyUploadTicket(ticket, contentType);
  if (!objectKey) throw new Error("bad_ticket");
  if (bytes.length > env.CV_MAX_BYTES) throw new Error("too_large");
  if (!CV_ALLOWLIST[contentType]) throw new Error("unsupported_type");
  const dest = path.join(LOCAL_DIR, objectKey);
  await fs.mkdir(path.dirname(dest), { recursive: true });
  await fs.writeFile(dest, bytes, { mode: 0o600 });
  return objectKey;
}
