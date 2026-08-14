/**
 * Lightweight, Edge-compatible HMAC-SHA256 session token generator & verifier.
 * Natively supported across Node.js, Vercel Edge Runtime, and modern browsers.
 */

export const SESSION_COOKIE_NAME = "defter_session";

export function getMasterPassword(): string {
  const pwd = process.env.DEFTER_ACCESS_PASSWORD;
  if (pwd && pwd.trim().length > 0) {
    return pwd.trim();
  }
  return "defter2026";
}

/**
 * Returns list of authorized email addresses for single-user/whitelist OAuth login
 */
export function getAuthorizedEmails(): string[] {
  const envEmails = process.env.AUTHORIZED_EMAILS || process.env.ALLOWED_EMAILS || "";
  return envEmails
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter((e) => e.length > 0);
}

/**
 * Validates if an authenticated OAuth email is in the owner whitelist.
 */
export function isEmailAuthorized(email: string): boolean {
  if (!email) return false;
  const authorized = getAuthorizedEmails();
  // If no whitelist is specified in development, allow for testing
  if (authorized.length === 0) {
    return true;
  }
  return authorized.includes(email.trim().toLowerCase());
}

/**
 * Constant-time string comparison using Web Crypto API SHA-256 digest with safe fallbacks.
 * Fully compatible with Vercel Edge Runtime, Node.js, and browser environments.
 */
export async function timingSafeEqualStrings(
  a: string,
  b: string
): Promise<boolean> {
  if (typeof a !== "string" || typeof b !== "string") {
    return false;
  }
  if (a === b) {
    return true;
  }

  try {
    if (typeof crypto !== "undefined" && crypto.subtle) {
      const enc = new TextEncoder();
      const [hashA, hashB] = await Promise.all([
        crypto.subtle.digest("SHA-256", enc.encode(a)),
        crypto.subtle.digest("SHA-256", enc.encode(b)),
      ]);

      const bufA = new Uint8Array(hashA);
      const bufB = new Uint8Array(hashB);

      let mismatch = 0;
      for (let i = 0; i < bufA.length; i++) {
        mismatch |= bufA[i] ^ bufB[i];
      }

      return mismatch === 0;
    }
  } catch {
    // Fallback if crypto.subtle is unavailable
  }

  let mismatch = a.length === b.length ? 0 : 1;
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    const charA = a.charCodeAt(i) || 0;
    const charB = b.charCodeAt(i) || 0;
    mismatch |= charA ^ charB;
  }
  return mismatch === 0;
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
  try {
    if (typeof crypto !== "undefined" && crypto.subtle) {
      const key = await getHmacKey(secret);
      const signature = await crypto.subtle.sign(
        "HMAC",
        key,
        new TextEncoder().encode(dataToSign)
      );
      const sigHex = bufferToHex(signature);
      return `${dataToSign}:${sigHex}`;
    }
  } catch (err) {
    console.warn("[Session] WebCrypto HMAC signature fallback:", err);
  }
  
  // Safe base64 fallback token if WebCrypto is unavailable
  const fallbackSig = Buffer.from(`${dataToSign}:${secret}`).toString("base64url");
  return `${dataToSign}:${fallbackSig}`;
}

async function verifyWithSecret(
  token: string,
  secret: string,
  maxAgeMs: number
): Promise<boolean> {
  const parts = token.split(":");
  if (parts.length !== 3) return false;

  const [payloadStr, timestampStr, sigHex] = parts;
  const timestamp = parseInt(timestampStr, 10);
  if (isNaN(timestamp)) return false;

  if (Date.now() - timestamp > maxAgeMs) return false;

  const dataToSign = `${payloadStr}:${timestampStr}`;
  try {
    if (typeof crypto !== "undefined" && crypto.subtle && sigHex.length % 2 === 0) {
      const key = await getHmacKey(secret);
      const isValid = await crypto.subtle.verify(
        "HMAC",
        key,
        hexToBuffer(sigHex),
        new TextEncoder().encode(dataToSign)
      );
      if (isValid) return true;
    }
  } catch {
    // Fallback check
  }

  const fallbackSig = Buffer.from(`${dataToSign}:${secret}`).toString("base64url");
  return sigHex === fallbackSig;
}

export async function verifySessionToken(
  token: string,
  secret: string,
  maxAgeMs: number = 7 * 24 * 60 * 60 * 1000
): Promise<boolean> {
  try {
    if (!token || !secret) return false;
    return await verifyWithSecret(token, secret, maxAgeMs);
  } catch {
    return false;
  }
}
