-- =========================================================
-- DEFTER — SUPABASE İLERİ MİGRASYON #001
-- =========================================================
-- ⚠️ GÜVENLİK KURALI: Bu migration dosyası mevcuttaki verileri KORUR.
-- ⚠️ 'DROP TABLE' veya yıkıcı komut İÇERMEZ.
-- ⚠️ Sadece eksik tabloları 'CREATE TABLE IF NOT EXISTS' ile ekler.
-- =========================================================

-- 1. Kullanıcı Ayarları Tablosu
CREATE TABLE IF NOT EXISTS public.user_settings (
    id TEXT PRIMARY KEY DEFAULT 'default',
    user_name TEXT NOT NULL DEFAULT 'Defter Sahibi',
    currency TEXT NOT NULL DEFAULT '₺ TRY',
    price_alerts BOOLEAN NOT NULL DEFAULT true,
    ipo_alerts BOOLEAN NOT NULL DEFAULT true,
    dividend_alerts BOOLEAN NOT NULL DEFAULT true,
    oracle_alerts BOOLEAN NOT NULL DEFAULT true,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "No Anon Access on user_settings" ON user_settings FOR ALL USING (false);

-- 2. Fiyat Alarmları Tablosu
CREATE TABLE IF NOT EXISTS public.price_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_symbol TEXT NOT NULL REFERENCES companies(symbol) ON DELETE CASCADE,
    target_price NUMERIC(15, 2) NOT NULL,
    condition TEXT NOT NULL DEFAULT 'ABOVE', -- ABOVE, BELOW
    triggered BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE price_alerts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "No Anon Access on price_alerts" ON price_alerts FOR ALL USING (false);

-- 3. Temettü Projeksiyonları Tablosu
CREATE TABLE IF NOT EXISTS public.dividends (
    id TEXT PRIMARY KEY,
    company_symbol TEXT NOT NULL REFERENCES companies(symbol) ON DELETE CASCADE,
    company_name TEXT NOT NULL,
    payment_date DATE NOT NULL,
    net_amount_per_share NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    yield_percent NUMERIC(5, 2) NOT NULL DEFAULT 0.00,
    status TEXT NOT NULL DEFAULT 'Yaklaşıyor', -- Yaklaşıyor, Ödendi, Açıklanacak
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE dividends ENABLE ROW LEVEL SECURITY;
CREATE POLICY "No Anon Access on dividends" ON dividends FOR ALL USING (false);

-- 4. Dağıtık & Atomik Rate Limiting Tablosu ve RPC Fonksiyonu
CREATE TABLE IF NOT EXISTS public.rate_limits (
    id TEXT PRIMARY KEY,
    count INTEGER NOT NULL DEFAULT 1,
    reset_time BIGINT NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "No Anon Access on rate_limits" ON rate_limits FOR ALL USING (false);

CREATE OR REPLACE FUNCTION increment_rate_limit(p_id TEXT, p_window_ms BIGINT, p_now BIGINT)
RETURNS TABLE(count INT, reset_time BIGINT) AS $$
BEGIN
    INSERT INTO rate_limits (id, count, reset_time, updated_at)
    VALUES (p_id, 1, p_now + p_window_ms, NOW())
    ON CONFLICT (id) DO UPDATE
    SET count = CASE
            WHEN rate_limits.reset_time < p_now THEN 1
            ELSE rate_limits.count + 1
        END,
        reset_time = CASE
            WHEN rate_limits.reset_time < p_now THEN p_now + p_window_ms
            ELSE rate_limits.reset_time
        END,
        updated_at = NOW()
    RETURNING rate_limits.count, rate_limits.reset_time INTO count, reset_time;
    RETURN NEXT;
END;
$$ LANGUAGE plpgsql;
