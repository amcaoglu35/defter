/**
 * Defter — Kurumsal Makro Senaryo & Stres Testi Motoru (Stress Test Engine)
 *
 * Simüle Edilen Makro Senaryolar:
 * 1. Döviz Şoku (USD/TRY +%25 Sıçrama)
 * 2. Faiz Şoku (TCMB Politika Faizi +500 bps Sıkılaşma)
 * 3. Piyasa Çöküşü (BIST 100 -%20 Sistemik Düzeltme)
 * 4. Küresel Emtia / Enerji Şoku (Brent Petrol +%30 Yükseliş)
 * 5. Enflasyonist Maliyet Baskısı (Girdi Maliyeti +%20, Brüt Marj Sıkışması)
 */

export interface StressHoldingInput {
  symbol: string;
  assetClass: "hisse" | "maden" | "fon" | "doviz";
  sector: string;
  weightPercent: number; // 0..100
  beta?: number;         // Piyasaya duyarlılık (varsayılan: 1.0)
  exportRatioPct?: number; // İhracat oranı (%)
  netDebtToEbitda?: number; // Net Borç / FAVÖK
}

export type ScenarioId =
  | "FX_SHOCK_USD"
  | "RATE_HIKE_TCMB"
  | "BIST_CRASH"
  | "ENERGY_SHOCK"
  | "MARGIN_SQUEEZE";

export interface StressScenarioDefinition {
  id: ScenarioId;
  title: string;
  description: string;
  category: "Döviz" | "Faiz" | "Piyasa" | "Emtia" | "Maliyet";
  severity: "Düşük" | "Orta" | "Yüksek" | "Kritik";
}

export interface HoldingStressResult {
  symbol: string;
  estimatedImpactPct: number; // % Etki (örn: -12.5 veya +8.2)
  reasoning: string;
}

export interface StressTestScenarioResult {
  scenario: StressScenarioDefinition;
  portfolioImpactPct: number;      // Tüm portföye toplam % etki
  portfolioImpactAmountTl: number; // Toplam TL tutar etkisi
  holdingImpacts: HoldingStressResult[];
  verdict: "Korumalı" | "Dengeli" | "Hassas" | "Yüksek Riskli";
  summary: string;
}

export const STRESS_SCENARIOS: StressScenarioDefinition[] = [
  {
    id: "FX_SHOCK_USD",
    title: "💵 Dolar/TL %25 Sıçrama Şoku",
    description: "Kurun aniden %25 yükselmesi durumunda ihracatçı, döviz varlıklı ve borçlu şirketlerin tepkisi.",
    category: "Döviz",
    severity: "Yüksek",
  },
  {
    id: "RATE_HIKE_TCMB",
    title: "🏦 TCMB +500 Bps Sıkılaşma Şoku",
    description: "Politika faizinin 500 baz puan artması durumunda yüksek borçlu ve finansal maliyetli şirketlerin etkilenme oranı.",
    category: "Faiz",
    severity: "Yüksek",
  },
  {
    id: "BIST_CRASH",
    title: "📉 BIST 100 %20 Sistemik Düzeltme",
    description: "Genel piyasa türbülansında beta katsayılarına göre sepetin değer kaybetme oranı.",
    category: "Piyasa",
    severity: "Kritik",
  },
  {
    id: "ENERGY_SHOCK",
    title: "🛢️ Brent Petrol %30 Yükseliş Şoku",
    description: "Enerji ve girdi maliyetlerinin aniden artması durumunda havacılık, çimento ve sanayi hisselerinin tepkisi.",
    category: "Emtia",
    severity: "Orta",
  },
  {
    id: "MARGIN_SQUEEZE",
    title: "📊 Enflasyonist Brüt Marj Sıkışması",
    description: "Girdi maliyet enflasyonunun ürün fiyatlarına yansıtılamaması sonucu marjların %15 daralması.",
    category: "Maliyet",
    severity: "Orta",
  },
];

/**
 * Tek bir varlığın belirli bir makro senaryoya tahmini etki oranını hesaplar.
 */
