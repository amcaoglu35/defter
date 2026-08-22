import { SupabaseClient } from "@supabase/supabase-js";

export interface UserPreferenceProfile {
  preferredPersona: string;
  riskTolerance: "düşük" | "orta" | "yüksek";
  sectorBias: Record<string, number>; // { "Havacılık": 35.5, "Bankacılık": 20.0 }
  topHoldings: string[];
  maxSingleHoldingWeightPct: number;
  verdictFollowRate: number | null; // % (AL dediklerinin kaçını sepete ekledi)
  personalizationContext: string;
}

/**
 * Kullanıcı Tercih Profili Hesaplayıcısı (Kişiselleştirme & Öğrenme Katmanı)
 * basket_holdings, user_settings ve ai_history tablolarını tarayarak
 * kullanıcının gerçek risk profilini, sektörel yoğunlaşmasını ve persona tercihini çıkarır.
 */
export async function computeUserPreferenceProfile(
  supabase: SupabaseClient,
  userId: string = "default_user"
): Promise<UserPreferenceProfile> {
  const defaultProfile: UserPreferenceProfile = {
    preferredPersona: "deger",
    riskTolerance: "orta",
    sectorBias: {},
    topHoldings: [],
    maxSingleHoldingWeightPct: 0,
    verdictFollowRate: null,
    personalizationContext: "Kullanıcı profili: Dengeli risk toleransı, Değer Yatırımcısı tercihi.",
  };

  try {
    const [
      { data: dbSettings },
      { data: dbBaskets },
      { data: dbHistory },
      { data: dbCompanies },
    ] = await Promise.all([
      supabase.from("user_settings").select("*").eq("id", userId).single(),
      supabase.from("baskets").select("*, basket_holdings(*)"),
      supabase.from("ai_history").select("symbol, verdict, verdict_tag, persona_used, created_at").limit(50),
      supabase.from("companies").select("symbol, sector, price"),
    ]);

    const companySectorMap = new Map<string, string>();
    if (dbCompanies && Array.isArray(dbCompanies)) {
      for (const c of dbCompanies) {
        if (c.symbol) companySectorMap.set(c.symbol.toUpperCase(), c.sector || "Genel");
      }
    }

    // 1. Sektör Dağılımı ve Pozisyon Büyüklüğü
    let totalPortfolioValue = 0;
    const holdingWeights = new Map<string, number>();
    const sectorValues = new Map<string, number>();

    if (dbBaskets && Array.isArray(dbBaskets)) {
      for (const basket of dbBaskets) {
        const holdings = (basket.basket_holdings || []) as Array<{
          company_symbol?: string;
          symbol?: string;
          shares?: number;
          amount?: number;
          weight_percent?: number;
        }>;

        const bVal = Number(basket.total_value) || 0;
        totalPortfolioValue += bVal;

        for (const h of holdings) {
          const sym = (h.company_symbol || h.symbol || "").toUpperCase();
          if (!sym) continue;

          const weightPct = Number(h.weight_percent) || 0;
          const posVal = bVal > 0 ? (weightPct / 100) * bVal : 1;

          holdingWeights.set(sym, (holdingWeights.get(sym) || 0) + posVal);

          const sector = companySectorMap.get(sym) || "Diğer";
          sectorValues.set(sector, (sectorValues.get(sector) || 0) + posVal);
        }
      }
    }

    // Sektör Yüzdeleri
    const sectorBias: Record<string, number> = {};
    if (totalPortfolioValue > 0) {
      for (const [sec, val] of sectorValues.entries()) {
        sectorBias[sec] = parseFloat(((val / totalPortfolioValue) * 100).toFixed(1));
      }
    }

    // En büyük tekil hisse ağırlığı
    let maxWeightPct = 0;
    const sortedHoldings = Array.from(holdingWeights.entries()).sort((a, b) => b[1] - a[1]);
    if (totalPortfolioValue > 0 && sortedHoldings.length > 0) {
      maxWeightPct = parseFloat(((sortedHoldings[0][1] / totalPortfolioValue) * 100).toFixed(1));
    }

    const topHoldings = sortedHoldings.slice(0, 3).map(([sym]) => sym);

    // 2. Risk Toleransı Türetimi
    let riskTolerance: "düşük" | "orta" | "yüksek" = "orta";
    if (maxWeightPct > 40 || sortedHoldings.length <= 2) {
      riskTolerance = "yüksek"; // Yüksek yoğunlaşma
    } else if (maxWeightPct < 20 && sortedHoldings.length >= 6) {
      riskTolerance = "düşük"; // Yüksek çeşitlendirme
    }

    // 3. Tercih Edilen Persona
    let preferredPersona = (dbSettings?.orakulPersona || dbSettings?.preferred_persona || "deger").toLowerCase();
    if (dbHistory && Array.isArray(dbHistory) && dbHistory.length > 0) {
      const personaCounts = new Map<string, number>();
      for (const item of dbHistory) {
        if (item.persona_used) {
          personaCounts.set(item.persona_used, (personaCounts.get(item.persona_used) || 0) + 1);
        }
      }
      let topCount = 0;
      for (const [p, count] of personaCounts.entries()) {
        if (count > topCount) {
          topCount = count;
          preferredPersona = p;
        }
      }
    }

    // 4. AL Tavsiyelerine Uyma Oranı (Verdict Follow Rate)
    let verdictFollowRate: number | null = null;
    if (dbHistory && Array.isArray(dbHistory) && holdingWeights.size > 0) {
      const alVerdicts = dbHistory.filter((h) => (h.verdict || h.verdict_tag || "").toUpperCase().includes("AL"));
      if (alVerdicts.length > 0) {
        const followed = alVerdicts.filter((h) => h.symbol && holdingWeights.has(h.symbol.toUpperCase())).length;
        verdictFollowRate = parseFloat(((followed / alVerdicts.length) * 100).toFixed(1));
      }
    }

    // 5. Kişiselleştirme Metni Oluşturma
    const sectorBiasStr = Object.entries(sectorBias)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([sec, pct]) => `${sec} (%${pct})`)
      .join(", ");

    const personalizationContext = `KULLANICI PROFİLİ:
- Risk Toleransı: ${riskTolerance.toUpperCase()} (${maxWeightPct > 35 ? `Tek hissede %${maxWeightPct} yoğunlaşma var` : "Dengeli portföy dağılımı"})
- Tercih Edilen Tarz: ${preferredPersona}
${sectorBiasStr ? `- Portföy Sektör Yoğunlaşması: ${sectorBiasStr}` : ""}
${topHoldings.length > 0 ? `- Mevcut Ana Varlıklar: ${topHoldings.join(", ")}` : ""}
KURAL: Kararını ve tonlamanı bu profile göre uyarla (örn. temkinli kullanıcıya riskleri daha detaylı açıkla). Ancak asla finansal gerçekleri veya değerleme metriklerini kullanıcının önyargılarına göre değiştirme.`;

    return {
      preferredPersona,
      riskTolerance,
      sectorBias,
      topHoldings,
      maxSingleHoldingWeightPct: maxWeightPct,
      verdictFollowRate,
      personalizationContext,
    };
  } catch (err) {
    console.warn("[computeUserPreferenceProfile] Profil hesaplama hatası:", err);
    return defaultProfile;
  }
}
