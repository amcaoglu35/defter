import { SupabaseClient } from "@supabase/supabase-js";
import { getSymbolTicker } from "./liveSymbols";

export interface AccuracyStatsResult {
  total: number;
  correct: number;
  accuracyRate: number;
  alAccuracy?: number;
  satAccuracy?: number;
  tutAccuracy?: number;
}

export interface CalibrationTier {
  band: string;
  count: number;
  correct: number;
  accuracyRate: number;
}

export interface ConfidenceCalibrationResult {
  isOverconfident: boolean;
  calibrationNote?: string;
  tiers: CalibrationTier[];
}

/**
 * Sunucu Tarafı AI Karar Değerlendirme Fonksiyonu
 * Geçmiş ai_history kayıtlarını hedef gün vadesi (target_period_days) dolduğunda
 * güncel hisse fiyatıyla karşılaştırarak deterministik olarak değerlendirir.
 */
export async function evaluatePendingOutcomesServerSide(
  supabase: SupabaseClient
): Promise<{ evaluated: number; updatedIds: string[] }> {
  try {
    const { data: pendingHistory, error: historyError } = await supabase
      .from("ai_history")
      .select("*")
      .is("outcome_correct", null)
      .not("price_at_verdict", "is", null);

    if (historyError || !pendingHistory || pendingHistory.length === 0) {
      return { evaluated: 0, updatedIds: [] };
    }

    // Şirket fiyat kütüğünü çek
    const { data: dbCompanies } = await supabase
      .from("companies")
      .select("symbol, price");

    const companyMap = new Map<string, number>();
    if (dbCompanies && Array.isArray(dbCompanies)) {
      for (const c of dbCompanies) {
        if (c.symbol && typeof c.price === "number") {
          companyMap.set(c.symbol.toUpperCase(), c.price);
        }
      }
    }

    let evaluatedCount = 0;
    const updatedIds: string[] = [];

    for (const item of pendingHistory) {
      if (!item.symbol || !item.price_at_verdict) continue;

      const verdictDateStr = item.verdict_date || item.created_at;
      if (!verdictDateStr) continue;

      const verdictTime = new Date(verdictDateStr).getTime();
      if (isNaN(verdictTime)) continue;

      const daysPassed = (Date.now() - verdictTime) / (1000 * 60 * 60 * 24);
      const targetDays = Number(item.target_period_days) || 30;

      // Henüz vadesi gelmemiş kararları atla
      if (daysPassed < targetDays) continue;

      const sym = item.symbol.toUpperCase();
      const curPrice = companyMap.get(sym);
      if (curPrice === undefined || curPrice <= 0) continue;

      const priceAtVerdict = Number(item.price_at_verdict);
      if (priceAtVerdict <= 0) continue;

      const stockReturn = ((curPrice - priceAtVerdict) / priceAtVerdict) * 100;
      const v = (item.verdict || item.verdict_tag || "").toUpperCase();

      let isCorrect: boolean | null = null;
      if (v.includes("AL")) {
        // AL tavsiyesi: hisse en az %1.0 değer kazandıysa başarılı
        isCorrect = stockReturn >= 1.0;
      } else if (v.includes("SAT")) {
        // SAT tavsiyesi: hisse en az %1.0 değer kaybettiyse başarılı
        isCorrect = stockReturn <= -1.0;
      } else if (v.includes("TUT") || v.includes("DENGELİ") || v.includes("NÖTR")) {
        // TUT/NÖTR: hisse ±%5 bant aralığında kaldıysa başarılı
        isCorrect = Math.abs(stockReturn) <= 5.0;
      }

      if (isCorrect !== null) {
        const { error: updateErr } = await supabase
          .from("ai_history")
          .update({
            outcome_correct: isCorrect,
            price_after_period: curPrice,
            outcome_checked_at: new Date().toISOString(),
          })
          .eq("id", item.id);

        if (!updateErr) {
          evaluatedCount++;
          updatedIds.push(String(item.id));
        }
      }
    }

    return { evaluated: evaluatedCount, updatedIds };
  } catch (err) {
    console.warn("[evaluatePendingOutcomesServerSide] Değerlendirme hatası:", err);
    return { evaluated: 0, updatedIds: [] };
  }
}

/**
 * Sunucu Tarafı Gerçek İsabet Oranı Hesaplayıcısı
 * 06 numaralı kural gereği sıfır uydurma veri prensibiyle çalışır.
 */
