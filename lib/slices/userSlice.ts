/**
 * Defter — Domain Slice: User Settings & Privacy Security
 */

export interface UserSettings {
  userName: string;
  currency: string;
  priceAlerts: boolean;
  ipoAlerts: boolean;
  dividendAlerts: boolean;
  oracleAlerts: boolean;
  orakulPersona?: "temkinli" | "cesur" | "deger";
  commissionRate?: number; // %0.15
  bsmvRate?: number;       // %5
}

export interface TriggeredAlert {
  id: string;
  symbol: string;
  targetPrice: number;
  triggeredPrice: number;
  triggeredAt: string;
  condition: "ABOVE" | "BELOW";
}

export const DEFAULT_USER_SETTINGS: UserSettings = {
  userName: "Defter Sahibi",
  currency: "₺ TRY",
  priceAlerts: true,
  ipoAlerts: true,
  dividendAlerts: true,
  oracleAlerts: true,
  orakulPersona: "deger",
  commissionRate: 0.15,
  bsmvRate: 5,
};
