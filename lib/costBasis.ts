/**
 * Defter — Kurumsal Maliyet ve Muhasebe Motoru (Cost Basis Engine)
 *
 * Desteklenen Muhasebe Metotları:
 * 1. FIFO (First-In, First-Out): Vergi ve gerçek kazanç takibinde her alım lotu
 *    ayrı saklanır, satışlar en eski lottan eritilerek tam gerçekleşen kâr/zarar bulunur.
 * 2. WAC (Weighted Average Cost / Ağırlıklı Ortalama Maliyet): Geleneksel portföy
 *    takip standardı. Her alımda ortalama maliyet güncellenir, satışta birim ortalama maliyet düşülür.
 *
 * Kurumsal İşlemler (Corporate Actions):
 * - BUY: Yeni lot / ortalama maliyet artışı (komisyon dahil)
 * - SELL: Lot eritme / gerçekleşen kâr-zarar hesabı (stopaj ve komisyon dahil)
 * - DIVIDEND: Nakit temettü geliri kaydı (maliyeti düşürmez, temettü kütüğüne işlenir)
 * - SPLIT: Hisse bölünmesi (lot sayısı oranla çarpılır, birim maliyet bölünür)
 * - BONUS: Bedelsiz sermaye artırımı (sıfır maliyetle lot eklenir, ortalama maliyet düşer)
 * - FEE: Doğrudan portföy gideri
 * - TAX: Doğrudan vergi / stopaj kesintisi
 */

export type TransactionType =
  | "BUY"
  | "SELL"
  | "DIVIDEND"
  | "FEE"
  | "TAX"
  | "SPLIT"
  | "BONUS";

export type CostBasisMethod = "FIFO" | "WAC";

export interface TransactionRecord {
  id: string;
  companySymbol: string;
  type: TransactionType;
  quantity: number;
  price: number;
  totalAmount: number;
  date: string;
  fee?: number;
  tax?: number;
  note?: string;
  basketId?: string;
  /** Bölünme/Bedelsiz oranı: örn. 2 = %100 bedelsiz / 2'ye bölünme, 0.5 = 2 hisse 1'e birleşme */
  splitRatio?: number;
}

export interface TaxLot {
  id: string;
  transactionId: string;
  symbol: string;
  buyDate: string;
  originalQuantity: number;
  remainingQuantity: number;
  unitCost: number;
  fee: number;
}

export interface MatchedLotDetail {
  lotId: string;
  buyDate: string;
  quantity: number;
  unitCost: number;
  realizedGain: number;
  holdingDays: number;
  isShortTerm: boolean;
}

export interface RealizedGainLoss {
  transactionId: string;
  symbol: string;
  sellDate: string;
  quantitySold: number;
  sellPrice: number;
  grossProceeds: number;
  costBasis: number;
  realizedGain: number;
  realizedGainPct: number;
  fee: number;
  tax: number;
  netRealizedGain: number;
  method: CostBasisMethod;
  matchedLots?: MatchedLotDetail[];
}

export interface PositionCostSummary {
  symbol: string;
  totalQuantity: number;
  averageCost: number;
  totalCostBasis: number;
  currentPrice: number;
  currentValue: number;
  unrealizedGain: number;
  unrealizedGainPct: number;
  realizedGainTotal: number;
  dividendIncomeTotal: number;
  feesTotal: number;
  taxesTotal: number;
  netProfitTotal: number;
  openLots: TaxLot[];
}

export interface PortfolioCostBasisReport {
  method: CostBasisMethod;
  positions: Record<string, PositionCostSummary>;
  totalCostBasis: number;
  totalCurrentValue: number;
  totalUnrealizedGain: number;
  totalUnrealizedGainPct: number;
  totalRealizedGain: number;
  totalDividendIncome: number;
  totalFees: number;
  totalTaxes: number;
  totalNetProfit: number;
  realizedEvents: RealizedGainLoss[];
}

/**
 * Gün farkı hesaplar (YYYY-MM-DD formatında)
 */
function getHoldingDays(startDateStr: string, endDateStr: string): number {
  const start = new Date(startDateStr).getTime();
  const end = new Date(endDateStr).getTime();
  if (isNaN(start) || isNaN(end) || end < start) return 0;
  return Math.max(0, Math.floor((end - start) / (1000 * 60 * 60 * 24)));
}

/**
 * Bir sembol için tüm geçmiş işlemleri FIFO yöntemiyle işler.
 */
