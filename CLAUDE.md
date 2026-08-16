# Defter — Geliştirici & Model Kuralları

## Finansal Veri Dürüstlüğü ve Şeffaflık
1. **Sıfır Sahte/Uydurma Veri Kuralı**:
   - Hiçbir sayfada veya bileşende (şirket detay, sepetler, Orakul, ana sayfa vb.), gerçek veri (Yahoo Finance, KAP, TEFAS, veritabanı) bulunmadığında `price * 1.32`, `+32.0%`, sabit BIST yüzdesi gibi sahte/tahmini sayılar üretilmemelidir.
   - Veri yoksa her zaman nötr bir *"Veri Yok / Analist Hedefi Bulunmuyor"* durumu gösterilmeli veya alan gizlenmelidir.

2. **Canlı / Statik Ayrımı**:
   - Canlı fiyat akışı olmayan varlıklar şeffaf olarak `📌 Statik Veri` ile etiketlenmelidir.
   - Gerçekte olmayan veri kaynakları (örn. "Google Finance API") etiket olarak kullanılmamalıdır.
