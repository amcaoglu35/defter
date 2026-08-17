import { Company } from "./mockData";

export interface SimilarCompanyMatch {
  company: Company;
  matchScore: number; // 0 to 100
  matchReasons: string[];
}

/**
 * Calculates algorithmic financial similarity between a target asset and the universe of companies.
 * Factors:
 * 1. Sector Alignment (40%)
 * 2. Market Cap Proximity (25%)
 * 3. Valuation Multiple (P/E & P/B) Alignment (25%)
 * 4. Asset Class / Exchange Compatibility (10%)
 */
export function getSimilarCompanies(
  target: Company,
  allCompanies: Company[],
  limit = 4
): SimilarCompanyMatch[] {
  if (!target || !allCompanies || allCompanies.length === 0) return [];

  const targetSymbol = target.symbol.toUpperCase();
  const candidates = allCompanies.filter(
    (c) => c.symbol.toUpperCase() !== targetSymbol && c.assetClass === target.assetClass
  );

  const scored: SimilarCompanyMatch[] = candidates.map((candidate) => {
    let score = 0;
    const matchReasons: string[] = [];

    // 1. Sector Match (Max 40 pts)
    if (target.sector && candidate.sector) {
      if (target.sector.toLowerCase() === candidate.sector.toLowerCase()) {
        score += 40;
        matchReasons.push(`Aynı Sektör (${target.sector})`);
      } else if (
        target.sector.toLowerCase().split(/[&/]/)[0].trim() ===
        candidate.sector.toLowerCase().split(/[&/]/)[0].trim()
      ) {
        score += 25;
        matchReasons.push("Benzer Faaliyet Alanı");
      }
    }

    // 2. Market Cap Proximity (Max 25 pts)
    const targetCap = parseMarketCap(target.marketCap);
    const candidateCap = parseMarketCap(candidate.marketCap);
    if (targetCap > 0 && candidateCap > 0) {
      const ratio = Math.max(targetCap, candidateCap) / Math.min(targetCap, candidateCap);
      if (ratio <= 1.5) {
        score += 25;
        matchReasons.push("Benzer Piyasa Büyüklüğü");
      } else if (ratio <= 3.0) {
        score += 15;
        matchReasons.push("Yakın Ölçek");
      } else if (ratio <= 5.0) {
        score += 8;
      }
    }

    // 3. P/E Multiple Proximity (Max 20 pts)
    if (
      target.peRatio &&
      candidate.peRatio &&
      target.peRatio > 0 &&
      candidate.peRatio > 0
    ) {
      const peDiff = Math.abs(target.peRatio - candidate.peRatio);
      if (peDiff <= 3.0) {
        score += 20;
        matchReasons.push(`Yakın F/K Çarpanı (${candidate.peRatio.toFixed(1)}x)`);
      } else if (peDiff <= 6.0) {
        score += 12;
      } else if (peDiff <= 10.0) {
        score += 5;
      }
    }

    // 4. Exchange Alignment (Max 15 pts)
    if (target.exchange && candidate.exchange && target.exchange === candidate.exchange) {
      score += 15;
    }

    return {
      company: candidate,
      matchScore: Math.min(100, Math.round(score)),
      matchReasons,
    };
  });

  return scored
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, limit);
}

function parseMarketCap(capStr?: string): number {
  if (!capStr) return 0;
  const num = parseFloat(capStr.replace(/[^\d.,]/g, "").replace(",", "."));
  if (isNaN(num)) return 0;
  if (capStr.includes("Mr") || capStr.includes("B")) return num * 1_000_000_000;
  if (capStr.includes("Mn") || capStr.includes("M")) return num * 1_000_000;
  return num;
}
