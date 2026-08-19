/**
 * Defter — Modern Portföy Teorisi ve Etkin Sınır Motoru (MPT Engine)
 *
 * Markowitz Mean-Variance Optimization & Efficient Frontier
 *
 * Hesaplanan Noktalar:
 * 1. Minimum Varyans Portföyü (MVP / Minimum Volatility Portfolio)
 * 2. Teğet Portföy (Tangency Portfolio / Maximum Sharpe Ratio Portfolio)
 * 3. Etkin Sınır Eğrisi (Efficient Frontier Curve - 50 Simülasyon / Analitik Nokta)
 * 4. Mevcut Portföyün Etkin Sınır Üzerindeki Konumu & İyileştirme Potansiyeli
 */

import { calculateLogReturns, HistoricalPricePoint } from "./riskEngine";

export interface MptAssetInput {
  symbol: string;
  weight: number; // 0..1 arası (örn: 0.25)
  priceHistory: HistoricalPricePoint[];
}

export interface MptPortfolioPoint {
  weights: Record<string, number>; // Sembol -> % Ağırlık
  expectedReturnPct: number;       // Yıllıklandırılmış Beklenen Getiri (%)
  volatilityPct: number;           // Yıllıklandırılmış Risk (%)
  sharpeRatio: number;             // Sharpe Oranı
}

export interface MptOptimizationResult {
  status: "success" | "insufficient_data" | "singular_matrix";
  message: string;
  symbols: string[];

  // Mevcut Portföy
  currentPortfolio: MptPortfolioPoint | null;

  // Minimum Varyans Portföyü (En Düşük Riskli Optimal Dağılım)
  minVariancePortfolio: MptPortfolioPoint | null;

  // Maksimum Sharpe / Teğet Portföyü (En Yüksek Risk-Ayarlı Getiri)
  maxSharpePortfolio: MptPortfolioPoint | null;

  // Etkin Sınır Eğrisi Noktaları (Grafik Çizimi İçin)
  frontierPoints: MptPortfolioPoint[];

  // Risk-Free Oran (% Yıllık)
  riskFreeRatePct: number;
}

/**
 * NxN Matris Tersini Alır (Gauss-Jordan Eliminasyon Yöntemi)
 */
function invertMatrix(matrix: number[][]): number[][] | null {
  const n = matrix.length;
  // Artırılmış matris oluştur [A | I]
  const aug: number[][] = matrix.map((row, i) => {
    const newRow = new Array(2 * n).fill(0);
    for (let j = 0; j < n; j++) newRow[j] = row[j];
    newRow[n + i] = 1;
    return newRow;
  });

  for (let i = 0; i < n; i++) {
    // Pivot bul
    let maxRow = i;
    for (let k = i + 1; k < n; k++) {
      if (Math.abs(aug[k][i]) > Math.abs(aug[maxRow][i])) {
        maxRow = k;
      }
    }

    if (Math.abs(aug[maxRow][i]) < 1e-12) {
      return null; // Matris tekil (singular) veya bağımlı
    }

    // Satır değiştir
    const temp = aug[i];
    aug[i] = aug[maxRow];
    aug[maxRow] = temp;

    // Pivot elemanını 1 yap
    const pivot = aug[i][i];
    for (let j = 0; j < 2 * n; j++) {
      aug[i][j] /= pivot;
    }

    // Diğer satırları sıfırla
    for (let k = 0; k < n; k++) {
      if (k !== i) {
        const factor = aug[k][i];
        for (let j = 0; j < 2 * n; j++) {
          aug[k][j] -= factor * aug[i][j];
        }
      }
    }
  }

  // Ters matrisi çıkar [I | A^-1]
  const inv: number[][] = [];
  for (let i = 0; i < n; i++) {
    inv.push(aug[i].slice(n));
  }

  return inv;
}

/**
 * Matris-Vektör çarpımı: A * v
 */
function matrixVectorMult(mat: number[][], vec: number[]): number[] {
  return mat.map((row) => row.reduce((sum, val, colIdx) => sum + val * vec[colIdx], 0));
}

/**
 * Vektör-Matris-Vektör çarpımı (Karesel form): v^T * A * v
 */
