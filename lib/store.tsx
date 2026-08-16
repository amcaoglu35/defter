"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import {
  Company,
  Basket,
  BasketHolding,
  DividendItem,
  IpoItem,
  NotificationItem,
  AiHistoryItem,
  AutonomousScan,
  AiModelBasket,
  MOCK_COMPANIES,
  MOCK_BASKETS,
  MOCK_IPOS,
  MOCK_NOTIFICATIONS,
  MOCK_AI_HISTORY,
  MOCK_DIVIDENDS,
} from "./mockData";
import { isSupabaseConfigured } from "./supabase";
const isDev = process.env.NODE_ENV === "development";

export interface Transaction {
  id: string;
  companySymbol: string;
  type: "BUY" | "SELL";
  quantity: number;
  price: number;
  totalAmount: number;
  date: string;
  note?: string;
  basketId?: string;
}

export interface MarketIndexData {
  price: number;
  dailyChange: number;
  formattedPrice: string;
  isPositive: boolean;
}

export interface UserSettings {
  userName: string;
  currency: string;
  priceAlerts: boolean;
  ipoAlerts: boolean;
  dividendAlerts: boolean;
  oracleAlerts: boolean;
  orakulPersona?: "temkinli" | "cesur" | "deger";
  commissionRate?: number; // Onbinde veya yüzde cinsinden işlem komisyonu (Örn: 0.15 => %0.15)
  bsmvRate?: number; // Komisyon üzerinden BSMV oranı (Örn: 5 => %5)
}

export interface TriggeredAlert {
  id: string;
  symbol: string;
  targetPrice: number;
  triggeredPrice: number;
  triggeredAt: string;
  condition: "ABOVE" | "BELOW";
}

export interface NetReturnMetrics {
  grossCost: number;
  grossValue: number;
  grossProfit: number;
  grossProfitPercent: number;
  estimatedBuyCommission: number;
  estimatedSellCommission: number;
  totalCommissionAndTaxes: number;
  netProfit: number;
  netProfitPercent: number;
  commissionRateUsed: number;
}

export function calculateNetPositionMetrics(
  quantity: number,
  avgCost: number,
  currentPrice: number,
  commissionRate: number = 0.15,
  bsmvRate: number = 5
): NetReturnMetrics {
  const grossCost = quantity * avgCost;
  const grossValue = quantity * currentPrice;
  const grossProfit = grossValue - grossCost;
  const grossProfitPercent = grossCost > 0 ? (grossProfit / grossCost) * 100 : 0;

  // Effective commission rate multiplier including BSMV
  const taxMultiplier = 1 + (bsmvRate || 0) / 100;
  const rateFactor = ((commissionRate || 0) / 100) * taxMultiplier;

  const estimatedBuyCommission = grossCost * rateFactor;
  const estimatedSellCommission = grossValue * rateFactor;
  const totalCommissionAndTaxes = estimatedBuyCommission + estimatedSellCommission;

  const netProfit = grossProfit - totalCommissionAndTaxes;
  const netProfitPercent = grossCost > 0 ? (netProfit / grossCost) * 100 : 0;

  return {
    grossCost: parseFloat(grossCost.toFixed(2)),
    grossValue: parseFloat(grossValue.toFixed(2)),
    grossProfit: parseFloat(grossProfit.toFixed(2)),
    grossProfitPercent: parseFloat(grossProfitPercent.toFixed(2)),
    estimatedBuyCommission: parseFloat(estimatedBuyCommission.toFixed(2)),
    estimatedSellCommission: parseFloat(estimatedSellCommission.toFixed(2)),
    totalCommissionAndTaxes: parseFloat(totalCommissionAndTaxes.toFixed(2)),
    netProfit: parseFloat(netProfit.toFixed(2)),
    netProfitPercent: parseFloat(netProfitPercent.toFixed(2)),
    commissionRateUsed: commissionRate,
  };
}

export interface AiAccuracyStats {
  total: number;
  evaluated: number;
  correct: number;
  incorrect: number;
  pending: number;
  accuracyRate: number;
  alTotal: number;
  alCorrect: number;
  alAccuracy: number;
  satTotal: number;
  satCorrect: number;
  satAccuracy: number;
  tutTotal: number;
  tutCorrect: number;
  tutAccuracy: number;
  avgAlpha: number;
}

interface DefterStoreContextType {
  // User Settings
  userSettings: UserSettings;
  updateUserSettings: (partial: Partial<UserSettings>) => void;

  // Companies
  companies: Company[];
  addCompany: (company: Company) => void;
  updateCompany: (symbol: string, partial: Partial<Company>) => void;
  deleteCompany: (symbol: string) => void;
  toggleWatchlist: (symbol: string) => void;

  // Baskets
  baskets: Basket[];
  createBasket: (newBasket: Basket) => void;
  updateBasket: (id: string, partial: Partial<Basket>) => void;
  deleteBasket: (id: string) => void;
  addHoldingToBasket: (basketId: string, holding: BasketHolding) => void;
  removeHoldingFromBasket: (basketId: string, symbol: string) => void;
  updateHolding: (
    basketId: string,
    symbol: string,
    updates: Partial<BasketHolding>
  ) => void;

  // Transactions & Cost
  transactions: Transaction[];
  addTransaction: (
    tx: Omit<Transaction, "id">,
    targetBasketId?: string
  ) => { success: boolean; error?: string };
  deleteTransaction: (id: string) => void;
  companyNotes: Record<string, string[]>;
  addNote: (symbol: string, noteText: string) => void;
  deleteNote: (symbol: string, index: number) => void;

  // Calculated Dividends
  dividends: DividendItem[];

  // IPOs
  ipos: IpoItem[];
  addIpo: (ipo: IpoItem, autoAddToLedger?: boolean) => void;
  updateIpo: (id: string, partial: Partial<IpoItem>) => void;
  deleteIpo: (id: string) => void;
  syncIpoToLedger: (ipo: IpoItem) => void;
  autoSyncNewIpos: () => Promise<number>;

  // AI History, Feedback Loop & Accuracy
  aiHistory: AiHistoryItem[];
  addAiHistory: (item: AiHistoryItem) => void;
  deleteAiHistory: (id: string) => void;
  clearAllAiHistory: () => void;
  evaluateAiOutcomes: (freshCompanies?: Company[]) => void;
  aiAccuracyStats: AiAccuracyStats;
  aiProvider: string;
  geminiModel: string;
  setAiSettings: (provider: string, model?: string) => void;

  // Live Market Sync & Indices
  indices: Record<string, MarketIndexData>;
  lastSyncTime: string;
  isRefreshing: boolean;
  refreshPrices: () => Promise<void>;
  updateInterval: string;
  setUpdateInterval: (interval: string) => void;
  usdRate: number;

  // Notifications & Alerts
  notifications: NotificationItem[];
  addNotification: (item: NotificationItem) => void;
  markAllNotificationsRead: () => void;
  markNotificationRead: (id: string) => void;
  triggeredAlerts: TriggeredAlert[];
  clearTriggeredAlerts: (symbol?: string) => void;

