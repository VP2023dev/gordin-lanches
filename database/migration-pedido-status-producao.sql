-- ============================================
-- Status de produção dos pedidos (painel gerente)
-- Execute no SQL Editor do Supabase (uma vez)
-- ============================================

ALTER TABLE pedidos ADD COLUMN IF NOT EXISTS status_producao VARCHAR(24);

-- Pedidos antigos: não aparecem como "novos" na cozinha
UPDATE pedidos SET status_producao = 'concluido' WHERE status_producao IS NULL;

ALTER TABLE pedidos ALTER COLUMN status_producao SET DEFAULT 'recebido';

COMMENT ON COLUMN pedidos.status_producao IS 'recebido | em_producao | pronto | concluido';

CREATE INDEX IF NOT EXISTS idx_pedidos_status ON pedidos(status_producao);
