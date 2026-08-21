# Defter — Fiyat ve Veri Kaynağı Tutarlılığı Denetim Raporu

> **Tarih:** 2026-08-22  
> **Kapsam:** `lib/mockData.ts`, `lib/aiService.ts`, `app/api/prices/*`, `lib/store.tsx`, `app/orakul/page.tsx`  
> **Amaç:** Projedeki tüm veri kaynaklarının güncellik seviyelerini, kullanım yerlerini, statik/canlı ayrımını ve potansiyel tutarsızlık noktalarını şeffaf biçimde belgelemek.

---

## 1. Veri Kaynakları Karşılaştırma ve Envanter Haritası

| Kaynak / Modül | Dosya / Uç Nokta | Güncellik Düzeyi | Nerede Kullanılıyor? | Kullanıcıya "Canlı" Olarak mı Gösteriliyor? | Açıklama & Veri Akışı |
| :--- | :--- | :--- | :--- | :---: | :--- |
| **`MOCK_COMPANIES`** | `lib/mockData.ts` (24.000+ satır) | **Statik** (Kalıcı Master Tohum) | `lib/store.tsx` (İlk kütük açılışı & Supabase senkronizasyonu), `/api/prices` (Yedek meta kütüğü), Sayfa açılışları | **Hayır** (📌 Statik rozet veya ilk açılış tabanı) | 420+ varlıklı ana tohum veri tabanıdır. İlk kurulumda Supabase DB'ye yazılır ve LocalStorage'da saklanır; canlı fiyatlar çekilince anlık olarak ezilir. |
| **`defaultSeeds`** | `lib/aiService.ts` (~satır 1111) | **Statik Acil Durum Yedeği** (2026-08) | `generateOrakulRecipe` (Kullanıcı kütüğü boşsa veya filtre sonrası `< targetCount` ise) | **Hayır** (⚠️ "Yedek Kütük Fiyatı" uyarısıyla etiketli) | Kullanıcının kütüğünde seçilen evrende yeterli hisse kalmadığında algoritmanın çökmesini önleyen 12 varlıklı güvenlik tamponudur. |
| **`/api/prices`** | `app/api/prices/route.ts` | **Canlı (3 dk micro-cache)** | Tüm sayfalarda fiyat yenileme (`refreshPrices`), Portföy Değeri, Kâr/Zarar | **Evet** (🟢 Canlı Piyasa / 15sn - 15dk periyodik) | `borsats` (BIST Ticker) ve `yahoo-finance2` batch API'lerini kullanarak anlık BIST, Emtia, Döviz ve Fon fiyatlarını çeker. |
| **`/api/prices/history`** | `app/api/prices/history/route.ts` | **Canlı / Gerçek Tarihsel** | Şirket detay grafikleri, Teknik Analiz, Orakul Geçmiş Backtest | **Evet** (Tarihsel kesin mumlar) | Yahoo Finance üzerinden 1y / 6m / 1m günlük kapanış serilerini çeker. |
| **`/api/prices/deep`** | `app/api/prices/deep/route.ts` | **Canlı Temel Oranlar** | Şirket detay sayfası, F/K, PD/DD, ROE, Temettü Verimi | **Evet** (Canlı Bilanço Çarpanları) | Yahoo Finance `summaryDetail` ve `defaultKeyStatistics` üzerinden gerçek temel finansal çarpanları çeker. |
| **`/api/prices/kap`** | `app/api/prices/kap/route.ts` | **Canlı KAP Akışı** | Şirket KAP bildirimleri, Haber Duygu Analizi | **Evet** (Canlı RSS Bildirimleri) | KAP RSS ve Google Finans RSS akışlarını anlık olarak parse eder. |
| **`/api/prices/tefas`** | `app/api/prices/tefas/route.ts` | **Canlı TEFAS Verisi** | Fon detay kartları, Fon portföy dağılımları | **Evet** (Resmi TEFAS Verisi) | TEFAS platformundan fon fiyatı, fon büyüklüğü ve portföy dağılımını çeker. |
| **Yahoo Finance (Backtest)** | `lib/aiService.ts` (`fetchHistoricalDailyCloses`) | **Canlı Tarihsel Veri** | `runBacktestSimulation`, `app/orakul/page.tsx` | **Evet** (Gerçek 1 Yıllık Getiri & Alfa) | Backtest simülasyonlarında tahmin uydurmak yerine Yahoo Finance'ten 252 işlem gününün gerçek kapanış serisini çeker. |

---

## 2. Tespit Edilen Riskler ve Uygulanan Çözümler

### 1) `defaultSeeds` İzolasyonu ve Şeffaflık (Seçenek A + B Hibrit Uygulama)
- **Sorun:** `defaultSeeds` dizisindeki fiyatlar kodun yazıldığı tarihteki statik sayılardı.
- **Çözüm:** 
  1. `generateOrakulRecipe` öncelikle kullanıcının aktif kütüğündeki (`allCompanies`) güncel fiyatları kullanır.
  2. Eğer filtreler sonucu evrende yeterli hisse kalmazsa, öncelikle `MOCK_COMPANIES` üzerinden güncel kütük varlıkları taranır.
  3. `usedFallbackSeeds: boolean` alanı reçete nesnesine eklenmiştir.
  4. Eğer `usedFallbackSeeds: true` ise, ön yüzde kullanıcıya belirgin bir sarı bilgi kutusu ile **"⚠️ Kütüğünüzde yeterli varlık verisi bulunamadığı için örnek/yedek kütük fiyatlarıyla hesaplandı."** uyarısı gösterilir.

---

### 2) LLM Fiyat Tutarsızlığı Kontrolü (%5 Sapma Kuralı)
- **Sorun:** LLM `allocation` listesinde halüsinasyon sonucu kütükteki fiyattan çok farklı bir fiyat (`item.price`) üretebiliyordu.
- **Çözüm:** `validateAndFixAllocation` fonksiyonuna %5 sapma denetimi eklendi:
  - Eğer LLM'in verdiği `price`, kütükteki gerçek `catalogPrice` değerinden **%5'ten fazla sapıyorsa**, LLM'in fiyatı reddedilir ve kütükteki gerçek fiyat zorunlu kılınır.
  - Önerilen lot (`suggestedShares = Math.floor(bütçe / gerçekFiyat)`) ve toplam maliyet (`totalCost = lot * gerçekFiyat`) gerçek fiyata göre yeniden hesaplanır.

---

### 3) Kütük (`allCompanies`) Tazelik ve Bayat Veri Koruması
- **Sorun:** Kullanıcı sekmeyi uzun süre açık tutup "Reçete Üret" butonuna bastığında bayat fiyatlarla lot hesabı yapılabilirdi.
- **Çözüm:** 
  1. `useDefterStore` içindeki `lastSyncTime` ve periyodik `refreshPrices` mekanizması Orakul sayfasına bağlandı.
  2. Kullanıcı "Reçete Üret" butonuna bastığında, eğer kütük fiyatları son 5 dakikadır güncellenmemişse otomatik hızlı arka plan yenilemesi tetiklenerek en taze fiyatlarla bütçe/lot optimizasyonu yapılması güvence altına alındı.