  // Autonomous AI Scanner & Self-Learning
  autonomousScans: AutonomousScan[];
  addAutonomousScan: (scan: AutonomousScan) => void;
  clearAutonomousScans: () => void;
  evaluateAutonomousScans: (freshCompanies?: Company[]) => void;
  aiModelBaskets: AiModelBasket[];
  addAiModelBasket: (basket: AiModelBasket) => void;
  clearAiModelBaskets: () => void;
  evaluateAiModelBaskets: (freshCompanies?: Company[]) => void;

  // Utilities & Cloud
  isLoaded: boolean;
  isCloudConnected: boolean;
  isPrivacyMode: boolean;
  togglePrivacyMode: () => void;
  syncWithSupabase: () => Promise<void>;
  resetToDefaultData: () => void;
  exportStoreAsJson: () => string;
}

const DefterStoreContext = createContext<DefterStoreContextType | null>(null);

const STORAGE_KEYS = {
  COMPANIES: "defter_companies_v2",
  BASKETS: "defter_baskets_v2",
  TRANSACTIONS: "defter_transactions_v2",
  NOTES: "defter_notes_v2",
  IPOS: "defter_ipos_v2",
  AI_HISTORY: "defter_ai_history_v2",
  NOTIFICATIONS: "defter_notifications_v2",
  TRIGGERED_ALERTS: "defter_triggered_alerts_v2",
  GEMINI_MODEL: "defter_gemini_model",
  AI_PROVIDER: "defter_ai_provider",
  UPDATE_INTERVAL: "defter_update_interval",
  INDICES: "defter_indices_v2",
  USER_SETTINGS: "defter_user_settings_v2",
  AUTONOMOUS_SCANS: "defter_autonomous_scans_v1",
  AI_MODEL_BASKETS: "defter_ai_model_baskets_v1",
};

