/**
 * Defter — Web Push & Native Browser Notification Service
 * Allows users to receive desktop/mobile system notifications when price targets or IPO deadlines hit.
 */

export async function requestNotificationPermission(): Promise<boolean> {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return false;
  }

  if (Notification.permission === "granted") {
    return true;
  }

  if (Notification.permission !== "denied") {
    const permission = await Notification.requestPermission();
    return permission === "granted";
  }

  return false;
}

export function sendBrowserNotification(title: string, options?: NotificationOptions) {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return;
  }

  if (Notification.permission === "granted") {
    try {
      new Notification(title, {
        icon: "/icon-192.png",
        badge: "/icon-192.png",
        ...options,
      });
    } catch (e) {
      console.warn("[notificationService] Notification display error:", e);
    }
  }
}
