/**
 * Defter — Yapay Zeka Destekli KAP Bildirimi Duygu & Değer Etki Skoru Motoru (KAP Sentiment Engine)
 *
 * Kamuyu Aydınlatma Platformu (KAP) resmi bildirim metinlerini ve başlıklarını
 * finansal NLP kuralları ve kural tabanlı ağırlık matrisi ile ayrıştırarak
 * şirket piyasa değerine olası etkisini puanlar.
 *
 * Kategori Ayrıştırmaları:
 * 1. FINANCIALL_RESULTS: Bilanço / Çeyreklik Finansal Raporlar
 * 2. NEW_CONTRACT: Yeni İş İlişkisi / Satış Sözleşmesi / İhale
 * 3. INVESTMENT_CAPEX: Yatırım / Kapasite Artışı / Fabrika Açılışı
 * 4. DIVIDEND_BONUS: Temettü Dağıtımı / Bedelsiz Sermaye Artırımı
 * 5. SHARE_BUYBACK: Hisse Geri Alım Programı / Pay Alımı
 * 6. LEGAL_REGULATORY: Dava / Soruşturma / Maktu İdari Para Cezası
 * 7. CREDIT_RATING: Kredi Notu / Borçlanma Araçları İhracı
 */

export type KapCategory =
  | "FINANCIAL_RESULTS"
  | "NEW_CONTRACT"
  | "INVESTMENT_CAPEX"
  | "DIVIDEND_BONUS"
  | "SHARE_BUYBACK"
  | "LEGAL_REGULATORY"
  | "CREDIT_RATING"
  | "GENERAL";

export type SignalVerdict = "BULLISH" | "BEARISH" | "NEUTRAL";

export interface KapDisclosureInput {
  id: string;
  symbol: string;
  title: string;
  summary: string;
  publishDate: string;
  contractAmountTl?: number; // Varsa yeni iş ilişkisi tutarı (TL)
  companyMarketCapTl?: number; // Şirket piyasa değeri (TL)
}

export interface KapAnalysisResult {
  id: string;
  symbol: string;
  category: KapCategory;
  categoryLabel: string;
  publishDate: string;

  /** Duygu Skoru: -1.0 (Aşırı Olumsuz) ile +1.0 (Aşırı Olumlu) arası */
  sentimentScore: number;

  /** Tahmini Hızlı Fiyat Etkisi (%): örn +4.5% veya -3.2% */
  expectedPriceImpactPct: number;

  /** Oransal İş Büyüklüğü (%): Sözleşme Tutarı / Piyasa Değeri */
  relativeMaterialityPct?: number;

  /** Güven Derecesi */
  confidenceLevel: "Yüksek" | "Orta" | "Düşük";

  /** İşlem Sinyali */
  signal: SignalVerdict;

  /** Türkçe Özet & Değerlendirme */
  impactSummary: string;
  keyDrivers: string[];
}

const KEYWORD_RULES: Array<{
  category: KapCategory;
  label: string;
  keywords: string[];
  baseScore: number;
}> = [
  {
    category: "NEW_CONTRACT",
    label: "Yeni İş İlişkisi & İhale",
    keywords: ["yeni iş ilişkisi", "ihale", "sözleşme", "sipariş", "satış anlaşması", "tedarik"],
    baseScore: 0.65,
  },
  {
    category: "SHARE_BUYBACK",
    label: "Hisse Geri Alım Programı",
    keywords: ["geri alım", "pay alımı", "hisse geri alım", "payların geri alınması"],
    baseScore: 0.80,
  },
  {
    category: "DIVIDEND_BONUS",
    label: "Temettü & Bedelsiz Artırım",
    keywords: ["kâr payı", "temettü", "bedelsiz", "sermaye artırımı", "dağıtım"],
    baseScore: 0.70,
  },
  {
    category: "INVESTMENT_CAPEX",
    label: "Yatırım & Kapasite Artışı",
    keywords: ["yatırım", "kapasite artışı", "yeni tesis", "fabrika", "ges", "res", "ruhsat"],
    baseScore: 0.60,
  },
  {
    category: "FINANCIAL_RESULTS",
    label: "Finansal Rapor & Bilanço",
    keywords: ["bilanço", "finansal rapor", "net kâr", "hasılat", "favök", "çeyrek"],
    baseScore: 0.50,
  },
  {
    category: "LEGAL_REGULATORY",
    label: "Hukuki & İdari Süreç",
    keywords: ["dava", "ceza", "soruşturma", "iptal", "tazminat", "vergi incelemesi"],
    baseScore: -0.60,
  },
  {
    category: "CREDIT_RATING",
    label: "Kredi Notu & Borçlanma",
    keywords: ["kredi notu", "tahvil", "bono", "borçlanma aracı", "fitch", "moodys", "jcr"],
    baseScore: 0.30,
  },
];