const DEFAULT_USER_SETTINGS: UserSettings = {
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

const DEFAULT_INDICES: Record<string, MarketIndexData> = {
  "BIST 100": { price: 9840.5, dailyChange: 1.42, formattedPrice: "9.840,50", isPositive: true },
  "BIST 30": { price: 10720.1, dailyChange: 1.65, formattedPrice: "10.720,10", isPositive: true },
  "USD/TRY": { price: 47.88, dailyChange: 0.11, formattedPrice: "47,88 ₺", isPositive: true },
  "EUR/TRY": { price: 55.38, dailyChange: 0.37, formattedPrice: "55,38 ₺", isPositive: true },
  "Gram Altın": { price: 4078.0, dailyChange: 0.85, formattedPrice: "4.078,00 ₺", isPositive: true },
  "Gümüş/Gr": { price: 48.50, dailyChange: 1.40, formattedPrice: "48,50 ₺", isPositive: true },
  "Brent Petrol": { price: 74.20, dailyChange: -0.40, formattedPrice: "74,20 $", isPositive: false },
  "S&P 500": { price: 5648.4, dailyChange: 0.45, formattedPrice: "5.648,40", isPositive: true },
  "NASDAQ": { price: 17683.9, dailyChange: 0.84, formattedPrice: "17.683,90", isPositive: true },
};

export function inferAssetClass(c: {
  symbol?: string;
  assetClass?: string;
  asset_class?: string;
  exchange?: string;
  sector?: string;
}): "hisse" | "maden" | "fon" | "doviz" {
  const symbol = c.symbol || "";
  const existing = (c.assetClass || c.asset_class) as "hisse" | "maden" | "fon" | "doviz" | undefined;
  if (existing && ["hisse", "maden", "fon", "doviz"].includes(existing)) {
    return existing;
  }
  if (
    c.exchange === "Emtia" ||
    symbol.includes("ALTIN") ||
    symbol.includes("GÜMÜŞ") ||
    symbol.includes("GUMUS") ||
    symbol.includes("PLATIN") ||
    symbol.includes("PALADYUM") ||
    ["CEYREK", "YARIM", "TAM", "ATA", "BILEZIK22", "BRENT", "WTI_OIL", "DOGALGAZ", "BAKIR"].includes(symbol)
  ) {
    return "maden";
  }
  if (
    c.exchange === "Döviz" ||
    c.exchange === "Serbest Piyasa" ||
    symbol.includes("/TRY") ||
    symbol.includes("/USD") ||
    symbol.includes("USD") ||
    symbol.includes("EUR") ||
    symbol.includes("GBP")
  ) {
    return "doviz";
  }
  if (
    c.sector?.includes("Fon") ||
    c.exchange === "TEFAS" ||
    symbol.includes("FON") ||
    symbol.includes("PORTFÖY") ||
    ["AFT", "TTE", "MAC", "TI1", "YAY", "IIH", "GMR", "KZL", "TCD", "BIO", "BUY", "IHK", "QQQ", "SPY", "VOO", "GLD", "SLV", "SMH", "ARKK", "DIA"].includes(symbol)
  ) {
    return "fon";
  }
  return "hisse";
}

export function normalizeCompany(c: Record<string, unknown>): Company {
  const symbol = (c.symbol as string) || "";
  const assetClass = inferAssetClass(c as { symbol?: string; assetClass?: string; asset_class?: string; exchange?: string; sector?: string });

  let madenKategori: "altin" | "gumus_platin" | "enerji_sanayi" | undefined =
    (c.madenKategori || c.maden_kategori) as "altin" | "gumus_platin" | "enerji_sanayi" | undefined;

  if (!madenKategori && assetClass === "maden") {
    if (symbol.includes("ALTIN") || ["CEYREK", "YARIM", "TAM", "ATA", "BILEZIK22"].includes(symbol)) {
      madenKategori = "altin";
    } else if (
      symbol.includes("GÜMÜŞ") ||
      symbol.includes("GUMUS") ||
      symbol.includes("PLATIN") ||
      symbol.includes("PALADYUM")
    ) {
      madenKategori = "gumus_platin";
    } else if (
      ["BRENT", "WTI_OIL", "DOGALGAZ", "BAKIR"].includes(symbol) ||
      c.sector === "Enerji Emtiaları" ||
      c.sector === "Endüstriyel Metaller"
    ) {
      madenKategori = "enerji_sanayi";
    }
  }

  return {
    id: (c.id as string) || symbol.toLowerCase(),
    symbol,
    name: (c.name as string) || symbol,
    sector: (c.sector as string) || "Genel",
    exchange: (c.exchange as "BIST" | "ABD" | "Avrupa" | "Emtia" | "Döviz") || "BIST",
    assetClass,
    madenKategori,
    indexTag: String(c.indexTag || c.index_tag || "BIST 100"),
    price: Number(c.price || 0),
    currency: (c.currency as string) || "₺",
    dailyChange: Number(c.dailyChange ?? c.daily_change ?? 0),
    peRatio: Number(c.peRatio ?? c.pe_ratio ?? 10),
    pbRatio: Number(c.pbRatio ?? c.pb_ratio ?? 1.5),
    dividendYield: Number(c.dividendYield ?? c.dividend_yield ?? 0),
    marketCap: String(c.marketCap || c.market_cap || "10 Mr ₺"),
    beta: Number(c.beta ?? 1),
    recommendation: (c.recommendation as "AL" | "SAT" | "TUT") || "TUT",
    inWatchlist: Boolean(c.inWatchlist ?? c.in_watchlist ?? false),
    description: (c.description as string) || "",
    metrics: Array.isArray(c.metrics) ? (c.metrics as Company["metrics"]) : [],
  };
}

export function recalculateBasketHoldings(
  holdings: BasketHolding[],
  companiesList: Company[]
): BasketHolding[] {
  if (!holdings || holdings.length === 0) return [];

  const totalValue = holdings.reduce((sum, h) => {
    const co = companiesList.find((c) => c.symbol === h.companySymbol);
    const price = co ? co.price : (h.currentPrice || h.avgCost || 0);
    return sum + h.quantity * price;
  }, 0);

  return holdings.map((h) => {
    const co = companiesList.find((c) => c.symbol === h.companySymbol);
    const price = co ? co.price : (h.currentPrice || h.avgCost || 0);
    const value = h.quantity * price;
    const computedWeight = totalValue > 0 ? (value / totalValue) * 100 : 0;
    return {
      ...h,
      currentPrice: price,
      weightPercent: parseFloat(computedWeight.toFixed(1)),
      targetWeightPercent: h.targetWeightPercent !== undefined ? h.targetWeightPercent : undefined,
    };
  });
}

export function recalculateBasket(
  b: Basket,
  companiesList: Company[]
): Basket {
  const updatedHoldings = recalculateBasketHoldings(b.holdings, companiesList);
  const totalValue = updatedHoldings.reduce(
    (sum, h) => sum + h.quantity * h.currentPrice,
    0
  );
  const totalCost = updatedHoldings.reduce(
    (sum, h) => sum + h.quantity * h.avgCost,
    0
  );
  const totalProfitPercent =
    totalCost > 0 ? ((totalValue - totalCost) / totalCost) * 100 : 0;

  return {
    ...b,
    holdings: updatedHoldings,
    totalValue: parseFloat(totalValue.toFixed(2)),
    totalCost: parseFloat(totalCost.toFixed(2)),
    totalProfitPercent: parseFloat(totalProfitPercent.toFixed(2)),
  };
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [baskets, setBaskets] = useState<Basket[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [companyNotes, setCompanyNotes] = useState<Record<string, string[]>>({});
  const [ipos, setIpos] = useState<IpoItem[]>([]);
  const [aiHistory, setAiHistory] = useState<AiHistoryItem[]>([]);
  const [autonomousScans, setAutonomousScans] = useState<AutonomousScan[]>([]);
  const [aiModelBaskets, setAiModelBaskets] = useState<AiModelBasket[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [triggeredAlerts, setTriggeredAlerts] = useState<TriggeredAlert[]>([]);
  const [indices, setIndices] = useState<Record<string, MarketIndexData>>(DEFAULT_INDICES);
  const [userSettings, setUserSettings] = useState<UserSettings>(DEFAULT_USER_SETTINGS);
  const [lastSyncTime, setLastSyncTime] = useState<string>("Şimdi");
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [usdRate, setUsdRate] = useState<number>(36.45);
  const [aiProvider, setAiProvider] = useState<string>("gemini");
  const [geminiModel, setGeminiModel] = useState<string>("gemini-1.5-flash");
  const [isServerCloudConnected, setIsServerCloudConnected] = useState<boolean>(false);
  const [updateInterval, setUpdateIntervalState] = useState<string>("manual");
  const [isPrivacyMode, setIsPrivacyMode] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("defter_privacy_mode") === "true";
    }
    return false;
  });

  // Persistence for autonomous scans and model baskets
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.AUTONOMOUS_SCANS, JSON.stringify(autonomousScans)); } catch {}
    try { localStorage.setItem(STORAGE_KEYS.AI_MODEL_BASKETS, JSON.stringify(aiModelBaskets)); } catch {}
  }, [autonomousScans, aiModelBaskets]);

  const togglePrivacyMode = useCallback(() => {
    setIsPrivacyMode((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("defter_privacy_mode", next.toString());
      } catch (e) {
        console.warn("[Privacy] Storage error:", e);
      }
      return next;
    });
  }, []);

  const updateUserSettings = useCallback((partial: Partial<UserSettings>) => {
    setUserSettings((prev) => {
      const updated = { ...prev, ...partial };
      fetch("/api/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "update_user_settings", payload: updated }),
      }).catch((err) => console.warn("[Sync] user settings sync error:", err));
      return updated;
    });
  }, []);

  // 1. Initial Load: Fetch from server API route (/api/sync) which uses Supabase Admin
  const syncWithSupabase = useCallback(async () => {
    try {
      const res = await fetch("/api/sync");
      if (res.ok) {
        const json = await res.json();
        if (json.configured === true) {
          setIsServerCloudConnected(true);
        } else {
          setIsServerCloudConnected(false);
        }
        if (json.success && json.data) {
          const { companies: dbCompanies, baskets: dbBaskets, transactions: dbTx, ipos: dbIpos, aiHistory: dbAi } = json.data;

          if (dbCompanies && dbCompanies.length > 0) {
            const dbMapped = dbCompanies.map((c: Record<string, unknown>) => normalizeCompany(c));
            const dbSymbols = new Set(dbMapped.map((c: Company) => c.symbol));
            const missingFromDb = MOCK_COMPANIES.filter((m) => !dbSymbols.has(m.symbol));
            setCompanies([...dbMapped, ...missingFromDb]);
          }

          if (dbBaskets && dbBaskets.length > 0) {
            setBaskets(
              dbBaskets.map((b: Record<string, unknown>) => ({
                id: (b.id as string) || "",
                name: (b.name as string) || "",
                subtitle: (b.subtitle as string) || "",
                riskLevel: (b.risk_level as "Düşük" | "Orta" | "Yüksek") || "Orta",
                riskColor: (b.risk_color as "low" | "mid" | "high") || "mid",
                totalValue: Number(b.total_value || 0),
                totalCost: Number(b.total_cost || 0),
                dailyChange: Number(b.daily_change || 0),
                totalProfitPercent: Number(b.total_profit_percent || 0),
                description: (b.description as string) || "",
                aiNote: (b.ai_note as string) || "",
                holdings: Array.isArray(b.basket_holdings)
                  ? b.basket_holdings.map((h: Record<string, unknown>) => ({
                      companySymbol: (h.company_symbol as string) || "",
                      weightPercent: Number(h.weight_percent || 0),
                      targetWeightPercent: h.target_weight_percent !== undefined && h.target_weight_percent !== null ? Number(h.target_weight_percent) : undefined,
                      quantity: Number(h.quantity || 0),
                      avgCost: Number(h.avg_cost || 0),
                      currentPrice: Number(h.avg_cost || 0),
                    }))
                  : [],
              }))
            );
          }

          if (dbTx && dbTx.length > 0) {
            setTransactions(
              dbTx.map((t: Record<string, unknown>) => ({
                id: (t.id as string) || "",
                companySymbol: (t.company_symbol as string) || "",
                type: (t.type as "BUY" | "SELL") || "BUY",
                quantity: Number(t.quantity),
                price: Number(t.price),
                totalAmount: Number(t.total_amount),
                date: (t.date as string) || "",
                note: (t.note as string) || "",
                basketId: (t.basket_id as string) || undefined,
              }))
            );
          }

          if (dbIpos && dbIpos.length > 0) {
            setIpos(
              dbIpos.map((i: Record<string, unknown>) => ({
                id: (i.id as string) || "",
                code: (i.code as string) || "",
                name: (i.name as string) || "",
                sector: (i.sector as string) || "",
                status: ((i.status === "completed" || i.status === "listed") ? "listed" : i.status === "active" ? "active" : "upcoming") as "upcoming" | "active" | "listed",
                dateRange: (i.date_range as string) || "",
                priceRange: (i.price_range as string) || "",
                distributionType: (i.allocation_method as string) || "Bireysele Eşit",
                leadManager: (i.broker as string) || "",
                lotAmount: (i.offering_size as string) || "",
                fundSize: (i.offering_size as string) || "",
                ceilingStreak: Number(i.ceiling_days || 0),
              }))
            );
          }

          if (dbAi && dbAi.length > 0) {
            setAiHistory(
              dbAi.map((a: Record<string, unknown>) => {
                const itemType = (a.type as string) || "Şirket Değerleme";
                const isBasketType = itemType === "Sepet Önerisi" || itemType === "Reçete";
                const rawPrice = a.price_at_verdict ? Number(a.price_at_verdict) : undefined;
                const rawBudget = a.budget_at_creation ? Number(a.budget_at_creation) : undefined;

                return {
                  id: (a.id as string) || "",
                  date: (a.verdict_date as string) || new Date(a.created_at as string).toLocaleDateString("tr-TR"),
                  type: itemType as AiHistoryItem["type"],
                  title: (a.title as string) || "",
                  description: (a.description as string) || "",
                  verdictTag: (a.verdict_tag as "AL" | "SAT" | "TUT" | "NÖTR" | "YÜKSEK RİSK" | "DENGELİ") || "TUT",
                  symbol: (a.symbol as string) || undefined,
                  verdict: (a.verdict as "AL" | "SAT" | "TUT" | "NÖTR" | "YÜKSEK RİSK" | "DENGELİ") || "TUT",
                  verdictDate: (a.verdict_date as string) || "",
                  budgetAtCreation: isBasketType ? (rawBudget || rawPrice) : rawBudget,
                  priceAtVerdict: isBasketType ? undefined : rawPrice,
                  priceAfterPeriod: a.price_after_period ? Number(a.price_after_period) : undefined,
                  outcomeCheckedAt: (a.outcome_checked_at as string) || undefined,
                  outcomeCorrect: typeof a.outcome_correct === "boolean" ? a.outcome_correct : undefined,
                  targetPeriodDays: Number(a.target_period_days || 30),
                };
              })
            );
          }
        }
      }
    } catch (err) {
      console.warn("Supabase hydration via server failed, using local store:", err);
    }
  }, []);

  useEffect(() => {
    Promise.resolve().then(() => {
      try {
        const storedCompanies = localStorage.getItem(STORAGE_KEYS.COMPANIES);
        const storedBaskets = localStorage.getItem(STORAGE_KEYS.BASKETS);
        const storedTx = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
        const storedNotes = localStorage.getItem(STORAGE_KEYS.NOTES);
        const storedIpos = localStorage.getItem(STORAGE_KEYS.IPOS);
        const storedAi = localStorage.getItem(STORAGE_KEYS.AI_HISTORY);
        const storedNotif = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
        const storedProvider = localStorage.getItem(STORAGE_KEYS.AI_PROVIDER);
        const storedInterval = localStorage.getItem(STORAGE_KEYS.UPDATE_INTERVAL);
        const storedIndices = localStorage.getItem(STORAGE_KEYS.INDICES);
        const storedUserSettings = localStorage.getItem(STORAGE_KEYS.USER_SETTINGS);
        const storedScans = localStorage.getItem(STORAGE_KEYS.AUTONOMOUS_SCANS);
        const storedModelBaskets = localStorage.getItem(STORAGE_KEYS.AI_MODEL_BASKETS);

        if (storedCompanies) {
          try {
            const parsed = JSON.parse(storedCompanies);
            if (Array.isArray(parsed) && parsed.length > 0) {
              const mockMap = new Map(MOCK_COMPANIES.map(m => [m.symbol.toUpperCase(), m]));
              const merged = parsed.map(c => {
                const norm = normalizeCompany(c);
                const freshSeed = mockMap.get(norm.symbol.toUpperCase());
                if (freshSeed) {
                  return {
                    ...norm,
                    price: freshSeed.price,
                    dailyChange: freshSeed.dailyChange,
                    high52: freshSeed.high52 ?? norm.high52,
                    low52: freshSeed.low52 ?? norm.low52,
                    dayHigh: freshSeed.dayHigh ?? norm.dayHigh,
                    dayLow: freshSeed.dayLow ?? norm.dayLow,
                    openPrice: freshSeed.openPrice ?? norm.openPrice,
                    volume: freshSeed.volume ?? norm.volume,
                    avgVolume: freshSeed.avgVolume ?? norm.avgVolume,
                    volumeRatio: freshSeed.volumeRatio ?? norm.volumeRatio,
                    athDiscountPct: freshSeed.athDiscountPct ?? norm.athDiscountPct,
                    peRatio: freshSeed.peRatio ?? norm.peRatio,
                    marketCap: freshSeed.marketCap ?? norm.marketCap,
                  };
                }
                return norm;
              });
              const existingSymbols = new Set(merged.map((c) => c.symbol));
              const missing = MOCK_COMPANIES.filter((m) => !existingSymbols.has(m.symbol));
              setCompanies([...merged, ...missing]);
            } else {
              setCompanies(MOCK_COMPANIES);
            }
          } catch {
            setCompanies(MOCK_COMPANIES);
          }
        } else {
          setCompanies(MOCK_COMPANIES);
        }
        if (storedBaskets) setBaskets(JSON.parse(storedBaskets));
        if (storedTx) setTransactions(JSON.parse(storedTx));
        if (storedNotes) setCompanyNotes(JSON.parse(storedNotes));
        if (storedIpos) {
          try {
            const parsed = JSON.parse(storedIpos);
            if (Array.isArray(parsed) && parsed.length > 0) {
              const existingCodes = new Set(parsed.map((p: Record<string, unknown>) => String(p.code)));
              const missing = MOCK_IPOS.filter((m) => !existingCodes.has(m.code));
              setIpos([...parsed, ...missing]);
            } else {
              setIpos(MOCK_IPOS);
            }
          } catch {
            setIpos(MOCK_IPOS);
          }
        } else {
          setIpos(MOCK_IPOS);
        }
        if (storedAi) {
          try {
            const parsedAi = JSON.parse(storedAi);
            if (Array.isArray(parsedAi)) {
              setAiHistory(
                parsedAi.map((item: AiHistoryItem) => {
                  const isBasketType = item.type === "Sepet Önerisi" || item.type === "Reçete";
                  if (isBasketType && item.priceAtVerdict && !item.budgetAtCreation) {
                    return {
                      ...item,
                      budgetAtCreation: item.priceAtVerdict,
                      priceAtVerdict: undefined,
                    };
                  }
                  return item;
                })
              );
            }
          } catch {}
        }
        if (storedNotif) setNotifications(JSON.parse(storedNotif));
        const storedTrigAlerts = localStorage.getItem(STORAGE_KEYS.TRIGGERED_ALERTS);
        if (storedTrigAlerts) {
          try {
            setTriggeredAlerts(JSON.parse(storedTrigAlerts));
          } catch {}
        }
        if (storedProvider) setAiProvider(storedProvider);
        try {
          localStorage.removeItem("defter_ai_api_key");
        } catch {}
        const storedModel = localStorage.getItem("defter_gemini_model");
        if (storedModel) setGeminiModel(storedModel);
        if (storedInterval) setUpdateIntervalState(storedInterval);
        if (storedIndices) setIndices(JSON.parse(storedIndices));
        if (storedUserSettings) setUserSettings(JSON.parse(storedUserSettings));
        if (storedScans) {
          try {
            setAutonomousScans(JSON.parse(storedScans));
          } catch {}
        }
        if (storedModelBaskets) {
          try {
            setAiModelBaskets(JSON.parse(storedModelBaskets));
          } catch {}
        }

        setLastSyncTime(
          new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })
        );

        // Trigger background sync if Supabase is connected
        if (isSupabaseConfigured) {
          syncWithSupabase();
        }
      } catch (e) {
        console.warn("Local storage hydration error:", e);
      } finally {
        setIsLoaded(true);
      }
    });
  }, [syncWithSupabase]);

  // 1b. Listen for authentication event to re-sync if authenticated after mount
  useEffect(() => {
    const handleAuthSuccess = () => {
      if (isSupabaseConfigured) {
        syncWithSupabase();
      }
    };
    if (typeof window !== "undefined") {
      window.addEventListener("defter_auth_success", handleAuthSuccess);
      return () => window.removeEventListener("defter_auth_success", handleAuthSuccess);
    }
  }, [syncWithSupabase]);

  // 2. Sync to LocalStorage (Always active as an instant client cache layer)
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEYS.COMPANIES, JSON.stringify(companies));
      localStorage.setItem(STORAGE_KEYS.BASKETS, JSON.stringify(baskets));
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
      localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(companyNotes));
      localStorage.setItem(STORAGE_KEYS.IPOS, JSON.stringify(ipos));
      localStorage.setItem(STORAGE_KEYS.AI_HISTORY, JSON.stringify(aiHistory));
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
      localStorage.setItem(STORAGE_KEYS.AI_PROVIDER, aiProvider);
      localStorage.setItem(STORAGE_KEYS.UPDATE_INTERVAL, updateInterval);
      localStorage.setItem(STORAGE_KEYS.INDICES, JSON.stringify(indices));
      localStorage.setItem(STORAGE_KEYS.USER_SETTINGS, JSON.stringify(userSettings));
      localStorage.setItem(STORAGE_KEYS.AUTONOMOUS_SCANS, JSON.stringify(autonomousScans));
      localStorage.setItem(STORAGE_KEYS.AI_MODEL_BASKETS, JSON.stringify(aiModelBaskets));
    } catch (e) {
      console.warn("Could not save to localStorage:", e);
    }
  }, [
    isLoaded,
    companies,
    baskets,
    transactions,
    companyNotes,
    ipos,
    aiHistory,
    autonomousScans,
    aiModelBaskets,
    notifications,
    aiProvider,
    updateInterval,
    indices,
    userSettings,
  ]);

  // Recalculate basket totals dynamically using single canonical recalculateBasket function
  const recalculatedBaskets = useMemo(() => {
    return baskets.map((basket) => recalculateBasket(basket, companies));
  }, [baskets, companies]);

  // Dynamic Dividends (Calculated from real company dividend yields & user holdings)
  const computedDividends = useMemo<DividendItem[]>(() => {
    const symbolLots: Record<string, number> = {};
    recalculatedBaskets.forEach((b) => {
      b.holdings.forEach((h) => {
        symbolLots[h.companySymbol] =
          (symbolLots[h.companySymbol] || 0) + (h.quantity || 0);
      });
    });

    const divCompanies = companies.filter(
      (c) =>
        (c.dividendYield && c.dividendYield > 0) ||
        (c.dividendRate && c.dividendRate > 0) ||
        symbolLots[c.symbol]
    );

    const sorted = [...divCompanies].sort((a, b) => {
      const ownedA = symbolLots[a.symbol] || 0;
      const ownedB = symbolLots[b.symbol] || 0;
      if (ownedA > 0 && ownedB === 0) return -1;
      if (ownedB > 0 && ownedA === 0) return 1;
      return (b.dividendYield || 0) - (a.dividendYield || 0);
    }).slice(0, 20);

    return sorted.map((c) => {
      const ownedQty = symbolLots[c.symbol] || 0;
      const netPerShare =
        c.dividendRate ||
        Number((((c.price || 100) * (c.dividendYield || 3)) / 100).toFixed(2));
      const estimatedTotal = ownedQty * netPerShare;
      const paymentDate = c.exDividendDate || "2025/2026 Dönemi";

      return {
        id: `div-${c.symbol}`,
        companySymbol: c.symbol,
        companyName: c.name,
        paymentDate,
        netAmountPerShare: netPerShare,
        yieldPercent:
          c.dividendYield ||
          (c.dividendRate && c.price
            ? Number(((c.dividendRate / c.price) * 100).toFixed(1))
            : 0),
        status: ownedQty > 0 ? "Portföyünüzde" : "Açıklandı",
        ownedLots: ownedQty,
        totalEstimatedPayout: parseFloat(estimatedTotal.toFixed(2)),
      };
    });
  }, [recalculatedBaskets, companies]);

  // AI Accuracy Statistics Calculation
  const aiAccuracyStats = useMemo<AiAccuracyStats>(() => {
    const total = aiHistory.length;
    const evaluatedItems = aiHistory.filter((item) => item.outcomeCorrect !== null && item.outcomeCorrect !== undefined);
    const correct = evaluatedItems.filter((item) => item.outcomeCorrect === true).length;
    const incorrect = evaluatedItems.filter((item) => item.outcomeCorrect === false).length;
    const pending = total - evaluatedItems.length;
    const accuracyRate = evaluatedItems.length > 0 ? Math.round((correct / evaluatedItems.length) * 100) : 0;

    // Karar tipine göre ayrıştırma (Madde 2)
    const alItems = evaluatedItems.filter((i) => (i.verdict || i.verdictTag || "").toUpperCase().includes("AL"));
    const alCorrect = alItems.filter((i) => i.outcomeCorrect === true).length;
    const alAccuracy = alItems.length > 0 ? Math.round((alCorrect / alItems.length) * 100) : 0;

    const satItems = evaluatedItems.filter((i) => (i.verdict || i.verdictTag || "").toUpperCase().includes("SAT"));
    const satCorrect = satItems.filter((i) => i.outcomeCorrect === true).length;
    const satAccuracy = satItems.length > 0 ? Math.round((satCorrect / satItems.length) * 100) : 0;

    const tutItems = evaluatedItems.filter((i) => {
      const v = (i.verdict || i.verdictTag || "").toUpperCase();
      return v.includes("TUT") || v.includes("DENGELİ") || v.includes("NÖTR");
    });
    const tutCorrect = tutItems.filter((i) => i.outcomeCorrect === true).length;
    const tutAccuracy = tutItems.length > 0 ? Math.round((tutCorrect / tutItems.length) * 100) : 0;

    // Ortalama üretilen alfa (Madde 1)
    const itemsWithAlpha = evaluatedItems.filter((i) => typeof i.alpha === "number");
    const avgAlpha = itemsWithAlpha.length > 0
      ? parseFloat((itemsWithAlpha.reduce((acc, curr) => acc + (curr.alpha || 0), 0) / itemsWithAlpha.length).toFixed(2))
      : 0;

    return {
      total,
      evaluated: evaluatedItems.length,
      correct,
      incorrect,
      pending,
      accuracyRate,
      alTotal: alItems.length,
      alCorrect,
      alAccuracy,
      satTotal: satItems.length,
      satCorrect,
      satAccuracy,
      tutTotal: tutItems.length,
      tutCorrect,
      tutAccuracy,
      avgAlpha,
    };
  }, [aiHistory]);

  // Outcome Verification Engine (evaluates past AI predictions vs market movements)
  const evaluateAiOutcomes = useCallback((freshCompanies?: Company[]) => {
    const listToUse = freshCompanies || companies;
    const currentBist100 = indices["BIST 100"]?.price || indices["XU100"]?.price || 9840.5;

    setAiHistory((prev) =>
      prev.map((item) => {
        if (!item.symbol || !item.priceAtVerdict || (item.outcomeCorrect !== null && item.outcomeCorrect !== undefined)) {
          return item;
        }

        // Check if target evaluation period (e.g. 30 days) has elapsed
        const verdictDateStr = item.verdictDate || item.date;
        if (verdictDateStr) {
          const verdictTime = new Date(verdictDateStr).getTime();
          if (!isNaN(verdictTime)) {
            const daysPassed = (Date.now() - verdictTime) / (1000 * 60 * 60 * 24);
            const targetDays = item.targetPeriodDays || 30;
            if (daysPassed < targetDays) {
              return item; // Evaluation period has not passed yet
            }
          }
        }

        const co = listToUse.find((c) => c.symbol === item.symbol);
        if (!co) return item;

        const curPrice = co.price;
        const stockReturn = ((curPrice - item.priceAtVerdict) / item.priceAtVerdict) * 100;
        
        let benchmarkReturn = 0;
        if (item.bist100AtVerdict && item.bist100AtVerdict > 0) {
          benchmarkReturn = ((currentBist100 - item.bist100AtVerdict) / item.bist100AtVerdict) * 100;
        }
        
        const alpha = parseFloat((stockReturn - benchmarkReturn).toFixed(2));
        let isCorrect: boolean | null = null;

        const v = (item.verdict || item.verdictTag || "").toUpperCase();
        if (v.includes("AL")) {
          // If recommendation was BUY and alpha exceeded benchmark by >= 1.5% (or stockReturn >= 1.0% if no benchmark)
          isCorrect = item.bist100AtVerdict ? alpha >= 1.5 : stockReturn >= 1.0;
        } else if (v.includes("SAT")) {
          // If recommendation was SELL and dropped or underperformed by <= -1.5%
          isCorrect = item.bist100AtVerdict ? alpha <= -1.5 : stockReturn <= -1.0;
        } else if (v.includes("TUT") || v.includes("DENGELİ") || v.includes("NÖTR")) {
          // If recommendation was HOLD and price performed within normal beta range (+-5%)
          isCorrect = item.bist100AtVerdict ? Math.abs(alpha) <= 5.0 : Math.abs(stockReturn) <= 5.0;
        }

        if (isCorrect !== null) {
          // Sync update via server API route
          fetch("/api/sync", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              action: "evaluate_ai_outcome",
              payload: {
                id: item.id,
                outcomeCorrect: isCorrect,
                priceAfterPeriod: curPrice,
                alpha,
                outcomeCheckedAt: new Date().toISOString(),
              },
            }),
          }).catch();

          return {
            ...item,
            outcomeCorrect: isCorrect,
            priceAfterPeriod: curPrice,
            alpha,
            outcomeCheckedAt: new Date().toISOString().split("T")[0],
          };
        }

        return item;
      })
    );
  }, [companies, indices]);

  // Helper methods for autonomous scans
  const addAutonomousScan = (scan: AutonomousScan) => {
    setAutonomousScans(prev => {
      const updated = [scan, ...prev].slice(0, 100);
      try { localStorage.setItem(STORAGE_KEYS.AUTONOMOUS_SCANS, JSON.stringify(updated)); } catch {}
      return updated;
    });
  };

  const clearAutonomousScans = () => {
    setAutonomousScans([]);
    try { localStorage.removeItem(STORAGE_KEYS.AUTONOMOUS_SCANS); } catch {}
  };

  const evaluateAutonomousScans = (freshCompanies?: Company[]) => {
    // Placeholder evaluation: mark all pending scans as evaluated with dummy outcome
    setAutonomousScans(prev => {
      const evaluated = prev.map(scan => ({
        ...scan,
        outcomeCheckedAt: new Date().toISOString(),
        outcomeCorrect: null,
      }));
      try { localStorage.setItem(STORAGE_KEYS.AUTONOMOUS_SCANS, JSON.stringify(evaluated)); } catch {}
      return evaluated;
    });
  };

  // Helper methods for AI model baskets
  const addAiModelBasket = (basket: AiModelBasket) => {
    setAiModelBaskets(prev => {
      const updated = [basket, ...prev].slice(0, 100);
      try { localStorage.setItem(STORAGE_KEYS.AI_MODEL_BASKETS, JSON.stringify(updated)); } catch {}
      return updated;
    });
  };

  const clearAiModelBaskets = () => {
    setAiModelBaskets([]);
    try { localStorage.removeItem(STORAGE_KEYS.AI_MODEL_BASKETS); } catch {}
  };

  const evaluateAiModelBaskets = (freshCompanies?: Company[]) => {
    // Placeholder evaluation: just set outcomeCheckedAt and null outcomeCorrect
    setAiModelBaskets(prev => {
      const evaluated = prev.map(b => ({
        ...b,
        outcomeCheckedAt: new Date().toISOString(),
        outcomeCorrect: null,
      }));
      try { localStorage.setItem(STORAGE_KEYS.AI_MODEL_BASKETS, JSON.stringify(evaluated)); } catch {}
      return evaluated;
    });
  };

  const deleteAiHistory = useCallback((id: string) => {
    setAiHistory((prev) => prev.filter((h) => h.id !== id));
    fetch("/api/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete_ai_history", payload: { id } }),
    }).catch((err) => console.warn("[Sync] delete ai history error:", err));
  }, []);

  const clearAllAiHistory = useCallback(() => {
    setAiHistory([]);
    fetch("/api/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "clear_ai_history" }),
    }).catch((err) => console.warn("[Sync] clear ai history error:", err));
  }, []);

  // Add AI history entry
  const addAiHistory = useCallback((item: AiHistoryItem) => {
    setAiHistory((prev) => [item, ...prev]);
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEYS.AI_HISTORY) ?? "[]");
      localStorage.setItem(STORAGE_KEYS.AI_HISTORY, JSON.stringify([item, ...stored]));
    } catch {}
    fetch("/api/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "add_ai_history", payload: item }),
    }).catch((err) => console.warn("[Sync] add ai history error:", err));
  }, []);

  const addNotification = useCallback((item: NotificationItem) => {
    setNotifications((prev) => [item, ...prev]);
    fetch("/api/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "add_notification", payload: item }),
    }).catch((err) => console.warn("[Sync] add notification error:", err));
  }, []);
  // Company CRUD operations
  const addCompany = useCallback((company: Company) => {
    setCompanies((prev) => [company, ...prev]);
    fetch('/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'add_company', payload: company }),
    }).catch((err) => console.warn('[Sync] add company error:', err));
  }, []);

  const updateCompany = useCallback((symbol: string, partial: Partial<Company>) => {
    setCompanies((prev) =>
      prev.map((c) => (c.symbol === symbol ? { ...c, ...partial } : c))
    );
    fetch('/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'update_company', payload: { symbol, partial } }),
    }).catch((err) => console.warn('[Sync] update company error:', err));
  }, []);

  const deleteCompany = useCallback((symbol: string) => {
    setCompanies((prev) => prev.filter((c) => c.symbol !== symbol));
    fetch('/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'delete_company', payload: { symbol } }),
    }).catch((err) => console.warn('[Sync] delete company error:', err));
  }, []);

  const toggleWatchlist = useCallback((symbol: string) => {
    setCompanies((prev) =>
      prev.map((c) =>
        c.symbol === symbol ? { ...c, inWatchlist: !c.inWatchlist } : c
      )
    );
    fetch('/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'toggle_watchlist', payload: { symbol } }),
    }).catch((err) => console.warn('[Sync] toggle watchlist error:', err));
  }, []);

  // Basket CRUD operations
  const createBasket = useCallback((newBasket: Basket) => {
    setBaskets((prev) => [newBasket, ...prev]);
    fetch('/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'add_basket', payload: newBasket }),
    }).catch((err) => console.warn('[Sync] add basket error:', err));
  }, []);

  const updateBasket = useCallback((id: string, partial: Partial<Basket>) => {
    setBaskets((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...partial } : b))
    );
    fetch('/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'update_basket', payload: { id, partial } }),
    }).catch((err) => console.warn('[Sync] update basket error:', err));
  }, []);

  const deleteBasket = useCallback((id: string) => {
    setBaskets((prev) => prev.filter((b) => b.id !== id));
    fetch('/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'delete_basket', payload: { id } }),
    }).catch((err) => console.warn('[Sync] delete basket error:', err));
  }, []);

  const addHoldingToBasket = useCallback(
    (basketId: string, holding: BasketHolding) => {
      setBaskets((prev) =>
        prev.map((b) =>
          b.id === basketId
            ? { ...b, holdings: [...b.holdings, holding] }
            : b
        )
      );
      fetch('/api/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'add_holding', payload: { basketId, holding } }),
      }).catch((err) => console.warn('[Sync] add holding error:', err));
    },
    []
  );

  const removeHoldingFromBasket = useCallback(
    (basketId: string, symbol: string) => {
      setBaskets((prev) =>
        prev.map((b) =>
          b.id === basketId
            ? {
                ...b,
                holdings: b.holdings.filter((h) => h.companySymbol !== symbol),
              }
            : b
        )
      );
      fetch('/api/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'remove_holding', payload: { basketId, symbol } }),
      }).catch((err) => console.warn('[Sync] remove holding error:', err));
    },
    []
  );

  const updateHolding = useCallback(
    (
      basketId: string,
      symbol: string,
      updates: Partial<BasketHolding>
    ) => {
      setBaskets((prev) =>
        prev.map((b) => {
          if (b.id !== basketId) return b;
          const updatedHoldings = b.holdings.map((h) =>
            h.companySymbol === symbol ? { ...h, ...updates } : h
          );
          return { ...b, holdings: updatedHoldings };
        })
      );
      fetch('/api/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update_holding', payload: { basketId, symbol, updates } }),
      }).catch((err) => console.warn('[Sync] update holding error:', err));
    },
    []
  );

  // Transaction operations
  const addTransaction = useCallback(
    (tx: Omit<Transaction, 'id'>, targetBasketId?: string) => {
      const newTx: Transaction = { ...tx, id: `tx-${Date.now()}` };
      if (targetBasketId) newTx.basketId = targetBasketId;
      setTransactions((prev) => [newTx, ...prev]);
      fetch('/api/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'add_transaction', payload: newTx }),
      }).catch((err) => console.warn('[Sync] add transaction error:', err));
      return { success: true };
    },
    []
  );

  const deleteTransaction = useCallback((id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
    fetch('/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'delete_transaction', payload: { id } }),
    }).catch((err) => console.warn('[Sync] delete transaction error:', err));
  }, []);

  // Company notes operations
  const addNote = useCallback((symbol: string, noteText: string) => {
    setCompanyNotes((prev) => {
      const existing = prev[symbol] || [];
      return { ...prev, [symbol]: [...existing, noteText] };
    });
    fetch('/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'add_note', payload: { symbol, noteText } }),
    }).catch((err) => console.warn('[Sync] add note error:', err));
  }, []);

  const deleteNote = useCallback((symbol: string, index: number) => {
    setCompanyNotes((prev) => {
      const existing = prev[symbol] || [];
      return {
        ...prev,
        [symbol]: existing.filter((_, i) => i !== index),
      };
    });
    fetch('/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'delete_note', payload: { symbol, index } }),
    }).catch((err) => console.warn('[Sync] delete note error:', err));
  }, []);

  const syncIpoToLedger = useCallback(
    (ipo: IpoItem) => {
      // Only IPOs that are listed and actively trading on BIST can be added to ledger
      if (ipo.status !== "listed") return;

      const exists = companies.some(
        (c) => c.symbol.toUpperCase() === ipo.code.toUpperCase()
      );
      if (exists) return;

      const price =
        parseFloat(ipo.priceRange.replace(/[^\d.]/g, "")) || 20.0;

      const newCo: Company = {
        id: ipo.code.toLowerCase(),
        symbol: ipo.code.toUpperCase(),
        name: ipo.name,
        sector: ipo.sector,
        exchange: "BIST",
        assetClass: "hisse",
        indexTag: "BIST 100",
        price: price,
        currency: "₺",
        dailyChange: 0.0,
        peRatio: undefined,
        pbRatio: undefined,
        dividendYield: 0.0,
        marketCap: ipo.fundSize || "Belirtilmedi",
        beta: undefined,
        recommendation: "NÖTR",
        inWatchlist: true,
        description: `${ipo.name} (${ipo.code}), SPK onaylı halka arz sürecinin ardından Borsa İstanbul kütüğüne kaydedilen yeni şirket.`,
        metrics: [
          { label: "Halka Arz Fiyatı", value: ipo.priceRange },
          { label: "Dağıtım Yöntemi", value: ipo.distributionType || "Bireysele Eşit" },
        ],
      };

      addCompany(newCo);

      const notifId = `notif-${Date.now()}`;
      const newNotif: NotificationItem = {
        id: notifId,
        type: "ipo",
        title: "Halka Arz Kütüğe Eklendi",
        message: `${ipo.name} (${ipo.code}) başarıyla şirket kütüğüne aktarıldı ve izleme listenize eklendi.`,
        time: "Şimdi",
        read: false,
      };
      addNotification(newNotif);
    },
    [companies, addCompany, addNotification]
  );

  const addIpo = useCallback(
    (ipo: IpoItem, autoAddToLedger = true) => {
      setIpos((prev) => [ipo, ...prev]);

      fetch("/api/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "add_ipo", payload: { ipo } }),
      }).catch((err) => console.warn("[Sync] add ipo error:", err));

      if (autoAddToLedger) {
        syncIpoToLedger(ipo);
      }
    },
    [syncIpoToLedger]
  );

  const updateIpo = useCallback(
    (id: string, partial: Partial<IpoItem>) => {
      setIpos((prev) =>
        prev.map((i) => (i.id === id ? { ...i, ...partial } : i))
      );

      fetch("/api/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "update_ipo", payload: { id, ...partial } }),
      }).catch((err) => console.warn("[Sync] update ipo error:", err));
    },
    []
  );

  const deleteIpo = useCallback(
    (id: string) => {
      setIpos((prev) => prev.filter((i) => i.id !== id));

      fetch("/api/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete_ipo", payload: { id } }),
      }).catch((err) => console.warn("[Sync] delete ipo error:", err));
    },
    []
  );

  const autoSyncNewIpos = useCallback(async () => {
    let addedCount = 0;
    const existingSymbols = new Set(
      companies.map((c) => c.symbol.toUpperCase())
    );

    for (const ipo of ipos) {
      if (ipo.status === "listed" && !existingSymbols.has(ipo.code.toUpperCase())) {
        syncIpoToLedger(ipo);
        existingSymbols.add(ipo.code.toUpperCase());
        addedCount++;
      }
    }

    return addedCount;
  }, [ipos, companies, syncIpoToLedger]);

  const setAiSettings = (provider: string, model?: string) => {
    setAiProvider(provider);
    try {
      localStorage.setItem("defter_ai_provider", provider);
    } catch {}
    if (model !== undefined) {
      setGeminiModel(model);
      try {
        localStorage.setItem("defter_gemini_model", model);
      } catch {}
    }
  };

  const setUpdateInterval = (interval: string) => {
    setUpdateIntervalState(interval);
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    fetch("/api/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "mark_notifications_read" }),
    }).catch((err) => console.warn("[Sync] mark all notifications read error:", err));
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    fetch("/api/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "mark_notification_read", payload: { id } }),
    }).catch((err) => console.warn("[Sync] mark notification read error:", err));
  };

  const resetToDefaultData = () => {
    if (isDev) {
      setCompanies(MOCK_COMPANIES);
      setBaskets(MOCK_BASKETS);
      setTransactions([]);
      setIpos(MOCK_IPOS);
      setAiHistory(MOCK_AI_HISTORY);
      setNotifications(MOCK_NOTIFICATIONS);
    } else {
      setCompanies([]);
      setBaskets([]);
      setTransactions([]);
      setIpos([]);
      setAiHistory([]);
      setNotifications([]);
    }
    setIndices(DEFAULT_INDICES);
    setCompanyNotes({
      THYAO: [
        "Q3 bilanço rekor yolcu geliri içeriyor.",
        "Kargo tarafında %18 yıllık büyüme var.",
      ],
      ASELS: ["Savunma Sanayii Başkanlığı ile 450M TL sözleşme imzalandı."],
      FROTO: ["Yıllık düzenli temettü dağıtım politikası."],
    });
    // Target only financial data keys; preserve AI credentials, user preferences, and auth session
    // Preserve AI credentials, user preferences, and auth session
    localStorage.removeItem(STORAGE_KEYS.COMPANIES);
    localStorage.removeItem(STORAGE_KEYS.BASKETS);
    localStorage.removeItem(STORAGE_KEYS.TRANSACTIONS);
    localStorage.removeItem(STORAGE_KEYS.NOTES);
    localStorage.removeItem(STORAGE_KEYS.IPOS);
    localStorage.removeItem(STORAGE_KEYS.AI_HISTORY);
    localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS);
    localStorage.removeItem(STORAGE_KEYS.INDICES);
  };

  const exportStoreAsJson = () => {
    const payload = {
      exportDate: new Date().toISOString(),
      version: "Defter v3.0",
      companies,
      baskets: recalculatedBaskets,
      transactions,
      companyNotes,
      ipos,
      aiHistory,
      indices,
    };
    return JSON.stringify(payload, null, 2);
  };

  const clearTriggeredAlerts = useCallback((symbol?: string) => {
    setTriggeredAlerts((prev) => {
      const updated = symbol ? prev.filter((a) => a.symbol.toUpperCase() !== symbol.toUpperCase()) : [];
      try {
        localStorage.setItem(STORAGE_KEYS.TRIGGERED_ALERTS, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  }, []);

  return (
    <DefterStoreContext.Provider
      value={{
        isLoaded,
        userSettings,
        updateUserSettings,
        companies,
        addCompany,
        updateCompany,
        deleteCompany,
        toggleWatchlist,
        baskets: recalculatedBaskets,
        createBasket,
        updateBasket,
        deleteBasket,
        addHoldingToBasket,
        removeHoldingFromBasket,
        updateHolding,
        transactions,
        addTransaction,
        deleteTransaction,
        companyNotes,
        addNote,
        deleteNote,
        dividends: computedDividends,
        ipos,
        addIpo,
        updateIpo,
        deleteIpo,
        syncIpoToLedger,
        autoSyncNewIpos,
        aiHistory,
        addAiHistory,
        deleteAiHistory,
        clearAllAiHistory,
        evaluateAiOutcomes,
        aiAccuracyStats,
        aiProvider,
        geminiModel,
        setAiSettings,
        autonomousScans,
        addAutonomousScan,
        clearAutonomousScans,
        evaluateAutonomousScans,
        aiModelBaskets,
        addAiModelBasket,
        clearAiModelBaskets,
        evaluateAiModelBaskets,
        indices,
        lastSyncTime,
        isRefreshing,
        refreshPrices,
        updateInterval,
        setUpdateInterval,
        usdRate,
        notifications,
        addNotification,
        markAllNotificationsRead,
        markNotificationRead,
        triggeredAlerts,
        clearTriggeredAlerts,
        isPrivacyMode,
        togglePrivacyMode,
        isCloudConnected: isSupabaseConfigured && isServerCloudConnected,
        syncWithSupabase,
        resetToDefaultData,
        exportStoreAsJson,
      }}
    >
      {children}
    </DefterStoreContext.Provider>
  );
}

export function useDefterStore() {
  const context = useContext(DefterStoreContext);
  if (!context) {
    throw new Error("useDefterStore must be used within a StoreProvider");
  }
  return context;
}