function calculateHoldingScenarioImpact(
  holding: StressHoldingInput,
  scenarioId: ScenarioId
): HoldingStressResult {
  const { symbol, assetClass, sector, beta = 1.0, exportRatioPct = 20, netDebtToEbitda = 1.5 } = holding;
  let impactPct = 0;
  let reasoning = "";

  switch (scenarioId) {
    case "FX_SHOCK_USD": {
      if (assetClass === "doviz" || assetClass === "maden") {
        impactPct = 24.5; // Döviz ve kıymetli maden doğrudan kazandırır
        reasoning = "Döviz/Maden cinsinden varlık kura %100 doğrudan indekslidir.";
      } else if (exportRatioPct >= 50) {
        impactPct = 12.0 + (exportRatioPct - 50) * 0.15;
        reasoning = `Yüksek ihracat oranı (%${exportRatioPct}) kur artışından pozitif etkilenir.`;
      } else if (netDebtToEbitda > 3.5) {
        impactPct = -14.0 - (netDebtToEbitda - 3.5) * 2.0;
        reasoning = `Yüksek net döviz borçluluğu (Net Borç/FAVÖK ${netDebtToEbitda}) kur farkı gideri yaratır.`;
      } else {
        impactPct = -3.5;
        reasoning = "Nötr döviz pozisyonu, genel maliyet artışından hafif olumsuz etkilenir.";
      }
      break;
    }

    case "RATE_HIKE_TCMB": {
      if (sector.includes("Finans") || sector.includes("Bankacılık")) {
        impactPct = -8.0;
        reasoning = "Kredi mevduat makası kısa vadede baskılanır.";
      } else if (netDebtToEbitda > 3.0) {
        impactPct = -16.0;
        reasoning = `Yüksek borçluluk (Net Borç/FAVÖK ${netDebtToEbitda}) finansman giderini katlar.`;
      } else if (netDebtToEbitda <= 0.5 || assetClass === "doviz") {
        impactPct = 4.0;
        reasoning = "Net nakit zengini bilanço yüksek mevduat getirisinden faydalanır.";
      } else {
        impactPct = -4.5;
        reasoning = "Faiz artışı genel değerleme çarpanlarını baskılar.";
      }
      break;
    }

    case "BIST_CRASH": {
      if (assetClass === "doviz" || assetClass === "maden") {
        impactPct = 1.5; // Güvenli liman
        reasoning = "BIST çöküşünde güvenli liman niteliği taşır.";
      } else {
        const effectiveBeta = Math.max(0.3, Math.min(2.5, beta));
        impactPct = -20.0 * effectiveBeta;
        reasoning = `BIST 100 -%20 çöküşünde Beta katsayısı (${effectiveBeta}) oranında geriler.`;
      }
      break;
    }

    case "ENERGY_SHOCK": {
      if (sector.includes("Havacılık") || sector.includes("Ulaştırma")) {
        impactPct = -18.0;
        reasoning = "Jet yakıtı giderleri toplam maliyetin %35-40'ını oluşturur.";
      } else if (sector.includes("Enerji") || sector.includes("Petrol")) {
        impactPct = 15.0;
        reasoning = "Petrol ve enerji fiyat artışları stok ve satış kârını artırır.";
      } else if (assetClass === "maden") {
        impactPct = 8.0;
        reasoning = "Enerji şokları enflasyonist çabayla altın ve emtialara yarar.";
      } else {
        impactPct = -4.0;
        reasoning = "Genel girdi maliyetlerinde yükseliş marjı daraltır.";
      }
      break;
    }

    case "MARGIN_SQUEEZE": {
      if (sector.includes("Gıda") || sector.includes("Perakende")) {
        impactPct = -2.5;
        reasoning = "Fiyatlama gücü yüksek, maliyeti tüketiciye hızlı yansıtır.";
      } else if (sector.includes("Teknoloji") || assetClass === "doviz") {
        impactPct = -1.0;
        reasoning = "Girdi maliyet bağımlılığı düşüktür.";
      } else {
        impactPct = -11.0;
        reasoning = "Girdi maliyeti artışı brüt kâr marjını daraltır.";
      }
      break;
    }
  }

  return {
    symbol,
    estimatedImpactPct: Number(impactPct.toFixed(2)),
    reasoning,
  };
}

/**
 * Tüm portföy için makro senaryo stres testi yürütür.
 *
 * @param holdings Portföydeki varlıklar ve ağırlıkları
 * @param totalPortfolioValueTl Portföyün toplam TL değeri (örn: 500,000 TL)
 * @param scenarioId İstenen senaryo ID'si veya 'ALL'
 */
export function runStressTest(
  holdings: StressHoldingInput[],
  totalPortfolioValueTl: number = 100000,
  scenarioId?: ScenarioId
): StressTestScenarioResult[] {
  if (!holdings || holdings.length === 0) return [];

  const totalWeight = holdings.reduce((sum, h) => sum + Math.max(0, h.weightPercent), 0) || 100;
  const targetScenarios = scenarioId
    ? STRESS_SCENARIOS.filter((s) => s.id === scenarioId)
    : STRESS_SCENARIOS;

  const results: StressTestScenarioResult[] = [];

  for (const def of targetScenarios) {
    let portfolioImpactPct = 0;
    const holdingImpacts: HoldingStressResult[] = [];

    for (const h of holdings) {
      const w = Math.max(0, h.weightPercent) / totalWeight;
      const res = calculateHoldingScenarioImpact(h, def.id);
      holdingImpacts.push(res);
      portfolioImpactPct += res.estimatedImpactPct * w;
    }

    portfolioImpactPct = Number(portfolioImpactPct.toFixed(2));
    const portfolioImpactAmountTl = Number(
      ((totalPortfolioValueTl * portfolioImpactPct) / 100).toFixed(2)
    );

    let verdict: StressTestScenarioResult["verdict"] = "Dengeli";
    if (portfolioImpactPct >= 5.0) verdict = "Korumalı";
    else if (portfolioImpactPct >= -5.0) verdict = "Dengeli";
    else if (portfolioImpactPct >= -15.0) verdict = "Hassas";
    else verdict = "Yüksek Riskli";

    const summary = `Bu senaryoda portföyün tahmini değer değişimi %${portfolioImpactPct >= 0 ? "+" : ""}${portfolioImpactPct} (${portfolioImpactAmountTl >= 0 ? "+" : ""}${portfolioImpactAmountTl.toLocaleString("tr-TR")} ₺) olarak hesaplanmıştır. Derece: ${verdict}.`;

    results.push({
      scenario: def,
      portfolioImpactPct,
      portfolioImpactAmountTl,
      holdingImpacts,
      verdict,
      summary,
    });
  }

  return results;
}
