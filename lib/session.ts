/**
 * Lightweight, Edge-compatible HMAC-SHA256 session token generator & verifier.
 * Natively supported across Node.js, Vercel Edge Runtime, and modern browsers.
 */

export const SESSION_COOKIE_NAME = "defter_session";

let devFallbackPassword: string | null = null;

export function getMasterPassword(): string {
  const pwd = process.env.DEFTER_ACCESS_PASSWORD;
  if (pwd && pwd.trim().length > 0) {
    return pwd.trim();
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "FATAL: DEFTER_ACCESS_PASSWORD ortam değişkeni tanımlı değil. Production ortamında bir kasa erişim şifresi zorunludur."
    );
  }

  // Development mode: Generate and persist an in-memory random password for this runtime session
  if (!devFallbackPassword) {
    const randomBytes = new Uint8Array(16);
    crypto.getRandomValues(randomBytes);
    devFallbackPassword = Array.from(randomBytes)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    console.warn(
      "\n" +
        "================================================================================\n" +
        "⚠️  [GÜVENLİK UYARISI] DEFTER_ACCESS_PASSWORD ORTAM DEĞİŞKENİ TANIMLI DEĞİL!\n" +
        `🔑  GEÇİCİ LOCAL DEV ŞİFRENİZ: ${devFallbackPassword}\n` +
        "💡  Kalıcı şifre için .env.local dosyanıza DEFTER_ACCESS_PASSWORD ekleyin.\n" +
        "================================================================================\n"
    );
  }

  return devFallbackPassword;
}

/**
 * Constant-time string comparison using Web Crypto API SHA-256 digest and XOR loop.
 * Fully compatible with Vercel Edge Runtime and Node.js.
 */
export async function timingSafeEqualStrings(
  a: string,
  b: string
): Promise<boolean> {
  if (typeof a !== "string" || typeof b !== "string") {
    return false;
  }

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
  const key = await getHmacKey(secret);
  return await crypto.subtle.verify(
    "HMAC",
    key,
    hexToBuffer(sigHex),
    new TextEncoder().encode(dataToSign)
  );
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
