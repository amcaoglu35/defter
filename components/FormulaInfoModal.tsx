"use client";

import React from "react";
import { BookOpen, X, Sparkles, CheckCircle2, Calculator } from "lucide-react";

export interface FormulaExplanation {
  title: string;
  category: "Quant & Risk" | "Değerleme" | "Ekonometri & Makro" | "İleri Modeller";
  formula: string;
  whatItDoes: string;
  howToRead: string;
  benchmarkTarget?: string;
}

export const FORMULA_DICTIONARY: Record<string, FormulaExplanation> = {
  sharpe: {
    title: "Sharpe Rasyosu (Risk Başına Getiri Verimi)",
    category: "Quant & Risk",
    formula: "(Portföy Getirisi - Risksiz Faiz) / Portföy Volatilitesi",
    whatItDoes: "Aldığınız her 1 birim riske karşılık, risksiz mevduat faizinin üzerinde ne kadar ekstra getiri kazandığınızı ölçer.",
    howToRead: "> 1.0 ise başarılı, > 1.5 ise mükemmel kurumsal verimlilik. Negatifse faiz altı kalındığını gösterir.",
    benchmarkTarget: "> 1.20 Hedef",
  },
  sortino: {
    title: "Sortino Rasyosu (Zarar Yönlü Risk Verimi)",
    category: "Quant & Risk",
    formula: "(Portföy Getirisi - Risksiz Faiz) / Düşüş Yönlü Volatilite",
    whatItDoes: "Sharpe'tan farklı olarak sadece zarar ettiren düşüş günlerini risk sayar. Yukarı yönlü sert yükselişleri risk sayıp cezalandırmaz.",
    howToRead: "> 1.2 ise portföyün düşüşlere karşı koruması çok güçlü demektir.",
    benchmarkTarget: "> 1.50 Hedef",
  },
  var95: {
    title: "%95 VaR (Riske Maruz Değer — 30 Günlük)",
    category: "Quant & Risk",
    formula: "1.645 × Portföy Volatilitesi × √(30/365) × Portföy Değeri",
    whatItDoes: "Önümüzdeki 1 ayda normal piyasa şartlarında yaşayabileceğiniz tahmini maksimum zarar tutarını kuruşu kuruşuna gösterir.",
    howToRead: "%95 ihtimalle zararınız bu tutarı aşmaz. Kriz anlarında ise CVaR devreye girer.",
    benchmarkTarget: "< %8.0 Aylık",
  },
  ulcer: {
    title: "Ülser Stres Endeksi (Ulcer Index)",
    category: "Quant & Risk",
    formula: "√[ Σ (Düşüş Yüzdesi)² / N ]",
    whatItDoes: "Portföyün düşüşlerde ne kadar derin çukur açtığını ve o çukurda ne kadar uzun süre kaldığını ölçerek yatırımcının stresini puanlar.",
    howToRead: "< 6.0 ise 'Huzurlu / Düşük Stres', > 12.0 ise 'Yüksek Mide Ağrısı / Stresli Varlık'.",
    benchmarkTarget: "< 7.0 Hedef",
  },
  monteCarlo: {
    title: "Monte Carlo Gelecek Simülasyonu (1.000 Patika)",
    category: "Quant & Risk",
    formula: "S(t) = S(0) · exp((μ - σ²/2)t + σ√t · Z)",
    whatItDoes: "Portföyün ortalama büyüme hızı ve dalgalanmasını kullanarak önümüzdeki 1-5 yıl için 1.000 farklı geleceği simüle eder.",
    howToRead: "%5 Tabanı en kötü kriz senaryosunu, %50 Medyan en olası bakiyeyi, %95 Tavanı ise boğa rallisi potansiyelini gösterir.",
    benchmarkTarget: "Medyan Trend Takibi",
  },
  omega: {
    title: "Omega Rasyosu (Ω — Gerçek Kazanç / Kayıp Oranı)",
    category: "İleri Modeller",
    formula: "Eşik Üzeri Kazanç Alanı / Eşik Altı Kayıp Alanı",
    whatItDoes: "Getirilerin çan eğrisi olmadığı BIST piyasasında, tüm kazanç olasılıklarının toplam kayıp olasılıklarına oranını integralle hesaplar.",
    howToRead: "> 1.5 ise portföy asimetrik olarak yukarı yönlü patlama eğilimindedir.",
    benchmarkTarget: "> 1.40 Hedef",
  },
  treynor: {
    title: "Treynor Rasyosu (Sistematik Risk Başına Alfa)",
    category: "İleri Modeller",
    formula: "(Portföy Getirisi - Risksiz Faiz) / Portföy Betası (β)",
    whatItDoes: "Piyasadan kaçılamayan sistematik piyasa riski başına ne kadar net getiri üretildiğini ölçer.",
    howToRead: "Yüksek Treynor, piyasa düşse bile hisse seçimlerinin çok kaliteli olduğunu kanıtlar.",
    benchmarkTarget: "Maksimum Değer",
  },
  mSquared: {
    title: "Modigliani & Modigliani (M² Riski Eşitlenmiş Getiri)",
    category: "İleri Modeller",
    formula: "Rf + Sharpe × BIST 100 Volatilitesi",
    whatItDoes: "Sharpe oranını yüzdeye (%) dönüştürür. Portföyünüz BIST 100 ile aynı riskte olsaydı yüzde kaç getirecekti sorusunun cevabıdır.",
    howToRead: "BIST 100 getirisinden yüksekse piyasayı gerçek anlamda yendiğinizi teyit eder.",
    benchmarkTarget: "> BIST 100 Getirisi",
  },
  upDownCapture: {
    title: "Boğa & Ayı Yakalama Oranları (Up/Down Capture)",
    category: "İleri Modeller",
    formula: "Up: (Portföy Boğa / BIST Boğa) × 100 | Down: (Portföy Ayı / BIST Ayı) × 100",
    whatItDoes: "Piyasa çıkarken ne kadarını yakaladığınızı, düşerken kaybın ne kadarına maruz kaldığınızı ölçer.",
    howToRead: "İdeal Hedge Fon Kuralı: Up-Capture > %100 ve Down-Capture < %80.",
    benchmarkTarget: "Up > %100, Down < %80",
  },
  shannon: {
    title: "Shannon Entropisi (Bilgi Çeşitlendirme Skoru)",
    category: "İleri Modeller",
    formula: "- Σ (w_i · ln(w_i)) / ln(n)",
    whatItDoes: "Claude Shannon'ın bilgi teorisini kullanarak portföyün sadece varlık sayısına değil, gerçek ağırlık homojenliğine bakar.",
    howToRead: "%100'e yakın değerler kusursuz çeşitlendirmeyi, düşük değerler tek hisse yoğunlaşma riskini gösterir.",
    benchmarkTarget: "> %80 Hedef",
  },
  piotroski: {
    title: "Piotroski F-Score (9 Kriterli Bilanço Sağlık Matrisi)",
    category: "Değerleme",
    formula: "Stanford Üniversitesi 9 Temel Bilanço Kriteri Toplamı (0-9)",
    whatItDoes: "Kârlılık, nakit akışı kalitesi, borç düşüşü, likidite ve operasyonel verimliliği 9 ayrı maddeyle denetler.",
    howToRead: "8 - 9 Puan: 'Elit / Kaya Gibi Sağlam', 0 - 3 Puan: 'Bilanço Çürük / Riskli'.",
    benchmarkTarget: "≥ 7 Puan",
  },
  merton: {
    title: "Kaldıraç & Borç Riski Göstergesi (Basitleştirilmiş Merton)",
    category: "Değerleme",
    formula: "Finansal Kaldıraç Çarpanı & Borç Yükü İndirgemesi",
    whatItDoes: "Şirketin finansal kaldıraç ve borçluluk yapısına göre temerrüt/borç çevirme riskini yaklaşık bir gösterge olarak sunar.",
    howToRead: "< %5.0 ise 'Güvenli Kaldıraç', > %10.0 ise 'Kritik Borç / Temerrüt Riski'.",
    benchmarkTarget: "< %5.0",
  },
  hurst: {
    title: "Hurst Exponent (H — R/S Fraktal Trend vs Ortalamaya Dönüş)",
    category: "Değerleme",
    formula: "Yeniden Ölçeklendirilmiş Aralık (R/S) Zaman Serisi Eğim Analizi",
    whatItDoes: "En az 20 günlük fiyat serisinin logaritmik getirilerini inceleyerek hareketin kalıcı momentumda mı yoksa ortalamaya dönüş eğiliminde mi olduğunu belirler.",
    howToRead: "H > 0.55 ise 'Kuvvetli Trend (Momentum)', H < 0.45 ise 'Ortalamaya Dönüş', H ~ 0.50 ise 'Rastgele Salınım'.",
    benchmarkTarget: "H > 0.55 Momentum",
  },
  graham: {
    title: "Benjamin Graham Sayısı (Kelepir Değerleme Eşiği)",
    category: "Değerleme",
    formula: "√(22.5 × Hisse Başı Kâr (EPS) × Defter Değeri (BVPS))",
    whatItDoes: "Değer yatırımının babası Benjamin Graham'ın bir hisseye ödenebilecek maksimum adil fiyat formülüdür.",
    howToRead: "Güncel fiyat Graham sayısının altındaysa hisse 'İskontolu / Kelepir' kabul edilir.",
    benchmarkTarget: "Fiyat < Graham",
  },
  dcf: {
    title: "DCF (İndirgenmiş Nakit Akımları) Adil Değeri",
    category: "Değerleme",
    formula: "Σ [ FCF_t / (1 + WACC)^t ] + Terminal Değer",
    whatItDoes: "Şirketin gelecekte üreteceği serbest nakit akımlarını bugünkü paraya indirgeyerek hissenin matematiksel içsel değerini bulur.",
    howToRead: "DCF adil değeri güncel fiyattan yüksekse şirkette getiri potansiyeli vardır.",
    benchmarkTarget: "Adil Değer > Fiyat",
  },
  magicFormula: {
    title: "Joel Greenblatt Sihirli Formülü (Magic Formula)",
    category: "Değerleme",
    formula: "Kazanç Verimi (EBIT / EV) Sıralaması + Sermaye Kârlılığı (ROIC) Sıralaması",
    whatItDoes: "Piyasanın en ucuza satılan ve aynı zamanda en devasa sermaye kârı üreten kaliteli şirketlerini tek puanda birleştirir.",
    howToRead: "Yüksek puan ve 'Elit Sınıf' etiketine sahip hisseler tarihsel olarak endeksi 2'ye katlayan sepetlerdir.",
    benchmarkTarget: "≥ 75 Puan (Elit)",
  },
  dupont: {
    title: "DuPont 3 Kademeli ROE Ayrıştırma Ağacı",
    category: "Değerleme",
    formula: "Net Kâr Marjı × Varlık Devir Hızı × Finansal Kaldıraç",
    whatItDoes: "Şirketin özkaynak kârlılığının nereden geldiğini teşhis eder: Fiyatlama gücünden mi, operasyonel hızdan mı yoksa borç kaldıraçından mı?",
    howToRead: "Kâr marjı ve devir hızı yüksek şirketler en kaliteli büyüme motorudur.",
    benchmarkTarget: "Yüksek Marj + Devir",
  },
  famaFrench: {
    title: "Fama-French 5 Faktör Modeli & Arı Alfa",
    category: "Ekonometri & Makro",
    formula: "Rp - Rf = α + β1(Piyasa) + β2(SMB) + β3(HML) + β4(RMW) + β5(CMA)",
    whatItDoes: "Kârınızın şans eseri mi yoksa büyüklük, değer, kârlılık ve yatırım faktörlerinden mi geldiğini ayrıştırıp geriye kalan 'Arı Yetenek Alfası'nı çıkarır.",
    howToRead: "Arı Alfa (+%) pozitifse fon yönetim stratejiniz piyasayı kendi yeteneğiyle ezmektedir.",
    benchmarkTarget: "Alfa > +%5",
  },
  macroElasticity: {
    title: "Makro Faktör Duyarlılık & Elastikiyet Analizi",
    category: "Ekonometri & Makro",
    formula: "Dolar Elastikiyeti (ε_USD) & Faiz Duyarlılığı (ε_FAİZ)",
    whatItDoes: "Dolar/TL %10 arttığında veya TCMB faizleri 500 bp indirdiğinde portföyünüzün kurumsal tepkisini simüle eder.",
    howToRead: "Pozitif değerler portföyün kura ve faiz indirim döngüsüne karşı zırhlı ve kazançlı olduğunu gösterir.",
    benchmarkTarget: "Pozitif Katkı",
  },
};

