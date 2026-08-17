import { Basket, Company } from "./mockData";
import { Transaction } from "./store";
import ExcelJS from "exceljs";

/**
 * Trigger browser file download for text/CSV content with UTF-8 BOM for Turkish character support in Excel.
 */
export function downloadCsvFile(filename: string, csvContent: string) {
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
 * Export a single basket's holdings to a styled, formatted Microsoft Excel (.xlsx) file using ExcelJS.
 */
export async function exportBasketToExcel(basket: Basket, companies: Company[]) {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Defter Kişisel Servet & Yatırım Takip";
  workbook.created = new Date();

  const worksheet = workbook.addWorksheet(basket.name.slice(0, 30) || "Sepet Varlıkları", {
    views: [{ state: "frozen", ySplit: 1 }],
  });

  // Define columns with widths and format
  worksheet.columns = [
    { header: "Varlık Kodu", key: "symbol", width: 14 },
    { header: "Şirket / Varlık Adı", key: "name", width: 28 },
    { header: "Sektör", key: "sector", width: 18 },
    { header: "Adet (Lot)", key: "quantity", width: 14 },
    { header: "Ortalama Maliyet (₺)", key: "avgCost", width: 20 },
    { header: "Güncel Fiyat (₺)", key: "currentPrice", width: 18 },
    { header: "Toplam Değer (₺)", key: "totalValue", width: 20 },
    { header: "Toplam Maliyet (₺)", key: "totalCost", width: 20 },
    { header: "Net Kâr / Zarar (₺)", key: "profitVal", width: 20 },
    { header: "Kâr/Zarar (%)", key: "profitPct", width: 16 },
    { header: "Sepet Ağırlığı (%)", key: "weightPct", width: 18 },
  ];

  // Style header row
  const headerRow = worksheet.getRow(1);
  headerRow.height = 28;
  headerRow.eachCell((cell) => {
    cell.font = { name: "Arial", size: 11, bold: true, color: { argb: "FFFFFFFF" } };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF1E293B" }, // Defter dark slate
    };
    cell.alignment = { vertical: "middle", horizontal: "center" };
    cell.border = {
      bottom: { style: "medium", color: { argb: "FFC9A24B" } },
    };
  });

  // Populate data rows
  basket.holdings.forEach((h) => {
    const co = companies.find((c) => c.symbol.toUpperCase() === h.companySymbol.toUpperCase());
    const name = co ? co.name : h.companySymbol;
    const sector = co ? co.sector : "Genel";
    const currentPrice = co ? co.price : (h.currentPrice || h.avgCost);
    const totalVal = h.quantity * currentPrice;
    const totalCost = h.quantity * h.avgCost;
    const profitVal = totalVal - totalCost;
    const profitPct = totalCost > 0 ? (profitVal / totalCost) * 100 : 0;

    const row = worksheet.addRow({
      symbol: h.companySymbol,
      name,
      sector,
      quantity: h.quantity,
      avgCost: Number(h.avgCost.toFixed(2)),
      currentPrice: Number(currentPrice.toFixed(2)),
      totalValue: Number(totalVal.toFixed(2)),
      totalCost: Number(totalCost.toFixed(2)),
      profitVal: Number(profitVal.toFixed(2)),
      profitPct: Number(profitPct.toFixed(2)),
      weightPct: Number((h.weightPercent || 0).toFixed(2)),
    });

    row.height = 22;
    row.alignment = { vertical: "middle" };

    // Format currency numbers
    row.getCell("avgCost").numFmt = '#,##0.00 "₺"';
    row.getCell("currentPrice").numFmt = '#,##0.00 "₺"';
    row.getCell("totalValue").numFmt = '#,##0.00 "₺"';
    row.getCell("totalCost").numFmt = '#,##0.00 "₺"';
    row.getCell("profitVal").numFmt = '#,##0.00 "₺"';
    row.getCell("profitPct").numFmt = '0.00"%"';
    row.getCell("weightPct").numFmt = '0.00"%"';

    // Highlight profit / loss in green / red
    const profitCell = row.getCell("profitVal");
    const pctCell = row.getCell("profitPct");
    if (profitVal >= 0) {
      profitCell.font = { color: { argb: "FF059669" }, bold: true };
      pctCell.font = { color: { argb: "FF059669" }, bold: true };
    } else {
      profitCell.font = { color: { argb: "FFDC2626" }, bold: true };
      pctCell.font = { color: { argb: "FFDC2626" }, bold: true };
    }
  });

  // Summary row
  const totalVal = basket.totalValue;
  const totalCost = basket.totalCost;
  const totalProfit = totalVal - totalCost;
  const totalProfitPct = totalCost > 0 ? (totalProfit / totalCost) * 100 : 0;

  const summaryRow = worksheet.addRow({
    symbol: "TOPLAM",
    name: basket.name,
    sector: "",
    quantity: basket.holdings.reduce((sum, h) => sum + h.quantity, 0),
    avgCost: "",
    currentPrice: "",
    totalValue: Number(totalVal.toFixed(2)),
    totalCost: Number(totalCost.toFixed(2)),
    profitVal: Number(totalProfit.toFixed(2)),
    profitPct: Number(totalProfitPct.toFixed(2)),
    weightPct: 100,
  });

  summaryRow.height = 26;
  summaryRow.font = { bold: true };
  summaryRow.eachCell((cell) => {
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFF1F5F9" },
    };
    cell.border = {
      top: { style: "thin", color: { argb: "FF94A3B8" } },
      bottom: { style: "double", color: { argb: "FF1E293B" } },
    };
  });

  summaryRow.getCell("totalValue").numFmt = '#,##0.00 "₺"';
  summaryRow.getCell("totalCost").numFmt = '#,##0.00 "₺"';
  summaryRow.getCell("profitVal").numFmt = '#,##0.00 "₺"';
  summaryRow.getCell("profitPct").numFmt = '0.00"%"';

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = URL.createObjectURL(blob);
  const cleanName = basket.name.toLowerCase().replace(/[^a-z0-9]/gi, "_");
  const dateStr = new Date().toISOString().split("T")[0];
  const link = document.createElement("a");
  link.href = url;
  link.download = `defter_sepet_${cleanName}_${dateStr}.xlsx`;
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
 * Export all user buy/sell transactions to a styled Excel (.xlsx) file.
 */
