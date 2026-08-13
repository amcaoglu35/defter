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
  MOCK_COMPANIES,
  MOCK_BASKETS,
  MOCK_IPOS,
  MOCK_NOTIFICATIONS,
  MOCK_AI_HISTORY,
  MOCK_DIVIDENDS,
} from "./mockData";
import { isSupabaseConfigured } from "./supabase";

export interface Transaction {
  id: string;
  companySymbol: string;
  type: "BUY" | "SELL";
  quantity: number;
  price: number;
  totalAmount: number;
  date: string;
  note?: string;
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
}

export interface AiAccuracyStats {
  total: number;
  evaluated: number;
  correct: number;
  incorrect: number;
  pending: number;
  accuracyRate: number;
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
  ) => void;

  // Notes
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
  evaluateAiOutcomes: () => void;
  aiAccuracyStats: AiAccuracyStats;
  aiProvider: string;
  aiApiKey: string;
  geminiModel: string;
  setAiSettings: (provider: string, apiKey?: string, model?: string) => void;

  // Live Market Sync & Indices
  indices: Record<string, MarketIndexData>;
  lastSyncTime: string;
  isRefreshing: boolean;
  refreshPrices: () => Promise<void>;
  updateInterval: string;
  setUpdateInterval: (interval: string) => void;
  usdRate: number;

  // Notifications
  notifications: NotificationItem[];
  markAllNotificationsRead: () => void;

  // Utilities & Cloud
  isCloudConnected: boolean;
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
  AI_PROVIDER: "defter_ai_provider",
  UPDATE_INTERVAL: "defter_update_interval",
  INDICES: "defter_indices_v2",
  USER_SETTINGS: "defter_user_settings_v2",
};

const DEFAULT_USER_SETTINGS: UserSettings = {
  userName: "Defter Sahibi",
  currency: "₺ TRY",
  priceAlerts: true,
  ipoAlerts: true,
  dividendAlerts: true,
  oracleAlerts: true,
};

const DEFAULT_INDICES: Record<string, MarketIndexData> = {
  "BIST 100": { price: 9840.5, dailyChange: 1.42, formattedPrice: "9.840,50", isPositive: true },
  "BIST 30": { price: 10720.1, dailyChange: 1.65, formattedPrice: "10.720,10", isPositive: true },
  "S&P 500": { price: 5648.4, dailyChange: 0.45, formattedPrice: "5.648,40", isPositive: true },
  "NASDAQ": { price: 17683.9, dailyChange: 0.84, formattedPrice: "17.683,90", isPositive: true },
};

