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
  EyeOff,
  Sliders,
  Cloud,
  CheckCircle2,
  AlertTriangle,
  Brain,
  Key,
  RefreshCw,
} from "lucide-react";
import { useDefterStore } from "@/lib/store";
import { useToast } from "@/components/ToastProvider";

export default function AyarlarPage() {
  const {
    userSettings,
    updateUserSettings,
    isCloudConnected,
    syncWithSupabase,
    resetToDefaultData,
    exportStoreAsJson,
    companies,
    baskets,
    transactions,
    aiProvider,
    aiApiKey,
    setAiSettings,
    updateInterval,
    setUpdateInterval,
  } = useDefterStore();
  const { showToast } = useToast();

  const [userName, setUserName] = useState(userSettings?.userName || "Defter Sahibi");
  const [currency, setCurrency] = useState(userSettings?.currency || "₺ TRY");
  const [prevUserSettings, setPrevUserSettings] = useState(userSettings);

  if (userSettings !== prevUserSettings) {
    setPrevUserSettings(userSettings);
    if (userSettings) {
      setUserName(userSettings.userName);
      setCurrency(userSettings.currency);
    }
  }

  // AI states
  const [selectedProvider, setSelectedProvider] = useState(aiProvider || "gemini");
  const [inputApiKey, setInputApiKey] = useState(aiApiKey || "");
  const [showApiKey, setShowApiKey] = useState(false);
  const [aiSavedSuccess, setAiSavedSuccess] = useState(false);
  const [testResult, setTestResult] = useState<{ isConfigured: boolean; message: string } | null>(null);
  const [testingKey, setTestingKey] = useState(false);

  // Security password state
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [passSaving, setPassSaving] = useState(false);
  const [passSaved, setPassSaved] = useState(false);
  const [passError, setPassError] = useState<string | null>(null);
  const [passMessage, setPassMessage] = useState<string | null>(null);

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserSettings({ userName, currency });
    setSavedSuccess(true);
    showToast("Profil Güncellendi", "Profil ve varsayılan para birimi ayarları kaydedildi.", "success");
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleSaveAiSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setAiSettings(selectedProvider, inputApiKey.trim());
    setAiSavedSuccess(true);
    showToast("AI Ayarları Güncellendi", `Yapay zeka tercihi '${selectedProvider}' olarak kaydedildi.`, "success");
    setTimeout(() => setAiSavedSuccess(false), 3000);
  };

  const handleTestServerKey = async () => {
    setTestingKey(true);
    setTestResult(null);
    try {
      const res = await fetch("/api/orakul", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "test_connection",
          provider: selectedProvider,
          apiKey: inputApiKey.trim() || undefined,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setTestResult({
          isConfigured: data.isConfigured,
          message: data.message,
        });
        showToast("Bağlantı Testi", data.message, data.isConfigured ? "success" : "info");
      }
    } catch (e) {
      setTestResult({
        isConfigured: false,
        message: "Sunucu bağlantı testi gerçekleştirilemedi.",
      });
      showToast("Test Hatası", "Sunucu bağlantı testi yapılamadı.", "error");
    } finally {
      setTestingKey(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPass || !newPass) return;
    if (newPass !== confirmPass) {
      setPassError("Yeni şifre ile yeni şifre tekrarı birbiriyle uyuşmuyor.");
      showToast("Şifre Uyuşmazlığı", "Girdiğiniz yeni şifreler eşleşmiyor.", "error");
      return;
    }
    setPassSaving(true);
    setPassError(null);
    setPassSaved(false);
    setPassMessage(null);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "change_password",
          currentPassword: currentPass,
          newPassword: newPass,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setPassSaved(true);
        setPassMessage(data.message || "Mevcut şifreniz başarıyla doğrulandı.");
        showToast(
          data.isPermanent ? "Şifre Güncellendi" : "Mevcut Şifre Doğrulandı",
          data.message,
          "success"
        );
        setCurrentPass("");
        setNewPass("");
        setConfirmPass("");
      } else {
        setPassError(data.error || "Şifre değiştirilemedi.");
        showToast("Şifre Hatası", data.error || "Mevcut şifre hatalı.", "error");
      }
    } catch {
      setPassError("Sunucu bağlantı hatası oluştu.");
      showToast("Bağlantı Hatası", "Sunucuya ulaşılamadı.", "error");
    } finally {
      setPassSaving(false);
    }
  };

  const handleLockVault = async () => {
    try {
      await fetch("/api/auth", { method: "DELETE" });
    } catch {}
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
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-[var(--mist)] uppercase mb-1.5">
                Yapay Zeka Sağlayıcısı
              </label>
              <select
                value={selectedProvider}
                onChange={(e) => {
                  setSelectedProvider(e.target.value);
                  setTestResult(null);
                }}
                className="w-full bg-[var(--ink-3)] border border-[var(--line)] rounded p-2.5 text-xs text-[var(--paper)] font-mono focus:border-[var(--brass)] outline-none"
              >
                <option value="gemini">Google Gemini (Önerilen — Gemini 1.5 / 2.0 Flash)</option>
                <option value="openai">OpenAI (GPT-4o Mini)</option>
                <option value="local">Yerel Finansal Motor (API Anahtarsız Çevrimdışı Mod)</option>
              </select>
            </div>

            {selectedProvider !== "local" && (
              <div>
                <label className="block text-xs font-mono text-[var(--mist)] uppercase mb-1.5 flex items-center justify-between">
                  <span>Özel {selectedProvider.toUpperCase()} API Anahtarı (Opsiyonel)</span>
                  <span className="text-[11px] text-[var(--brass)] font-normal">Boş bırakılırsa sunucu ortam değişkeni kullanılır</span>
                </label>
                <div className="relative flex items-center">
                  <input
                    type={showApiKey ? "text" : "password"}
                    value={inputApiKey}
                    onChange={(e) => {
                      setInputApiKey(e.target.value);
                      setTestResult(null);
                    }}
                    placeholder={
                      selectedProvider === "openai"
                        ? "sk-proj-..."
                        : "AIzaSy..."
                    }
                    className="w-full bg-[var(--ink-3)] border border-[var(--line)] rounded p-2.5 pr-10 text-xs text-[var(--paper)] font-mono focus:border-[var(--brass)] outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute right-3 text-[var(--mist)] hover:text-[var(--paper)] p-1 transition-colors cursor-pointer"
                    title={showApiKey ? "Gizle" : "Göster"}
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
                {!isCloudConnected && inputApiKey.length > 0 && (
                  <p className="mt-1.5 text-[11px] font-mono text-[var(--brass)] flex items-center gap-1.5 bg-[var(--brass-glow)] p-2 rounded border border-[var(--brass-dim)]">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-[var(--brass)]" />
                    <span>Yerel Mod: API anahtarınız bu cihazın tarayıcı hafızasında saklanmaktadır. Paylaşımlı cihazlarda kullanmayın.</span>
                  </p>
                )}
              </div>
            )}

            <div className="bg-[var(--ink-3)] p-3 rounded border border-[var(--line)] flex items-center justify-between">
              <div className="text-[11px] text-[var(--mist)] font-mono">
                API bağlantısını ve girdiğiniz özel anahtarı canlı test edin:
              </div>
              <button
                type="button"
                onClick={handleTestServerKey}
                disabled={testingKey || selectedProvider === "local"}
                className="bg-[var(--ink)] border border-[var(--brass-dim)] hover:border-[var(--brass)] text-[var(--brass)] text-[11px] font-mono px-3.5 py-1.5 rounded transition-all cursor-pointer disabled:opacity-40 flex items-center gap-1.5"
              >
                <Key className="w-3.5 h-3.5" />
                <span>{testingKey ? "Test Ediliyor..." : "API Bağlantısını Test Et"}</span>
              </button>
            </div>
          </div>

          {testResult && (
            <div
              className={`p-3 rounded text-xs font-mono border flex items-center gap-2 ${
                testResult.isConfigured
                  ? "bg-[rgba(91,140,123,0.15)] text-[var(--verdigris)] border-[var(--verdigris)]"
                  : "bg-[var(--brass-glow)] text-[var(--brass)] border-[var(--brass-dim)]"
              }`}
            >
              {testResult.isConfigured ? (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 shrink-0" />
              )}
              <span>{testResult.message}</span>
            </div>
          )}

          <div className="pt-2 flex items-center justify-between">
            <button
              type="submit"
              className="bg-[var(--brass)] text-[var(--ink)] font-bold text-xs px-5 py-2.5 rounded hover:bg-[#d9b35a] transition-all cursor-pointer shadow"
            >
              Sağlayıcı Tercihini Kaydet
            </button>
            {aiSavedSuccess && (
              <span className="text-xs font-mono text-[var(--verdigris)] flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> AI tercihi güncellendi ✓
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
              key: "priceAlerts" as const,
              title: "Fiyat ve Trend Alarmları",
              desc: "Takip listesindeki hisseler direnç/destek kırdığında uyar.",
              checked: userSettings?.priceAlerts ?? true,
            },
            {
              key: "ipoAlerts" as const,
              title: "Halka Arz Onay & Talep Hatırlatıcısı",
              desc: "Yeni SPK bülteni ve talep toplama başlangıç günlerinde bildirim gönder.",
              checked: userSettings?.ipoAlerts ?? true,
            },
            {
              key: "dividendAlerts" as const,
              title: "Temettü Ödeme Günleri",
              desc: "Portföyündeki şirketlerin hak kullanım ve nakit aktarım günlerini bildir.",
              checked: userSettings?.dividendAlerts ?? true,
            },
            {
              key: "oracleAlerts" as const,
              title: "Orakul Yeniden Dengeleme Sinyali",
              desc: "Sepet ağırlıkları hedef sınırları aştığında optimize uyarısı ver.",
              checked: userSettings?.oracleAlerts ?? true,
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
                onClick={() => updateUserSettings({ [item.key]: !item.checked })}
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
              Mevcut Erişim Şifresi
            </label>
            <div className="relative flex items-center">
              <input
                type={showCurrentPass ? "text" : "password"}
                value={currentPass}
                onChange={(e) => setCurrentPass(e.target.value)}
                placeholder="Mevcut şifrenizi girin..."
                className="w-full bg-[var(--ink-3)] border border-[var(--line)] rounded p-2.5 pr-10 text-xs text-[var(--paper)] font-mono focus:border-[var(--brass)] outline-none"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPass(!showCurrentPass)}
                className="absolute right-3 text-[var(--mist)] hover:text-[var(--paper)] p-1 transition-colors cursor-pointer"
                title={showCurrentPass ? "Şifreyi Gizle" : "Şifreyi Göster"}
              >
                {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-[var(--mist)] uppercase mb-1.5">
              Yeni Erişim Şifresi
            </label>
            <div className="relative flex items-center">
              <input
                type={showNewPass ? "text" : "password"}
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                placeholder="Yeni şifrenizi girin..."
                className="w-full bg-[var(--ink-3)] border border-[var(--line)] rounded p-2.5 pr-10 text-xs text-[var(--paper)] font-mono focus:border-[var(--brass)] outline-none"
              />
              <button
                type="button"
                onClick={() => setShowNewPass(!showNewPass)}
                className="absolute right-3 text-[var(--mist)] hover:text-[var(--paper)] p-1 transition-colors cursor-pointer"
                title={showNewPass ? "Şifreyi Gizle" : "Şifreyi Göster"}
              >
                {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-[var(--mist)] uppercase mb-1.5">
              Yeni Erişim Şifresi (Tekrar Doğrulama)
            </label>
            <div className="relative flex items-center">
              <input
                type={showConfirmPass ? "text" : "password"}
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
                placeholder="Yeni şifrenizi tekrar girin..."
                className="w-full bg-[var(--ink-3)] border border-[var(--line)] rounded p-2.5 pr-10 text-xs text-[var(--paper)] font-mono focus:border-[var(--brass)] outline-none"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPass(!showConfirmPass)}
                className="absolute right-3 text-[var(--mist)] hover:text-[var(--paper)] p-1 transition-colors cursor-pointer"
                title={showConfirmPass ? "Şifreyi Gizle" : "Şifreyi Göster"}
              >
                {showConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={passSaving}
              className="bg-[var(--brass)] text-[var(--ink)] font-bold text-xs px-4 py-2 rounded hover:bg-[#d9b35a] transition-all cursor-pointer disabled:opacity-50"
            >
              {passSaving ? "Doğrulanıyor..." : isCloudConnected ? "Şifreyi Güncelle" : "Şifreyi Doğrula"}
            </button>
            {passSaved && (
              <span className="text-xs font-mono text-[var(--verdigris)]">
                Mevcut şifre doğrulandı ✓
              </span>
            )}
          </div>

          {passError && (
            <div className="p-3 rounded text-xs font-mono bg-[rgba(217,83,79,0.15)] text-[var(--loss)] border border-[var(--loss)]">
              {passError}
            </div>
          )}

          {passMessage && (
            <div className="p-3 rounded text-xs font-mono bg-[rgba(91,140,123,0.15)] text-[var(--verdigris)] border border-[var(--verdigris)]">
              {passMessage}
            </div>
          )}
        </form>

        {/* Vercel Environment Variable Notice */}
        <div className="p-4 rounded-lg bg-[var(--ink-3)] border border-[var(--line)] text-xs font-mono space-y-1.5">
          <div className="flex items-center gap-2 text-[var(--brass)] font-semibold">
            <Lock className="w-4 h-4" />
            <span>Kalıcı Şifre Değişimi Hakkında Bilgilendirme</span>
          </div>
          <p className="text-[11px] text-[var(--mist)] leading-relaxed">
            Güvenlik mimarimiz gereği erişim şifresi sunucu seviyesinde saklanmaktadır. Sunucunuzda şifreyi kalıcı olarak değiştirmek için Vercel panelinizden <strong>Settings → Environment Variables → DEFTER_ACCESS_PASSWORD</strong> değişkenini güncelleyin.
          </p>
        </div>

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
