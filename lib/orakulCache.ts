/**
 * Orakul AI Caching, Model Tiering & Telemetry Engine
 * Provides deterministic 5-minute TTL caching, task-based model selection,
 * and prompt/latency telemetry logging.
 */

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
  createdAt: number;
}

const orakulMemoryCache = new Map<string, CacheEntry<unknown>>();

// Periodic cleanup of expired cache entries (every 10 minutes or when cache grows)
function pruneExpiredEntries(): void {
  const now = Date.now();
  for (const [key, entry] of orakulMemoryCache.entries()) {
    if (now > entry.expiresAt) {
      orakulMemoryCache.delete(key);
    }
  }
}

/**
 * Deterministic JSON stringifier that sorts keys recursively.
 */
function deterministicStringify(obj: unknown): string {
  if (obj === null || typeof obj !== "object") {
    return JSON.stringify(obj);
  }
  if (Array.isArray(obj)) {
    return `[${obj.map(deterministicStringify).join(",")}]`;
  }
  const keys = Object.keys(obj as Record<string, unknown>).sort();
  const pairs = keys.map((k) => `${JSON.stringify(k)}:${deterministicStringify((obj as Record<string, unknown>)[k])}`);
  return `{${pairs.join(",")}}`;
}

/**
 * Generates a deterministic cache key for Orakul AI requests.
 */
export function generateOrakulCacheKey(
  type: string,
  payload: unknown,
  provider: string = "gemini",
  model?: string,
  persona: string = "deger"
): string {
  const normalized = {
    type,
    payload,
    provider,
    model: model || "default",
    persona,
  };
  return `orakul:${type}:${deterministicStringify(normalized)}`;
}

/**
 * Retrieve cached response if not expired (5-minute TTL).
 */
export function getOrakulCachedResponse<T>(key: string): T | null {
  const entry = orakulMemoryCache.get(key);
  if (!entry) return null;

  if (Date.now() > entry.expiresAt) {
    orakulMemoryCache.delete(key);
    return null;
  }

  return entry.data as T;
}

/**
 * Store response in cache with default 5-minute TTL (300,000 ms).
 */
export function setOrakulCachedResponse<T>(key: string, data: T, ttlMs: number = 300_000): void {
  if (orakulMemoryCache.size > 500) {
    pruneExpiredEntries();
  }

  orakulMemoryCache.set(key, {
    data,
    expiresAt: Date.now() + ttlMs,
    createdAt: Date.now(),
  });
}

/**
 * Clears the entire Orakul AI cache (useful for testing or forced resets).
 */
export function clearOrakulCache(): void {
  orakulMemoryCache.clear();
}

/**
 * Task Model Tiering: Selects lightweight vs standard Gemini model based on task complexity,
 * without overriding user's explicit model preference.
 */
export type OrakulTaskType =
  | "recipe"
  | "company_analysis"
  | "earnings_flash"
  | "value_trap"
  | "backtest"
  | "screener"
  | "daily_brief"
  | "sentiment"
  | "weekly_letter"
  | "chat"
  | "test_connection";

export function getOptimalModelForTask(
  taskType: OrakulTaskType | string,
  userCustomModel?: string,
  provider: string = "gemini"
): string {
  // If user or caller explicitly passed a custom model, NEVER override it
  if (userCustomModel && userCustomModel.trim().length > 0) {
    return userCustomModel.trim();
  }

  if (provider === "openai") {
    return "gpt-4o-mini";
  }

  // Gemini Tiering
  switch (taskType) {
    case "earnings_flash":
    case "daily_brief":
    case "sentiment":
    case "screener":
    case "test_connection":
      return "gemini-2.0-flash"; // Fast & cost-efficient for single summaries and dictionary screenings

    case "recipe":
    case "company_analysis":
    case "weekly_letter":
    case "chat":
    case "backtest":
    case "value_trap":
    default:
      return "gemini-2.5-flash"; // Deep synthesis, multi-agent committee debate & macro reasoning
  }
}

/**
 * Server-side Telemetry logger to record prompt character count, token estimates, and latency.
 */
export function logOrakulTelemetry(params: {
  type: string;
  promptChars: number;
  responseMs: number;
  candidateCount?: number;
  cached?: boolean;
  model?: string;
}): void {
  const estTokens = Math.round(params.promptChars / 4);
  const cacheStr = params.cached ? " [CACHE HIT ⚡]" : "";
  console.info(
    `[Orakul Telemetry][${params.type}] promptChars=${params.promptChars}, estTokens=~${estTokens}, responseMs=${params.responseMs}ms${
      params.candidateCount !== undefined ? `, candidates=${params.candidateCount}` : ""
    }, model=${params.model || "default"}${cacheStr}`
  );
}
