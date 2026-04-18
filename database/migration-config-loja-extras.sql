-- Extras da loja: tempo estimado, entrega, cupom, contato (execute no SQL Editor do Supabase)

ALTER TABLE config_loja ADD COLUMN IF NOT EXISTS tempo_estimado_texto VARCHAR(80) DEFAULT '~25 min';
ALTER TABLE config_loja ADD COLUMN IF NOT EXISTS taxa_entrega_padrao DECIMAL(10,2) DEFAULT 5;
ALTER TABLE config_loja ADD COLUMN IF NOT EXISTS taxas_bairro_text TEXT;
ALTER TABLE config_loja ADD COLUMN IF NOT EXISTS cupom_codigo VARCHAR(40);
ALTER TABLE config_loja ADD COLUMN IF NOT EXISTS cupom_desconto_percent INTEGER;
ALTER TABLE config_loja ADD COLUMN IF NOT EXISTS cnpj VARCHAR(22);
ALTER TABLE config_loja ADD COLUMN IF NOT EXISTS maps_embed_url TEXT;

COMMENT ON COLUMN config_loja.taxas_bairro_text IS 'Uma linha por regra: Nome do Bairro;5 ou Nome;5,50';
COMMENT ON COLUMN config_loja.maps_embed_url IS 'URL src do iframe (Google Maps > Compartilhar > Incorporar mapa)';
