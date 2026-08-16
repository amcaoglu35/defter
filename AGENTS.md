<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Defter — Geliştirici & Agent Kuralları

## 1. Finansal Veri Dürüstlüğü ve Şeffaflık (Sıfır Uydurma/Mock Sayı Kuralı)
- **Asla Sahte/Uydurma Veri Üretme**: Şirket detay, sepetler, Orakul veya ana sayfa dahil hiçbir arayüz kartında; Yahoo Finance, KAP, TEFAS veya kullanıcı kütüğünden gelen gerçek veri bulunmadığında `price * 1.32`, `+32.0%`, sabit BIST yüzdesi gibi tahmini/uydurma sayılar **kesinlikle gösterilmemelidir**.
- **Nötr Durum Gösterimi**: Bir finansal metrik, analist hedefi veya haber akışı tanımsız ya da boşsa, kullanıcıyı yanıltacak sahte bir gösterge yerine her zaman nötr bir *"Veri Yok / Kapsam Dışı / Analist Takibi Bulunmuyor"* durumu gösterilmeli veya ilgili modül boş kutu bırakmadan temizce gizlenmelidir.
- **Canlı ve Statik Ayrımı**: Canlı fiyat akışı olmayan varlıklar şeffaf biçimde `📌 Statik Veri` rozetiyle belirtilmeli, kullanıcının gerçek veri sandığı yanıltıcı rozetler kullanılmamalıdır.

