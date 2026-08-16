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
  // BIST IPO & New Market Stocks
  HOROZ: "HOROZ.IS",
  KOTON: "KOTON.IS",
  KOCMT: "KOCMT.IS",
  MOGAN: "MOGAN.IS",
  RGYAS: "RGYAS.IS",
  ENTRA: "ENTRA.IS",
  LILAK: "LILAK.IS",
  HRKET: "HRKET.IS",
  ALTNY: "ALTNY.IS",
  OBAMS: "OBAMS.IS",
  ICUGS: "ICUGS.IS",
  TEKMN: "TEKMN.IS",
  GUNDG: "GUNDG.IS",
  BAHKM: "BAHKM.IS",
  ARTMS: "ARTMS.IS",
  ONRYT: "ONRYT.IS",
  DURKN: "DURKN.IS",
  DCTTR: "DCTTR.IS",
  EFORC: "EFORC.IS",
  AHSGY: "AHSGY.IS",
  TABGD: "TABGD.IS",
  BEGYO: "BEGYO.IS",
  SURGY: "SURGY.IS",
  BORLS: "BORLS.IS",
  DOFER: "DOFER.IS",
  MARBL: "MARBL.IS",
  TARKM: "TARKM.IS",
  HATSAN: "HATSAN.IS",
  GOKNR: "GOKNR.IS",
  CVKMD: "CVKMD.IS",
  KOPOL: "KOPOL.IS",
  IZENR: "IZENR.IS",
  TATEN: "TATEN.IS",
  ENERY: "ENERY.IS",
  ASGYO: "ASGYO.IS",
  OFSYM: "OFSYM.IS",
  KTSKR: "KTSKR.IS",
  DMRGD: "DMRGD.IS",

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
  VOO: "VOO",
  VTI: "VTI",
  GLD: "GLD",
  SLV: "SLV",
  SMH: "SMH",
  SOXX: "SOXX",
  DIA: "DIA",
  SCHD: "SCHD",
  VYM: "VYM",
  XLF: "XLF",
  XLK: "XLK",
  XLE: "XLE",
  XLV: "XLV",
  XLI: "XLI",
  XLP: "XLP",
  XLY: "XLY",
  XLU: "XLU",
  VNQ: "VNQ",
  TLT: "TLT",
  AGG: "AGG",
  BND: "BND",
  VEA: "VEA",
  VWO: "VWO",
  EFA: "EFA",
  IWM: "IWM",
  ARKK: "ARKK",
  TQQQ: "TQQQ",
  SQQQ: "SQQQ",

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

  // Dynamically Derived Precious Metals in TRY (computed in /api/prices from spot ounce & USD/TRY)
  "ALTIN/GR": "ALTIN/GR",
  "GÜMÜŞ/GR": "GÜMÜŞ/GR",
  "GUMUS/GR": "GÜMÜŞ/GR",
  "PLATIN/GR": "PLATIN/GR",
  CEYREK: "CEYREK",
  YARIM: "YARIM",
  TAM: "TAM",
  ATA: "ATA",

  // Market & Sector Indices
  "BIST 100": "XU100.IS",
  "BIST 30": "XU030.IS",
  "BIST Banka": "XBANK.IS",
  "BIST Sınai": "XUSIN.IS",
  "BIST Teknoloji": "XTEK.IS",
  "BIST GYO": "XGMYO.IS",
  "BIST Temettü": "XTMTU.IS",
  "S&P 500": "^GSPC",
  NASDAQ: "^IXIC",
  "ABD 10Y Tahvil": "^TNX",
  "VIX Korku": "^VIX",
  "DXY Dolar": "DX-Y.NYB",

  // TEFAS Yatırım Fonları
  TI2: "TEFAS:TI2",
  TCD: "TEFAS:TCD",
  MAC: "TEFAS:MAC",
  NNF: "TEFAS:NNF",
  IPB: "TEFAS:IPB",
  AFT: "TEFAS:AFT",
  YAY: "TEFAS:YAY",
  BUY: "TEFAS:BUY",
  GMR: "TEFAS:GMR",
  ZCN: "TEFAS:ZCN",
  KTM: "TEFAS:KTM",
};

/**
 * Explicit set of symbols that are either fetched directly from Yahoo Finance
 * or dynamically calculated on-the-fly from live spot quotes (Gram Altın, Çeyrek, etc.).
 */
export const LIVE_SYMBOLS = new Set<string>(Object.keys(SYMBOL_MAP).map((k) => k.toUpperCase()));

export const DYNAMICALLY_DERIVED_SYMBOLS = new Set<string>([
  "ALTIN/GR",
  "GÜMÜŞ/GR",
  "GUMUS/GR",
  "PLATIN/GR",
  "CEYREK",
  "YARIM",
  "TAM",
  "ATA",
  "USD/TRY",
  "EUR/TRY",
  "GBP/TRY",
  "CHF/TRY",
  "EUR/USD",
  "BRENT",
]);

export function isLiveSymbol(symbol: string): boolean {
  if (!symbol) return false;
  const upper = symbol.toUpperCase().trim();
  return LIVE_SYMBOLS.has(upper) || DYNAMICALLY_DERIVED_SYMBOLS.has(upper);
}

export function getSymbolTicker(symbol: string): string {
  if (!symbol) return "";
  const upper = symbol.toUpperCase().trim();
  if (SYMBOL_MAP[upper]) return SYMBOL_MAP[upper];
  if (/^[A-Z0-9]{3,6}$/.test(upper) && !upper.includes("/") && !upper.includes(".")) {
    return `${upper}.IS`;
  }
  return upper;
}
