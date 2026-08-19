import { NextResponse } from "next/server";
import YahooFinance from "yahoo-finance2";
import { Ticker, Fund } from "@muhammedaksam/borsats";
import {
  getClientIp,
  checkRateLimit,
  createRateLimitResponse,
} from "@/lib/rateLimit";
import { getSymbolTicker, isLiveSymbol } from "@/lib/liveSymbols";

const yf = new YahooFinance({ suppressNotices: ["yahooSurvey"] });

export interface DeepCompanyData {
  technicals?: {
    rsi14?: number;
    macd?: number;
    macdSignal?: number;
    macdHist?: number;
    bbUpper?: number;
    bbMiddle?: number;
    bbLower?: number;
    sma20?: number;
    sma50?: number;
    ema12?: number;
    ema26?: number;
    atr14?: number;
    stochK?: number;
    stochD?: number;
  };
  insiderTransactions?: Array<{
    filerName?: string;
    filerRelation?: string;
    transactionText?: string;
    shares?: number;
    value?: number;
    date?: string;
    moneyText?: string;
  }>;
  majorHoldersBreakdown?: {
    insidersPercentHeld?: number;
    institutionsPercentHeld?: number;
    institutionsFloatPercentHeld?: number;
    institutionsCount?: number;
  };
  recommendationTrend?: Array<{
    period?: string;
    strongBuy?: number;
    buy?: number;
    hold?: number;
    sell?: number;
    strongSell?: number;
  }>;
  upgradeDowngradeHistory?: Array<{
    date?: string;
    firm?: string;
    toGrade?: string;
    fromGrade?: string;
    action?: string;
  }>;
  incomeStatementHistory?: Array<{
    endDate?: string;
    totalRevenue?: number;
    netIncome?: number;
    operatingIncome?: number;
    grossProfit?: number;
  }>;
  earningsHistory?: Array<{
    quarter?: string;
    epsActual?: number;
    epsEstimate?: number;
    surprisePercent?: number;
  }>;
  // Key Valuation & Multiples (defaultKeyStatistics)
  keyStatistics?: {
    forwardPE?: number;
    pegRatio?: number;
    priceToSales?: number;
    enterpriseToEbitda?: number;
    shortRatio?: number;
    enterpriseValue?: number;
  };
  // Future Analyst Outlook (earningsTrend)
  earningsTrend?: {
    period?: string;
    epsEstimateAvg?: number;
    epsGrowthPercent?: number;
    revenueEstimateAvg?: number;
    numberOfAnalysts?: number;
  };
  // Fund & ETF Specific Analytics (topHoldings, fundProfile, fundPerformance)
  fundData?: {
    topHoldings?: Array<{
      symbol?: string;
      holdingName?: string;
      holdingPercent?: number;
    }>;
    expenseRatio?: number;
    fundFamily?: string;
    categoryName?: string;
    cashPosition?: number;
    annualReturns?: {
      ytd?: number;
      oneYear?: number;
      threeYear?: number;
      fiveYear?: number;
    };
  };
}

// In-memory cache for deep fundamental data (TTL: 30 minutes)
const deepCache = new Map<string, { timestamp: number; data: DeepCompanyData }>();
const DEEP_CACHE_TTL = 30 * 60 * 1000;

