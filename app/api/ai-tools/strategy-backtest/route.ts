import { NextResponse } from "next/server";
import {
  runStrategyBacktest,
  TradingStrategy,
  PRESET_STRATEGIES,
} from "@/lib/strategyBacktestEngine";
import { getClientIp, checkRateLimit, createRateLimitResponse, formatApiError } from "@/lib/rateLimit";

export async function POST(req: Request) {
  const clientIp = getClientIp(req);
  const rateLimit = await checkRateLimit(`ai-tools:strategy-backtest:${clientIp}`, 15, 60000);
  if (!rateLimit.allowed) {
    return createRateLimitResponse(rateLimit.resetInSeconds);
  }

  try {
    const body = await req.json();
    const { symbol, strategyKey, customStrategy, periodMonths, initialCapital } = body as {
      symbol: string;
      strategyKey?: string;
      customStrategy?: TradingStrategy;
      periodMonths?: number;
      initialCapital?: number;
    };

    if (!symbol || typeof symbol !== "string" || symbol.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "Geçersiz veya eksik şirket sembolü" },
        { status: 400 }
      );
    }

    let activeStrategy: TradingStrategy | undefined = customStrategy;
    if (!activeStrategy && strategyKey && PRESET_STRATEGIES[strategyKey]) {
      activeStrategy = PRESET_STRATEGIES[strategyKey];
    }

    if (!activeStrategy) {
      activeStrategy = PRESET_STRATEGIES.rsi_mean_reversion;
    }

    const result = await runStrategyBacktest(
      symbol,
      activeStrategy,
      periodMonths || 12,
      initialCapital || 100000
    );

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: unknown) {
    return formatApiError(error, "Strateji backtest simülasyonu çalıştırılırken bir hata oluştu.");
  }
}
