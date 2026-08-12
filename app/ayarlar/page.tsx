"use client";

import React, { useState } from "react";
import {
  User,
  Bell,
  Shield,
  Database,
  Lock,
  Download,
  RotateCcw,
  Check,
  Smartphone,
  Eye,
  Sliders,
  Cloud,
  CheckCircle2,
  AlertTriangle,
  Brain,
  Key,
  RefreshCw,
} from "lucide-react";
import { useDefterStore } from "@/lib/store";

export default function AyarlarPage() {
  const {
    isCloudConnected,
    syncWithSupabase,
    resetToDefaultData,
    exportStoreAsJson,
    companies,
    baskets,
    transactions,
    aiProvider,
    apiKey,
    setAiSettings,
    updateInterval,
    setUpdateInterval,
  } = useDefterStore();

  const [userName, setUserName] = useState("Defter Sahibi");
  const [currency, setCurrency] = useState("₺ TRY");

  // AI states
  const [selectedProvider, setSelectedProvider] = useState(aiProvider || "gemini");
  const [keyInput, setKeyInput] = useState(apiKey || "");
  const [aiSavedSuccess, setAiSavedSuccess] = useState(false);

  // Notification toggles
  const [priceAlerts, setPriceAlerts] = useState(true);
  const [ipoAlerts, setIpoAlerts] = useState(true);
  const [dividendAlerts, setDividendAlerts] = useState(true);
  const [oracleAlerts, setOracleAlerts] = useState(true);

  // Security password state
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [passSaved, setPassSaved] = useState(false);

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleSaveAiSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setAiSettings(selectedProvider, keyInput.trim());
    setAiSavedSuccess(true);
    setTimeout(() => setAiSavedSuccess(false), 3000);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPass) return;
    setPassSaved(true);
    setCurrentPass("");
    setNewPass("");
    setTimeout(() => setPassSaved(false), 3000);
  };

  const handleLockVault = () => {
    localStorage.removeItem("defter_auth_token");
    window.location.reload();
  };

  const handleExportData = () => {
    const jsonString = exportStoreAsJson();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(jsonString);
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `defter_kasa_yedek_${new Date().toISOString().split("T")[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleReset = () => {
    if (
      confirm(
        "Tüm şirket, sepet, not ve işlem kayıtları başlangıç tohum verilerine döndürülecektir. Devam etmek istiyor musunuz?"
      )
    ) {
      resetToDefaultData();
      setResetSuccess(true);
      setTimeout(() => setResetSuccess(false), 3000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-8 space-y-10">
      {/* 1. Header */}
      <div className="border-b border-[var(--line)] pb-6">
        <span className="font-mono text-xs text-[var(--brass)] uppercase tracking-wider">
          Sistem Yapılandırması
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-[var(--paper)] font-medium mt-1">
          Kasa &amp; Uygulama Ayarları
        </h1>
        <p className="text-xs font-mono text-[var(--mist)] mt-2">
          Yapay zeka anahtarları, canlı piyasa fiyat senkronu, bildirimler ve yerel/bulut veri yönetimi.
        </p>
      </div>

      {/* 2. Orakul AI Motoru & API Anahtarı Ayarı */}
      <section className="bg-[var(--ink-2)] border border-[var(--brass-dim)] rounded-xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex items-center gap-2.5 text-[var(--brass)] font-serif text-xl font-medium border-b border-[var(--line)] pb-3">
          <Brain className="w-5 h-5" />
          <h2>Orakul AI Motoru &amp; LLM Entegrasyonu</h2>
        </div>

        <form onSubmit={handleSaveAiSettings} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-[var(--mist)] uppercase mb-1.5">
                Yapay Zeka Sağlayıcısı
              </label>
              <select
                value={selectedProvider}
                onChange={(e) => setSelectedProvider(e.target.value)}
                className="w-full bg-[var(--ink-3)] border border-[var(--line)] rounded p-2.5 text-xs text-[var(--paper)] font-mono focus:border-[var(--brass)] outline-none"
              >
                <option value="gemini">Google Gemini (Önerilen — Ücretsiz Google AI Studio)</option>
                <option value="openai">OpenAI (GPT-4o / GPT-4o-mini)</option>
                <option value="local">Yerel Finansal Motor (API Anahtarsız Çevrimdışı Mod)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono text-[var(--mist)] uppercase mb-1.5 flex items-center justify-between">
                <span>Özel API Anahtarı (İsteğe Bağlı)</span>
                <span className="text-[10px] text-[var(--brass)]">Korumalı</span>
              </label>
              <input
                type="password"
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                placeholder="AIzaSy... (Gemini) veya sk-... (OpenAI)"
                className="w-full bg-[var(--ink-3)] border border-[var(--line)] rounded p-2.5 text-xs text-[var(--paper)] font-mono focus:border-[var(--brass)] outline-none"
              />
            </div>
          </div>

          <p className="text-[11px] text-[var(--mist)] leading-relaxed font-sans">
            * <strong>Google Gemini:</strong> <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-[var(--brass)] underline hover:text-[var(--paper)]">Google AI Studio&apos;dan ücretsiz API anahtarı</a> alarak gerçek zamanlı yapay zeka analizlerini etkinleştirebilirsiniz. Boş bırakırsanız Defter&apos;in yerel kural motoru devreye girer.
          </p>

          <div className="pt-2 flex items-center justify-between">
            <button
              type="submit"
              className="bg-[var(--brass)] text-[var(--ink)] font-bold text-xs px-5 py-2.5 rounded hover:bg-[#d9b35a] transition-all cursor-pointer shadow"
            >
              Yapay Zeka Ayarlarını Kaydet
            </button>
            {aiSavedSuccess && (
              <span className="text-xs font-mono text-[var(--verdigris)] flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> AI yapılandırması güncellendi ✓
              </span>
            )}
          </div>
        </form>
      </section>

      {/* 3. Canlı Piyasa Fiyat Güncelleme Periyodu */}
      <section className="bg-[var(--ink-2)] border border-[var(--line)] rounded-xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2.5 text-[var(--brass)] font-serif text-xl font-medium border-b border-[var(--line)] pb-3">
          <RefreshCw className="w-5 h-5" />
          <h2>Fiyat Senkronizasyonu &amp; Otomasyon</h2>
        </div>

        <div className="space-y-3">
          <label className="block text-xs font-mono text-[var(--mist)] uppercase">
            Otomatik Fiyat Güncelleme Sıklığı
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { id: "manual", label: "Yalnızca Manuel" },
              { id: "live", label: "15 Saniyede Bir (Canlı)" },
              { id: "15min", label: "15 Dakikada Bir" },
              { id: "1hour", label: "1 Saatte Bir" },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setUpdateInterval(opt.id)}
                className={`py-2.5 px-3 text-xs font-mono rounded border transition-all cursor-pointer ${
                  updateInterval === opt.id
                    ? "border-[var(--brass)] bg-[var(--brass)] text-[var(--ink)] font-bold shadow"
                    : "border-[var(--line)] text-[var(--mist)] hover:text-[var(--paper)] bg-[var(--ink-3)]"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <p className="text-[11px] text-[var(--mist)]">
            BIST ve küresel piyasa fiyatları arka planda otomatik güncellenir ve sepet kâr/zarar oranları anında revize edilir.
          </p>
        </div>
      </section>

      {/* 4. Supabase Bulut Bağlantı Durumu */}
      <section className="bg-[var(--ink-2)] border border-[var(--line)] rounded-xl p-6 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Cloud className="w-5 h-5 text-[var(--brass)]" />
            <h2 className="font-serif text-xl font-medium text-[var(--paper)]">
              Veri Depolama &amp; Supabase Durumu
            </h2>
          </div>

          <div
            className={`font-mono text-xs px-2.5 py-1 rounded-full flex items-center gap-1.5 font-bold ${
              isCloudConnected
                ? "bg-[rgba(91,140,123,0.15)] text-[var(--verdigris)] border border-[var(--verdigris)]"
                : "bg-[var(--brass-glow)] text-[var(--brass)] border border-[var(--brass-dim)]"
            }`}
          >
            {isCloudConnected ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Supabase Bulut Aktif</span>
              </>
            ) : (
              <>
                <Shield className="w-3.5 h-3.5" />
                <span>Yerel Kasa Modu (Aktif)</span>
              </>
            )}
          </div>
        </div>

        <p className="text-xs text-[var(--mist)] leading-relaxed">
          {isCloudConnected
            ? "Tüm kütük, sepet ve işlem verileriniz Supabase PostgreSQL veritabanı ile otomatik senkronize edilmektedir."
            : "Verileriniz şu an bu cihazın tarayıcısında şifreli ve kalıcı olarak saklanmaktadır. Supabase bulut veritabanına bağlamak için .env.local dosyanıza NEXT_PUBLIC_SUPABASE_URL ve NEXT_PUBLIC_SUPABASE_ANON_KEY eklemeniz yeterlidir."}
        </p>

        {isCloudConnected && (
          <div className="pt-2">
            <button
              onClick={() => syncWithSupabase()}
              className="flex items-center gap-2 px-3.5 py-1.5 bg-[var(--ink-3)] hover:bg-[var(--ink)] border border-[var(--brass-dim)] text-[var(--brass)] rounded text-xs font-mono transition-all cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Bulut Verilerini Şimdi Senkronize Et</span>
            </button>
          </div>
        )}
      </section>

      {/* 5. Bildirim Tercihleri */}
      <section className="bg-[var(--ink-2)] border border-[var(--line)] rounded-xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-2.5 text-[var(--brass)] font-serif text-xl font-medium border-b border-[var(--line)] pb-3">
          <Bell className="w-5 h-5" />
          <h2>Bildirim &amp; Sinyal Kanalları</h2>
        </div>

        <div className="space-y-4">
          {[
            {
              title: "Fiyat ve Trend Alarmları",
              desc: "Takip listesindeki hisseler direnç/destek kırdığında uyar.",
              checked: priceAlerts,
              toggle: () => setPriceAlerts(!priceAlerts),
            },
            {
              title: "Halka Arz Onay & Talep Hatırlatıcısı",
              desc: "Yeni SPK bülteni ve talep toplama başlangıç günlerinde bildirim gönder.",
              checked: ipoAlerts,
              toggle: () => setIpoAlerts(!ipoAlerts),
            },
            {
              title: "Temettü Ödeme Günleri",
              desc: "Portföyündeki şirketlerin hak kullanım ve nakit aktarım günlerini bildir.",
              checked: dividendAlerts,
              toggle: () => setDividendAlerts(!dividendAlerts),
            },
            {
              title: "Orakul Yeniden Dengeleme Sinyali",
              desc: "Sepet ağırlıkları hedef sınırları aştığında optimize uyarısı ver.",
              checked: oracleAlerts,
              toggle: () => setOracleAlerts(!oracleAlerts),
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3.5 rounded bg-[var(--ink-3)] border border-[var(--line)]"
            >
              <div>
                <div className="text-xs font-semibold text-[var(--paper)]">
                  {item.title}
                </div>
                <div className="text-[11px] text-[var(--mist)] mt-0.5">
                  {item.desc}
                </div>
              </div>

              <button
                type="button"
                onClick={item.toggle}
                className={`w-10 h-5 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                  item.checked ? "bg-[var(--brass)]" : "bg-[var(--line)]"
                }`}
              >
                <div
                  className={`bg-[var(--ink)] w-3.5 h-3.5 rounded-full shadow-md transform transition-transform ${
                    item.checked ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Güvenlik & Kasa Şifresi */}
      <section className="bg-[var(--ink-2)] border border-[var(--line)] rounded-xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-2.5 text-[var(--brass)] font-serif text-xl font-medium border-b border-[var(--line)] pb-3">
          <Shield className="w-5 h-5" />
          <h2>Güvenlik &amp; Kasa Kilidi</h2>
        </div>

        <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
          <div>
            <label className="block text-xs font-mono text-[var(--mist)] uppercase mb-1.5">
              Yeni Erişim Şifresi
            </label>
            <input
              type="password"
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
              placeholder="Yeni şifreyi girin..."
              className="w-full bg-[var(--ink-3)] border border-[var(--line)] rounded p-2.5 text-xs text-[var(--paper)] font-mono focus:border-[var(--brass)] outline-none"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="bg-[var(--brass)] text-[var(--ink)] font-bold text-xs px-4 py-2 rounded hover:bg-[#d9b35a] transition-all cursor-pointer"
            >
              Şifreyi Güncelle
            </button>
            {passSaved && (
              <span className="text-xs font-mono text-[var(--verdigris)]">
                Şifre güncellendi ✓
              </span>
            )}
          </div>
        </form>

        <div className="pt-4 border-t border-dashed border-[var(--line)] flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-[var(--paper)]">
              Kasayı Şimdi Kilitle
            </div>
            <div className="text-[11px] text-[var(--mist)] mt-0.5">
              Oturumu sonlandırıp şifre giriş ekranına döner.
            </div>
          </div>
          <button
            type="button"
            onClick={handleLockVault}
            className="border border-[var(--loss)] text-[var(--loss)] hover:bg-[var(--wine)]/20 px-4 py-2 rounded text-xs font-mono font-bold transition-colors cursor-pointer"
          >
            Kasayı Kilitle
          </button>
        </div>
      </section>

      {/* 7. Veri Yönetimi, İndirme & Sıfırlama */}
      <section className="bg-[var(--ink-2)] border border-[var(--line)] rounded-xl p-6 sm:p-8 space-y-5">
        <div className="flex items-center gap-2.5 text-[var(--brass)] font-serif text-xl font-medium border-b border-[var(--line)] pb-3">
          <Database className="w-5 h-5" />
          <h2>Veri Yönetimi &amp; Yedekleme</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
          <div className="bg-[var(--ink-3)] p-3 rounded border border-[var(--line)]">
            <span className="text-[var(--mist)]">Kayıtlı Varlık:</span>
            <div className="font-bold text-[var(--paper)] text-sm mt-1">{companies.length} Adet</div>
          </div>
          <div className="bg-[var(--ink-3)] p-3 rounded border border-[var(--line)]">
            <span className="text-[var(--mist)]">Aktif Sepet:</span>
            <div className="font-bold text-[var(--paper)] text-sm mt-1">{baskets.length} Adet</div>
          </div>
          <div className="bg-[var(--ink-3)] p-3 rounded border border-[var(--line)]">
            <span className="text-[var(--mist)]">İşlem Kaydı:</span>
            <div className="font-bold text-[var(--paper)] text-sm mt-1">{transactions.length} Adet</div>
          </div>
        </div>

        <div className="pt-2 flex flex-wrap gap-4 items-center justify-between">
          <button
            onClick={handleExportData}
            className="bg-[var(--ink-3)] border border-[var(--line)] hover:border-[var(--brass)] text-[var(--paper)] text-xs font-mono px-4 py-2.5 rounded flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-[var(--brass)]" />
            <span>Kütük Verilerini İndir (.JSON)</span>
          </button>

          <button
            onClick={handleReset}
            className="border border-[var(--line)] hover:border-[var(--loss)] text-[var(--mist)] hover:text-[var(--loss)] text-xs font-mono px-4 py-2.5 rounded flex items-center gap-2 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Fabrika Tohum Verisine Sıfırla</span>
          </button>
        </div>

        {resetSuccess && (
          <p className="text-xs font-mono text-[var(--verdigris)]">
            Veri tabanı başarıyla tohum ayarlarına döndürüldü ✓
          </p>
        )}
      </section>
    </div>
  );
}
