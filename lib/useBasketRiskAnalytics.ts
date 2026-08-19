"use client";

import { useState, useEffect, useMemo } from "react";
import { Basket } from "./mockData";
import { getSymbolTicker } from "./liveSymbols";
import {
  calculateRiskProfile,
  ComprehensiveRiskProfile,
  HistoricalPricePoint,
  RiskDataQuality,
} from "./riskEngine";
import { buildCorrelationMatrix, CorrelationResult } from "./correlationService";
import { calculateTWRR } from "./performanceEngine";

export interface BasketAnalyticsState {
  status: RiskDataQuality;
  isLoading: boolean;
  error: string | null;
  /** Holding sembolü -> Tarihsel fiyat dizisi map'i */
  holdingSeriesMap: Map<string, HistoricalPricePoint[]>;
  /** Ağırlıklı portföy tarihsel fiyat endeksi (100 ile başlar) */
  portfolioPriceSeries: HistoricalPricePoint[];
  /** BIST 100 benchmark tarihsel fiyat serisi */
  benchmarkPriceSeries: HistoricalPricePoint[];
  /** Portföy risk profili (Sharpe, Volatilite, Sortino, VaR, Beta vs.) */
  riskProfile: ComprehensiveRiskProfile | null;
  /** Varlıklar arası Pearson korelasyon matrisi sonuçları */
  correlationMatrix: CorrelationResult[];
  /** Zaman ağırlıklı getiri (TWRR) sonucu */
  twrrPct: number | null;
}

export function useBasketRiskAnalytics(
  basket?: Basket | null,
  period: string = "6m"
): BasketAnalyticsState {
  const [holdingSeriesMap, setHoldingSeriesMap] = useState<Map<string, HistoricalPricePoint[]>>(new Map());
  const [benchmarkPriceSeries, setBenchmarkPriceSeries] = useState<HistoricalPricePoint[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!basket || !basket.holdings || basket.holdings.length === 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- Sepet boşaldığında analitik state sıfırlama
      setHoldingSeriesMap(new Map());
      setBenchmarkPriceSeries([]);
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    setIsLoading(true);
    setError(null);

    async function fetchAllHistories() {
      try {
        const holdings = basket!.holdings;
        // Holding sembollerini ticker'a çevir
        const symbolTickerPairs = holdings.map((h) => ({
          symbol: h.companySymbol.toUpperCase(),
          ticker: getSymbolTicker(h.companySymbol),
        }));

        // BIST 100 benchmark ekle
        const allRequests = [
          ...symbolTickerPairs.map((p) => ({ key: p.symbol, ticker: p.ticker })),
          { key: "BENCHMARK_BIST", ticker: "XU100.IS" },
        ];

        const results = await Promise.allSettled(
          allRequests.map(async (req) => {
            const url = `/api/prices/history?symbol=${encodeURIComponent(req.ticker)}&period=${period}`;
            const res = await fetch(url);
            if (!res.ok) return { key: req.key, data: [] };
            const json = (await res.json()) as { success: boolean; data?: HistoricalPricePoint[] };
            return { key: req.key, data: json.success && json.data ? json.data : [] };
          })
        );

        if (!isMounted) return;

        const newMap = new Map<string, HistoricalPricePoint[]>();
        let bSeries: HistoricalPricePoint[] = [];

        for (const res of results) {
          if (res.status === "fulfilled") {
            const { key, data } = res.value;
            if (key === "BENCHMARK_BIST") {
              bSeries = data;
            } else {
              newMap.set(key, data);
            }
          }
        }

        setHoldingSeriesMap(newMap);
        setBenchmarkPriceSeries(bSeries);
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Fiyat geçmişi yüklenemedi");
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    fetchAllHistories();

    return () => {
      isMounted = false;
    };
  }, [basket, period]);

  // Ağırlıklı Portföy Fiyat Serisi Hesabı
  const portfolioPriceSeries = useMemo<HistoricalPricePoint[]>(() => {
    if (!basket || holdingSeriesMap.size === 0) return [];

    // Tüm holdinglerin ortak tarihlerini bul
    const holdings = basket.holdings;
    const totalWeight = holdings.reduce((sum, h) => sum + (h.weightPercent || 0), 0) || 100;

    // İlk holdingin tarihlerini referans al
    const firstHoldingSym = holdings[0]?.companySymbol.toUpperCase();
    const referenceSeries = holdingSeriesMap.get(firstHoldingSym) || [];
    if (referenceSeries.length < 2) return [];

    // Tarih -> { sumReturn: number, totalValidWeight: number }
    const portfolioPoints: HistoricalPricePoint[] = [];
    let cumulativeValue = 100.0; // 100 baz puanla başlat
    portfolioPoints.push({ date: referenceSeries[0].date, close: cumulativeValue });

    for (let i = 1; i < referenceSeries.length; i++) {
      const date = referenceSeries[i].date;
      const prevDate = referenceSeries[i - 1].date;

      let weightedDailyReturn = 0;
      let usedWeight = 0;

      for (const h of holdings) {
        const sym = h.companySymbol.toUpperCase();
        const weight = (h.weightPercent || 0) / totalWeight;
        const series = holdingSeriesMap.get(sym);

        if (series && series.length > i) {
          const currPt = series.find((p) => p.date === date);
          const prevPt = series.find((p) => p.date === prevDate);

          if (currPt && prevPt && prevPt.close > 0 && currPt.close > 0) {
            const hReturn = (currPt.close - prevPt.close) / prevPt.close;
            weightedDailyReturn += hReturn * weight;
            usedWeight += weight;
          }
        }
      }

      if (usedWeight > 0) {
        // Ağırlığı normalize et
        const normalizedReturn = weightedDailyReturn / usedWeight;
        cumulativeValue = cumulativeValue * (1 + normalizedReturn);
        portfolioPoints.push({
          date,
          close: Number(cumulativeValue.toFixed(4)),
        });
      }
    }

    return portfolioPoints;
  }, [basket, holdingSeriesMap]);

  // Risk Profili Hesabı (Phase 4 Quant Engine)
  const riskProfile = useMemo<ComprehensiveRiskProfile | null>(() => {
    if (portfolioPriceSeries.length < 20) return null;
    return calculateRiskProfile(
      portfolioPriceSeries,
      benchmarkPriceSeries,
      "XU100.IS",
      { minDataPoints: 20 }
    );
  }, [portfolioPriceSeries, benchmarkPriceSeries]);

  // Korelasyon Matrisi (Phase 0 Pearson Engine)
  const correlationMatrix = useMemo<CorrelationResult[]>(() => {
    if (!basket) return [];
    const symbols = basket.holdings.map((h) => h.companySymbol.toUpperCase());
    return buildCorrelationMatrix(symbols, holdingSeriesMap);
  }, [basket, holdingSeriesMap]);

  // TWRR Getiri (Phase 3 Performance Engine)
  const twrrPct = useMemo<number | null>(() => {
    if (portfolioPriceSeries.length < 2) return null;
    const snapshots = portfolioPriceSeries.map((p) => ({
      date: p.date,
      portfolioValue: p.close,
    }));
    const res = calculateTWRR(snapshots);
    return res.twrrPct;
  }, [portfolioPriceSeries]);

  const status: RiskDataQuality =
    portfolioPriceSeries.length >= 20
      ? "live"
      : portfolioPriceSeries.length > 0
      ? "insufficient"
      : "unavailable";

  return {
    status,
    isLoading,
    error,
    holdingSeriesMap,
    portfolioPriceSeries,
    benchmarkPriceSeries,
    riskProfile,
    correlationMatrix,
    twrrPct,
  };
}
