-- ============================================
-- Gordin Lanches - Schema do Banco de Dados
-- PostgreSQL / Supabase
-- ============================================

-- Configuração da loja (único registro)
CREATE TABLE IF NOT EXISTS config_loja (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(100) NOT NULL,
  whatsapp VARCHAR(20) NOT NULL,
  endereco TEXT,
  horario TEXT,
  logo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Categorias do cardápio (secao: 'lanches' | 'japonesa' para agrupar no cardápio)
CREATE TABLE IF NOT EXISTS categorias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(100) NOT NULL,
  ordem INTEGER NOT NULL DEFAULT 0,
  ativa BOOLEAN DEFAULT TRUE,
  secao VARCHAR(20) DEFAULT 'lanches',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Produtos (com foto e ingredientes)
CREATE TABLE IF NOT EXISTS produtos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  categoria_id UUID NOT NULL REFERENCES categorias(id) ON DELETE CASCADE,
  nome VARCHAR(150) NOT NULL,
  descricao TEXT,
  ingredientes TEXT,
  preco DECIMAL(10,2) NOT NULL,
  imagem_url TEXT,
  disponivel BOOLEAN DEFAULT TRUE,
  ordem INTEGER NOT NULL DEFAULT 0,
  destaque BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Acréscimos (extras para os lanches)
CREATE TABLE IF NOT EXISTS acrescimos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(100) NOT NULL,
  preco DECIMAL(10,2) NOT NULL DEFAULT 0,
  ativo BOOLEAN DEFAULT TRUE,
  ordem INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Promoções do dia
CREATE TABLE IF NOT EXISTS promocoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo VARCHAR(150) NOT NULL,
  descricao TEXT,
  preco_promocional DECIMAL(10,2),
  imagem_url TEXT,
  ativa BOOLEAN DEFAULT TRUE,
  ordem INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_produtos_categoria ON produtos(categoria_id);
CREATE INDEX IF NOT EXISTS idx_produtos_disponivel ON produtos(disponivel);
CREATE INDEX IF NOT EXISTS idx_categorias_ordem ON categorias(ordem);
CREATE INDEX IF NOT EXISTS idx_promocoes_ativa ON promocoes(ativa);
CREATE INDEX IF NOT EXISTS idx_acrescimos_ativo ON acrescimos(ativo);

-- RLS (Row Level Security) para Supabase - desative se não usar
-- ALTER TABLE config_loja ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE categorias ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE produtos ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE promocoes ENABLE ROW LEVEL SECURITY;

-- Políticas para leitura pública (cardápio)
-- CREATE POLICY "Cardápio público" ON config_loja FOR SELECT USING (true);
-- CREATE POLICY "Categorias públicas" ON categorias FOR SELECT USING (ativa = true);
-- CREATE POLICY "Produtos públicos" ON produtos FOR SELECT USING (disponivel = true);
-- CREATE POLICY "Promoções públicas" ON promocoes FOR SELECT USING (ativa = true);

-- Inserir configuração inicial (apenas se tabela estiver vazia)
INSERT INTO config_loja (nome, whatsapp, endereco, horario)
SELECT 'Gordin Lanches', '5511999999999', 'Rua Exemplo, 123 - Centro', 'Seg a Dom: 11h às 23h'
WHERE NOT EXISTS (SELECT 1 FROM config_loja);

-- Inserir categorias de exemplo (comente ou remova se já tiver dados)
-- INSERT INTO categorias (nome, ordem) VALUES ('Lanches', 1), ('Bebidas', 2), ('Combos', 3);
