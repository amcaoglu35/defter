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
import { supabase, isSupabaseConfigured } from "./supabaseClient";

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

export interface AiAccuracyStats {
  total: number;
  evaluated: number;
  correct: number;
  incorrect: number;
  pending: number;
  accuracyRate: number;
}

interface DefterStoreContextType {
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
  apiKey: string;
  setAiSettings: (provider: string, key: string) => void;

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
  AI_KEY: "defter_ai_key",
  UPDATE_INTERVAL: "defter_update_interval",
  INDICES: "defter_indices_v2",
};

const DEFAULT_INDICES: Record<string, MarketIndexData> = {
  "BIST 100": { price: 9840.5, dailyChange: 1.42, formattedPrice: "9.840,50", isPositive: true },
  "BIST 30": { price: 10720.1, dailyChange: 1.65, formattedPrice: "10.720,10", isPositive: true },
  "S&P 500": { price: 5648.4, dailyChange: 0.45, formattedPrice: "5.648,40", isPositive: true },
  "NASDAQ": { price: 17683.9, dailyChange: 0.84, formattedPrice: "17.683,90", isPositive: true },
};

function normalizeCompany(c: any): Company {
  const symbol = c.symbol || "";
  let assetClass: "hisse" | "maden" | "fon" | "doviz" = c.assetClass || c.asset_class;
  if (!assetClass) {
    if (
      c.exchange === "Emtia" ||
      symbol.includes("ALTIN") ||
      symbol.includes("GÜMÜŞ") ||
      symbol.includes("PLATIN") ||
      ["CEYREK", "TAM", "ATA", "BRENT", "BAKIR"].includes(symbol)
    ) {
      assetClass = "maden";
    } else if (c.exchange === "Döviz" || symbol.includes("/TRY") || symbol.includes("/USD")) {
      assetClass = "doviz";
    } else if (
      c.sector?.includes("Fon") ||
      ["AFT", "TTE", "MAC", "QQQ", "SPY", "GLD"].includes(symbol)
    ) {
      assetClass = "fon";
    } else {
      assetClass = "hisse";
    }
  }

  return {
    id: c.id || symbol.toLowerCase(),
    symbol: symbol,
    name: c.name || symbol,
    sector: c.sector || "Genel",
    exchange: c.exchange || "BIST",
    assetClass: assetClass,
    indexTag: c.indexTag || c.index_tag || (c.exchange === "ABD" ? "S&P 500" : "BIST 100"),
    price: Number(c.price || 0),
    currency: c.currency || (c.exchange === "ABD" ? "$" : "₺"),
    dailyChange: Number(c.dailyChange ?? c.daily_change ?? 0),
    peRatio: c.peRatio ?? (c.pe_ratio ? Number(c.pe_ratio) : undefined),
    pbRatio: c.pbRatio ?? (c.pb_ratio ? Number(c.pb_ratio) : undefined),
    dividendYield: Number(c.dividendYield ?? c.dividend_yield ?? 0),
    marketCap: c.marketCap || c.market_cap,
    beta: c.beta ? Number(c.beta) : undefined,
    recommendation: c.recommendation || "TUT",
    inWatchlist: Boolean(c.inWatchlist ?? c.in_watchlist),
    description: c.description || "",
    metrics: c.metrics || [],
  };
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [isLoaded, setIsLoaded] = useState(false);

  // States
  const [companies, setCompanies] = useState<Company[]>(MOCK_COMPANIES);
  const [baskets, setBaskets] = useState<Basket[]>(MOCK_BASKETS);
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: "tx-1",
      companySymbol: "THYAO",
      type: "BUY",
      quantity: 150,
      price: 235.0,
      totalAmount: 35250,
      date: "2026-06-15",
      note: "Portföy ilk giriş",
    },
  ]);
  const [companyNotes, setCompanyNotes] = useState<Record<string, string[]>>({
    THYAO: [
      "Kargo birimi büyümesi devam ediyor.",
      "Yolcu doluluk oranı %84.5 olarak açıklandı.",
    ],
    ASELS: ["Savunma Sanayii Başkanlığı ile 450M TL sözleşme imzalandı."],
  });
  const [ipos, setIpos] = useState<IpoItem[]>(MOCK_IPOS);
  const [aiHistory, setAiHistory] = useState<AiHistoryItem[]>(MOCK_AI_HISTORY);
  const [notifications, setNotifications] =
    useState<NotificationItem[]>(MOCK_NOTIFICATIONS);

  // Live Sync, Indices & AI Settings
  const [indices, setIndices] = useState<Record<string, MarketIndexData>>(DEFAULT_INDICES);
  const [lastSyncTime, setLastSyncTime] = useState<string>("Canlı");
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [usdRate, setUsdRate] = useState<number>(36.45);
  const [aiProvider, setAiProvider] = useState<string>("gemini");
  const [apiKey, setApiKey] = useState<string>("");
  const [updateInterval, setUpdateIntervalState] = useState<string>("manual");

  // 1. Initial Load: Try Supabase first if configured, else fallback to localStorage
  const syncWithSupabase = useCallback(async () => {
    if (!isSupabaseConfigured || !supabase) return;

    try {
      // Fetch Companies
      const { data: dbCompanies, error: compErr } = await supabase
        .from("companies")
        .select("*");

      if (!compErr && dbCompanies) {
        const dbMapped = dbCompanies.map(normalizeCompany);
        const dbSymbols = new Set(dbMapped.map((c) => c.symbol));
        const missingFromDb = MOCK_COMPANIES.filter((m) => !dbSymbols.has(m.symbol));
        const fullCompanies = [...dbMapped, ...missingFromDb];

        setCompanies(fullCompanies);

        // Auto-seed missing assets to Supabase
        if (missingFromDb.length > 0) {
          const client = supabase;
          if (client) {
            const toInsert = missingFromDb.map((m) => ({
              id: m.id,
              symbol: m.symbol,
              name: m.name,
              sector: m.sector,
              exchange: m.exchange,
              asset_class: m.assetClass,
              index_tag: m.indexTag,
              price: m.price,
              currency: m.currency,
              daily_change: m.dailyChange,
              pe_ratio: m.peRatio,
              pb_ratio: m.pbRatio,
              dividend_yield: m.dividendYield,
              market_cap: m.marketCap,
              beta: m.beta,
              recommendation: m.recommendation,
              in_watchlist: m.inWatchlist,
              description: m.description,
            }));
            client.from("companies").upsert(toInsert, { onConflict: "symbol" }).then(({ error }) => {
              if (!error) console.log(`Auto-seeded ${missingFromDb.length} assets to Supabase.`);
            });
          }
        }
      }

      // Fetch Baskets & Holdings
      const { data: dbBaskets, error: basketErr } = await supabase
        .from("baskets")
        .select("*, basket_holdings(*)");

      if (!basketErr && dbBaskets && dbBaskets.length > 0) {
        setBaskets(
          dbBaskets.map((b: any) => ({
            id: b.id,
            name: b.name,
            subtitle: b.subtitle || "",
            riskLevel: b.risk_level || "Orta",
            riskColor: b.risk_color || "mid",
            totalValue: Number(b.total_value || 0),
            totalCost: Number(b.total_cost || 0),
            dailyChange: Number(b.daily_change || 0),
            totalProfitPercent: Number(b.total_profit_percent || 0),
            description: b.description || "",
            aiNote: b.ai_note || "",
            holdings: (b.basket_holdings || []).map((h: any) => ({
              companySymbol: h.company_symbol,
              weightPercent: Number(h.weight_percent || 0),
              quantity: Number(h.quantity || 0),
              avgCost: Number(h.avg_cost || 0),
              currentPrice: Number(h.avg_cost || 0),
            })),
          }))
        );
      }

      // Fetch Transactions
      const { data: dbTx, error: txErr } = await supabase
        .from("transactions")
        .select("*")
        .order("created_at", { ascending: false });

      if (!txErr && dbTx && dbTx.length > 0) {
        setTransactions(
          dbTx.map((t: any) => ({
            id: t.id,
            companySymbol: t.company_symbol,
            type: t.type,
            quantity: Number(t.quantity),
            price: Number(t.price),
            totalAmount: Number(t.total_amount),
            date: t.date,
            note: t.note,
          }))
        );
      }

      // Fetch IPOs
      const { data: dbIpos, error: ipoErr } = await supabase
        .from("ipos")
        .select("*")
        .order("created_at", { ascending: false });

      if (!ipoErr && dbIpos && dbIpos.length > 0) {
        setIpos(
          dbIpos.map((i: any) => ({
            id: i.id,
            code: i.code,
            name: i.name,
            sector: i.sector,
            status: i.status || "upcoming",
            dateRange: i.date_range,
            priceRange: i.price_range,
            distributionType: i.allocation_method || "Bireysele Eşit",
            leadManager: i.broker || "",
            lotAmount: i.offering_size || "",
            fundSize: i.offering_size || "",
            ceilingStreak: i.ceiling_days || 0,
          }))
        );
      }

      // Fetch AI History
      const { data: dbAi, error: aiErr } = await supabase
        .from("ai_history")
        .select("*")
        .order("created_at", { ascending: false });

      if (!aiErr && dbAi && dbAi.length > 0) {
        setAiHistory(
          dbAi.map((a: any) => ({
            id: a.id,
            date: a.verdict_date || new Date(a.created_at).toLocaleDateString("tr-TR"),
            type: a.type || "Şirket Değerleme",
            title: a.title,
            description: a.description,
            verdictTag: a.verdict_tag,
            symbol: a.symbol,
            verdict: a.verdict,
            verdictDate: a.verdict_date,
            priceAtVerdict: a.price_at_verdict ? Number(a.price_at_verdict) : undefined,
            priceAfterPeriod: a.price_after_period ? Number(a.price_after_period) : undefined,
            outcomeCheckedAt: a.outcome_checked_at,
            outcomeCorrect: a.outcome_correct,
            targetPeriodDays: a.target_period_days || 30,
          }))
        );
      }
    } catch (err) {
      console.warn("Supabase hydration failed, using local/fallback store:", err);
    }
  }, []);

  useEffect(() => {
    try {
      const storedCompanies = localStorage.getItem(STORAGE_KEYS.COMPANIES);
      const storedBaskets = localStorage.getItem(STORAGE_KEYS.BASKETS);
      const storedTx = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      const storedNotes = localStorage.getItem(STORAGE_KEYS.NOTES);
      const storedIpos = localStorage.getItem(STORAGE_KEYS.IPOS);
      const storedAi = localStorage.getItem(STORAGE_KEYS.AI_HISTORY);
      const storedNotif = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      const storedProvider = localStorage.getItem(STORAGE_KEYS.AI_PROVIDER);
      const storedKey = localStorage.getItem(STORAGE_KEYS.AI_KEY);
      const storedInterval = localStorage.getItem(STORAGE_KEYS.UPDATE_INTERVAL);
      const storedIndices = localStorage.getItem(STORAGE_KEYS.INDICES);

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
            const existingCodes = new Set(parsed.map((p: any) => p.code));
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
      if (storedKey) setApiKey(storedKey);
      if (storedInterval) setUpdateIntervalState(storedInterval);
      if (storedIndices) setIndices(JSON.parse(storedIndices));

      setLastSyncTime(
        new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })
      );

      // Trigger background sync if Supabase is connected
      if (isSupabaseConfigured) {
        syncWithSupabase();
      }
    } catch (e) {
      console.warn("Could not load from localStorage:", e);
    } finally {
      setIsLoaded(true);
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
      localStorage.setItem(STORAGE_KEYS.AI_KEY, apiKey);
      localStorage.setItem(STORAGE_KEYS.UPDATE_INTERVAL, updateInterval);
      localStorage.setItem(STORAGE_KEYS.INDICES, JSON.stringify(indices));
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
    apiKey,
    updateInterval,
    indices,
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
  const evaluateAiOutcomes = useCallback(() => {
    setAiHistory((prev) =>
      prev.map((item) => {
        if (!item.symbol || !item.priceAtVerdict || item.outcomeCorrect !== null && item.outcomeCorrect !== undefined) {
          return item;
        }

        const co = companies.find((c) => c.symbol === item.symbol);
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
          // Sync update to Supabase if connected
          if (isSupabaseConfigured && supabase) {
            supabase
              .from("ai_history")
              .update({
                outcome_correct: isCorrect,
                price_after_period: curPrice,
                outcome_checked_at: new Date().toISOString(),
              })
              .eq("id", item.id)
              .then();
          }

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
  const refreshPrices = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch("/api/prices");
      if (res.ok) {
        const data = await res.json();
        if (data.prices) {
          setCompanies((prev) =>
            prev.map((c) => {
              const live = data.prices[c.symbol];
              if (live) {
                return {
                  ...c,
                  price: live.price,
                  dailyChange: live.dailyChange,
                };
              }
              return c;
            })
          );
        }

        if (data.indices) {
          setIndices(data.indices);
        }

        if (data.prices && data.prices["USD/TRY"]) {
          setUsdRate(data.prices["USD/TRY"].price);
        }

        setLastSyncTime(data.formattedTime || "Şimdi");

        // Run outcome evaluation after prices are refreshed
        evaluateAiOutcomes();
      }
    } catch (e) {
      console.warn("Price sync failed:", e);
    } finally {
      setIsRefreshing(false);
    }
  };

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
  }, [updateInterval]);

  // --- CRUD ACTIONS (Optimistic Updates + Background Supabase Sync) ---

  const addCompany = (company: Company) => {
    setCompanies((prev) => [company, ...prev]);

    if (isSupabaseConfigured && supabase) {
      supabase
        .from("companies")
        .upsert({
          id: company.id,
          symbol: company.symbol,
          name: company.name,
          sector: company.sector,
          exchange: company.exchange,
          asset_class: company.assetClass,
          index_tag: company.indexTag,
          price: company.price,
          currency: company.currency,
          daily_change: company.dailyChange,
          pe_ratio: company.peRatio,
          pb_ratio: company.pbRatio,
          dividend_yield: company.dividendYield,
          market_cap: company.marketCap,
          beta: company.beta,
          recommendation: company.recommendation,
          in_watchlist: company.inWatchlist,
          description: company.description,
        })
        .then();
    }
  };

  const updateCompany = (symbol: string, partial: Partial<Company>) => {
    setCompanies((prev) =>
      prev.map((c) => (c.symbol === symbol ? { ...c, ...partial } : c))
    );

    if (isSupabaseConfigured && supabase) {
      const dbPayload: any = {};
      if (partial.price !== undefined) dbPayload.price = partial.price;
      if (partial.dailyChange !== undefined) dbPayload.daily_change = partial.dailyChange;
      if (partial.recommendation !== undefined) dbPayload.recommendation = partial.recommendation;
      if (partial.inWatchlist !== undefined) dbPayload.in_watchlist = partial.inWatchlist;

      supabase
        .from("companies")
        .update(dbPayload)
        .eq("symbol", symbol)
        .then();
    }
  };

  const deleteCompany = (symbol: string) => {
    setCompanies((prev) => prev.filter((c) => c.symbol !== symbol));

    if (isSupabaseConfigured && supabase) {
      supabase.from("companies").delete().eq("symbol", symbol).then();
    }
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

    if (isSupabaseConfigured && supabase) {
      supabase
        .from("companies")
        .update({ in_watchlist: nextVal })
        .eq("symbol", symbol)
        .then();
    }
  };

  const createBasket = (newBasket: Basket) => {
    setBaskets((prev) => [...prev, newBasket]);

    if (isSupabaseConfigured && supabase) {
      const client = supabase;
      client
        .from("baskets")
        .insert({
          id: newBasket.id,
          name: newBasket.name,
          subtitle: newBasket.subtitle,
          risk_level: newBasket.riskLevel,
          risk_color: newBasket.riskColor,
          total_value: newBasket.totalValue,
          total_cost: newBasket.totalCost,
          daily_change: newBasket.dailyChange,
          total_profit_percent: newBasket.totalProfitPercent,
          description: newBasket.description,
          ai_note: newBasket.aiNote,
        })
        .then(() => {
          if (newBasket.holdings && newBasket.holdings.length > 0) {
            const holdingsPayload = newBasket.holdings.map((h) => ({
              basket_id: newBasket.id,
              company_symbol: h.companySymbol,
              weight_percent: h.weightPercent,
              quantity: h.quantity,
              avg_cost: h.avgCost,
            }));
            client.from("basket_holdings").insert(holdingsPayload).then();
          }
        });
    }
  };

  const updateBasket = (id: string, partial: Partial<Basket>) => {
    setBaskets((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...partial } : b))
    );

    if (isSupabaseConfigured && supabase) {
      const payload: any = {};
      if (partial.name) payload.name = partial.name;
      if (partial.subtitle) payload.subtitle = partial.subtitle;
      if (partial.riskLevel) payload.risk_level = partial.riskLevel;
      if (partial.description) payload.description = partial.description;

      supabase.from("baskets").update(payload).eq("id", id).then();
    }
  };

  const deleteBasket = (id: string) => {
    setBaskets((prev) => prev.filter((b) => b.id !== id));

    if (isSupabaseConfigured && supabase) {
      supabase.from("baskets").delete().eq("id", id).then();
    }
  };

  const addHoldingToBasket = (basketId: string, holding: BasketHolding) => {
    setBaskets((prev) =>
      prev.map((b) => {
        if (b.id !== basketId) return b;
        const exists = b.holdings.find(
          (h) => h.companySymbol === holding.companySymbol
        );
        if (exists) {
          return {
            ...b,
            holdings: b.holdings.map((h) =>
              h.companySymbol === holding.companySymbol
                ? {
                    ...h,
                    quantity: h.quantity + holding.quantity,
                    weightPercent: holding.weightPercent || h.weightPercent,
                  }
                : h
            ),
          };
        }
        return {
          ...b,
          holdings: [...b.holdings, holding],
        };
      })
    );

    if (isSupabaseConfigured && supabase) {
      supabase
        .from("basket_holdings")
        .upsert({
          basket_id: basketId,
          company_symbol: holding.companySymbol,
          weight_percent: holding.weightPercent,
          quantity: holding.quantity,
          avg_cost: holding.avgCost,
        })
        .then();
    }
  };

  const removeHoldingFromBasket = (basketId: string, symbol: string) => {
    setBaskets((prev) =>
      prev.map((b) => {
        if (b.id !== basketId) return b;
        return {
          ...b,
          holdings: b.holdings.filter((h) => h.companySymbol !== symbol),
        };
      })
    );

    if (isSupabaseConfigured && supabase) {
      supabase
        .from("basket_holdings")
        .delete()
        .match({ basket_id: basketId, company_symbol: symbol })
        .then();
    }
  };

  const updateHolding = (
    basketId: string,
    symbol: string,
    updates: Partial<BasketHolding>
  ) => {
    setBaskets((prev) =>
      prev.map((b) => {
        if (b.id !== basketId) return b;
        return {
          ...b,
          holdings: b.holdings.map((h) =>
            h.companySymbol === symbol ? { ...h, ...updates } : h
          ),
        };
      })
    );

    if (isSupabaseConfigured && supabase) {
      const payload: any = {};
      if (updates.quantity !== undefined) payload.quantity = updates.quantity;
      if (updates.avgCost !== undefined) payload.avg_cost = updates.avgCost;
      if (updates.weightPercent !== undefined) payload.weight_percent = updates.weightPercent;

      supabase
        .from("basket_holdings")
        .update(payload)
        .match({ basket_id: basketId, company_symbol: symbol })
        .then();
    }
  };

  const addTransaction = (
    tx: Omit<Transaction, "id">,
    targetBasketId?: string
  ) => {
    const newTx: Transaction = {
      ...tx,
      id: `tx-${Date.now()}`,
    };
    setTransactions((prev) => [newTx, ...prev]);

    if (isSupabaseConfigured && supabase) {
      supabase
        .from("transactions")
        .insert({
          company_symbol: tx.companySymbol,
          type: tx.type,
          quantity: tx.quantity,
          price: tx.price,
          total_amount: tx.totalAmount,
          date: tx.date,
          note: tx.note,
        })
        .then();
    }

    const basketToUpdate = targetBasketId
      ? baskets.find((b) => b.id === targetBasketId)
      : baskets[0];

    if (basketToUpdate) {
      setBaskets((prev) =>
        prev.map((b) => {
          if (b.id !== basketToUpdate.id) return b;

          const existingHolding = b.holdings.find(
            (h) => h.companySymbol === tx.companySymbol
          );

          if (tx.type === "BUY") {
            if (existingHolding) {
              const oldQty = existingHolding.quantity;
              const oldCost = existingHolding.avgCost;
              const newQty = oldQty + tx.quantity;
              const newAvgCost =
                newQty > 0
                  ? (oldQty * oldCost + tx.quantity * tx.price) / newQty
                  : tx.price;

              return {
                ...b,
                holdings: b.holdings.map((h) =>
                  h.companySymbol === tx.companySymbol
                    ? {
                        ...h,
                        quantity: newQty,
                        avgCost: parseFloat(newAvgCost.toFixed(2)),
                      }
                    : h
                ),
              };
            } else {
              return {
                ...b,
                holdings: [
                  ...b.holdings,
                  {
                    companySymbol: tx.companySymbol,
                    weightPercent: 15,
                    quantity: tx.quantity,
                    avgCost: tx.price,
                    currentPrice: tx.price,
                  },
                ],
              };
            }
          } else if (tx.type === "SELL" && existingHolding) {
            const newQty = Math.max(0, existingHolding.quantity - tx.quantity);
            return {
              ...b,
              holdings: b.holdings.map((h) =>
                h.companySymbol === tx.companySymbol
                  ? { ...h, quantity: newQty }
                  : h
              ),
            };
          }

          return b;
        })
      );
    }
  };

  const addNote = (symbol: string, noteText: string) => {
    setCompanyNotes((prev) => ({
      ...prev,
      [symbol]: [noteText, ...(prev[symbol] || [])],
    }));

    if (isSupabaseConfigured && supabase) {
      supabase
        .from("notes")
        .insert({
          company_symbol: symbol,
          note_text: noteText,
        })
        .then();
    }
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

  const addAiHistory = (item: AiHistoryItem) => {
    setAiHistory((prev) => [item, ...prev]);

    if (isSupabaseConfigured && supabase) {
      supabase
        .from("ai_history")
        .insert({
          id: item.id,
          symbol: item.symbol || null,
          type: item.type,
          title: item.title,
          description: item.description,
          verdict: item.verdict || item.verdictTag || "TUT",
          verdict_tag: item.verdictTag,
          verdict_date: item.verdictDate || new Date().toISOString().split("T")[0],
          price_at_verdict: item.priceAtVerdict || null,
          price_after_period: item.priceAfterPeriod || null,
          outcome_correct: item.outcomeCorrect ?? null,
          target_period_days: item.targetPeriodDays || 30,
        })
        .then();
    }
  };

  const syncIpoToLedger = useCallback(
    (ipo: IpoItem) => {
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
        peRatio: 10.5,
        pbRatio: 2.1,
        dividendYield: 0.0,
        marketCap: ipo.fundSize || "2 Mr ₺",
        beta: 1.05,
        recommendation: "AL",
        inWatchlist: true,
        description: `${ipo.name} (${ipo.code}), SPK onaylı halka arz sürecinin ardından Borsa İstanbul kütüğüne kaydedilen yeni şirket.`,
        metrics: [
          { label: "Halka Arz Fiyatı", value: ipo.priceRange },
          { label: "Dağıtım Yöntemi", value: ipo.distributionType || "Bireysele Eşit" },
        ],
      };

      addCompany(newCo);

      // Add instant notification
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

      if (isSupabaseConfigured && supabase) {
        supabase
          .from("notifications")
          .insert({
            id: notifId,
            type: newNotif.type,
            title: newNotif.title,
            message: newNotif.message,
            time: newNotif.time,
            read: false,
          })
          .then();
      }
    },
    [companies, addCompany, isSupabaseConfigured]
  );

  const addIpo = useCallback(
    (ipo: IpoItem, autoAddToLedger = true) => {
      setIpos((prev) => [ipo, ...prev]);

      if (isSupabaseConfigured && supabase) {
        supabase
          .from("ipos")
          .upsert({
            id: ipo.id,
            name: ipo.name,
            code: ipo.code,
            sector: ipo.sector,
            date_range: ipo.dateRange,
            price_range: ipo.priceRange,
            offering_size: ipo.fundSize,
            allocation_method: ipo.distributionType || "Bireysele Eşit",
            broker: ipo.leadManager || null,
            status: ipo.status,
            ceiling_days: ipo.ceilingStreak || 0,
          })
          .then();
      }

      if (autoAddToLedger) {
        syncIpoToLedger(ipo);
      }
    },
    [isSupabaseConfigured, syncIpoToLedger]
  );

  const updateIpo = useCallback(
    (id: string, partial: Partial<IpoItem>) => {
      setIpos((prev) =>
        prev.map((i) => (i.id === id ? { ...i, ...partial } : i))
      );

      if (isSupabaseConfigured && supabase) {
        const payload: any = {};
        if (partial.name) payload.name = partial.name;
        if (partial.code) payload.code = partial.code;
        if (partial.sector) payload.sector = partial.sector;
        if (partial.status) payload.status = partial.status;
        if (partial.dateRange) payload.date_range = partial.dateRange;
        if (partial.priceRange) payload.price_range = partial.priceRange;
        if (partial.fundSize) payload.offering_size = partial.fundSize;
        if (partial.distributionType) payload.allocation_method = partial.distributionType;
        if (partial.leadManager) payload.broker = partial.leadManager;
        if (partial.ceilingStreak !== undefined) payload.ceiling_days = partial.ceilingStreak;

        supabase.from("ipos").update(payload).eq("id", id).then();
      }
    },
    [isSupabaseConfigured]
  );

  const deleteIpo = useCallback(
    (id: string) => {
      setIpos((prev) => prev.filter((i) => i.id !== id));

      if (isSupabaseConfigured && supabase) {
        supabase.from("ipos").delete().eq("id", id).then();
      }
    },
    [isSupabaseConfigured]
  );

  const autoSyncNewIpos = useCallback(async () => {
    let addedCount = 0;
    const existingSymbols = new Set(
      companies.map((c) => c.symbol.toUpperCase())
    );

    for (const ipo of ipos) {
      if (!existingSymbols.has(ipo.code.toUpperCase())) {
        syncIpoToLedger(ipo);
        existingSymbols.add(ipo.code.toUpperCase());
        addedCount++;
      }
    }

    return addedCount;
  }, [ipos, companies, syncIpoToLedger]);

  const setAiSettings = (provider: string, key: string) => {
    setAiProvider(provider);
    setApiKey(key);
  };

  const setUpdateInterval = (interval: string) => {
    setUpdateIntervalState(interval);
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

    if (isSupabaseConfigured && supabase) {
      supabase.from("notifications").update({ read: true }).neq("read", true).then();
    }
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
        apiKey,
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
        isCloudConnected: isSupabaseConfigured,
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
