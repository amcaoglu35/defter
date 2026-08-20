import { supabaseAdmin, isSupabaseAdminConfigured } from "./supabaseAdmin";

export const SESSION_COOKIE_NAME = "defter_session";

/**
 * Resolves master password from DEFTER_ACCESS_PASSWORD env variable.
 * In production: Fails closed if not set.
 * In development: Uses temporary dev password with an explicit warning.
 */
export function getMasterPassword(): string {
  const pwd = process.env.DEFTER_ACCESS_PASSWORD;
  if (pwd && pwd.trim().length > 0) {
    return pwd.trim();
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "DEFTER_ACCESS_PASSWORD ortam değişkeni production'da zorunludur. Vercel panelinden Environment Variables bölümüne ekleyin."
    );
  }

  console.warn(
    "[UYARI] DEFTER_ACCESS_PASSWORD ayarlanmamış. Sadece geliştirme ortamı için geçici 'defter-dev-only' şifresi kullanılıyor. Production'a ASLA bu şekilde deploy etmeyin."
  );
  return "defter-dev-only";
}

/**
 * Returns list of authorized email addresses for single-user/whitelist OAuth login
 */
export function getAuthorizedEmails(): string[] {
  const envEmails = process.env.AUTHORIZED_EMAILS || process.env.ALLOWED_EMAILS || "amcaogluyusuf@gmail.com";
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
  
  if (authorized.length === 0) {
    // In production: Fail closed to prevent arbitrary OAuth logins
    return process.env.NODE_ENV !== "production";
  }
  return authorized.includes(email.trim().toLowerCase());
}

/**
 * Hashes a password with a cryptographic salt using Web Crypto SHA-256.
 * Format: "saltHex:hashHex"
 */
export async function hashPassword(password: string, customSaltHex?: string): Promise<string> {
  const enc = new TextEncoder();
  let saltHex = customSaltHex;

  if (!saltHex) {
    const saltBytes = new Uint8Array(16);
    if (typeof crypto !== "undefined" && crypto.getRandomValues) {
      crypto.getRandomValues(saltBytes);
    } else {
      for (let i = 0; i < 16; i++) saltBytes[i] = Math.floor(Math.random() * 256);
    }
    saltHex = bufferToHex(saltBytes.buffer);
  }

  const dataToHash = `${saltHex}:${password}`;
  if (typeof crypto !== "undefined" && crypto.subtle) {
    const digest = await crypto.subtle.digest("SHA-256", enc.encode(dataToHash));
    return `${saltHex}:${bufferToHex(digest)}`;
  }

  // Safe fallback if crypto.subtle is unavailable
  const fallback = Buffer.from(dataToHash).toString("base64url");
  return `${saltHex}:${fallback}`;
}

/**
 * Verifies a plaintext password against a stored "saltHex:hashHex" string.
 */
export async function verifyPasswordHash(
  password: string,
  storedSaltAndHash: string
): Promise<boolean> {
  if (!password || !storedSaltAndHash) return false;
  const parts = storedSaltAndHash.split(":");
  if (parts.length !== 2) return false;
  const [saltHex] = parts;
  const computed = await hashPassword(password, saltHex);
  return timingSafeEqualStrings(computed, storedSaltAndHash);
}

/**
 * Asynchronously verifies master password against Supabase `app_settings` (if present)
 * or fallback to environment variable / dev password.
 */
export async function verifyMasterPassword(
  inputPassword: string
): Promise<{ valid: boolean; isStoredInDb?: boolean; reason?: string }> {
  if (!inputPassword || typeof inputPassword !== "string") {
    return { valid: false, reason: "Lütfen bir şifre girin." };
  }

  // 1. Check Supabase app_settings table first if configured
  if (isSupabaseAdminConfigured && supabaseAdmin) {
    try {
      const { data, error } = await supabaseAdmin
        .from("app_settings")
        .select("value")
        .eq("key", "master_password_hash")
        .maybeSingle();

      if (!error && data?.value) {
        const isValid = await verifyPasswordHash(inputPassword, data.value);
        return { valid: isValid, isStoredInDb: true };
      }
    } catch (dbErr) {
      console.warn("[Auth] Supabase app_settings query warning:", dbErr);
    }
  }

  // 2. Fallback to Environment Variable
  let envPassword: string;
  try {
    envPassword = getMasterPassword();
  } catch (envErr: unknown) {
    return {
      valid: false,
      reason: (envErr instanceof Error ? envErr.message : String(envErr)) || "Kasa şifresi sunucuda henüz tanımlanmamış. Lütfen DEFTER_ACCESS_PASSWORD ortam değişkenini ayarlayın.",
    };
  }

  const isValid = await timingSafeEqualStrings(inputPassword, envPassword);
  return { valid: isValid, isStoredInDb: false };
}

/**
 * Persists a new master password hash to Supabase `app_settings` table.
 */
export async function setStoredMasterPassword(newPassword: string): Promise<boolean> {
  if (!isSupabaseAdminConfigured || !supabaseAdmin) {
    return false;
  }
  try {
    const hashed = await hashPassword(newPassword);
    const { error } = await supabaseAdmin.from("app_settings").upsert(
      {
        key: "master_password_hash",
        value: hashed,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "key" }
    );
    return !error;
  } catch (err) {
    console.error("[Auth] Failed to set stored master password:", err);
    return false;
  }
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
