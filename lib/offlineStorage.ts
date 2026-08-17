/**
 * Defter — PWA Offline State & IndexedDB Synchronization Service
 * Ensures zero data loss and seamless offline experience when internet is disconnected.
 */

const DB_NAME = "defter_offline_db";
const STORE_NAME = "portfolio_state";
const DB_VERSION = 1;

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !("indexedDB" in window)) {
      return reject(new Error("IndexedDB not supported in this environment"));
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveOfflineSnapshot<T>(key: string, data: T): Promise<void> {
  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const request = store.put(data, key);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (e) {
    // Fallback to localStorage
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(`defter_offline_${key}`, JSON.stringify(data));
      } catch {}
    }
  }
}

export async function loadOfflineSnapshot<T>(key: string): Promise<T | null> {
  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const request = store.get(key);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  } catch (e) {
    // Fallback to localStorage
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem(`defter_offline_${key}`);
        return raw ? JSON.parse(raw) : null;
      } catch {}
    }
    return null;
  }
}