interface FormulaInfoModalProps {
  formulaKey: string | null;
  onClose: () => void;
}

export default function FormulaInfoModal({
  formulaKey,
  onClose,
}: FormulaInfoModalProps) {
  if (!formulaKey || !FORMULA_DICTIONARY[formulaKey]) return null;

  const info = FORMULA_DICTIONARY[formulaKey];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in">
      <div className="bg-[var(--ink-2)] border border-[var(--brass-dim)] rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl space-y-0">
        {/* Modal Başlık */}
        <div className="p-4 border-b border-[var(--line)] flex items-center justify-between bg-[var(--ink-3)]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[var(--brass-glow)] border border-[var(--brass-dim)] flex items-center justify-center text-[var(--brass)] shadow-xs">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--brass)] block">
                {info.category} REHBERİ
              </span>
              <h3 className="font-serif font-bold text-base text-[var(--paper)]">
                {info.title}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--mist)] hover:text-[var(--paper)] hover:bg-[var(--line)]/40 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal İçerik */}
        <div className="p-6 space-y-4 font-sans text-sm">
          {/* Formül Kutusu */}
          <div className="p-3 bg-[var(--ink-3)] border border-[var(--line)] rounded-xl space-y-1">
            <span className="text-[11px] font-mono text-[var(--brass)] font-bold flex items-center gap-1.5">
              <Calculator className="w-3.5 h-3.5" /> Matematiksel Formül:
            </span>
            <code className="text-xs font-mono text-[var(--paper)] block bg-[var(--ink)] p-2 rounded border border-[var(--line)] font-bold">
              {info.formula}
            </code>
          </div>

          {/* Ne İşe Yarar */}
          <div className="space-y-1">
            <span className="text-xs font-mono font-bold text-[var(--paper)] block">
              💡 Ne İşe Yarar?
            </span>
            <p className="text-xs text-[var(--mist)] font-mono leading-relaxed bg-[var(--ink-3)]/60 p-3 rounded-lg border border-[var(--line)]">
              {info.whatItDoes}
            </p>
          </div>

          {/* Nasıl Yorumlanır */}
          <div className="space-y-1">
            <span className="text-xs font-mono font-bold text-[var(--paper)] block">
              🎯 Nasıl Yorumlanır?
            </span>
            <p className="text-xs text-[var(--paper-dim)] font-mono leading-relaxed bg-[var(--ink-3)]/60 p-3 rounded-lg border border-[var(--line)]">
              {info.howToRead}
            </p>
          </div>

          {/* Hedef Eşik */}
          {info.benchmarkTarget && (
            <div className="p-2.5 rounded-lg bg-[var(--brass-glow)] border border-[var(--brass-dim)] flex items-center justify-between text-xs font-mono">
              <span className="text-[var(--mist)]">İdeal Kurumsal Hedef:</span>
              <span className="font-bold text-[var(--brass)]">{info.benchmarkTarget}</span>
            </div>
          )}
        </div>

        {/* Alt Kapatma */}
        <div className="p-4 border-t border-[var(--line)] bg-[var(--ink-3)] flex items-center justify-between">
          <span className="text-[10px] font-mono text-[var(--mist)]">
            Defter Finansal Matematik Sözlüğü
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[var(--brass)] hover:bg-[#d9b35a] text-[var(--ink)] text-xs font-mono font-bold cursor-pointer transition-colors"
          >
            Anladım
          </button>
        </div>
      </div>
    </div>
  );
}
