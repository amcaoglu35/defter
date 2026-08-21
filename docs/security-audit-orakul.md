# Defter — /api/orakul Güvenlik İncelemesi ve Sertleştirme Raporu

**Tarih:** 21 Ağustos 2026  
**Kapsam:** `app/api/orakul/route.ts`, `lib/rateLimit.ts`, `lib/aiSchemas.ts`, `app/api/user-ai-key/route.ts`, `middleware.ts`  
**Durum:** Tüm Yüksek ve Orta Riskli Bulgular Kapatıldı ve Sertleştirildi ✅

---

## 1. Güvenlik Denetim Özeti (Executive Summary)

| Güvenlik Kategorisi | İncelenen Bileşenler | Tespit Edilen Risk | Uygulanan Önlem | Durum |
| :--- | :--- | :--- | :--- | :---: |
| **1. Rate Limiting & IP Güvenliği** | `getClientIp()`, `checkRateLimit()` | Orta (Tüm tiplerin aynı sayaçta olması, proxy forge riski) | 3 seviyeli granüler rate limit (`ping:30`, `standard:20`, `heavy:10`), Vercel/Cloudflare edge IP önceliklendirmesi | **DÜZELTİLDİ** |
| **2. API Anahtarı ve Günlükleme** | `app/api/orakul/route.ts`, `lib/rateLimit.ts` | Yüksek (Loglarda URL query string `key=...` sızıntı riski) | `sanitizeLogMessage` regex maskelemesi (`key=***REDACTED***`), `defter_ai_key` httpOnly/secure doğrulaması | **DÜZELTİLDİ** |
| **3. Girdi Doğrulama (Validation)** | `OrakulApiRequestSchema`, `req.json()` | Yüksek (Aşırı büyük payload / array ile token tüketim saldırısı) | Zod strict şema doğrulaması, payload `allCompanies <= 500` üst sınır kırpma, 400 Bad Request engeli | **DÜZELTİLDİ** |
| **4. Hata ve Bilgi Sızıntısı** | `formatApiError()` | Orta (İç sistem/stack trace sızıntı riski) | Prodüksiyonda ham hata mesajları gizlendi, jenerik Türkçe güvenli mesaj döndürüldü | **DÜZELTİLDİ** |
| **5. CORS & Origin Kontrolü** | `isAllowedOrigin()`, `middleware.ts` | Yüksek (Harici sitelerden CSRF / yetkisiz proxy çağrısı) | Origin/Referer eşleşme doğrulaması eklendi, yabancı domainler `403 Forbidden` ile engellendi | **DÜZELTİLDİ** |

---

## 2. Detaylı Bulgu Matrisi

### 1) Rate Limit Atlatma ve Granülarite Analizi

#### Bulgu 1.1: Tek Tip Rate Limit Sayacı (Resource Exhaustion)
- **Risk Seviyesi:** `Orta`
- **Açıklama:** Daha önce tüm istek tipleri (`test_connection`, `recipe`, `chat`, `screener`) tek bir `orakul:${clientIp}` anahtarı altında dakikada 10 istekle sınırlandırılıyordu. Kötü niyetli bir kullanıcı veya otomatik UI ping'leri ucuz `test_connection` çağrılarıyla limiti tüketip kullanıcının pahalı `recipe` veya `company_analysis` almasını engelleyebiliyordu.
- **Uygulanan Düzeltme:** `lib/rateLimit.ts` içine `getOrakulRateLimitTier(type)` eklendi:
  - `orakul:ping:${ip}` (Ping/Bağlantı Testi): **30 istek / dakika**
  - `orakul:standard:${ip}` (Screener, Günlük Brifing, Duygu Analizi): **20 istek / dakika**
  - `orakul:heavy:${ip}` (Reçete, Şirket Teşhisi, Backtest, Chat, Haftalık Mektup): **10 istek / dakika**

#### Bulgu 1.2: Dağıtık (Distributed) vs Bellek İçi (In-Memory) Rate Limiting
- **Risk Seviyesi:** `Düşük - Bilgilendirme`
- **Açıklama:** Supabase `increment_rate_limit` RPC'si aktifken sayaçlar veritabanında atomik tutulur. Supabase yapılandırılmadığında in-memory `Map` devreye girer. Çoklu serverless instance ortamında in-memory limitler instance başına bağımsız çalışır.
- **Uygulanan Düzeltme:** Kod tabanında Supabase RPC önceliklendirildi, hata durumunda bellek içi koruma kesintisiz fallback olarak korundu.

---

### 2) API Anahtarı Sızıntı Riskleri ve Çerez Güvenliği

