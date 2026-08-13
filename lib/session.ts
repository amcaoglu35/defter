/**
 * Lightweight, Edge-compatible HMAC-SHA256 session token generator & verifier.
 * Natively supported across Node.js, Vercel Edge Runtime, and modern browsers.
 */

export const SESSION_COOKIE_NAME = "defter_session";

export function getMasterPassword(): string {
  return process.env.DEFTER_ACCESS_PASSWORD || "defter2026";
}

async function getHmacKey(secret: string): Promise<CryptoKey> {
  const enc = new TextEncoder();
  return await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function hexToBuffer(hex: string): ArrayBuffer {
  const bytes = new Uint8Array(Math.ceil(hex.length / 2));
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.substring(i * 2, i * 2 + 2), 16);
  }
  return bytes.buffer;
}

export async function createSessionToken(
  secret: string,
  payloadStr: string = "authenticated_user"
): Promise<string> {
  const timestamp = Date.now().toString();
  const dataToSign = `${payloadStr}:${timestamp}`;
  const key = await getHmacKey(secret);
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(dataToSign)
  );
  const sigHex = bufferToHex(signature);
  return `${dataToSign}:${sigHex}`;
}

export async function verifySessionToken(
  token: string,
  secret: string,
  maxAgeMs: number = 7 * 24 * 60 * 60 * 1000
): Promise<boolean> {
  try {
    if (!token || !secret) return false;
    const parts = token.split(":");
    if (parts.length !== 3) return false;

    const [payloadStr, timestampStr, sigHex] = parts;
    const timestamp = parseInt(timestampStr, 10);
    if (isNaN(timestamp)) return false;

    // Check token age (default 7 days)
    if (Date.now() - timestamp > maxAgeMs) return false;

    const dataToSign = `${payloadStr}:${timestampStr}`;
    const key = await getHmacKey(secret);
    const isValid = await crypto.subtle.verify(
      "HMAC",
      key,
      hexToBuffer(sigHex),
      new TextEncoder().encode(dataToSign)
    );
    return isValid;
  } catch {
    return false;
  }
}
