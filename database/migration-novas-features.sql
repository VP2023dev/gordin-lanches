-- ============================================
-- Migração: Aberto/Fechado, Pedidos, Combos, Avaliações
-- Execute no SQL Editor do Supabase
-- ============================================

-- 1) Config: horário de abertura/fechamento (para "Aberto agora")
ALTER TABLE config_loja ADD COLUMN IF NOT EXISTS hora_abertura VARCHAR(5);
ALTER TABLE config_loja ADD COLUMN IF NOT EXISTS hora_fechamento VARCHAR(5);
-- Exemplo: hora_abertura = '11:00', hora_fechamento = '23:00'

-- 2) Pedidos (histórico para o dono)
CREATE TABLE IF NOT EXISTS pedidos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  nome_cliente VARCHAR(150),
  itens_json TEXT NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  tipo_entrega VARCHAR(20) NOT NULL,
  forma_pagamento VARCHAR(50),
  endereco_json TEXT
);
CREATE INDEX IF NOT EXISTS idx_pedidos_created ON pedidos(created_at DESC);

-- 3) Combos
CREATE TABLE IF NOT EXISTS combos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(150) NOT NULL,
  descricao TEXT,
  preco DECIMAL(10,2) NOT NULL,
  imagem_url TEXT,
  ativo BOOLEAN DEFAULT TRUE,
  ordem INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS combo_itens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  combo_id UUID NOT NULL REFERENCES combos(id) ON DELETE CASCADE,
  produto_id UUID NOT NULL REFERENCES produtos(id) ON DELETE CASCADE,
  quantidade INTEGER NOT NULL DEFAULT 1
);
CREATE INDEX IF NOT EXISTS idx_combo_itens_combo ON combo_itens(combo_id);

-- 4) Avaliações
CREATE TABLE IF NOT EXISTS avaliacoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  nota INTEGER NOT NULL CHECK (nota >= 1 AND nota <= 5),
  comentario TEXT
);
CREATE INDEX IF NOT EXISTS idx_avaliacoes_created ON avaliacoes(created_at DESC);
