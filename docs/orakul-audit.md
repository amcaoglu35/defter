# Defter Orakul AI Modülleri Kapsamlı Sayısal Doğruluk & Halüsinasyon Denetim Raporu (Audit)

> **Tarih:** 2026-08-21  
> **Kapsam:** `app/orakul/page.tsx`, `lib/aiService.ts`, `lib/aiToolsService.ts`, `components/AutonomousScanFeed.tsx`, `components/AiModelPortfolios.tsx`  
> **Kural Referansı:** Defter Geliştirici Kuralı 1 — *Finansal Veri Dürüstlüğü ve Şeffaflık (Sıfır Uydurma/Mock Sayı Kuralı)*

---

## 1. Yönetici Özeti

Orakul AI modülleri genelinde yapılan denetimde, yapay zekanın (LLM) finansal metrik üretme rolü ile deterministik algoritmaların rolü ayrıştırılmıştır. Daha önce "Sepet Sihirbazı" için uygulanan *deterministik hesaplama + Zod şema koruması + AI yorumu sınırlaması* metodolojisi, Defter bünyesindeki tüm Orakul alt modüllerine uygulanmaktadır.

---

## 2. Modül Bazında Detaylı Denetim ve Envanter Tablosu

| # | Modül Adı | Kaynak Fonksiyon / Dosya | Üretici Mekanizma | Hangi Sayısal Alanlar LLM'e, Hangileri Koda Ait? | Gerçek Geçmiş / Piyasa Verisi? | Risk Derecesi | Alınan / Uygulanan Önlem |
|---|---|---|---|---|---|---|---|
| **1** | **Zaman Makinesi (Backtest)** | `runBacktestSimulation` (`lib/aiService.ts`) | **Deterministik Kod + AI Sözel Yorumu** | **Kod:** `portfolioReturnPct`, `bist100ReturnPct`, `goldReturnPct`, `alphaOverBist`, `maxDrawdownPct`, `sharpeRatio`, `timeline` <br>**LLM:** Sadece `aiAnalysisVerdict` sözel paragrafı | **Evet (Yahoo Finance - `fetchHistoricalDailyCloses`)** | 🟢 **GÜVENLİ (Referans Benchmark)** | Sayısal tüm veriler 1 yıllık günlük kapanış serilerinden formüllerle hesaplanmaktadır. LLM hiçbir sayı üretmemektedir. |
| **2** | **Akıllı Hisse Tarayıcısı (Screener)** | `screenStocksWithAI` (`lib/aiService.ts`) | **LLM + Akıllı Arama & Ön Sıralayıcı** | **LLM:** `matchScore` (%90 vb.), `aiRationale` <br>**Kod:** Şirket Fiyatı, F/K, PD/DD, Temettü Verimi | **Evet (Kütük Şirket Verileri)** | 🔴 **YÜKSEK RİSK** (Düzeltildi) | Kullanıcı "F/K < 8" gibi sayısal filtre girdiğinde LLM filtre dışı hisse önerebiliyordu. Kod tarafında `extractNumericFilters` ile kesin filtreleme ve deterministik `matchScore` uygulandı. |
| **3** | **Şirket Analizi & Teşhisi** | `generateCompanyAnalysis` (`lib/aiService.ts`) | **LLM + `calculateValuationFormulas`** | **LLM:** `targetPrice12M` (`price * 1.35`), `altmanZScore`, `confidence`, `upsidePotential` <br>**Kod:** `grahamNumber`, `dcfFairValue`, `piotroskiFScore`, `dupontRoePct`, `mertonDefaultProbabilityPct` | **Evet (Kütük + Matematiksel Değerleme)** | 🔴 **YÜKSEK RİSK** (Düzeltildi) | Prompt içerisindeki sabit `price * 1.35` mock formülü kaldırıldı. `dcfFairValue`, `grahamNumber`, `altmanZScore`, `piotroskiScore`, `dupontRoe` doğrudan `quantEngine.ts` hesaplamasıyla ezildi. |
| **4** | **Bilanço Karnesi (Earnings Flash)** | `generateEarningsFlash` (`lib/aiService.ts`) | **LLM / Kural Fallback** | **LLM:** `healthScore` (1-10), `grade` (A+..F), `revenueGrowth`, `grossMargin` <br>**Kod:** Şirket Fiyat, F/K, PD/DD, Temettü | **Evet (Kütük Bilanço Çarpanları)** | 🟡 **ORTA RİSK** (Düzeltildi) | `healthScore` ve `grade` doğrudan Stanford Piotroski F-Score ve kütük kârlılık oranlarına bağlandı; sözel analist yorumları LLM'e bırakıldı. |
| **5** | **Değer Tuzağı Dedektörü (Value Trap)** | `detectValueTraps` (`lib/aiService.ts`) | **LLM / Adli Finans Fallback** | **LLM:** `altmanZScore`, `piotroskiFScore`, `trapRiskScore`, `interestCoverageRatio` <br>**Kod:** Çarpan kütüğü | **Evet (Kütük Çarpanları + Adli Formüller)** | 🔴 **YÜKSEK RİSK** (Düzeltildi) | `calculateValuationFormulas` ile `altmanZScore`, `altmanZone`, `piotroskiFScore`, `beneishMScore` ve `interestCoverageRatio` deterministik hesaplanıp LLM çıktısı ezildi. |
| **6** | **Otonom AI Tarayıcı** | `runAutonomousScan` (`lib/aiToolsService.ts`) | **LLM + Havuz Filtreleme** | **LLM:** `targetPrice` (`price * 1.20`), `valuationScore` <br>**Kod:** Şirket Fiyat, Çarpanlar, Değişim | **Evet (Kütük Şirket Verileri)** | 🔴 **YÜKSEK RİSK** (Düzeltildi) | Sabit `price * 1.20` kaldırıldı. `calculateValuationFormulas` entegrasyonu ile model adil değeri (DCF/Graham) atandı; `valuationScore` formüllere bağlandı. |
| **7** | **AI Model Sepetler** | `generateAiModelBaskets` (`lib/aiToolsService.ts`) | **Kural Filtresi + AI Yorumu** | **Kod:** `weight`, `priceAtCreation`, `priceNow`, `totalReturnPct` <br>**LLM:** Sadece `summary` | **Evet (Kütük Şirket Verileri)** | 🟢 **GÜVENLİ** | Varlık seçimi ve ağırlıklandırma zaten kod tarafında `item.filter` ile yapılıyor. LLM sadece 1-2 cümlelik gerekçe yazıyor. |
| **8** | **Günlük Brifing / Kasa Mektubu** | `generateDailyBriefing`, `generateWeeklyLetter` (`lib/aiService.ts`) | **Kod Hesabı + AI Metin Üretimi** | **Kod:** `portChange`, `bistChange`, `topWinner`, `topLoser`, `alphaDiff` <br>**LLM:** `executiveSummary`, `tacticalTip` | **Evet (Kullanıcı Portföyü + BIST Verisi)** | 🟢 **GÜVENLİ** | Tüm getiriler ve kazanan/kaybeden hisseler kullanıcı kütüğünden matematiksel hesaplanıyor; LLM sadece metin üretiyor. |
| **9** | **Haber & Duygu Analizi** | `generateSentimentAnalysis` (`lib/aiService.ts`) | **LLM + `analyzeNewsTitleSentiment`** | **Kod:** Başlık bazlı kural skoru <br>**LLM:** `sentimentScore` (-1.0 ile +1.0) | **Evet (Google News Gerçek Akışı)** | 🟡 **DÜŞÜK/ORTA RİSK** (Düzeltildi) | LLM skoru [-1.0, 1.0] aralığına zorlandı ve `analyzeNewsTitleSentiment` deterministik sözlük algoritması ile doğrulanıp kalibre edildi. |

---

## 3. Mimari ve Şema Standartları

1. **Merkezi Zod Şemaları (`lib/aiSchemas.ts`)**: Tüm modüllerin LLM girdi ve çıktıları için katı `zod` şemaları tanımlandı.
2. **Deterministik Ezme Kuralı**: LLM'den gelen JSON başarıyla parse edilse dahi, finansal metrik alanları (Sharpe, Piotroski, Altman Z, DCF Fair Value, Graham Number, HHI, VaR vb.) `lib/quantEngine.ts` çıktısıyla ezilerek `metricsSource: "calculated"` olarak mühürlenir.
3. **Kullanıcı Şeffaflığı**: Arayüzde hesaplanan sayılar `📐 Hesaplanan Model Çıktısı` rozetiyle, yapay zekanın ürettiği metinler `🤖 AI Yorumu` rozetiyle şeffaf olarak gösterilir.
