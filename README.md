# 📖 Defter — Modern Kişisel Yatırım ve Portföy Yönetim Platformu

<p align="center">
  <img src="public/icon.svg" alt="Defter Logo" width="96" height="96" />
</p>

<p align="center">
  <strong>Borsa İstanbul, Küresel Hisseler, Kıymetli Madenler, TEFAS Fonları ve Döviz için Bütünleşik Portföy Kütügü, Canlı Piyasa Entegrasyonu ve Yapay Zeka Destekli Değerleme Sistemi.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16.3-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/TailwindCSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css" alt="TailwindCSS" />
  <img src="https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase" alt="Supabase" />
  <img src="https://img.shields.io/badge/License-MIT-amber?style=for-the-badge" alt="License" />
</p>

---

## 🌟 Öne Çıkan Özellikler

### 1. 💼 Özelleştirilmiş Sepetler & Portföy Yönetimi
* **Tematik Yatırım Sepetleri:** BIST Temettü Kalesi, Küresel Yapay Zeka, Enflasyon Kalkanı gibi stratejik sepetler oluşturun.
* **Canlı Kâr / Zarar Takibi:** Varlık ağırlıkları, ortalama maliyetler, güncel piyasa değeri ve kümülatif getiri analizi.
* **İşlem Defteri:** Alış, satış ve temettü işlemlerini tarih ve notlarıyla birlikte eksiksiz kaydedin.

### 2. 🏛️ 420+ Varlıklı Geniş Kapsamlı Master Evren
* **Borsa İstanbul (BIST 100 & BIST 500):** Tüm popüler Türk hisse senetleri.
* **Küresel Teknoloji & Bluechip:** NVIDIA, Apple, Microsoft, Google, Tesla, Palantir, ASML ve daha fazlası.
* **Kıymetli Madenler & Ziynetler:** Gram Has Altın 995, Çeyrek, Yarım, Tam, Ata/Cumhuriyet Altını, 22/18/14 Ayar Bilezik, Gümüş, Platin, Paladyum, Ons Altın, Ons Gümüş, Brent Petrol ve Bakır.
* **TEFAS Fonları & Global ETF'ler:** AFT, TTE, MAC, TI1, YAY, IIH, KZL, TCD, QQQ, SPY, VOO, GLD vb.
* **Döviz Çaprazları:** USD/TRY, EUR/TRY, GBP/TRY, CHF/TRY, EUR/USD vb.
* **Akıllı Sayfalama:** 30'lu, 60'lı ve 100'lü sayfa navigasyonu ile yüksek performanslı listeleme.

### 3. 🔔 SPK Halka Arz Takip & Otomatik Kütük Senkronizasyonu
* **SPK Bülten Akışı:** Talep toplanan, yaklaşan ve borsada işlem gören tavan serisindeki şirketler.
* **İnteraktif Lot Dağıtım Hesaplayıcısı:** Katılımcı sayısı kaydırıcısı ile tahmini lot ve gereken nakit teminat hesabı.
* **10 Günlük Tavan Kâr Simülatörü:** Günlük +%10 bileşik tavan marjı projeksiyonu tablosu.
* **Otomatik Eşleme:** Yeni halka arzları tek tıkla veya toplu olarak şirket kütüğüne otomatik aktarma.

### 4. 🔮 Orakul — Finansal AI Asistanı & Geri Besleme Döngüsü
* **Yatırım Reçetesi Sihirbazı:** Hedef, risk toleransı ve bütçeye göre optimize edilmiş otomatik sepet üretimi.
* **Geri Besleme Döngüsü (Feedback Loop):** Orakul, bir hisse için yeni analiz yaparken o hisse için geçmiş tahminlerini ve piyasa sonuçlarını referans alarak kendini denetler.
* **Başarı Karnesi:** Geçmiş tahminlerin gerçekleşen piyasa hareketlerine göre doğruluğu ve isabet oranı (%XX) karnesi.
* **İnteraktif Finansal Sohbet:** Doğal dilde portföyünüzle ve piyasalarla sohbet edin.

