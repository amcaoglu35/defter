-- =========================================================
-- DEFTER — SUPABASE MİGRASYON #002 (Settings & Rate Limits)
-- =========================================================
-- ⚠️ GÜVENLİK KURALI: Bu migration dosyası mevcuttaki verileri KORUR.
-- ⚠️ 'DROP TABLE' veya yıkıcı komut İÇERMEZ.
-- ⚠️ Sadece eksik tabloları 'CREATE TABLE IF NOT EXISTS' ile ekler.
-- =========================================================

-- 1. Uygulama Ayarları & Şifreli Kasa Tablosu (app_settings)
CREATE TABLE IF NOT EXISTS public.app_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "No Anon Access on app_settings" ON app_settings FOR ALL USING (false);

-- 2. Dağıtık Rate Limiting Tablosu (rate_limits)
CREATE TABLE IF NOT EXISTS public.rate_limits (
    id TEXT PRIMARY KEY,
    count INTEGER NOT NULL DEFAULT 1,
    reset_time BIGINT NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "No Anon Access on rate_limits" ON rate_limits FOR ALL USING (false);
