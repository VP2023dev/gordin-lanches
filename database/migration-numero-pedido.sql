-- Número sequencial do pedido (#001, #002, ...)
-- Execute no SQL Editor do Supabase

ALTER TABLE pedidos ADD COLUMN IF NOT EXISTS numero INTEGER;

-- Opcional: preencher números para pedidos antigos (por ordem de criação)
-- WITH ranked AS (
--   SELECT id, ROW_NUMBER() OVER (ORDER BY created_at) AS rn
--   FROM pedidos
--   WHERE numero IS NULL
-- )
-- UPDATE pedidos p SET numero = ranked.rn FROM ranked WHERE p.id = ranked.id;
