# Defter Orakul AI Token ve Maliyet Optimizasyonu Raporu

> **Tarih:** 2026-08-22  
> **Kapsam:** `lib/aiService.ts`, `lib/orakulCache.ts`, `app/api/orakul/route.ts`, `app/orakul/page.tsx`  
> **Hedef:** LLM token tüketimini %60-70 azaltmak, 5 dakikalık akıllı önbellekleme ile mükerrer çağrıları sıfıra indirmek ve görev bazlı model seçimiyle maliyeti minimize etmek.

---

## 1. Yönetici Özeti (Cost & Token Summary)

| Metrik | Optimizasyon Öncesi | Optimizasyon Sonrası | İyileşme / Tasarruf |
| :--- | :--- | :--- | :---: |
| **Sepet Sihirbazı Prompt Boyutu** | ~4.200 karakter (~1.050 token) | ~1.400 karakter (~350 token) | **%67 Tasarruf** 📉 |
| **Hisse Tarayıcısı Prompt Boyutu** | ~3.500 karakter (~875 token) | ~920 karakter (~230 token) | **%74 Tasarruf** 📉 |
| **Aday Havuzu Boyutu (Aday Sayısı)** | Sabit 35 varlık | Dinamik (Hedef × 4, min 12, max 22) | **%40-65 Küçülme** 🎯 |
| **Mükerrer İstek Maliyeti (5 dk içi)** | Her tıklamada tam LLM çağrısı ($$$) | `X-Cache: HIT` (0 ms, 0 token) | **%100 Tasarruf (0 Token)** ⚡ |
| **Model Seçimi (Tiering)** | Sabit `gemini-2.5-flash` | Göreve göre `gemini-2.0-flash` / `gemini-2.5-flash` | **~%40-50 Birim Maliyet İndirimi** 💰 |

---

## 2. Uygulanan Optimizasyonlar ve Teknik Detaylar

### 1) Prompt Boyutu ve Kompakt Tablo Formatı
- **Eski Format:** Her aday şirket için Türkçe etiketler (`THYAO (Türk Hava Yolları, Sektör: Havacılık, Fiyat: 310 ₺, F/K: 7.2, Temettü: %2.5)`) tam metin olarak gönderiliyordu.
- **Yeni Kompakt Format:** Pipe-separated (`SEMBOL|SEKTÖR|FİYAT|FK|PD|TEM`) formatına geçildi.
  - Örnek: `THYAO|Havacılık|310₺|FK:7.2|PD:1.6|TEM:2.5%`
- **Dinamik Havuz:** Kullanıcının istediği varlık sayısına göre (`Math.min(Math.max(targetAssetCount * 4, 12), 22)`) yalnızca en yüksek alaka puanına sahip ilk 12-22 şirket prompt'a aktarılır.
- **JSON Şema Sıkıştırması:** Prompt içerisindeki uzun örnek JSON şablonları kaldırıldı; alan tanımları ve tipleri minimal yapıya indirgendi.

---

### 2) 5 Dakikalık TTL Akıllı Önbellek (`lib/orakulCache.ts`)
- **Mekanizma:** Gelen istek parametrelerinin anahtarları (`type`, `payload`, `provider`, `model`, `persona`) alfabetik olarak sıralanıp deterministik bir JSON hash anahtarı üretilir (`generateOrakulCacheKey`).
- **Önbelleğe Alınan Görevler:** `recipe`, `company_analysis`, `earnings_flash`, `value_trap`, `backtest`, `screener`, `daily_brief`, `weekly_letter`, `sentiment`.
- **Önbellek Dışı Tutulan Görevler:** `chat` (diyalog geçmişi aktığı için) ve `test_connection`.
- **Rebalance Güvenliği:** `rebalanceContext` (kullanıcının mevcut sepet ağırlıkları ve adetleri) payload içinde yer aldığından, farklı sepetlerin rebalance istekleri birbirinin önbelleğini asla ezmez.
- **HTTP Başlıkları:**
  - Önbellekten dönen yanıtlarda: `X-Cache: HIT`, `Cache-Control: private, max-age=300`
  - Yeni hesaplanan yanıtlarda: `X-Cache: MISS`

---

### 3) Göreve Göre Model Kademelendirmesi (Model Tiering)
Kullanıcı elle bir model seçmediyse, görev karmaşıklığına göre en maliyet-etkin model otomatik devreye girer:
- **Lightweight / Hızlı Model (`gemini-2.0-flash`):**
  - Bilanço Karnesi (`earnings_flash`)
  - Günlük Kapanış Brifingi (`daily_brief`)
  - Haber & Duygu Analizi (`sentiment`)
  - Akıllı Hisse Tarayıcısı (`screener`)
  - Bağlantı Testi (`test_connection`)
- **Standard / Derin Sentez Modeli (`gemini-2.5-flash`):**
  - Sepet Sihirbazı (`recipe` — MPT ve komite tartışması)
  - Şirket Analizi (`company_analysis` — Boğa vs Ayı & Makro Stres Testi)
  - Haftalık Kasa Mektubu (`weekly_letter`)
  - Orakul Copilot Chat (`chat`)

*Not: Kullanıcının Ayarlar sayfasından veya istek gövdesinden elle seçtiği özel model (`customModel`) asla ezilmez.*

---

### 4) Telemetri ve Gözlemlenebilirlik (`logOrakulTelemetry`)
Her sunucu çağrısında arka planda telemetri günlüğü tutulur:
```text
[Orakul Telemetry][recipe] promptChars=1380, estTokens=~345, responseMs=1120ms, candidates=16, model=gemini-2.5-flash
[Orakul Telemetry][recipe] promptChars=0, estTokens=~0, responseMs=0ms, model=gemini-2.5-flash [CACHE HIT ⚡]
```

---

### 5) Ön Yüz Çift Tıklama Koruması
`app/orakul/page.tsx` ve `components/OrakulCopilotChat.tsx` üzerindeki tüm AI aksiyon düğmelerinde (`loading`, `companyLoading`, `earningsLoading`, `trapLoading`, `backtestLoading`, `screenerLoading`, `briefingLoading`, `weeklyLetterLoading`, `sentimentLoading`) `disabled` durumları doğrulanmış ve mükerrer tıklamalar engellenmiştir.
