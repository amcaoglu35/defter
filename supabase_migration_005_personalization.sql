-- Supabase Migration 005: Orakul Kişiselleştirme, Öğrenme ve Güven Kalibrasyonu Kolonları

-- 1. user_settings tablosuna kişiselleştirme kolonları ekle
ALTER TABLE public.user_settings
  ADD COLUMN IF NOT EXISTS preferred_persona TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS risk_tolerance TEXT DEFAULT 'orta',
  ADD COLUMN IF NOT EXISTS verdict_follow_rate NUMERIC(5,2) DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS sector_bias JSONB DEFAULT NULL;

-- 2. ai_history tablosuna persona, kalibrasyon ve kontrol zamanı kolonları ekle
ALTER TABLE public.ai_history
  ADD COLUMN IF NOT EXISTS persona_used TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS confidence_at_verdict NUMERIC DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS outcome_checked_at TIMESTAMPTZ DEFAULT NULL;

-- 3. Hızlı sorgulama için indeksler
CREATE INDEX IF NOT EXISTS idx_ai_history_outcome_pending 
  ON public.ai_history(outcome_correct) 
  WHERE outcome_correct IS NULL;

CREATE INDEX IF NOT EXISTS idx_ai_history_symbol_verdict 
  ON public.ai_history(symbol, outcome_correct);