/**
 * KAP Bildirimi NLP ve Duygu/Etki Skoru Hesaplar
 */
export function analyzeKapDisclosure(input: KapDisclosureInput): KapAnalysisResult {
  const fullText = `${input.title} ${input.summary}`.toLowerCase();
  const symbol = input.symbol.toUpperCase();

  // 1. Kategori ve Temel Skor Tespiti
  let matchedCategory: KapCategory = "GENERAL";
  let categoryLabel = "Genel Açıklama";
  let baseScore = 0.0;
  const matchedDrivers: string[] = [];

  for (const rule of KEYWORD_RULES) {
    for (const kw of rule.keywords) {
      if (fullText.includes(kw)) {
        matchedCategory = rule.category;
        categoryLabel = rule.label;
        baseScore = rule.baseScore;
        matchedDrivers.push(`"${kw.toUpperCase()}" ifadesi tespit edildi.`);
        break;
      }
    }
    if (matchedCategory !== "GENERAL") break;
  }

  // 2. Olumsuz Kelime Düzeltmesi (Negative Modifiers)
  const negativeKeywords = ["olumsuz", "iptal", "fesih", "zarar", "düşüş", "gecikme", "ceza", "durdurma"];
  let negativeModifierCount = 0;
  for (const negKw of negativeKeywords) {
    if (fullText.includes(negKw)) {
      negativeModifierCount++;
      matchedDrivers.push(`Olumsuz risk terimi: "${negKw}"`);
    }
  }

  if (negativeModifierCount > 0) {
    baseScore -= negativeModifierCount * 0.35;
  }

  // 3. Oransal İş Büyüklüğü (Contract Amount / Market Cap)
  let relativeMaterialityPct: number | undefined;
  let materialityMultiplier = 1.0;

  if (input.contractAmountTl && input.companyMarketCapTl && input.companyMarketCapTl > 0) {
    relativeMaterialityPct = (input.contractAmountTl / input.companyMarketCapTl) * 100;
    matchedDrivers.push(
      `Sözleşme tutarı (${input.contractAmountTl.toLocaleString("tr-TR")} ₺), piyasa değerinin %${relativeMaterialityPct.toFixed(1)} kadarıdır.`
    );

    if (relativeMaterialityPct > 10.0) materialityMultiplier = 1.8;
    else if (relativeMaterialityPct > 5.0) materialityMultiplier = 1.4;
    else if (relativeMaterialityPct > 1.0) materialityMultiplier = 1.1;
  }

  // 4. Nihai Duygu ve Fiyat Etkisi Skoru
  const rawSentiment = baseScore * materialityMultiplier;
  const sentimentScore = Number(Math.max(-1.0, Math.min(1.0, rawSentiment)).toFixed(2));
  const expectedPriceImpactPct = Number((sentimentScore * 6.0).toFixed(2)); // Max ±6.0% ortalama şok tahmini

  // 5. Sinyal ve Güven Seviyesi
  let signal: SignalVerdict = "NEUTRAL";
  if (sentimentScore >= 0.25) signal = "BULLISH";
  else if (sentimentScore <= -0.25) signal = "BEARISH";

  let confidenceLevel: KapAnalysisResult["confidenceLevel"] = "Orta";
  if (relativeMaterialityPct !== undefined || Math.abs(sentimentScore) >= 0.7) {
    confidenceLevel = "Yüksek";
  } else if (matchedCategory === "GENERAL") {
    confidenceLevel = "Düşük";
  }

  const impactSummary =
    signal === "BULLISH"
      ? `${symbol} için ${categoryLabel} kapsamında pozitif bildirim. Tahmini fiyat etkisi %${expectedPriceImpactPct >= 0 ? "+" : ""}${expectedPriceImpactPct}.`
      : signal === "BEARISH"
      ? `${symbol} için ${categoryLabel} kapsamında olumsuz bildirim. Tahmini fiyat etki riski %${expectedPriceImpactPct}.`
      : `${symbol} açıklaması nötr/bilgilendirme niteliğindedir. Önemli bir fiyat şoku beklenmiyor.`;

  return {
    id: input.id,
    symbol,
    category: matchedCategory,
    categoryLabel,
    publishDate: input.publishDate,
    sentimentScore,
    expectedPriceImpactPct,
    relativeMaterialityPct: relativeMaterialityPct ? Number(relativeMaterialityPct.toFixed(2)) : undefined,
    confidenceLevel,
    signal,
    impactSummary,
    keyDrivers: matchedDrivers.length > 0 ? matchedDrivers : ["Genel KAP duyurusu."],
  };
}