export async function exportTransactionsToExcel(transactions: Transaction[]) {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Defter Kişisel Servet & Yatırım Takip";
  workbook.created = new Date();

  const worksheet = workbook.addWorksheet("İşlem Geçmişi", {
    views: [{ state: "frozen", ySplit: 1 }],
  });

  worksheet.columns = [
    { header: "İşlem No", key: "id", width: 14 },
    { header: "Tarih", key: "date", width: 14 },
    { header: "Varlık", key: "symbol", width: 14 },
    { header: "İşlem Türü", key: "type", width: 14 },
    { header: "Adet (Lot)", key: "quantity", width: 14 },
    { header: "Birim Fiyat (₺)", key: "price", width: 18 },
    { header: "Toplam Tutar (₺)", key: "totalAmount", width: 20 },
    { header: "Sepet ID", key: "basketId", width: 16 },
    { header: "İşlem Notu", key: "note", width: 30 },
  ];

  const headerRow = worksheet.getRow(1);
  headerRow.height = 28;
  headerRow.eachCell((cell) => {
    cell.font = { name: "Arial", size: 11, bold: true, color: { argb: "FFFFFFFF" } };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF1E293B" },
    };
    cell.alignment = { vertical: "middle", horizontal: "center" };
    cell.border = {
      bottom: { style: "medium", color: { argb: "FFC9A24B" } },
    };
  });

  transactions.forEach((tx) => {
    const row = worksheet.addRow({
      id: tx.id.slice(0, 8),
      date: tx.date,
      symbol: tx.companySymbol,
      type: tx.type === "BUY" ? "ALIŞ" : "SATIŞ",
      quantity: tx.quantity,
      price: Number(tx.price.toFixed(2)),
      totalAmount: Number(tx.totalAmount.toFixed(2)),
      basketId: tx.basketId || "Bağımsız",
      note: tx.note || "",
    });

    row.height = 22;
    row.alignment = { vertical: "middle" };
    row.getCell("price").numFmt = '#,##0.00 "₺"';
    row.getCell("totalAmount").numFmt = '#,##0.00 "₺"';

    const typeCell = row.getCell("type");
    if (tx.type === "BUY") {
      typeCell.font = { color: { argb: "FF059669" }, bold: true };
    } else {
      typeCell.font = { color: { argb: "FFDC2626" }, bold: true };
    }
  });

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = URL.createObjectURL(blob);
  const dateStr = new Date().toISOString().split("T")[0];
  const link = document.createElement("a");
  link.href = url;
  link.download = `defter_islemler_${dateStr}.xlsx`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
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
    "Sepet ID",
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
    `"${t.basketId || "Genel"}"`,
    `"${(t.note || "").replace(/"/g, '""')}"`,
  ]);

  const csvContent = [headers.join(";"), ...rows.map((r) => r.join(";"))].join("\r\n");
  const dateStr = new Date().toISOString().split("T")[0];
  downloadCsvFile(`defter_islemler_${dateStr}.csv`, csvContent);
}