export async function GET(request: Request) {
  const clientIp = getClientIp(request);
  const rateLimit = await checkRateLimit(`deep:${clientIp}`, 60, 60000);
  if (!rateLimit.allowed) {
    return createRateLimitResponse(rateLimit.resetInSeconds);
  }

  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get("symbol") || "THYAO";
  const cleanSymbol = decodeURIComponent(symbol).toUpperCase().trim();

  // If the symbol is not in the live symbols map, do not attempt Yahoo API
  if (!isLiveSymbol(cleanSymbol)) {
    return NextResponse.json({
      success: false,
      symbol: cleanSymbol,
      error: "Bu sembol için canlı derinlemesine veri akışı bulunmamaktadır.",
    }, { status: 404 });
  }

  const cacheKey = `deep:${cleanSymbol}`;
  const now = Date.now();
  const cached = deepCache.get(cacheKey);
  if (cached && now - cached.timestamp < DEEP_CACHE_TTL) {
    return NextResponse.json({
      success: true,
      symbol: cleanSymbol,
      source: "cache",
      data: cached.data,
    });
  }

  const ticker = getSymbolTicker(cleanSymbol);

  try {
    const rawSummary = await yf.quoteSummary(ticker, {
      modules: [
        "insiderTransactions",
        "majorHoldersBreakdown",
        "upgradeDowngradeHistory",
        "recommendationTrend",
        "incomeStatementHistory",
        "earningsHistory",
        "defaultKeyStatistics",
        "earningsTrend",
        "topHoldings",
        "fundProfile",
        "fundPerformance",
      ],
    }) as Record<string, unknown>;

    // Local type alias for Yahoo Finance API record access
    type YFRecord = Record<string, unknown>;

    /** Safely casts an unknown value to YFRecord for nested property access */
    function asRecord(v: unknown): YFRecord {
      return (v && typeof v === "object" ? v : {}) as YFRecord;
    }

    /** Safely gets an array from an unknown value */
    function asArray(v: unknown): unknown[] {
      return Array.isArray(v) ? v : [];
    }

    if (!rawSummary) {
      return NextResponse.json({
        success: true,
        symbol: cleanSymbol,
        data: null,
      });
    }

    const payload: DeepCompanyData = {};

    // 1. Insider Transactions
    const insiderTx = asRecord(rawSummary["insiderTransactions"]);
    if (insiderTx && Array.isArray(insiderTx["transactions"])) {
      payload.insiderTransactions = asArray(insiderTx["transactions"])
        .slice(0, 8)
        .map((txRaw) => {
          const tx = asRecord(txRaw);
          return {
            filerName: String(tx["filerName"] ?? ""),
            filerRelation: String(tx["filerRelation"] ?? ""),
            transactionText: String(tx["transactionText"] ?? ""),
            shares: tx["shares"] ? Number(tx["shares"]) : undefined,
            value: tx["value"] ? Number(tx["value"]) : undefined,
            moneyText: tx["moneyText"] ? String(tx["moneyText"]) : undefined,
            date: tx["startDate"] ? new Date(tx["startDate"] as string).toISOString().split("T")[0] : undefined,
          };
        });
    }

    // 2. Major Holders Breakdown
    const mbRaw = rawSummary["majorHoldersBreakdown"];
    if (mbRaw) {
      const mb = asRecord(mbRaw);
      payload.majorHoldersBreakdown = {
        insidersPercentHeld: mb["insidersPercentHeld"] ? Number((Number(mb["insidersPercentHeld"]) * 100).toFixed(2)) : undefined,
        institutionsPercentHeld: mb["institutionsPercentHeld"] ? Number((Number(mb["institutionsPercentHeld"]) * 100).toFixed(2)) : undefined,
        institutionsFloatPercentHeld: mb["institutionsFloatPercentHeld"] ? Number((Number(mb["institutionsFloatPercentHeld"]) * 100).toFixed(2)) : undefined,
        institutionsCount: mb["institutionsCount"] ? Number(mb["institutionsCount"]) : undefined,
      };
    }

    // 3. Recommendation Trend
    const recTrend = asRecord(rawSummary["recommendationTrend"]);
    if (recTrend && Array.isArray(recTrend["trend"])) {
      payload.recommendationTrend = asArray(recTrend["trend"])
        .slice(0, 4)
        .map((tRaw) => {
          const t = asRecord(tRaw);
          return {
            period: String(t["period"] ?? ""),
            strongBuy: Number(t["strongBuy"] ?? 0),
            buy: Number(t["buy"] ?? 0),
            hold: Number(t["hold"] ?? 0),
            sell: Number(t["sell"] ?? 0),
            strongSell: Number(t["strongSell"] ?? 0),
          };
        });
    }

    // 4. Upgrade / Downgrade History
    const ugdh = asRecord(rawSummary["upgradeDowngradeHistory"]);
    if (ugdh && Array.isArray(ugdh["history"])) {
      payload.upgradeDowngradeHistory = asArray(ugdh["history"])
        .slice(0, 6)
        .map((hRaw) => {
          const h = asRecord(hRaw);
          return {
            firm: String(h["firm"] ?? ""),
            toGrade: String(h["toGrade"] ?? ""),
            fromGrade: h["fromGrade"] ? String(h["fromGrade"]) : undefined,
            action: String(h["action"] ?? ""),
            date: h["epochGradeDate"] ? new Date(h["epochGradeDate"] as string | number).toISOString().split("T")[0] : undefined,
          };
        });
    }

    // 5. Income Statement History
    const incStmt = asRecord(rawSummary["incomeStatementHistory"]);
    if (incStmt && Array.isArray(incStmt["incomeStatementHistory"])) {
      payload.incomeStatementHistory = asArray(incStmt["incomeStatementHistory"])
        .slice(0, 3)
        .map((iRaw) => {
          const inc = asRecord(iRaw);
          return {
            endDate: inc["endDate"] ? new Date(inc["endDate"] as string | number).toISOString().split("T")[0] : undefined,
            totalRevenue: inc["totalRevenue"] ? Number(inc["totalRevenue"]) : undefined,
            netIncome: inc["netIncome"] ? Number(inc["netIncome"]) : undefined,
            operatingIncome: inc["operatingIncome"] ? Number(inc["operatingIncome"]) : undefined,
            grossProfit: inc["grossProfit"] ? Number(inc["grossProfit"]) : undefined,
          };
        });
    }

    // 6. Earnings History
    const earningsHist = asRecord(rawSummary["earningsHistory"]);
    if (earningsHist && Array.isArray(earningsHist["history"])) {
      payload.earningsHistory = asArray(earningsHist["history"])
        .slice(0, 4)
        .map((eRaw) => {
          const e = asRecord(eRaw);
          return {
            quarter: e["quarter"] ? new Date(e["quarter"] as string | number).toISOString().split("T")[0] : undefined,
            epsActual: e["epsActual"] != null ? Number(Number(e["epsActual"]).toFixed(2)) : undefined,
            epsEstimate: e["epsEstimate"] != null ? Number(Number(e["epsEstimate"]).toFixed(2)) : undefined,
            surprisePercent: e["surprisePercent"] != null ? Number((Number(e["surprisePercent"]) * 100).toFixed(1)) : undefined,
          };
        });
    }

    // 7. Key Valuation Multiples (defaultKeyStatistics)
    const ksRaw = rawSummary["defaultKeyStatistics"];
    if (ksRaw) {
      const ks = asRecord(ksRaw);
      payload.keyStatistics = {
        forwardPE: ks["forwardPE"] ? Number(Number(ks["forwardPE"]).toFixed(1)) : undefined,
        pegRatio: ks["pegRatio"] ? Number(Number(ks["pegRatio"]).toFixed(2)) : undefined,
        priceToSales: ks["priceToSalesTrailing12Months"] ? Number(Number(ks["priceToSalesTrailing12Months"]).toFixed(2)) : undefined,
        enterpriseToEbitda: ks["enterpriseToEbitda"] ? Number(Number(ks["enterpriseToEbitda"]).toFixed(1)) : undefined,
        shortRatio: ks["shortRatio"] ? Number(Number(ks["shortRatio"]).toFixed(2)) : undefined,
        enterpriseValue: ks["enterpriseValue"] ? Number(ks["enterpriseValue"]) : undefined,
      };
    }

    // 8. Future Analyst Outlook (earningsTrend)
    const etRaw = asRecord(rawSummary["earningsTrend"]);
    if (etRaw && Array.isArray(etRaw["trend"])) {
      const trends = asArray(etRaw["trend"]).map(asRecord);
      const nextQuarterTrend = trends.find((tr) => tr["period"] === "+1q" || tr["period"] === "0q") || trends[0];
      if (nextQuarterTrend) {
        const ee = asRecord(nextQuarterTrend["earningsEstimate"]);
        const re = asRecord(nextQuarterTrend["revenueEstimate"]);
        payload.earningsTrend = {
          period: nextQuarterTrend["period"] === "+1q" ? "Gelecek Çeyrek" : "Cari Çeyrek",
          epsEstimateAvg: ee["avg"] != null ? Number(Number(ee["avg"]).toFixed(2)) : undefined,
          epsGrowthPercent: nextQuarterTrend["growth"] != null ? Number((Number(nextQuarterTrend["growth"]) * 100).toFixed(1)) : undefined,
          revenueEstimateAvg: re["avg"] != null ? Number(re["avg"]) : undefined,
          numberOfAnalysts: ee["numberOfAnalysts"] != null ? Number(ee["numberOfAnalysts"]) : undefined,
        };
      }
    }

    // 9. Fund & ETF Specific Analytics (topHoldings, fundProfile, fundPerformance)
    const thRaw = rawSummary["topHoldings"];
    const fpRaw = rawSummary["fundProfile"];
    const fperfRaw = rawSummary["fundPerformance"];
    if (thRaw || fpRaw || fperfRaw) {
      const th = asRecord(thRaw);
      const fp = asRecord(fpRaw);
      const fperf = asRecord(fperfRaw);

      const topHoldingsList = thRaw && Array.isArray(th["holdings"])
        ? asArray(th["holdings"]).slice(0, 10).map((hRaw) => {
            const h = asRecord(hRaw);
            return {
              symbol: String(h["symbol"] ?? ""),
              holdingName: String(h["holdingName"] ?? ""),
              holdingPercent: h["holdingPercent"] != null ? Number((Number(h["holdingPercent"]) * 100).toFixed(2)) : undefined,
            };
          })
        : undefined;

      const fei = asRecord(asRecord(fp["feesExpensesInvestment"]));
      const expenseRatio = fei["annualReportExpenseRatio"] != null
        ? Number((Number(fei["annualReportExpenseRatio"]) * 100).toFixed(2))
        : (fei["grossExpenseRatio"] != null ? Number((Number(fei["grossExpenseRatio"]) * 100).toFixed(2)) : undefined);

      const atr = asRecord(fperf["annualTotalReturns"]);
      const trailingRet = asRecord(fperf["trailingReturns"]);
      const annualReturns = fperfRaw && atr["returns"]
        ? {
            ytd: asArray(atr["returns"]).map(asRecord).find((r) => r["year"] === "YTD")?.[" annualValue"] != null
              ? Number((Number(asArray(atr["returns"]).map(asRecord).find((r) => r["year"] === "YTD")?.["annualValue"]) * 100).toFixed(1))
              : undefined,
            oneYear: trailingRet["oneYear"] != null ? Number((Number(trailingRet["oneYear"]) * 100).toFixed(1)) : undefined,
            threeYear: trailingRet["threeYear"] != null ? Number((Number(trailingRet["threeYear"]) * 100).toFixed(1)) : undefined,
            fiveYear: trailingRet["fiveYear"] != null ? Number((Number(trailingRet["fiveYear"]) * 100).toFixed(1)) : undefined,
          }
        : undefined;

      payload.fundData = {
        topHoldings: topHoldingsList,
        expenseRatio,
        fundFamily: fp["family"] ? String(fp["family"]) : (fp["legalType"] ? String(fp["legalType"]) : undefined),
        categoryName: fp["categoryName"] ? String(fp["categoryName"]) : undefined,
        cashPosition: th["cashPosition"] != null ? Number((Number(th["cashPosition"]) * 100).toFixed(1)) : undefined,
        annualReturns,
      };
    }

    // 10. Enrich with Technical Indicators via borsats Ticker (RSI, MACD, Bollinger Bands)
    const targetTicker = getSymbolTicker(cleanSymbol);
    try {
      if (!targetTicker.startsWith("TEFAS:") && !cleanSymbol.includes("/")) {
        const stock = new Ticker(cleanSymbol);
        const ta = await stock.technicals("1mo");
        if (ta && ta.latest) {
          const l = ta.latest;
          payload.technicals = {
            rsi14: l.rsi_14 != null ? Number(Number(l.rsi_14).toFixed(1)) : undefined,
            macd: l.macd != null ? Number(Number(l.macd).toFixed(2)) : undefined,
            macdSignal: l.macd_signal != null ? Number(Number(l.macd_signal).toFixed(2)) : undefined,
            macdHist: l.macd_histogram != null ? Number(Number(l.macd_histogram).toFixed(2)) : undefined,
            bbUpper: l.bb_upper != null ? Number(Number(l.bb_upper).toFixed(2)) : undefined,
            bbMiddle: l.bb_middle != null ? Number(Number(l.bb_middle).toFixed(2)) : undefined,
            bbLower: l.bb_lower != null ? Number(Number(l.bb_lower).toFixed(2)) : undefined,
            sma20: l.sma_20 != null ? Number(Number(l.sma_20).toFixed(2)) : undefined,
            sma50: l.sma_50 != null ? Number(Number(l.sma_50).toFixed(2)) : undefined,
            ema12: l.ema_12 != null ? Number(Number(l.ema_12).toFixed(2)) : undefined,
            ema26: l.ema_26 != null ? Number(Number(l.ema_26).toFixed(2)) : undefined,
            atr14: l.atr_14 != null ? Number(Number(l.atr_14).toFixed(2)) : undefined,
            stochK: l.stoch_k != null ? Number(Number(l.stoch_k).toFixed(1)) : undefined,
            stochD: l.stoch_d != null ? Number(Number(l.stoch_d).toFixed(1)) : undefined,
          };
        }
      }
    } catch (taErr) {
      console.warn(`[Deep API] Technicals fetch warning for ${cleanSymbol}:`, taErr);
    }

    // 11. Enrich TEFAS Mutual Funds with real category and returns via borsats Fund
    if (targetTicker.startsWith("TEFAS:") || (cleanSymbol.length >= 3 && cleanSymbol.length <= 4)) {
      try {
        const fund = new Fund(cleanSymbol);
        const fInfo = await fund.info;
        if (fInfo && fInfo.price != null) {
          payload.fundData = {
            ...payload.fundData,
            categoryName: fInfo.category || fInfo.fund_type || payload.fundData?.categoryName,
            fundFamily: fInfo.manager || fInfo.founder || payload.fundData?.fundFamily,
            annualReturns: {
              ytd: fInfo.return_ytd != null ? Number(Number(fInfo.return_ytd).toFixed(1)) : payload.fundData?.annualReturns?.ytd,
              oneYear: fInfo.return_1y != null ? Number(Number(fInfo.return_1y).toFixed(1)) : payload.fundData?.annualReturns?.oneYear,
              threeYear: fInfo.return_3y != null ? Number(Number(fInfo.return_3y).toFixed(1)) : payload.fundData?.annualReturns?.threeYear,
              fiveYear: fInfo.return_5y != null ? Number(Number(fInfo.return_5y).toFixed(1)) : payload.fundData?.annualReturns?.fiveYear,
            },
          };
        }
      } catch (_fErr: unknown) {
        // Not a TEFAS fund or error — silently skip
      }
    }

    deepCache.set(cacheKey, { timestamp: now, data: payload });

    return NextResponse.json({
      success: true,
      symbol: cleanSymbol,
      source: "yahoo_finance_and_borsats",
      data: payload,
    });
  } catch (err) {
    console.warn(`[Deep API] Error fetching quoteSummary for ${cleanSymbol}:`, err);
    return NextResponse.json({
      success: true,
      symbol: cleanSymbol,
      source: "error_empty",
      data: null,
    });
  }
}
