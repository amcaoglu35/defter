import {
  analyzeKapDisclosure,
  KapDisclosureInput,
} from "../lib/kapSentimentEngine";

function assertEqual(actual: unknown, expected: unknown, message: string) {
  const actualStr = JSON.stringify(actual);
  const expectedStr = JSON.stringify(expected);
  if (actualStr !== expectedStr) {
    console.error(`❌ FAILED: ${message}\n  Expected: ${expectedStr}\n  Actual:   ${actualStr}`);
    process.exit(1);
  } else {
    console.log(`✅ PASSED: ${message}`);
  }
}

console.log("=== DEFTER KAP AI SENTIMENT & IMPACT SCORE ENGINE TESTS ===\n");

// Test 1: Material New Contract Announcement (High Materiality)
{
  const input: KapDisclosureInput = {
    id: "kap-101",
    symbol: "ASELS",
    title: "Yeni İş İlişkisi ve Satış Sözleşmesi Hakkında",
    summary: "Şirketimiz ile Savunma Sanayii Başkanlığı arasında 5.000.000.000 TL tutarında yeni iş sözleşmesi imzalanmıştır.",
    publishDate: "2025-05-10",
    contractAmountTl: 5000000000,
    companyMarketCapTl: 50000000000, // %10 materiality
  };

  const res = analyzeKapDisclosure(input);
  assertEqual(res.category, "NEW_CONTRACT", "Category identified as NEW_CONTRACT");
  assertEqual(res.signal, "BULLISH", "Signal is BULLISH");
  assertEqual(res.relativeMaterialityPct, 10.0, "Relative materiality is 10.0%");
  assertEqual(res.sentimentScore > 0.8, true, "High positive sentiment score (>0.8)");
}

// Test 2: Legal Litigation Risk Announcement (Bearish)
{
  const input: KapDisclosureInput = {
    id: "kap-102",
    symbol: "EREGL",
    title: "Hukuki Süreç ve Olumsuz Tazminat Davası Açılması",
    summary: "Şirketimiz aleyhine iptal ve vergi cezası talepli olumsuz dava açılmıştır.",
    publishDate: "2025-05-12",
  };

  const res = analyzeKapDisclosure(input);
  assertEqual(res.category, "LEGAL_REGULATORY", "Category identified as LEGAL_REGULATORY");
  assertEqual(res.signal, "BEARISH", "Signal is BEARISH");
  assertEqual(res.sentimentScore < -0.5, true, "Negative sentiment score (<-0.5)");
}

// Test 3: Share Buyback Announcement (Strong Bullish)
{
  const input: KapDisclosureInput = {
    id: "kap-103",
    symbol: "THYAO",
    title: "Yönetim Kurulu Payların Geri Alınması Kararı",
    summary: "Şirketimiz piyasa fiyatının istikrarlı oluşması için hisse geri alım programı başlatmıştır.",
    publishDate: "2025-05-14",
  };

  const res = analyzeKapDisclosure(input);
  assertEqual(res.category, "SHARE_BUYBACK", "Category identified as SHARE_BUYBACK");
  assertEqual(res.signal, "BULLISH", "Signal is BULLISH for share buyback");
}

console.log("\n🎉 ALL KAP AI SENTIMENT ENGINE TESTS PASSED PERFECTLY!");
