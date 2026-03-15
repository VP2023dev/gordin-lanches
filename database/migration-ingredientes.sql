-- Se a tabela produtos já existir sem a coluna ingredientes, execute este script no SQL Editor do Supabase:
ALTER TABLE produtos ADD COLUMN IF NOT EXISTS ingredientes TEXT;