export function calculatePositionFifo(
  symbol: string,
  transactions: TransactionRecord[],
  currentPrice: number = 0
): {
  summary: PositionCostSummary;
  realizedEvents: RealizedGainLoss[];
} {
  const sortedTx = [...transactions]
    .filter((t) => t.companySymbol.toUpperCase() === symbol.toUpperCase())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const openLots: TaxLot[] = [];
  const realizedEvents: RealizedGainLoss[] = [];

  let totalDividendIncome = 0;
  let totalFees = 0;
  let totalTaxes = 0;
  let totalRealizedGain = 0;

  for (const tx of sortedTx) {
    const fee = tx.fee ?? 0;
    const tax = tx.tax ?? 0;
    totalFees += fee;
    totalTaxes += tax;

    switch (tx.type) {
      case "BUY": {
        const qty = Math.max(0, tx.quantity);
        if (qty > 0) {
          const effectiveUnitCost = (tx.totalAmount + fee) / qty;
          openLots.push({
            id: `lot-${tx.id}`,
            transactionId: tx.id,
            symbol: symbol.toUpperCase(),
            buyDate: tx.date,
            originalQuantity: qty,
            remainingQuantity: qty,
            unitCost: effectiveUnitCost,
            fee,
          });
        }
        break;
      }

      case "SELL": {
        let qtyToSell = Math.max(0, tx.quantity);
        const sellPrice = tx.price;
        const grossProceeds = qtyToSell * sellPrice;
        let matchedCostBasis = 0;
        const matchedLots: MatchedLotDetail[] = [];

        while (qtyToSell > 0 && openLots.length > 0) {
          const oldestLot = openLots[0];
          const qtyFromLot = Math.min(qtyToSell, oldestLot.remainingQuantity);
          const costFromLot = qtyFromLot * oldestLot.unitCost;
          const lotGain = qtyFromLot * sellPrice - costFromLot;
          const holdingDays = getHoldingDays(oldestLot.buyDate, tx.date);

          matchedLots.push({
            lotId: oldestLot.id,
            buyDate: oldestLot.buyDate,
            quantity: qtyFromLot,
            unitCost: oldestLot.unitCost,
            realizedGain: lotGain,
            holdingDays,
            isShortTerm: holdingDays < 365,
          });

          matchedCostBasis += costFromLot;
          oldestLot.remainingQuantity -= qtyFromLot;
          qtyToSell -= qtyFromLot;

          if (oldestLot.remainingQuantity <= 0.000001) {
            openLots.shift();
          }
        }

        const realizedGain = grossProceeds - matchedCostBasis;
        const netRealizedGain = realizedGain - fee - tax;
        const realizedGainPct = matchedCostBasis > 0 ? (realizedGain / matchedCostBasis) * 100 : 0;

        totalRealizedGain += netRealizedGain;

        realizedEvents.push({
          transactionId: tx.id,
          symbol: symbol.toUpperCase(),
          sellDate: tx.date,
          quantitySold: tx.quantity,
          sellPrice,
          grossProceeds,
          costBasis: matchedCostBasis,
          realizedGain,
          realizedGainPct: Number(realizedGainPct.toFixed(2)),
          fee,
          tax,
          netRealizedGain,
          method: "FIFO",
          matchedLots,
        });
        break;
      }

      case "DIVIDEND": {
        totalDividendIncome += tx.totalAmount;
        break;
      }

      case "SPLIT": {
        const ratio = tx.splitRatio ?? (tx.price > 0 && tx.quantity > 0 ? tx.quantity : 1);
        if (ratio > 0 && ratio !== 1) {
          for (const lot of openLots) {
            lot.originalQuantity = lot.originalQuantity * ratio;
            lot.remainingQuantity = lot.remainingQuantity * ratio;
            lot.unitCost = lot.unitCost / ratio;
          }
        }
        break;
      }

      case "BONUS": {
        // Bedelsiz sermaye artırımı: ekstra lotlar sıfır maliyetle eklenir, mevcut lotların birim maliyetini düşürür
        const bonusQty = Math.max(0, tx.quantity);
        const currentTotalQty = openLots.reduce((s, l) => s + l.remainingQuantity, 0);
        if (bonusQty > 0 && currentTotalQty > 0) {
          const expansionFactor = (currentTotalQty + bonusQty) / currentTotalQty;
          for (const lot of openLots) {
            lot.remainingQuantity = lot.remainingQuantity * expansionFactor;
            lot.unitCost = lot.unitCost / expansionFactor;
          }
        }
        break;
      }

      case "FEE":
      case "TAX":
        // Ek masraflar toplam fee/tax kütüğüne yukarıda eklendi
        break;
    }
  }

  const remainingQuantity = openLots.reduce((s, l) => s + l.remainingQuantity, 0);
  const totalCostBasis = openLots.reduce((s, l) => s + l.remainingQuantity * l.unitCost, 0);
  const averageCost = remainingQuantity > 0 ? totalCostBasis / remainingQuantity : 0;
  const effectivePrice = currentPrice > 0 ? currentPrice : averageCost;
  const currentValue = remainingQuantity * effectivePrice;
  const unrealizedGain = currentValue - totalCostBasis;
  const unrealizedGainPct = totalCostBasis > 0 ? (unrealizedGain / totalCostBasis) * 100 : 0;
  const netProfitTotal = totalRealizedGain + unrealizedGain + totalDividendIncome - totalFees - totalTaxes;

  return {
    summary: {
      symbol: symbol.toUpperCase(),
      totalQuantity: Number(remainingQuantity.toFixed(4)),
      averageCost: Number(averageCost.toFixed(4)),
      totalCostBasis: Number(totalCostBasis.toFixed(2)),
      currentPrice: effectivePrice,
      currentValue: Number(currentValue.toFixed(2)),
      unrealizedGain: Number(unrealizedGain.toFixed(2)),
      unrealizedGainPct: Number(unrealizedGainPct.toFixed(2)),
      realizedGainTotal: Number(totalRealizedGain.toFixed(2)),
      dividendIncomeTotal: Number(totalDividendIncome.toFixed(2)),
      feesTotal: Number(totalFees.toFixed(2)),
      taxesTotal: Number(totalTaxes.toFixed(2)),
      netProfitTotal: Number(netProfitTotal.toFixed(2)),
      openLots,
    },
    realizedEvents,
  };
}

