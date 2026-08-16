import { NextResponse } from "next/server";
import YahooFinance from "yahoo-finance2";
import {
  getClientIp,
  checkRateLimit,
  createRateLimitResponse,
} from "@/lib/rateLimit";
import { getSymbolTicker, isLiveSymbol } from "@/lib/liveSymbols";

const yf = new YahooFinance({ suppressNotices: ["yahooSurvey"] });

export interface DeepCompanyData {
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
    }) as any;

    if (!rawSummary) {
      return NextResponse.json({
        success: true,
        symbol: cleanSymbol,
        data: null,
      });
    }

    const payload: DeepCompanyData = {};

    // 1. Insider Transactions
    if (rawSummary.insiderTransactions && Array.isArray(rawSummary.insiderTransactions.transactions)) {
      payload.insiderTransactions = rawSummary.insiderTransactions.transactions
        .slice(0, 8)
        .map((tx: any) => ({
          filerName: tx.filerName,
          filerRelation: tx.filerRelation,
          transactionText: tx.transactionText,
          shares: tx.shares ? Number(tx.shares) : undefined,
          value: tx.value ? Number(tx.value) : undefined,
          moneyText: tx.moneyText,
          date: tx.startDate ? new Date(tx.startDate).toISOString().split("T")[0] : undefined,
        }));
    }

    // 2. Major Holders Breakdown
    if (rawSummary.majorHoldersBreakdown) {
      const mb = rawSummary.majorHoldersBreakdown;
      payload.majorHoldersBreakdown = {
        insidersPercentHeld: mb.insidersPercentHeld ? Number((mb.insidersPercentHeld * 100).toFixed(2)) : undefined,
        institutionsPercentHeld: mb.institutionsPercentHeld ? Number((mb.institutionsPercentHeld * 100).toFixed(2)) : undefined,
        institutionsFloatPercentHeld: mb.institutionsFloatPercentHeld ? Number((mb.institutionsFloatPercentHeld * 100).toFixed(2)) : undefined,
        institutionsCount: mb.institutionsCount ? Number(mb.institutionsCount) : undefined,
      };
    }

    // 3. Recommendation Trend
    if (rawSummary.recommendationTrend && Array.isArray(rawSummary.recommendationTrend.trend)) {
      payload.recommendationTrend = rawSummary.recommendationTrend.trend
        .slice(0, 4)
        .map((t: any) => ({
          period: t.period,
          strongBuy: t.strongBuy ?? 0,
          buy: t.buy ?? 0,
          hold: t.hold ?? 0,
          sell: t.sell ?? 0,
          strongSell: t.strongSell ?? 0,
        }));
    }

    // 4. Upgrade / Downgrade History
    if (rawSummary.upgradeDowngradeHistory && Array.isArray(rawSummary.upgradeDowngradeHistory.history)) {
      payload.upgradeDowngradeHistory = rawSummary.upgradeDowngradeHistory.history
        .slice(0, 6)
        .map((h: any) => ({
          firm: h.firm,
          toGrade: h.toGrade,
          fromGrade: h.fromGrade,
          action: h.action,
          date: h.epochGradeDate ? new Date(h.epochGradeDate).toISOString().split("T")[0] : undefined,
        }));
    }

    // 5. Income Statement History
    if (rawSummary.incomeStatementHistory && Array.isArray(rawSummary.incomeStatementHistory.incomeStatementHistory)) {
      payload.incomeStatementHistory = rawSummary.incomeStatementHistory.incomeStatementHistory
        .slice(0, 3)
        .map((inc: any) => ({
          endDate: inc.endDate ? new Date(inc.endDate).toISOString().split("T")[0] : undefined,
          totalRevenue: inc.totalRevenue ? Number(inc.totalRevenue) : undefined,
          netIncome: inc.netIncome ? Number(inc.netIncome) : undefined,
          operatingIncome: inc.operatingIncome ? Number(inc.operatingIncome) : undefined,
          grossProfit: inc.grossProfit ? Number(inc.grossProfit) : undefined,
        }));
    }

    // 6. Earnings History
    if (rawSummary.earningsHistory && Array.isArray(rawSummary.earningsHistory.history)) {
      payload.earningsHistory = rawSummary.earningsHistory.history
        .slice(0, 4)
        .map((e: any) => ({
          quarter: e.quarter ? new Date(e.quarter).toISOString().split("T")[0] : undefined,
          epsActual: e.epsActual != null ? Number(Number(e.epsActual).toFixed(2)) : undefined,
          epsEstimate: e.epsEstimate != null ? Number(Number(e.epsEstimate).toFixed(2)) : undefined,
          surprisePercent: e.surprisePercent != null ? Number((Number(e.surprisePercent) * 100).toFixed(1)) : undefined,
        }));
    }

    // 7. Key Valuation Multiples (defaultKeyStatistics)
    if (rawSummary.defaultKeyStatistics) {
      const ks = rawSummary.defaultKeyStatistics;
      payload.keyStatistics = {
        forwardPE: ks.forwardPE ? Number(Number(ks.forwardPE).toFixed(1)) : undefined,
        pegRatio: ks.pegRatio ? Number(Number(ks.pegRatio).toFixed(2)) : undefined,
        priceToSales: ks.priceToSalesTrailing12Months ? Number(Number(ks.priceToSalesTrailing12Months).toFixed(2)) : undefined,
        enterpriseToEbitda: ks.enterpriseToEbitda ? Number(Number(ks.enterpriseToEbitda).toFixed(1)) : undefined,
        shortRatio: ks.shortRatio ? Number(Number(ks.shortRatio).toFixed(2)) : undefined,
        enterpriseValue: ks.enterpriseValue ? Number(ks.enterpriseValue) : undefined,
      };
    }

    // 8. Future Analyst Outlook (earningsTrend)
    if (rawSummary.earningsTrend && Array.isArray(rawSummary.earningsTrend.trend)) {
      const nextQuarterTrend = rawSummary.earningsTrend.trend.find((tr: any) => tr.period === "+1q" || tr.period === "0q") || rawSummary.earningsTrend.trend[0];
      if (nextQuarterTrend) {
        payload.earningsTrend = {
          period: nextQuarterTrend.period === "+1q" ? "Gelecek Çeyrek" : "Cari Çeyrek",
          epsEstimateAvg: nextQuarterTrend.earningsEstimate?.avg != null ? Number(Number(nextQuarterTrend.earningsEstimate.avg).toFixed(2)) : undefined,
          epsGrowthPercent: nextQuarterTrend.growth != null ? Number((Number(nextQuarterTrend.growth) * 100).toFixed(1)) : undefined,
          revenueEstimateAvg: nextQuarterTrend.revenueEstimate?.avg != null ? Number(nextQuarterTrend.revenueEstimate.avg) : undefined,
          numberOfAnalysts: nextQuarterTrend.earningsEstimate?.numberOfAnalysts != null ? Number(nextQuarterTrend.earningsEstimate.numberOfAnalysts) : undefined,
        };
      }
    }

    // 9. Fund & ETF Specific Analytics (topHoldings, fundProfile, fundPerformance)
    if (rawSummary.topHoldings || rawSummary.fundProfile || rawSummary.fundPerformance) {
      const th = rawSummary.topHoldings;
      const fp = rawSummary.fundProfile;
      const fperf = rawSummary.fundPerformance;

      const topHoldingsList = th && Array.isArray(th.holdings)
        ? th.holdings.slice(0, 10).map((h: any) => ({
            symbol: h.symbol,
            holdingName: h.holdingName,
            holdingPercent: h.holdingPercent != null ? Number((Number(h.holdingPercent) * 100).toFixed(2)) : undefined,
          }))
        : undefined;

      const expenseRatio = fp?.feesExpensesInvestment?.annualReportExpenseRatio != null
        ? Number((Number(fp.feesExpensesInvestment.annualReportExpenseRatio) * 100).toFixed(2))
        : (fp?.feesExpensesInvestment?.grossExpenseRatio != null ? Number((Number(fp.feesExpensesInvestment.grossExpenseRatio) * 100).toFixed(2)) : undefined);

      const annualReturns = fperf?.annualTotalReturns?.returns
        ? {
            ytd: fperf.annualTotalReturns.returns.find((r: any) => r.year === "YTD")?.annualValue != null ? Number((Number(fperf.annualTotalReturns.returns.find((r: any) => r.year === "YTD").annualValue) * 100).toFixed(1)) : undefined,
            oneYear: fperf.trailingReturns?.oneYear != null ? Number((Number(fperf.trailingReturns.oneYear) * 100).toFixed(1)) : undefined,
            threeYear: fperf.trailingReturns?.threeYear != null ? Number((Number(fperf.trailingReturns.threeYear) * 100).toFixed(1)) : undefined,
            fiveYear: fperf.trailingReturns?.fiveYear != null ? Number((Number(fperf.trailingReturns.fiveYear) * 100).toFixed(1)) : undefined,
          }
        : undefined;

      payload.fundData = {
        topHoldings: topHoldingsList,
        expenseRatio,
        fundFamily: fp?.family || fp?.legalType,
        categoryName: fp?.categoryName,
        cashPosition: th?.cashPosition != null ? Number((Number(th.cashPosition) * 100).toFixed(1)) : undefined,
        annualReturns,
      };
    }

    deepCache.set(cacheKey, { timestamp: now, data: payload });

    return NextResponse.json({
      success: true,
      symbol: cleanSymbol,
      source: "yahoo_finance_quote_summary",
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
