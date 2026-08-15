-- ==============================================================================
-- DEFTER: Sepetlerim & İşlem Geçmişi İzlenebilirlik Migration
-- Adds basket_id to transactions and target_weight_percent to basket_holdings
-- ==============================================================================

-- 1. Add basket_id to transactions table
ALTER TABLE transactions 
ADD COLUMN IF NOT EXISTS basket_id TEXT REFERENCES baskets(id) ON DELETE SET NULL;

-- Create index for fast lookups by basket
CREATE INDEX IF NOT EXISTS idx_transactions_basket_id ON transactions(basket_id);

-- 2. Add target_weight_percent to basket_holdings table
ALTER TABLE basket_holdings 
ADD COLUMN IF NOT EXISTS target_weight_percent NUMERIC(5,2);

-- 3. Comments for documentation
COMMENT ON COLUMN transactions.basket_id IS 'İşlemin ait olduğu sepet referansı (Opsiyonel / Genel portföy ise NULL)';
COMMENT ON COLUMN basket_holdings.target_weight_percent IS 'Kullanıcının belirlediği hedef portföy ağırlığı (%)';
