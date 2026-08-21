# Defter Test Rehberi (`TESTING.md`)

Bu doküman, Defter projesinde birim testlerinin çalıştırılması, test felsefesi ve yeni finansal/yapay zeka algoritmaları eklenirken izlenmesi gereken test desenlerini özetler.

---

## 🚀 Testleri Çalıştırma

Projede ESM ve TypeScript ile tam uyumlu çalışan **Vitest** test altyapısı kullanılmaktadır.

```bash
# Tüm test paketlerini bir kez çalıştır
npm run test

# Dosya değişikliklerini izleyen canlı test modu
npm run test:watch

# Görsel Vitest UI arayüzü ile inceleme
npx vitest --ui
```

---

## 📁 Test Dosya Yapısı

| Test Dosyası | Kapsadığı Modül | Test Türü |
| :--- | :--- | :--- |
| [`lib/quantEngine.test.ts`](file:///c:/Users/amcao/Projects/defter/lib/quantEngine.test.ts) | [`lib/quantEngine.ts`](file:///c:/Users/amcao/Projects/defter/lib/quantEngine.ts) | Saf Matematiksel / Ekonometri Birim Testleri |
| [`lib/aiService.test.ts`](file:///c:/Users/amcao/Projects/defter/lib/aiService.test.ts) | [`lib/aiService.ts`](file:///c:/Users/amcao/Projects/defter/lib/aiService.test.ts) | Algoritmik Optimizasyon & LLM Kontrat/Fallback Testleri |

---

## 📐 İzlenen Test Desenleri ve İlkeler

### 1. Sıfır Sahte Sayı & Finansal Doğruluk Kuralı (`AGENTS.md`)
Tüm nicel finansal metrikler (Sharpe, Sortino, VaR, HHI, Graham Sayısı, Altman Z, Piotroski vb.) deterministik matematiksel formüllerle hesaplanır. Testler bu fonksiyonların bilinen teorik referans değerleriyle birebir örtüştüğünü doğrular:
- **HHI:** 4 eşit ağırlıkta 2500, tek varlıkta 10000.
- **Monte Carlo:** Her simülasyon ayında $p5 \le p50 \le p95$ sıralaması ve $T+1$ zaman noktası.
- **Etkin Sınır:** Risk değerlerine göre küçükten büyüğe sıralı dizi ve tam 1 adet `isCurrent: true` portföy noktası.

### 2. Algoritmik Dal & Sıfır Ağ Çağrısı Güvencesi
`generateOrakulRecipe` fonksiyonuna API anahtarı verilmediğinde `fetch` fonksiyonunun **hiç çağrılmadığı** (`expect(fetch).not.toHaveBeenCalled()`) ve deterministik kural motorunun devreye girdiği test edilir.

### 3. LLM Mock & Kontrat Testleri
LLM'e bağımlı fonksiyonlar test edilirken:
- **Geçerli JSON Yanıtı:** Mocklanan LLM çıktısının Zod şemalarına uygun parse edildiği ve metriklerin deterministik motorla (`metricsSource: "calculated"`) ezildiği doğrulanır.
- **Bozuk/Geçersiz JSON Yanıtı:** LLM'in hata verdiği veya JSON olmayan metin döndürdüğü senaryoda uygulamanın çökmeden algoritmik motora güvenli fallback yaptığı doğrulanır.

---

## ⚙️ Sürekli Entegrasyon (CI) & GitHub Actions

Tüm testler ve Next.js prodüksiyon derlemesi [`.github/workflows/test.yml`](file:///c:/Users/amcao/Projects/defter/.github/workflows/test.yml) iş akışıyla `main` dalına her `push` ve `pull_request` açıldığında otomatik çalıştırılır.

> **💡 Branch Protection Tavsiyesi:** GitHub repository ayarlarından `main` dalı için `Require status checks to pass before merging` seçilerek `test` iş akışı zorunlu kılınmalıdır.