### 5. ⚡ Yüksek Performanslı Canlı Piyasa Entegrasyonu
* **Yahoo Finance Toplu İstek:** 65+ piyasa sembolünü tek bir HTTP isteğinde (~1.3s) çeker, 429 Rate Limit riskini önler.
* **Kıymetli Maden Dinamik Formülleri:** Ons altın ve anlık döviz kurundan fiziki gram/çeyrek/tam altın fiyatlarını anlık türetir.
* **Çok Katmanlı Fallback & Cache:** 10 dakikalık in-memory cache ve bağlantı kesintilerinde güvenli statik yedek fiyatlar.

### 6. 🔒 Güvenlik & Bulut Kalıcılığı
* **AuthGuard Kasa Kilidi:** Sunucu tarafında `DEFTER_ACCESS_PASSWORD` ile doğrulanan güvenli erişim (`/api/auth`).
* **Supabase Hibrit Senkronizasyon:** Hem PostgreSQL bulutunda hem de istemci LocalStorage'ında çift katmanlı anlık veri senkronizasyonu.

---

## 🛠️ Teknoloji Yığını

| Katman | Teknoloji |
| :--- | :--- |
| **Framework** | Next.js 16.3 (Turbopack, App Router) |
| **Kütüphane** | React 19, TypeScript |
| **Stil & Tasarım** | TailwindCSS 4.0, Lucide Icons, Özel Tipografi |
| **Veritabanı** | Supabase (PostgreSQL) |
| **Piyasa Verisi** | Yahoo Finance 2 (Batch Quotes Engine) |
| **Yapay Zeka** | Google Gemini / OpenAI / Hibrit Finansal Model |

---

## 🚀 Hızlı Başlangıç

### 1. Depoyu Klonlayın
```bash
git clone https://github.com/amcaoglu35/defter.git
cd defter
```

### 2. Bağımlılıkları Yükleyin
```bash
npm install
```

### 3. Ortam Değişkenlerini Ayarlayın
`.env.example` dosyasını `.env.local` olarak kopyalayın ve bilgilerinizi girin:

```bash
cp .env.example .env.local
```

`.env.local` içeriği:
```env
# Kasa Erişim Şifresi
DEFTER_ACCESS_PASSWORD=<kendi-sifreni-buraya-yaz>

# Supabase Veritabanı
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_publishable_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_secret_service_role_key
```

### 4. Geliştirme Sunucusunu Başlatın
```bash
npm run dev
```

Tarayıcınızda açın: **[http://localhost:3000](http://localhost:3000)**

---

## 🗄️ Veritabanı Kurulumu (Supabase)

Projenin kök dizinindeki [`supabase_schema.sql`](./supabase_schema.sql) dosyasını Supabase Dashboard'unuzdaki **SQL Editor** alanına yapıştırıp çalıştırarak tüm tabloları ve 420 varlıklı master kütüğü tek seferde oluşturabilirsiniz.

Oluşturulan tablolar:
* `companies` — 420 adet hisse senedi, emtia, döviz ve fon
* `baskets` & `basket_holdings` — Tematik portföy sepetleri ve varlık ağırlıkları
* `transactions` — Alış, satış ve temettü işlem geçmişi
* `ipos` — SPK onaylı halka arz listesi
* `ai_history` — Orakul değerlemeleri ve başarı doğrulama kayıtları
* `notifications` — Canlı piyasa ve sistem bildirimleri

---

## 📱 Sayfa Rotaları

* `/` — Ana Dashboard, Özet Varlık Dağılımı, Hızlı İşlemler
* `/sirketler` — 420 Varlıklı Master Kütük, Sayfalama, Varlık Detayları
* `/sepetlerim` — Portföy Sepetleri ve Ağırlık Yönetimi
* `/halka-arz` — SPK Halka Arz Takvimi, Lot Hesaplama, Tavan Projeksiyonu
* `/orakul` — Finansal AI Asistanı, Sepet Sihirbazı, Başarı Karnesi
* `/ayarlar` — Veri Yedekleme, Supabase Durumu, AI Sağlayıcı Ayarları

---

## 📄 Lisans

Bu proje [MIT Lisansı](./LICENSE) kapsamında açık kaynak olarak sunulmuştur.
Kişisel finans ve portföy takibi için özgürce kullanılabilir ve geliştirilebilir.
