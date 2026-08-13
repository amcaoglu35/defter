/**
 * Centralized list and map of live symbols supported by Yahoo Finance / live price API.
 */

export const SYMBOL_MAP: Record<string, string> = {
  // BIST Stocks
  THYAO: "THYAO.IS",
  PGSUS: "PGSUS.IS",
  TAVHL: "TAVHL.IS",
  ASELS: "ASELS.IS",
  SDTTR: "SDTTR.IS",
  MIATK: "MIATK.IS",
  LOGO: "LOGO.IS",
  REEDR: "REEDR.IS",
  FROTO: "FROTO.IS",
  TOASO: "TOASO.IS",
  DOAS: "DOAS.IS",
  OTKAR: "OTKAR.IS",
  ARCLK: "ARCLK.IS",
  VESTL: "VESTL.IS",
  TUPRS: "TUPRS.IS",
  ENJSA: "ENJSA.IS",
  ASTOR: "ASTOR.IS",
  KONTR: "KONTR.IS",
  CWENE: "CWENE.IS",
  EUPWR: "EUPWR.IS",
  ODAS: "ODAS.IS",
  AKBNK: "AKBNK.IS",
  GARAN: "GARAN.IS",
  ISCTR: "ISCTR.IS",
  YKBNK: "YKBNK.IS",
  VAKBN: "VAKBN.IS",
  ISMEN: "ISMEN.IS",
  KCHOL: "KCHOL.IS",
  SAHOL: "SAHOL.IS",
  ALARK: "ALARK.IS",
  ENKAI: "ENKAI.IS",
  SISE: "SISE.IS",
  EREGL: "EREGL.IS",
  KRDMD: "KRDMD.IS",
  BIMAS: "BIMAS.IS",
  MGROS: "MGROS.IS",
  SOKM: "SOKM.IS",
  CCOLA: "CCOLA.IS",
  TCELL: "TCELL.IS",
  TTKOM: "TTKOM.IS",

  // US & European Stocks
  NVDA: "NVDA",
  AAPL: "AAPL",
  MSFT: "MSFT",
  GOOGL: "GOOGL",
  AMZN: "AMZN",
  TSLA: "TSLA",
  PLTR: "PLTR",
  ASML: "ASML",

  // ETFs & Funds
  QQQ: "QQQ",
  SPY: "SPY",
  GLD: "GLD",

  // Currencies & FX
  "USD/TRY": "USDTRY=X",
  "EUR/TRY": "EURTRY=X",
  "GBP/TRY": "GBPTRY=X",
  "CHF/TRY": "CHFTRY=X",
  "EUR/USD": "EURUSD=X",

  // Commodities & Futures
  GOLD_OUNCE: "GC=F",
  SILVER_OUNCE: "SI=F",
  PLATINUM_OUNCE: "PL=F",
  BRENT: "BZ=F",
  BAKIR: "HG=F",

  // Market Indices
  "BIST 100": "XU100.IS",
  "BIST 30": "XU030.IS",
  "S&P 500": "^GSPC",
  NASDAQ: "^IXIC",
};

export const LIVE_SYMBOLS = new Set<string>(Object.keys(SYMBOL_MAP));

export function isLiveSymbol(symbol: string): boolean {
  if (!symbol) return false;
  return LIVE_SYMBOLS.has(symbol.toUpperCase());
}