export async function computeServerSideAccuracyStats(
  supabase: SupabaseClient,
  symbol?: string
): Promise<AccuracyStatsResult | null> {
  try {
    let query = supabase
      .from("ai_history")
      .select("verdict, verdict_tag, outcome_correct")
      .not("outcome_correct", "is", null);

    if (symbol) {
      query = query.eq("symbol", symbol.toUpperCase());
    }

    const { data, error } = await query;
    if (error || !data || data.length === 0) {
      return null;
    }

    const total = data.length;
    const correct = data.filter((d) => d.outcome_correct === true).length;
    const accuracyRate = parseFloat(((correct / total) * 100).toFixed(1));

    const alItems = data.filter((d) => (d.verdict || d.verdict_tag || "").toUpperCase().includes("AL"));
    const satItems = data.filter((d) => (d.verdict || d.verdict_tag || "").toUpperCase().includes("SAT"));
    const tutItems = data.filter((d) => (d.verdict || d.verdict_tag || "").toUpperCase().includes("TUT"));

    const alAccuracy = alItems.length > 0
      ? parseFloat(((alItems.filter((d) => d.outcome_correct === true).length / alItems.length) * 100).toFixed(1))
      : undefined;

    const satAccuracy = satItems.length > 0
      ? parseFloat(((satItems.filter((d) => d.outcome_correct === true).length / satItems.length) * 100).toFixed(1))
      : undefined;

    const tutAccuracy = tutItems.length > 0
      ? parseFloat(((tutItems.filter((d) => d.outcome_correct === true).length / tutItems.length) * 100).toFixed(1))
      : undefined;

    return {
      total,
      correct,
      accuracyRate,
      alAccuracy,
      satAccuracy,
      tutAccuracy,
    };
  } catch (err) {
    console.warn("[computeServerSideAccuracyStats] Hata:", err);
    return null;
  }
}

/**
 * Güven Kalibrasyonu (Confidence Calibration)
 * Orakul'un yüksek güven verdiği tahminlerin gerçekte ne kadar isabetli olduğunu
 * ölçerek sistematik aşırı özgüven (overconfidence) sapmalarını tespit eder.
 */
export async function computeConfidenceCalibration(
  supabase: SupabaseClient
): Promise<ConfidenceCalibrationResult> {
  try {
    const { data, error } = await supabase
      .from("ai_history")
      .select("confidence, confidence_at_verdict, outcome_correct")
      .not("outcome_correct", "is", null);

    if (error || !data || data.length < 5) {
      return { isOverconfident: false, tiers: [] };
    }

    const highTier = { band: "%80 - %100 Yüksek Güven", count: 0, correct: 0, accuracyRate: 0 };
    const midTier = { band: "%60 - %79 Orta Güven", count: 0, correct: 0, accuracyRate: 0 };
    const lowTier = { band: "%0 - %59 Düşük Güven", count: 0, correct: 0, accuracyRate: 0 };

    for (const item of data) {
      let confNum = 70; // varsayılan
      if (typeof item.confidence_at_verdict === "number") {
        confNum = item.confidence_at_verdict;
      } else if (typeof item.confidence === "string") {
        const match = item.confidence.match(/(\d+)/);
        if (match) confNum = parseInt(match[1], 10);
      }

      const isCorrect = item.outcome_correct === true;

      if (confNum >= 80) {
        highTier.count++;
        if (isCorrect) highTier.correct++;
      } else if (confNum >= 60) {
        midTier.count++;
        if (isCorrect) midTier.correct++;
      } else {
        lowTier.count++;
        if (isCorrect) lowTier.correct++;
      }
    }

    highTier.accuracyRate = highTier.count > 0 ? parseFloat(((highTier.correct / highTier.count) * 100).toFixed(1)) : 0;
    midTier.accuracyRate = midTier.count > 0 ? parseFloat(((midTier.correct / midTier.count) * 100).toFixed(1)) : 0;
    lowTier.accuracyRate = lowTier.count > 0 ? parseFloat(((lowTier.correct / lowTier.count) * 100).toFixed(1)) : 0;

    // Sistematik aşırı özgüven tespiti: Yüksek güvenli tahminlerin başarı oranı %60'ın altındaysa
    const isOverconfident = highTier.count >= 5 && highTier.accuracyRate < 60;
    let calibrationNote: string | undefined;

    if (isOverconfident) {
      calibrationNote = `Aşırı Özgüven Uyarısı: %80+ güvenle verilen kararların gerçek başarı oranı %${highTier.accuracyRate}. Hakem kararlarında daha temkinli güven aralığı kullanılmalıdır.`;
    }

    return {
      isOverconfident,
      calibrationNote,
      tiers: [highTier, midTier, lowTier],
    };
  } catch (err) {
    console.warn("[computeConfidenceCalibration] Kalibrasyon hatası:", err);
    return { isOverconfident: false, tiers: [] };
  }
}