function normalizeCompany(c: Record<string, unknown>): Company {
  const symbol = (c.symbol as string) || "";
  let assetClass: "hisse" | "maden" | "fon" | "doviz" = (c.assetClass || c.asset_class) as "hisse" | "maden" | "fon" | "doviz";
  if (!assetClass) {
    if (
      c.exchange === "Emtia" ||
      symbol.includes("ALTIN") ||
      symbol.includes("GÜMÜŞ") ||
      symbol.includes("PLATIN") ||
      ["CEYREK", "TAM", "ATA", "BRENT", "BAKIR"].includes(symbol)
    ) {
      assetClass = "maden";
    } else if (c.exchange === "Serbest Piyasa" || symbol.includes("USD") || symbol.includes("EUR") || symbol.includes("GBP")) {
      assetClass = "doviz";
    } else if (c.exchange === "TEFAS" || symbol.includes("FON") || symbol.includes("PORTFÖY")) {
      assetClass = "fon";
    } else {
      assetClass = "hisse";
    }
  }

  return {
    id: (c.id as string) || symbol.toLowerCase(),
    symbol,
    name: (c.name as string) || symbol,
    sector: (c.sector as string) || "Genel",
    exchange: (c.exchange as "BIST" | "ABD" | "Avrupa" | "Emtia" | "Döviz") || "BIST",
    assetClass,
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
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [indices, setIndices] = useState<Record<string, MarketIndexData>>(DEFAULT_INDICES);
  const [userSettings, setUserSettings] = useState<UserSettings>(DEFAULT_USER_SETTINGS);
  const [lastSyncTime, setLastSyncTime] = useState<string>("Şimdi");
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [usdRate, setUsdRate] = useState<number>(36.45);
  const [aiProvider, setAiProvider] = useState<string>("gemini");
  const [aiApiKey, setAiApiKey] = useState<string>("");
  const [geminiModel, setGeminiModel] = useState<string>("gemini-1.5-flash");
  const [isServerCloudConnected, setIsServerCloudConnected] = useState<boolean>(false);
  const [updateInterval, setUpdateIntervalState] = useState<string>("manual");

  const updateUserSettings = useCallback((partial: Partial<UserSettings>) => {
    setUserSettings((prev) => {
      const updated = { ...prev, ...partial };
      fetch("/api/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "update_user_settings", payload: updated }),
      }).catch();
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
                status: (i.status as "upcoming" | "active" | "completed") || "upcoming",
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
              dbAi.map((a: Record<string, unknown>) => ({
                id: (a.id as string) || "",
                date: (a.verdict_date as string) || new Date(a.created_at as string).toLocaleDateString("tr-TR"),
                type: (a.type as string) || "Şirket Değerleme",
                title: (a.title as string) || "",
                description: (a.description as string) || "",
                verdictTag: (a.verdict_tag as "AL" | "SAT" | "TUT" | "NÖTR" | "YÜKSEK RİSK" | "DENGELİ") || "TUT",
                symbol: (a.symbol as string) || undefined,
                verdict: (a.verdict as "AL" | "SAT" | "TUT" | "NÖTR" | "YÜKSEK RİSK" | "DENGELİ") || "TUT",
                verdictDate: (a.verdict_date as string) || "",
                priceAtVerdict: a.price_at_verdict ? Number(a.price_at_verdict) : undefined,
                priceAfterPeriod: a.price_after_period ? Number(a.price_after_period) : undefined,
                outcomeCheckedAt: (a.outcome_checked_at as string) || undefined,
                outcomeCorrect: typeof a.outcome_correct === "boolean" ? a.outcome_correct : undefined,
                targetPeriodDays: Number(a.target_period_days || 30),
              }))
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

        if (storedCompanies) {
          try {
            const parsed = JSON.parse(storedCompanies);
            if (Array.isArray(parsed) && parsed.length > 0) {
              const normalized = parsed.map(normalizeCompany);
              const existingSymbols = new Set(normalized.map((c) => c.symbol));
              const missing = MOCK_COMPANIES.filter((m) => !existingSymbols.has(m.symbol));
              setCompanies([...normalized, ...missing]);
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
        if (storedAi) setAiHistory(JSON.parse(storedAi));
        if (storedNotif) setNotifications(JSON.parse(storedNotif));
        if (storedProvider) setAiProvider(storedProvider);
        const storedApiKey = localStorage.getItem("defter_ai_api_key");
        if (storedApiKey) setAiApiKey(storedApiKey);
        const storedModel = localStorage.getItem("defter_gemini_model");
        if (storedModel) setGeminiModel(storedModel);
        if (storedInterval) setUpdateIntervalState(storedInterval);
        if (storedIndices) setIndices(JSON.parse(storedIndices));
        if (storedUserSettings) setUserSettings(JSON.parse(storedUserSettings));

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
    notifications,
    aiProvider,
    updateInterval,
    indices,
    userSettings,
  ]);

  // Recalculate basket totals dynamically
  const recalculatedBaskets = useMemo(() => {
    return baskets.map((basket) => {
      let totalVal = 0;
      let totalCst = 0;

      basket.holdings.forEach((h) => {
        const co = companies.find((c) => c.symbol === h.companySymbol);
        const curPrice = co ? co.price : h.currentPrice;
        totalVal += h.quantity * curPrice;
        totalCst += h.quantity * h.avgCost;
      });

      const profitPercent =
        totalCst > 0 ? ((totalVal - totalCst) / totalCst) * 100 : 0;

      return {
        ...basket,
        totalValue: Math.round(totalVal),
        totalCost: Math.round(totalCst),
        totalProfitPercent: parseFloat(profitPercent.toFixed(1)),
        holdings: basket.holdings.map((h) => {
          const co = companies.find((c) => c.symbol === h.companySymbol);
          return {
            ...h,
            currentPrice: co ? co.price : h.currentPrice,
          };
        }),
      };
    });
  }, [baskets, companies]);

  // Dynamic Dividends
  const computedDividends = useMemo<DividendItem[]>(() => {
    const symbolLots: Record<string, number> = {};
    recalculatedBaskets.forEach((b) => {
      b.holdings.forEach((h) => {
        symbolLots[h.companySymbol] =
          (symbolLots[h.companySymbol] || 0) + h.quantity;
      });
    });

    return MOCK_DIVIDENDS.map((div) => {
      const ownedQty = symbolLots[div.companySymbol] || 50;
      const estimatedTotal = ownedQty * div.netAmountPerShare;

      return {
        ...div,
        totalEstimatedPayout: parseFloat(estimatedTotal.toFixed(2)),
      };
    });
  }, [recalculatedBaskets]);

  // AI Accuracy Statistics Calculation
  const aiAccuracyStats = useMemo<AiAccuracyStats>(() => {
    const total = aiHistory.length;
    const evaluatedItems = aiHistory.filter((item) => item.outcomeCorrect !== null && item.outcomeCorrect !== undefined);
    const correct = evaluatedItems.filter((item) => item.outcomeCorrect === true).length;
    const incorrect = evaluatedItems.filter((item) => item.outcomeCorrect === false).length;
    const pending = total - evaluatedItems.length;
    const accuracyRate = evaluatedItems.length > 0 ? Math.round((correct / evaluatedItems.length) * 100) : 0;

    return {
      total,
      evaluated: evaluatedItems.length,
      correct,
      incorrect,
      pending,
      accuracyRate,
    };
  }, [aiHistory]);

  // Outcome Verification Engine (evaluates past AI predictions vs market movements)
  const evaluateAiOutcomes = useCallback((freshCompanies?: Company[]) => {
    const listToUse = freshCompanies || companies;
    setAiHistory((prev) =>
      prev.map((item) => {
        if (!item.symbol || !item.priceAtVerdict || item.outcomeCorrect !== null && item.outcomeCorrect !== undefined) {
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
        const priceDiffPercent = ((curPrice - item.priceAtVerdict) / item.priceAtVerdict) * 100;
        let isCorrect: boolean | null = null;

        const v = (item.verdict || item.verdictTag || "").toUpperCase();
        if (v.includes("AL")) {
          // If recommendation was BUY and price increased by >= 1% -> correct
          isCorrect = priceDiffPercent > 0.5;
        } else if (v.includes("SAT")) {
          // If recommendation was SELL and price dropped -> correct
          isCorrect = priceDiffPercent < -0.5;
        } else if (v.includes("TUT") || v.includes("DENGELİ") || v.includes("NÖTR")) {
          // If recommendation was HOLD and price stayed within range -> correct
          isCorrect = Math.abs(priceDiffPercent) <= 6.0;
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
                outcomeCheckedAt: new Date().toISOString(),
              },
            }),
          }).catch();

          return {
            ...item,
            outcomeCorrect: isCorrect,
            priceAfterPeriod: curPrice,
            outcomeCheckedAt: new Date().toISOString().split("T")[0],
          };
        }

        return item;
      })
    );
  }, [companies]);

  // Live Refresh Prices Action (Yahoo Finance API)
  const refreshPrices = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch("/api/prices");
      if (res.ok) {
        const data = await res.json();
        let freshList: Company[] | null = null;

        if (data.prices) {
          setCompanies((prev) => {
            const updated = prev.map((c) => {
              const live = data.prices[c.symbol];
              if (live) {
                return {
                  ...c,
                  price: live.price,
                  dailyChange: live.dailyChange,
                };
              }
              return c;
            });
            freshList = updated;
            return updated;
          });

          if (freshList) {
            const updatedComps = freshList as Company[];
            setBaskets((prevBaskets) =>
              prevBaskets.map((b) => recalculateBasket(b, updatedComps))
            );
            evaluateAiOutcomes(updatedComps);
          }
        }

        if (data.indices) {
          setIndices(data.indices);
        }

        if (data.prices && data.prices["USD/TRY"]) {
          setUsdRate(data.prices["USD/TRY"].price);
        }

        setLastSyncTime(data.formattedTime || "Şimdi");
      }
    } catch (e) {
      console.warn("Price sync failed:", e);
    } finally {
      setIsRefreshing(false);
    }
  }, [evaluateAiOutcomes]);

  // Periodic Auto-refresh
  useEffect(() => {
    if (updateInterval === "manual") return;
    const ms =
      updateInterval === "live"
        ? 15000
        : updateInterval === "15min"
        ? 15 * 60 * 1000
        : 60 * 60 * 1000;

    const timer = setInterval(() => {
      refreshPrices();
    }, ms);

    return () => clearInterval(timer);
  }, [updateInterval, refreshPrices]);

  // --- CRUD ACTIONS (Optimistic Updates + Background Supabase Sync) ---

  const addCompany = useCallback((company: Company) => {
    setCompanies((prev) => [company, ...prev]);
    fetch("/api/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "add_company", payload: company }),
    }).catch();
  }, []);

  const updateCompany = (symbol: string, partial: Partial<Company>) => {
    setCompanies((prev) =>
      prev.map((c) => (c.symbol === symbol ? { ...c, ...partial } : c))
    );
    fetch("/api/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "update_company", payload: { symbol, ...partial } }),
    }).catch();
  };

  const deleteCompany = (symbol: string) => {
    setCompanies((prev) => prev.filter((c) => c.symbol !== symbol));
    fetch("/api/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete_company", payload: { symbol } }),
    }).catch();
  };

  const toggleWatchlist = (symbol: string) => {
    let nextVal = false;
    setCompanies((prev) =>
      prev.map((c) => {
        if (c.symbol === symbol) {
          nextVal = !c.inWatchlist;
          return { ...c, inWatchlist: nextVal };
        }
        return c;
      })
    );
    fetch("/api/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "update_company", payload: { symbol, inWatchlist: nextVal } }),
    }).catch();
  };

  const createBasket = (newBasket: Basket) => {
    setBaskets((prev) => [...prev, newBasket]);
    fetch("/api/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "create_basket", payload: { basket: newBasket } }),
    }).catch();
  };

  const updateBasket = (id: string, partial: Partial<Basket>) => {
    setBaskets((prev) =>
      prev.map((b) => {
        if (b.id !== id) return b;
        const updated = { ...b, ...partial };
        fetch("/api/sync", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "update_basket",
            payload: { basket: updated },
          }),
        }).catch((err) => console.warn("[Sync] update basket error:", err));
        return updated;
      })
    );
  };

  const deleteBasket = (id: string) => {
    setBaskets((prev) => prev.filter((b) => b.id !== id));
    fetch("/api/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "delete_basket",
        payload: { id },
      }),
    }).catch((err) => console.warn("[Sync] delete basket error:", err));
  };

  const addHoldingToBasket = (basketId: string, holding: BasketHolding) => {
    setBaskets((prev) =>
      prev.map((b) => {
        if (b.id !== basketId) return b;
        const exists = b.holdings.find(
          (h) => h.companySymbol === holding.companySymbol
        );
        let newHoldings: BasketHolding[];
        if (exists) {
          const newQty = exists.quantity + holding.quantity;
          const newAvgCost =
            newQty > 0
              ? parseFloat(
                  (
                    (exists.quantity * exists.avgCost + holding.quantity * holding.avgCost) /
                    newQty
                  ).toFixed(2)
                )
              : holding.avgCost;

          newHoldings = b.holdings.map((h) =>
            h.companySymbol === holding.companySymbol
              ? {
                  ...h,
                  quantity: newQty,
                  avgCost: newAvgCost,
                }
              : h
          );
        } else {
          newHoldings = [...b.holdings, holding];
        }
        const updatedB = recalculateBasket({ ...b, holdings: newHoldings }, companies);

        const targetH = updatedB.holdings.find((h) => h.companySymbol === holding.companySymbol);
        fetch("/api/sync", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "upsert_holding",
            payload: {
              basketId: b.id,
              companySymbol: holding.companySymbol,
              weightPercent: targetH?.weightPercent || 0,
              quantity: targetH ? targetH.quantity : 0,
              avgCost: targetH ? targetH.avgCost : holding.avgCost,
            },
          }),
        }).catch((err) => console.warn("[Sync] upsert holding error:", err));

        fetch("/api/sync", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "update_basket",
            payload: { basket: updatedB },
          }),
        }).catch((err) => console.warn("[Sync] update basket error:", err));

        return updatedB;
      })
    );
  };

  const removeHoldingFromBasket = (basketId: string, symbol: string) => {
    setBaskets((prev) =>
      prev.map((b) => {
        if (b.id !== basketId) return b;
        const newHoldings = b.holdings.filter((h) => h.companySymbol !== symbol);
        const updatedB = recalculateBasket({ ...b, holdings: newHoldings }, companies);

        fetch("/api/sync", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "delete_holding",
            payload: { basketId, companySymbol: symbol },
          }),
        }).catch((err) => console.warn("[Sync] delete holding error:", err));

        fetch("/api/sync", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "update_basket",
            payload: { basket: updatedB },
          }),
        }).catch((err) => console.warn("[Sync] update basket error:", err));

        return updatedB;
      })
    );
  };

  const updateHolding = (
    basketId: string,
    symbol: string,
    updates: Partial<BasketHolding>
  ) => {
    setBaskets((prev) =>
      prev.map((b) => {
        if (b.id !== basketId) return b;
        const newHoldings = b.holdings.map((h) =>
          h.companySymbol === symbol ? { ...h, ...updates } : h
        );
        const updatedB = recalculateBasket({ ...b, holdings: newHoldings }, companies);

        const updatedH = updatedB.holdings.find((h) => h.companySymbol === symbol);
        if (updatedH) {
          fetch("/api/sync", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              action: "upsert_holding",
              payload: {
                basketId,
                companySymbol: symbol,
                weightPercent: updatedH.weightPercent,
                quantity: updatedH.quantity,
                avgCost: updatedH.avgCost,
              },
            }),
          }).catch((err) => console.warn("[Sync] upsert holding error:", err));
        }

        fetch("/api/sync", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "update_basket",
            payload: { basket: updatedB },
          }),
        }).catch((err) => console.warn("[Sync] update basket error:", err));

        return updatedB;
      })
    );
  };

  const addTransaction = (
    tx: Omit<Transaction, "id">,
    targetBasketId?: string
  ) => {
    if (!targetBasketId) {
      console.warn("addTransaction: targetBasketId is required");
      return;
    }
    const basketToUpdate = baskets.find((b) => b.id === targetBasketId);
    if (!basketToUpdate) {
      console.warn("addTransaction: Target basket not found:", targetBasketId);
      return;
    }

    const newTx: Transaction = {
      ...tx,
      id: `tx-${Date.now()}`,
    };
    setTransactions((prev) => [newTx, ...prev]);

    fetch("/api/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "add_transaction", payload: newTx }),
    }).catch();

    setBaskets((prev) =>
      prev.map((b) => {
        if (b.id !== basketToUpdate.id) return b;

        const existingHolding = b.holdings.find(
          (h) => h.companySymbol === tx.companySymbol
        );

        let newHoldings = [...b.holdings];

        if (tx.type === "BUY") {
          if (existingHolding) {
            const oldQty = existingHolding.quantity;
            const oldCost = existingHolding.avgCost;
            const newQty = oldQty + tx.quantity;
            const newAvgCost =
              newQty > 0
                ? (oldQty * oldCost + tx.quantity * tx.price) / newQty
                : tx.price;

            newHoldings = b.holdings.map((h) =>
              h.companySymbol === tx.companySymbol
                ? {
                    ...h,
                    quantity: newQty,
                    avgCost: parseFloat(newAvgCost.toFixed(2)),
                  }
                : h
            );
          } else {
            newHoldings = [
              ...b.holdings,
              {
                companySymbol: tx.companySymbol,
                weightPercent: 0,
                quantity: tx.quantity,
                avgCost: tx.price,
                currentPrice: tx.price,
              },
            ];
          }
        } else if (tx.type === "SELL" && existingHolding) {
          const newQty = Math.max(0, existingHolding.quantity - tx.quantity);
          if (newQty === 0) {
            newHoldings = b.holdings.filter((h) => h.companySymbol !== tx.companySymbol);
          } else {
            newHoldings = b.holdings.map((h) =>
              h.companySymbol === tx.companySymbol
                ? { ...h, quantity: newQty }
                : h
            );
          }
        }

        const updatedB = recalculateBasket({ ...b, holdings: newHoldings }, companies);

        const targetH = updatedB.holdings.find((h) => h.companySymbol === tx.companySymbol);
        fetch("/api/sync", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "update_basket_holding",
            payload: {
              basketId: b.id,
              companySymbol: tx.companySymbol,
              weightPercent: targetH ? targetH.weightPercent : 0,
              quantity: targetH ? targetH.quantity : 0,
              avgCost: targetH ? targetH.avgCost : tx.price,
            },
          }),
        }).catch((err) => console.warn("[Sync] transaction holding sync error:", err));

        fetch("/api/sync", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "update_basket",
            payload: { basket: updatedB },
          }),
        }).catch((err) => console.warn("[Sync] transaction basket sync error:", err));

        return updatedB;
      })
    );
  };

  const addNote = (symbol: string, noteText: string) => {
    setCompanyNotes((prev) => ({
      ...prev,
      [symbol]: [noteText, ...(prev[symbol] || [])],
    }));
  };

  const deleteNote = (symbol: string, index: number) => {
    setCompanyNotes((prev) => {
      const current = prev[symbol] || [];
      const updated = current.filter((_, i) => i !== index);
      return {
        ...prev,
        [symbol]: updated,
      };
    });
  };

  const addAiHistory = useCallback((item: AiHistoryItem) => {
    setAiHistory((prev) => [item, ...prev]);
    fetch("/api/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "add_ai_history", payload: item }),
    }).catch();
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
      setNotifications((prev) => [newNotif, ...prev]);
    },
    [companies, addCompany]
  );

  const addIpo = useCallback(
    (ipo: IpoItem, autoAddToLedger = true) => {
      setIpos((prev) => [ipo, ...prev]);

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
    },
    []
  );

  const deleteIpo = useCallback(
    (id: string) => {
      setIpos((prev) => prev.filter((i) => i.id !== id));
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

  const setAiSettings = (provider: string, apiKey?: string, model?: string) => {
    setAiProvider(provider);
    if (apiKey !== undefined) {
      setAiApiKey(apiKey);
      try {
        localStorage.setItem("defter_ai_api_key", apiKey);
      } catch {}
    }
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
    }).catch();
  };

  const resetToDefaultData = () => {
    setCompanies(MOCK_COMPANIES);
    setBaskets(MOCK_BASKETS);
    setIpos(MOCK_IPOS);
    setAiHistory(MOCK_AI_HISTORY);
    setNotifications(MOCK_NOTIFICATIONS);
    setIndices(DEFAULT_INDICES);
    setCompanyNotes({
      THYAO: [
        "Q3 bilanço rekor yolcu geliri içeriyor.",
        "Kargo tarafında %18 yıllık büyüme var.",
      ],
      ASELS: ["Savunma Sanayii Başkanlığı ile 450M TL sözleşme imzalandı."],
      FROTO: ["Yıllık düzenli temettü dağıtım politikası."],
    });
    localStorage.clear();
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

  return (
    <DefterStoreContext.Provider
      value={{
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
        evaluateAiOutcomes,
        aiAccuracyStats,
        aiProvider,
        aiApiKey,
        geminiModel,
        setAiSettings,
        indices,
        lastSyncTime,
        isRefreshing,
        refreshPrices,
        updateInterval,
        setUpdateInterval,
        usdRate,
        notifications,
        markAllNotificationsRead,
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