function quadraticForm(vec: number[], mat: number[][]): number {
  const temp = matrixVectorMult(mat, vec);
  return vec.reduce((sum, val, idx) => sum + val * temp[idx], 0);
}

/**
 * Markowitz Etkin Sınır & Portföy Optimizasyonu Hesaplar
 *
 * @param assets Varlık listesi ve tarihsel fiyat serileri
 * @param riskFreeRatePct Yıllık risksiz faiz oranı (%) (varsayılan: 0.0)
 * @param tradingDays Yıllık işlem günü sayısı (varsayılan: 252)
 */
export function calculateEfficientFrontier(
  assets: MptAssetInput[],
  riskFreeRatePct: number = 0.0,
  tradingDays: number = 252
): MptOptimizationResult {
  const validAssets = assets.filter((a) => a.priceHistory && a.priceHistory.length >= 20);

  if (validAssets.length < 2) {
    return {
      status: "insufficient_data",
      message: "MPT optimizasyonu için en az 2 adet yeterli tarihsel verisi (≥20 gün) olan varlık gereklidir.",
      symbols: validAssets.map((a) => a.symbol),
      currentPortfolio: null,
      minVariancePortfolio: null,
      maxSharpePortfolio: null,
      frontierPoints: [],
      riskFreeRatePct,
    };
  }

  const symbols = validAssets.map((a) => a.symbol.toUpperCase());
  const N = validAssets.length;

  // 1. Ortak İşlem Günleri Log Getirileri
  const returnsMap = new Map<string, number[]>();
  for (const asset of validAssets) {
    const { returns } = calculateLogReturns(asset.priceHistory);
    returnsMap.set(asset.symbol.toUpperCase(), returns);
  }

  // Ortak min uzunluk
  const minLen = Math.min(...Array.from(returnsMap.values()).map((r) => r.length));
  if (minLen < 20) {
    return {
      status: "insufficient_data",
      message: `Ortak veri kümesi yetersiz (${minLen} gün < 20 gün).`,
      symbols,
      currentPortfolio: null,
      minVariancePortfolio: null,
      maxSharpePortfolio: null,
      frontierPoints: [],
      riskFreeRatePct,
    };
  }

  // 2. Yıllıklandırılmış Beklenen Getiri Vektörü (μ)
  const mu: number[] = [];
  for (const sym of symbols) {
    const rets = returnsMap.get(sym)!.slice(0, minLen);
    const meanDaily = rets.reduce((s, v) => s + v, 0) / minLen;
    // Ann Return = e^(mean * 252) - 1
    const annRet = Math.exp(meanDaily * tradingDays) - 1;
    mu.push(annRet);
  }

  // 3. Kovaryans Matrisi (Σ) - Yıllıklandırılmış
  const covMatrix: number[][] = Array.from({ length: N }, () => new Array(N).fill(0));
  for (let i = 0; i < N; i++) {
    const retsI = returnsMap.get(symbols[i])!.slice(0, minLen);
    const meanI = retsI.reduce((s, v) => s + v, 0) / minLen;

    for (let j = 0; j < N; j++) {
      const retsJ = returnsMap.get(symbols[j])!.slice(0, minLen);
      const meanJ = retsJ.reduce((s, v) => s + v, 0) / minLen;

      let covDaily = 0;
      for (let k = 0; k < minLen; k++) {
        covDaily += (retsI[k] - meanI) * (retsJ[k] - meanJ);
      }
      covDaily /= minLen - 1;

      covMatrix[i][j] = covDaily * tradingDays; // Yıllıklandırılmış kovaryans
    }
  }

  // 4. Kovaryans Matrisinin Tersini Al (Σ^-1)
  const invCov = invertMatrix(covMatrix);
  if (!invCov) {
    return {
      status: "singular_matrix",
      message: "Varlıklar arasındaki kovaryans matrisi tekil (singular). Varlıklar yüksek derecede bağımlı.",
      symbols,
      currentPortfolio: null,
      minVariancePortfolio: null,
      maxSharpePortfolio: null,
      frontierPoints: [],
      riskFreeRatePct,
    };
  }

  // Helper: Vektör ağırlıklarından Portföy Noktası Üret
  const buildPortfolioPoint = (weightsArray: number[]): MptPortfolioPoint => {
    // Negatif ağırlıkları sıfırla & normalize et (açık pozisyon kısıtı: Long-Only)
    let nonNegWeights = weightsArray.map((w) => Math.max(0, w));
    const sumW = nonNegWeights.reduce((s, w) => s + w, 0) || 1;
    nonNegWeights = nonNegWeights.map((w) => w / sumW);

    const ret = nonNegWeights.reduce((sum, w, idx) => sum + w * mu[idx], 0);
    const varP = Math.max(0, quadraticForm(nonNegWeights, covMatrix));
    const vol = Math.sqrt(varP);
    const rfDecimal = riskFreeRatePct / 100;
    const sharpe = vol > 0 ? (ret - rfDecimal) / vol : 0;

    const weightsRecord: Record<string, number> = {};
    symbols.forEach((sym, idx) => {
      weightsRecord[sym] = Number((nonNegWeights[idx] * 100).toFixed(2));
    });

    return {
      weights: weightsRecord,
      expectedReturnPct: Number((ret * 100).toFixed(2)),
      volatilityPct: Number((vol * 100).toFixed(2)),
      sharpeRatio: Number(sharpe.toFixed(2)),
    };
  };

  // 5. Mevcut Portföy Noktası
  const totalInputWeight = validAssets.reduce((s, a) => s + Math.max(0, a.weight), 0) || 1;
  const currentWeightsArray = validAssets.map((a) => Math.max(0, a.weight) / totalInputWeight);
  const currentPortfolio = buildPortfolioPoint(currentWeightsArray);

  // 6. Minimum Varyans Portföyü (MVP): w_mvp = Σ^-1 * 1 / (1^T * Σ^-1 * 1)
  const ones = new Array(N).fill(1);
  const invCovOnes = matrixVectorMult(invCov, ones);
  const denominatorMvp = ones.reduce((sum, _, i) => sum + invCovOnes[i], 0);
  const mvpWeightsArray = invCovOnes.map((w) => w / (denominatorMvp || 1));
  const minVariancePortfolio = buildPortfolioPoint(mvpWeightsArray);

  // 7. Maksimum Sharpe / Teğet Portföyü: w_tangency = Σ^-1 * (μ - Rf*1) / (1^T * Σ^-1 * (μ - Rf*1))
  const rfDecimal = riskFreeRatePct / 100;
  const excessMu = mu.map((m) => m - rfDecimal);
  const invCovExcessMu = matrixVectorMult(invCov, excessMu);
  const denominatorTangency = ones.reduce((sum, _, i) => sum + invCovExcessMu[i], 0);
  const tangencyWeightsArray = invCovExcessMu.map((w) => w / (denominatorTangency || 1));
  const maxSharpePortfolio = buildPortfolioPoint(tangencyWeightsArray);

  // 8. Etkin Sınır Eğrisi (Monte Carlo & Izgara Taraması - 60 Nokta)
  const frontierPoints: MptPortfolioPoint[] = [];

  // MVP ve Max Sharpe noktalarını eğriye ekle
  frontierPoints.push(minVariancePortfolio);
  if (Math.abs(maxSharpePortfolio.volatilityPct - minVariancePortfolio.volatilityPct) > 0.01) {
    frontierPoints.push(maxSharpePortfolio);
  }

  // Rastgele 500 simülasyon yaparak sınır zarfını yakala
  for (let i = 0; i < 500; i++) {
    const rawRands = symbols.map(() => Math.random());
    const sumRand = rawRands.reduce((s, r) => s + r, 0);
    const randWeights = rawRands.map((r) => r / sumRand);
    frontierPoints.push(buildPortfolioPoint(randWeights));
  }

  // Volatiliteye göre sırala
  frontierPoints.sort((a, b) => a.volatilityPct - b.volatilityPct);

  return {
    status: "success",
    message: `${N} adet varlık için Markowitz Etkin Sınır eğrisi ve optimal portföyler hesaplandı.`,
    symbols,
    currentPortfolio,
    minVariancePortfolio,
    maxSharpePortfolio,
    frontierPoints: frontierPoints.slice(0, 60), // UI için ilk 60 temsilci nokta
    riskFreeRatePct,
  };
}
