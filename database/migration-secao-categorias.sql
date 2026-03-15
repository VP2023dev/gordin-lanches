-- Adiciona agrupamento de categorias (lanches vs comida japonesa)
-- Execute no SQL Editor do Supabase antes do seed da comida japonesa.

ALTER TABLE categorias ADD COLUMN IF NOT EXISTS secao VARCHAR(20) DEFAULT 'lanches';

UPDATE categorias SET secao = 'lanches' WHERE secao IS NULL;