#### Bulgu 2.1: Loglarda API Anahtarı Sızıntısı
- **Risk Seviyesi:** `Yüksek`
- **Açıklama:** Google Gemini `fetch` çağrılarında URL parametresi olarak `?key=${effectiveKey}` gönderilir. Ağ hatası veya `fetch` istisnası fırlatıldığında `console.warn(err)` çağrısı URL'i ve dolayısıyla API anahtarını sunucu konsoluna yazabilirdi.
- **Uygulanan Düzeltme:** `lib/rateLimit.ts` içine `sanitizeLogMessage()` eklendi. Regex ile tüm `key=...`, `apiKey=...`, `Bearer ...` değerleri `***REDACTED***` olarak maskelenmektedir.

#### Bulgu 2.2: `defter_ai_key` Çerez Güvenliği
- **Risk Seviyesi:** `Düşük (Doğrulandı)`
- **Açıklama:** `app/api/user-ai-key/route.ts` incelendi:
  - `httpOnly: true` (JavaScript XSS ile okunamaz)
  - `secure: process.env.NODE_ENV === "production"` (Yalnızca HTTPS üzerinden iletilir)
  - `sameSite: "lax"` (CSRF sızıntısına karşı korumalı)
  - `path: "/"`
- **Sonuç:** Güvenlik standartlarına tam uyumludur.

---

### 3) Girdi Doğrulama ve DoS / Maliyet Saldırısı Koruması

#### Bulgu 3.1: Şemasız `req.json()` Kabulü
- **Risk Seviyesi:** `Yüksek`
- **Açıklama:** `/api/orakul` gövdesi yalnızca gevşek `typeof` kontrolleriyle okunuyordu. Kötü niyetli bir kullanıcı 10.000 elemanlı bir `allCompanies` dizisi göndererek sunucunun bellek tüketmesini ve LLM prompt'unun devasa boyutlara ulaşarak bütçeyi tüketmesini sağlayabilirdi.
- **Uygulanan Düzeltme:**
  - `lib/aiSchemas.ts` içine `OrakulApiRequestSchema`, `OrakulRecipePayloadSchema`, `OrakulCompanyPayloadSchema`, `OrakulScreenerPayloadSchema` Zod şemaları eklendi.
  - `allCompanies` ve `companies` dizileri **maksimum 500 eleman** ile sınırlandırıldı ve sunucuda `.slice(0, 500)` ile kırpıldı.
  - `budget`, `assetCount` (1-20), `minDividendYield` (0-100), `maxPeRatio` (0-500) alanlarına katı sayısal sınırlar getirildi.
  - Şemaya uymayan istekler işleme alınmadan anında `400 Bad Request` ile reddedilmektedir.

---

### 4) Hata Mesajlarında Bilgi Sızıntısı

#### Bulgu 4.1: Ham Stack Trace ve Hata Mesajı
- **Risk Seviyesi:** `Orta`
- **Açıklama:** `formatApiError` geliştirme ortamında hata detayını döndürebilirken, prodüksiyonda iç sistem detaylarının sızmaması gerekiyordu.
- **Uygulanan Düzeltme:** Prodüksiyon ortamında (`NODE_ENV === 'production'`) istemciye daima sabit ve jenerik Türkçe mesaj dönmesi sağlandı, geliştirme ortamında ise hassas verileri temizleyen `sanitizeLogMessage` filtresi uygulandı.

---

### 5) CORS / Origin ve CSRF Koruması

#### Bulgu 5.1: Harici Siteden POST İstekleri (Cross-Origin Abuse)
- **Risk Seviyesi:** `Yüksek`
- **Açıklama:** Bir saldırgan başka bir siteden `fetch('https://defter-app.com/api/orakul')` çağrısı yaparak kullanıcının aktif tarayıcı çerezleriyle (veya sunucu env API anahtarıyla) yetkisiz LLM çağrısı tetikleyebilirdi.
- **Uygulanan Düzeltme:** `isAllowedOrigin(req)` fonksiyonu eklendi. `Origin` ve `Referer` başlıkları sunucu `Host` değeriyle uyuşmayan harici istekler derhal `403 Forbidden` ile engellendi.

---

## 3. Doğrulama ve Test Sonuçları

- **TypeScript & Zod Derlemesi:** Başarılı (`npm run build` ile 32 sayfa ve tüm API route'ları doğrulandı).
- **Kullanıcı Deneyimi:** Meşru kullanıcı akışında hiçbir kısıtlama yaratılmadı; tüm güvenlik kontrolleri arka planda şeffaf olarak çalışmaktadır.
