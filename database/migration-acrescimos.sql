-- Migração: criar tabela de acréscimos (extras para lanches)
-- Execute no SQL Editor do Supabase se você já tem o banco e quer adicionar acréscimos.

CREATE TABLE IF NOT EXISTS acrescimos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(100) NOT NULL,
  preco DECIMAL(10,2) NOT NULL DEFAULT 0,
  ativo BOOLEAN DEFAULT TRUE,
  ordem INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_acrescimos_ativo ON acrescimos(ativo);