/**
 * Bir sembol için tüm geçmiş işlemleri WAC (Ağırlıklı Ortalama Maliyet) yöntemiyle işler.
 */
export function calculatePositionWac(
  symbol: string,
  transactions: TransactionRecord[],
  currentPrice: number = 0
): {
  summary: PositionCostSummary;
  realizedEvents: RealizedGainLoss[];
} {
  const sortedTx = [...transactions]
    .filter((t) => t.companySymbol.toUpperCase() === symbol.toUpperCase())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  let totalQuantity = 0;
  let totalCostBasis = 0;
  let averageCost = 0;

  let totalDividendIncome = 0;
  let totalFees = 0;
  let totalTaxes = 0;
  let totalRealizedGain = 0;

  const realizedEvents: RealizedGainLoss[] = [];

  for (const tx of sortedTx) {
    const fee = tx.fee ?? 0;
    const tax = tx.tax ?? 0;
    totalFees += fee;
    totalTaxes += tax;

    switch (tx.type) {
      case "BUY": {
        const qty = Math.max(0, tx.quantity);
        if (qty > 0) {
          const buyCost = tx.totalAmount + fee;
          totalQuantity += qty;
          totalCostBasis += buyCost;
          averageCost = totalQuantity > 0 ? totalCostBasis / totalQuantity : 0;
        }
        break;
      }

      case "SELL": {
        const qtyToSell = Math.min(Math.max(0, tx.quantity), totalQuantity);
        if (qtyToSell > 0) {
          const costOfSharesSold = qtyToSell * averageCost;
          const grossProceeds = qtyToSell * tx.price;
          const realizedGain = grossProceeds - costOfSharesSold;
          const netRealizedGain = realizedGain - fee - tax;
          const realizedGainPct = costOfSharesSold > 0 ? (realizedGain / costOfSharesSold) * 100 : 0;

          totalQuantity -= qtyToSell;
          totalCostBasis -= costOfSharesSold;
          if (totalQuantity <= 0.000001) {
            totalQuantity = 0;
            totalCostBasis = 0;
            averageCost = 0;
          }

          totalRealizedGain += netRealizedGain;

          realizedEvents.push({
            transactionId: tx.id,
            symbol: symbol.toUpperCase(),
            sellDate: tx.date,
            quantitySold: qtyToSell,
            sellPrice: tx.price,
            grossProceeds,
            costBasis: costOfSharesSold,
            realizedGain,
            realizedGainPct: Number(realizedGainPct.toFixed(2)),
            fee,
            tax,
            netRealizedGain,
            method: "WAC",
          });
        }
        break;
      }

      case "DIVIDEND": {
        totalDividendIncome += tx.totalAmount;
        break;
      }

      case "SPLIT": {
        const ratio = tx.splitRatio ?? (tx.price > 0 && tx.quantity > 0 ? tx.quantity : 1);
        if (ratio > 0 && ratio !== 1) {
          totalQuantity = totalQuantity * ratio;
          averageCost = averageCost / ratio;
          // totalCostBasis değişmez
        }
        break;
      }

      case "BONUS": {
        const bonusQty = Math.max(0, tx.quantity);
        if (bonusQty > 0) {
          totalQuantity += bonusQty;
          averageCost = totalQuantity > 0 ? totalCostBasis / totalQuantity : 0;
        }
        break;
      }

      case "FEE":
      case "TAX":
        break;
    }
  }

  const effectivePrice = currentPrice > 0 ? currentPrice : averageCost;
  const currentValue = totalQuantity * effectivePrice;
  const unrealizedGain = currentValue - totalCostBasis;
  const unrealizedGainPct = totalCostBasis > 0 ? (unrealizedGain / totalCostBasis) * 100 : 0;
  const netProfitTotal = totalRealizedGain + unrealizedGain + totalDividendIncome - totalFees - totalTaxes;

  return {
    summary: {
      symbol: symbol.toUpperCase(),
      totalQuantity: Number(totalQuantity.toFixed(4)),
      averageCost: Number(averageCost.toFixed(4)),
      totalCostBasis: Number(totalCostBasis.toFixed(2)),
      currentPrice: effectivePrice,
      currentValue: Number(currentValue.toFixed(2)),
      unrealizedGain: Number(unrealizedGain.toFixed(2)),
      unrealizedGainPct: Number(unrealizedGainPct.toFixed(2)),
      realizedGainTotal: Number(totalRealizedGain.toFixed(2)),
      dividendIncomeTotal: Number(totalDividendIncome.toFixed(2)),
      feesTotal: Number(totalFees.toFixed(2)),
      taxesTotal: Number(totalTaxes.toFixed(2)),
      netProfitTotal: Number(netProfitTotal.toFixed(2)),
      openLots: [],
    },
    realizedEvents,
  };
}

