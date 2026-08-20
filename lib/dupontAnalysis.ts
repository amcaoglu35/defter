/**
 * Defter — DuPont Return on Equity (ROE) Decomposition Engine
 * Deconstructs ROE into 3 distinct operational drivers:
 * 1. Net Profit Margin (Operating Efficiency / Pricing Power)
 * 2. Asset Turnover (Asset Utilization Speed)
 * 3. Equity Multiplier (Financial Leverage & Solvency Risk)
 *
 * Formula: ROE = Net Profit Margin × Asset Turnover × Equity Multiplier
 * Sektör ortalaması varsayımlarına dayalı yaklaşık (proxy) model — şirket için gerçek
 * gelir tablosu verileri (totalRevenue, netIncome) mevcut değilse tahminleme olarak kullanılır.
 */

import { Company } from "./mockData";

export interface DuPontAnalysisResult {
  roePct: number; // Return on Equity (%)
  netProfitMarginPct: number; // Net Margin (%)
  assetTurnoverRatio: number; // Asset Turnover (x)
  equityMultiplier: number; // Financial Leverage (x)
  isEstimated: boolean; // Gerçek bilanço verisi mi yoksa sektör proxy tahmini mi?
  profitabilityDriver: "Yüksek Kâr Marjı (Fiyatlama Gücü)" | "Hızlı Varlık Devri (Operasyonel Hız)" | "Finansal Kaldıraç (Borçluluk)";
  healthVerdict: "Mükemmel & Organik" | "Sağlıklı" | "Kaldıraç Ağırlıklı (Riskli)" | "Düşük Verim";
  summary: string;
}

export function performDuPontAnalysis(company: Company): DuPontAnalysisResult {
  // Extract or proxy baseline financial ratios
  const pbRatio = company.pbRatio || 2.5;
  const peRatio = company.peRatio || 12;

  // Approximate ROE from P/B and P/E: ROE = (P/B) / (P/E)
  let rawRoe = peRatio > 0 ? (pbRatio / peRatio) * 100 : 15;
  rawRoe = Math.max(1, Math.min(120, rawRoe));

  const parsedRevenue = typeof company.totalRevenue === "number"
    ? company.totalRevenue
    : company.totalRevenue
    ? parseFloat(String(company.totalRevenue).replace(/[^0-9.,-]/g, "").replace(",", "."))
    : null;

  const parsedNetIncome = typeof company.netIncome === "number"
    ? company.netIncome
    : company.netIncome
    ? parseFloat(String(company.netIncome).replace(/[^0-9.,-]/g, "").replace(",", "."))
    : null;

  const hasGenuineIncomeData =
    typeof parsedRevenue === "number" &&
    !isNaN(parsedRevenue) &&
    parsedRevenue > 0 &&
    typeof parsedNetIncome === "number" &&
    !isNaN(parsedNetIncome);

  let isEstimated = !hasGenuineIncomeData;
  let netMargin = 12.5;
  let assetTurnover = 0.85;
  let leverage = 2.2;

  if (hasGenuineIncomeData && parsedRevenue && parsedNetIncome !== null) {
    // Gerçek gelir tablosu verileri mevcutsa doğrudan hesapla
    netMargin = Number(((parsedNetIncome / parsedRevenue) * 100).toFixed(1));
    // ROE = NetMargin * Turnover * Leverage => Turnover * Leverage = ROE / NetMargin
    const remainingMultiple = netMargin > 0 ? rawRoe / netMargin : 1.5;
    assetTurnover = Number(Math.max(0.2, Math.min(4.0, Math.sqrt(remainingMultiple))).toFixed(2));
    leverage = Number(Math.max(1.0, Math.min(10.0, remainingMultiple / assetTurnover)).toFixed(2));
  } else {
    // Sektör bazlı proxy varsayımları
    if (["Banka", "Finansal Hizmetler"].includes(company.sector)) {
      netMargin = 22.0;
      assetTurnover = 0.15;
      leverage = 7.5; // High leverage inherent to banks
    } else if (["Perakende & Tüketim", "Toptan Ticaret"].includes(company.sector)) {
      netMargin = 4.5;
      assetTurnover = 2.8; // High turnover
      leverage = 2.4;
    } else if (["Yazılım & Bilişim", "Teknoloji"].includes(company.sector)) {
      netMargin = 28.0; // High margin
      assetTurnover = 0.95;
      leverage = 1.4;
    } else if (["Sanayi & Üretim", "Otomotiv", "Kimya & Petrol"].includes(company.sector)) {
      netMargin = 11.0;
      assetTurnover = 1.1;
      leverage = 2.1;
    }
  }

  // Adjust components to match company ROE
  const product = (netMargin / 100) * assetTurnover * leverage * 100;
  const scale = product > 0 ? rawRoe / product : 1;
  const finalMargin = Number((netMargin * Math.sqrt(scale)).toFixed(1));
  const finalTurnover = Number((assetTurnover * Math.pow(scale, 0.25)).toFixed(2));
  const finalLeverage = Number((leverage * Math.pow(scale, 0.25)).toFixed(2));
  const finalRoe = Number(rawRoe.toFixed(1));

  let profitabilityDriver: DuPontAnalysisResult["profitabilityDriver"] = "Yüksek Kâr Marjı (Fiyatlama Gücü)";
  if (finalLeverage > 4.5 && company.sector !== "Banka") {
    profitabilityDriver = "Finansal Kaldıraç (Borçluluk)";
  } else if (finalTurnover > 1.8) {
    profitabilityDriver = "Hızlı Varlık Devri (Operasyonel Hız)";
  }

  let healthVerdict: DuPontAnalysisResult["healthVerdict"] = "Sağlıklı";
  if (finalRoe > 35 && finalLeverage < 3.0) healthVerdict = "Mükemmel & Organik";
  else if (finalLeverage > 5.0 && company.sector !== "Banka") healthVerdict = "Kaldıraç Ağırlıklı (Riskli)";
  else if (finalRoe < 8) healthVerdict = "Düşük Verim";

  const noteEstimated = isEstimated
    ? " Bu şirket için detaylı gelir tablosu verisi mevcut olmadığından, rakamlar sektör ortalamalarına dayalı bir yaklaşık modeldir."
    : "";

  const summary = `${company.name} için %${finalRoe} seviyesindeki Özkaynak Kârlılığı (ROE); %${finalMargin} net kâr marjı, ${finalTurnover}x varlık devir hızı ve ${finalLeverage}x kaldıraç çarpanı bileşimiyle üretilmektedir.${noteEstimated}`;

  return {
    roePct: finalRoe,
    netProfitMarginPct: finalMargin,
    assetTurnoverRatio: finalTurnover,
    equityMultiplier: finalLeverage,
    isEstimated,
    profitabilityDriver,
    healthVerdict,
    summary,
  };
}
