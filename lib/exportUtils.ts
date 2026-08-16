import { Basket, Company } from "./mockData";
import { Transaction } from "./store";

/**
 * Trigger browser file download for text/CSV content with UTF-8 BOM for Turkish character support in Excel.
 */
export function downloadCsvFile(filename: string, csvContent: string) {
  // UTF-8 BOM prefix (\uFEFF) ensures Excel opens Turkish characters (ç, ğ, ı, ö, ş, ü, ₺) correctly
  const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Export a single basket's holdings to Excel-compatible CSV.
 */
export function exportBasketToCsv(basket: Basket, companies: Company[]) {
  const headers = [
    "Varlık Kodu",
    "Şirket / Varlık Adı",
    "Sektör",
    "Adet (Lot)",
    "Ortalama Maliyet (TL)",
    "Güncel Fiyat (TL)",
    "Toplam Değer (TL)",
    "Toplam Maliyet (TL)",
    "Kâr/Zarar Tutarı (TL)",
    "Kâr/Zarar Oranı (%)",
    "Sepet Ağırlığı (%)",
  ];

  const rows = basket.holdings.map((h) => {
    const co = companies.find((c) => c.symbol.toUpperCase() === h.companySymbol.toUpperCase());
    const name = co ? co.name : h.companySymbol;
    const sector = co ? co.sector : "Genel";
    const currentPrice = co ? co.price : (h.currentPrice || h.avgCost);
    const totalVal = h.quantity * currentPrice;
    const totalCost = h.quantity * h.avgCost;
    const profitVal = totalVal - totalCost;
    const profitPct = totalCost > 0 ? ((profitVal / totalCost) * 100).toFixed(2) : "0.00";

    return [
      `"${h.companySymbol}"`,
      `"${name.replace(/"/g, '""')}"`,
      `"${sector}"`,
      h.quantity,
      h.avgCost.toFixed(2),
      currentPrice.toFixed(2),
      totalVal.toFixed(2),
      totalCost.toFixed(2),
      profitVal.toFixed(2),
      `"%${profitPct}"`,
      `"%${h.weightPercent}"`,
    ];
  });

  // Summary row
  const totalVal = basket.totalValue;
  const totalCost = basket.totalCost;
  const totalProfit = totalVal - totalCost;
  const totalProfitPct = totalCost > 0 ? ((totalProfit / totalCost) * 100).toFixed(2) : "0.00";

  rows.push([
    '"TOPLAM / ÖZET"',
    `"${basket.name.replace(/"/g, '""')}"`,
    '""',
    basket.holdings.reduce((sum, h) => sum + h.quantity, 0),
    '""',
    '""',
    totalVal.toFixed(2),
    totalCost.toFixed(2),
    totalProfit.toFixed(2),
    `"%${totalProfitPct}"`,
    '"%100"',
  ]);

  const csvContent = [headers.join(";"), ...rows.map((r) => r.join(";"))].join("\r\n");
  const cleanName = basket.name.toLowerCase().replace(/[^a-z0-9]/gi, "_");
  const dateStr = new Date().toISOString().split("T")[0];
  downloadCsvFile(`defter_sepet_${cleanName}_${dateStr}.csv`, csvContent);
}

/**
 * Export all user buy/sell transactions to CSV.
 */
export function exportTransactionsToCsv(transactions: Transaction[]) {
  const headers = [
    "İşlem ID",
    "Tarih",
    "Varlık",
    "İşlem Tipi",
    "Adet",
    "Birim Fiyat",
    "Toplam Tutar",
    "Not",
  ];

  const rows = transactions.map((t) => [
    `"${t.id}"`,
    `"${t.date}"`,
    `"${t.companySymbol}"`,
    `"${t.type === "BUY" ? "ALIŞ" : "SATIŞ"}"`,
    t.quantity,
    t.price.toFixed(2),
    t.totalAmount.toFixed(2),
    `"${(t.note || "").replace(/"/g, '""')}"`,
  ]);

  const csvContent = [headers.join(";"), ...rows.map((r) => r.join(";"))].join("\r\n");
  const dateStr = new Date().toISOString().split("T")[0];
  downloadCsvFile(`defter_tum_islemler_${dateStr}.csv`, csvContent);
}