/**
 * Tüm portföyün maliyet analiz raporunu üretir.
 */
export function calculatePortfolioCostBasis(
  transactions: TransactionRecord[],
  currentPrices: Record<string, number> = {},
  method: CostBasisMethod = "FIFO"
): PortfolioCostBasisReport {
  const symbols = Array.from(
    new Set(transactions.map((t) => t.companySymbol.toUpperCase()))
  );

  const positions: Record<string, PositionCostSummary> = {};
  const allRealizedEvents: RealizedGainLoss[] = [];

  let totalCostBasis = 0;
  let totalCurrentValue = 0;
  let totalRealizedGain = 0;
  let totalDividendIncome = 0;
  let totalFees = 0;
  let totalTaxes = 0;

  for (const sym of symbols) {
    const price = currentPrices[sym] ?? 0;
    const { summary, realizedEvents } =
      method === "FIFO"
        ? calculatePositionFifo(sym, transactions, price)
        : calculatePositionWac(sym, transactions, price);

    positions[sym] = summary;
    allRealizedEvents.push(...realizedEvents);

    totalCostBasis += summary.totalCostBasis;
    totalCurrentValue += summary.currentValue;
    totalRealizedGain += summary.realizedGainTotal;
    totalDividendIncome += summary.dividendIncomeTotal;
    totalFees += summary.feesTotal;
    totalTaxes += summary.taxesTotal;
  }

  const totalUnrealizedGain = totalCurrentValue - totalCostBasis;
  const totalUnrealizedGainPct = totalCostBasis > 0 ? (totalUnrealizedGain / totalCostBasis) * 100 : 0;
  const totalNetProfit = totalRealizedGain + totalUnrealizedGain + totalDividendIncome - totalFees - totalTaxes;

  return {
    method,
    positions,
    totalCostBasis: Number(totalCostBasis.toFixed(2)),
    totalCurrentValue: Number(totalCurrentValue.toFixed(2)),
    totalUnrealizedGain: Number(totalUnrealizedGain.toFixed(2)),
    totalUnrealizedGainPct: Number(totalUnrealizedGainPct.toFixed(2)),
    totalRealizedGain: Number(totalRealizedGain.toFixed(2)),
    totalDividendIncome: Number(totalDividendIncome.toFixed(2)),
    totalFees: Number(totalFees.toFixed(2)),
    totalTaxes: Number(totalTaxes.toFixed(2)),
    totalNetProfit: Number(totalNetProfit.toFixed(2)),
    realizedEvents: allRealizedEvents.sort(
      (a, b) => new Date(b.sellDate).getTime() - new Date(a.sellDate).getTime()
    ),
  };
}
