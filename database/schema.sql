-- ============================================
-- Gordin Lanches - Schema do Banco de Dados
-- PostgreSQL / Supabase
-- ============================================

-- Configuração da loja (único registro)
-- hora_abertura / hora_fechamento: "11:00" e "23:00" para "Aberto agora"
CREATE TABLE IF NOT EXISTS config_loja (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(100) NOT NULL,
  whatsapp VARCHAR(20) NOT NULL,
  endereco TEXT,
  horario TEXT,
  logo_url TEXT,
  hora_abertura VARCHAR(5),
  hora_fechamento VARCHAR(5),
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

-- Pedidos (histórico para o dono)
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

-- Combos (produtos do tipo combo)
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

-- Avaliações dos clientes
CREATE TABLE IF NOT EXISTS avaliacoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  nota INTEGER NOT NULL CHECK (nota >= 1 AND nota <= 5),
  comentario TEXT
);
CREATE INDEX IF NOT EXISTS idx_avaliacoes_created ON avaliacoes(created_at DESC);

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
