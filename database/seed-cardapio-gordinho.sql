-- ============================================
-- Gordinho Lanches - Cardápio completo
-- Execute no SQL Editor do Supabase (uma vez)
-- ============================================

-- Atualizar config da loja (nome e WhatsApp 17 99144 9785)
UPDATE config_loja SET
  nome = 'Gordinho Lanches',
  whatsapp = '5517991449785',
  updated_at = NOW()
WHERE id = (SELECT id FROM config_loja LIMIT 1);

-- Garantir coluna ingredientes
ALTER TABLE produtos ADD COLUMN IF NOT EXISTS ingredientes TEXT;

-- Garantir coluna secao em categorias (Comida Japonesa)
ALTER TABLE categorias ADD COLUMN IF NOT EXISTS secao VARCHAR(20) DEFAULT 'lanches';

-- Limpar produtos e categorias para reinserir (evita duplicados ao rodar de novo)
DELETE FROM produtos;
DELETE FROM categorias;

-- Inserir categorias LANCHES (IDs fixos para referência)
INSERT INTO categorias (id, nome, ordem, secao) VALUES
  ('c1111111-1111-4111-8111-111111111101', 'Hambúrguer', 1, 'lanches'),
  ('c1111111-1111-4111-8111-111111111102', 'Linha Premium', 2, 'lanches'),
  ('c1111111-1111-4111-8111-111111111103', 'Filé', 3, 'lanches'),
  ('c1111111-1111-4111-8111-111111111104', 'Frango', 4, 'lanches'),
  ('c1111111-1111-4111-8111-111111111105', 'Dogs', 5, 'lanches'),
  ('c1111111-1111-4111-8111-111111111106', 'Batatas e Porções', 6, 'lanches')
;

-- Categorias COMIDA JAPONESA (Gordinho Sushi)
INSERT INTO categorias (id, nome, ordem, secao) VALUES
  ('a2222222-2222-4222-8222-222222222201', 'Hossomaki', 10, 'japonesa'),
  ('a2222222-2222-4222-8222-222222222202', 'Uramaki', 11, 'japonesa'),
  ('a2222222-2222-4222-8222-222222222203', 'Entradas', 12, 'japonesa'),
  ('a2222222-2222-4222-8222-222222222204', 'Sobremesa', 13, 'japonesa'),
  ('a2222222-2222-4222-8222-222222222205', 'Sushi Combinados', 14, 'japonesa'),
  ('a2222222-2222-4222-8222-222222222206', 'Hot Roll', 15, 'japonesa'),
  ('a2222222-2222-4222-8222-222222222207', 'Joy', 16, 'japonesa'),
  ('a2222222-2222-4222-8222-222222222208', 'Niguiri', 17, 'japonesa'),
  ('a2222222-2222-4222-8222-222222222209', 'Temaki', 18, 'japonesa')
;

-- Hambúrguer
INSERT INTO produtos (categoria_id, nome, descricao, ingredientes, preco, disponivel, ordem) VALUES
  ('c1111111-1111-4111-8111-111111111101', 'Hambúrguer Simples', NULL, 'Pão, hambúrguer artesanal 100g, mussarela, tomate', 16.00, true, 1),
  ('c1111111-1111-4111-8111-111111111101', 'X-Salada', NULL, 'Pão, hambúrguer artesanal 100g, presunto, mussarela, alface e tomate', 18.00, true, 2),
  ('c1111111-1111-4111-8111-111111111101', 'X-Salada Egg', NULL, 'Pão, hambúrguer artesanal 100g, presunto, mussarela, ovo, alface e tomate', 21.00, true, 3),
  ('c1111111-1111-4111-8111-111111111101', 'X-Salada Bacon', NULL, 'Pão, hambúrguer artesanal 100g, presunto, mussarela, bacon, alface e tomate', 24.00, true, 4),
  ('c1111111-1111-4111-8111-111111111101', 'X-Salada Egg Bacon', NULL, 'Pão, hambúrguer artesanal 100g, presunto, mussarela, ovo, bacon, alface e tomate', 26.00, true, 5),
  ('c1111111-1111-4111-8111-111111111101', 'X-Tudo', NULL, 'Pão, hambúrguer artesanal 199g, presunto, mussarela, frango, ovo, bacon, calabresa, cebola, alface e tomate', 29.00, true, 6),
  ('c1111111-1111-4111-8111-111111111101', 'X-Tudo Especial', NULL, 'Pão, salsicha, hambúrguer artesanal 100g, presunto, mussarela, frango, ovo, bacon, calabresa, alface e tomate', 31.00, true, 7),
  ('c1111111-1111-4111-8111-111111111101', 'Salada Especial', NULL, 'Pão, 2 salsicha, hambúrguer artesanal 100g, presunto, mussarela, ovo, bacon, alface e tomate', 28.00, true, 8),
  ('c1111111-1111-4111-8111-111111111101', 'Big Burguer', NULL, 'Pão, 2 hambúrguer artesanal 100g, 2 presunto, 2 mussarela, catupiry, alface e tomate', 32.00, true, 9),
  ('c1111111-1111-4111-8111-111111111101', 'Duplo com Queijo', NULL, 'Pão, 2 hambúrguer artesanal 100g, mussarela, bacon, cebola roxa', 32.00, true, 10),
  ('c1111111-1111-4111-8111-111111111101', 'Clássico', NULL, 'Pão, hambúrguer artesanal 100g, bacon, mussarela, molho barbecue, cebola roxa, alface, tomate e picles', 29.00, true, 11);

-- Linha Premium
INSERT INTO produtos (categoria_id, nome, descricao, ingredientes, preco, disponivel, ordem) VALUES
  ('c1111111-1111-4111-8111-111111111102', 'Premium 1', NULL, 'Pão, hambúrguer artesanal 100g, mussarela, cebola roxa, tomate e picles', 22.00, true, 1),
  ('c1111111-1111-4111-8111-111111111102', 'Premium 2', NULL, 'Pão, 2 hambúrguer artesanal 100g, bacon, mussarela, cebola roxa, picles, alface, tomate e molho barbecue', 35.00, true, 2),
  ('c1111111-1111-4111-8111-111111111102', 'Premium 3', NULL, 'Pão, hambúrguer artesanal 100g, bacon, mussarela, cebola grelhada na chapa, cheddar cremoso, picles, alface e molho billy jack', 38.00, true, 3),
  ('c1111111-1111-4111-8111-111111111102', 'Premium 4', NULL, 'Pão, 2 hambúrguer artesanal 100g, bacon, cheddar cremoso, cebola grelhada na chapa, tomate e geléia de pimenta', 35.00, true, 4),
  ('c1111111-1111-4111-8111-111111111102', 'Premium 5', NULL, 'Pão, hambúrguer artesanal 100g, bacon, mussarela, cebola roxa, alface, tomate, picles e molho barbecue', 29.00, true, 5);

-- Filé
INSERT INTO produtos (categoria_id, nome, descricao, ingredientes, preco, disponivel, ordem) VALUES
  ('c1111111-1111-4111-8111-111111111103', 'Filé Simples', NULL, 'Pão francês, filé, mussarela, tomate', 26.00, true, 1),
  ('c1111111-1111-4111-8111-111111111103', 'Filé Salada', NULL, 'Pão francês, filé, presunto, mussarela, alface e tomate', 27.00, true, 2),
  ('c1111111-1111-4111-8111-111111111103', 'Filé Egg', NULL, 'Pão francês, filé, presunto, mussarela, ovo, alface e tomate', 30.00, true, 3),
  ('c1111111-1111-4111-8111-111111111103', 'Filé Bacon', NULL, 'Pão francês, filé, presunto, mussarela, bacon, alface e tomate', 32.00, true, 4),
  ('c1111111-1111-4111-8111-111111111103', 'Filé Egg Bacon', NULL, 'Pão francês, filé, presunto, mussarela, ovo, bacon, alface e tomate', 33.00, true, 5),
  ('c1111111-1111-4111-8111-111111111103', 'Filé Tudo', NULL, 'Pão francês, filé, presunto, mussarela, ovo, bacon, calabresa, cebola, alface e tomate', 34.00, true, 6),
  ('c1111111-1111-4111-8111-111111111103', 'Bauru de Filé', NULL, 'Pão francês, filé, mussarela, bacon, cebola e tomate', 33.00, true, 7);

-- Frango
INSERT INTO produtos (categoria_id, nome, descricao, ingredientes, preco, disponivel, ordem) VALUES
  ('c1111111-1111-4111-8111-111111111104', 'Frango Simples', NULL, 'Pão, frango, mussarela, tomate', 20.00, true, 1),
  ('c1111111-1111-4111-8111-111111111104', 'Frango Salada', NULL, 'Pão, frango, presunto, mussarela, alface e tomate', 21.00, true, 2),
  ('c1111111-1111-4111-8111-111111111104', 'Frango Egg', NULL, 'Pão, frango, presunto, mussarela, ovo, alface e tomate', 23.00, true, 3),
  ('c1111111-1111-4111-8111-111111111104', 'Frango Bacon', NULL, 'Pão, frango, presunto, mussarela, bacon, alface e tomate', 26.00, true, 4),
  ('c1111111-1111-4111-8111-111111111104', 'Frango Egg Bacon', NULL, 'Pão, frango, presunto, mussarela, ovo, bacon, alface e tomate', 28.00, true, 5),
  ('c1111111-1111-4111-8111-111111111104', 'Frango Tropical', NULL, 'Pão francês, frango, presunto, mussarela, catupiry, alface e tomate', 27.00, true, 6),
  ('c1111111-1111-4111-8111-111111111104', 'Frango Tudo', NULL, 'Pão, 2 frango, hambúrguer artesanal 100g, presunto, mussarela, ovo, bacon, calabresa, cebola, alface e tomate', 30.00, true, 7),
  ('c1111111-1111-4111-8111-111111111104', 'Bauru de Frango', NULL, 'Pão francês, frango, mussarela, bacon, cebola e tomate', 27.00, true, 8);

-- Dogs
INSERT INTO produtos (categoria_id, nome, descricao, ingredientes, preco, disponivel, ordem) VALUES
  ('c1111111-1111-4111-8111-111111111105', 'Dog Tradicional', NULL, 'Pão de dog, salsicha, carne moída com molho, tomate, alface, milho, batata palha, ketchup e maionese', 17.00, true, 1),
  ('c1111111-1111-4111-8111-111111111105', 'Dog de Frango', NULL, 'Pão de dog, salsicha, cebola, frango, catupiry, mussarela, alface, tomate, milho e batata palha', 24.00, true, 2),
  ('c1111111-1111-4111-8111-111111111105', 'Dog de Calabresa', NULL, 'Pão de dog, salsicha, cebola, calabresa, catupiry, mussarela, alface, tomate, milho e batata palha', 25.00, true, 3),
  ('c1111111-1111-4111-8111-111111111105', 'Dog de Bacon', NULL, 'Pão de dog, salsicha, cebola, bacon, catupiry, mussarela, alface, tomate, milho e batata palha', 27.00, true, 4),
  ('c1111111-1111-4111-8111-111111111105', 'Dogão Matador', NULL, '2 pão, 2 salsicha, cebola, frango, calabresa, bacon, catupiry, mussarela, alface, tomate, milho e batata palha', 34.00, true, 5),
  ('c1111111-1111-4111-8111-111111111105', 'Dog Master', NULL, '2 pão, 4 salsicha, cebola, frango, calabresa, bacon, filé catupiry, mussarela, alface, tomate, milho e batata palha', 55.00, true, 6);

-- Batatas e Porções (porção única - preço 300g; você pode criar 500g como produto à parte se quiser)
INSERT INTO produtos (categoria_id, nome, descricao, ingredientes, preco, disponivel, ordem) VALUES
  ('c1111111-1111-4111-8111-111111111106', 'Batata Simples 300g', 'Porção 300g', 'Batata frita', 15.00, true, 1),
  ('c1111111-1111-4111-8111-111111111106', 'Batata Simples 500g', 'Porção 500g', 'Batata frita', 25.00, true, 2),
  ('c1111111-1111-4111-8111-111111111106', 'Batata Cheddar 300g', 'Porção 300g', 'Batata frita, cheddar', 18.00, true, 3),
  ('c1111111-1111-4111-8111-111111111106', 'Batata Cheddar 500g', 'Porção 500g', 'Batata frita, cheddar', 28.00, true, 4),
  ('c1111111-1111-4111-8111-111111111106', 'Batata Queijo 300g', 'Porção 300g', 'Batata frita, queijo', 18.00, true, 5),
  ('c1111111-1111-4111-8111-111111111106', 'Batata Queijo 500g', 'Porção 500g', 'Batata frita, queijo', 28.00, true, 6),
  ('c1111111-1111-4111-8111-111111111106', 'Batata Cheddar/Bacon 300g', 'Porção 300g', 'Batata frita, cheddar, bacon', 22.00, true, 7),
  ('c1111111-1111-4111-8111-111111111106', 'Batata Cheddar/Bacon 500g', 'Porção 500g', 'Batata frita, cheddar, bacon', 35.00, true, 8),
  ('c1111111-1111-4111-8111-111111111106', 'Batata Maluka 300g', 'Porção 300g', 'Batata frita, cheddar, bacon, calabresa', 24.00, true, 9),
  ('c1111111-1111-4111-8111-111111111106', 'Batata Maluka 500g', 'Porção 500g', 'Batata frita, cheddar, bacon, calabresa', 40.00, true, 10),
  ('c1111111-1111-4111-8111-111111111106', 'Frango Empanado 300g', 'Porção 300g', 'Frango empanado', 24.00, true, 11),
  ('c1111111-1111-4111-8111-111111111106', 'Frango Empanado 500g', 'Porção 500g', 'Frango empanado', 40.00, true, 12);

-- ========== COMIDA JAPONESA (Gordinho Sushi) ==========
-- Hossomaki (8 unidades)
INSERT INTO produtos (categoria_id, nome, descricao, ingredientes, preco, disponivel, ordem) VALUES
  ('a2222222-2222-4222-8222-222222222201', 'Legumes', '8 unidades', '8 unidades', 18.00, true, 1),
  ('a2222222-2222-4222-8222-222222222201', 'Salmão', '8 unidades', '8 unidades', 21.00, true, 2),
  ('a2222222-2222-4222-8222-222222222201', 'Salmão Especial', '8 unidades', '8 unidades', 23.00, true, 3);

-- Uramaki (8 unidades)
INSERT INTO produtos (categoria_id, nome, descricao, ingredientes, preco, disponivel, ordem) VALUES
  ('a2222222-2222-4222-8222-222222222202', 'Salmão', '8 unidades', '8 unidades', 21.00, true, 1),
  ('a2222222-2222-4222-8222-222222222202', 'Salmão Nacho', '8 unidades', '8 unidades', 23.00, true, 2),
  ('a2222222-2222-4222-8222-222222222202', 'Salmão Gambey', '8 unidades', '8 unidades', 23.00, true, 3),
  ('a2222222-2222-4222-8222-222222222202', 'Nacho', '8 unidades', '8 unidades', 18.00, true, 4),
  ('a2222222-2222-4222-8222-222222222202', 'Gambey', '8 unidades', '8 unidades', 18.00, true, 5),
  ('a2222222-2222-4222-8222-222222222202', 'Filadelfia', '8 unidades', '8 unidades', 23.00, true, 6),
  ('a2222222-2222-4222-8222-222222222202', 'Grelhado', '8 unidades', '8 unidades', 24.00, true, 7),
  ('a2222222-2222-4222-8222-222222222202', 'Shin c/ raspas de limão', '8 unidades', '8 unidades', 20.00, true, 8),
  ('a2222222-2222-4222-8222-222222222202', 'Atum', '8 unidades', '8 unidades', 21.00, true, 9);

-- Entradas
INSERT INTO produtos (categoria_id, nome, descricao, ingredientes, preco, disponivel, ordem) VALUES
  ('a2222222-2222-4222-8222-222222222203', 'Ceviche', NULL, NULL, 35.00, true, 1),
  ('a2222222-2222-4222-8222-222222222203', 'Sunomono', NULL, NULL, 10.00, true, 2),
  ('a2222222-2222-4222-8222-222222222203', 'Tartar de Salmão', NULL, NULL, 40.00, true, 3),
  ('a2222222-2222-4222-8222-222222222203', 'Shimeji', NULL, NULL, 30.00, true, 4),
  ('a2222222-2222-4222-8222-222222222203', 'Rolinho Primavera (queijo) unidade', 'Unidade', 'Unidade', 5.00, true, 5),
  ('a2222222-2222-4222-8222-222222222203', 'Rolinho Primavera (porco c/ legumes) unidade', 'Unidade', 'Unidade', 7.00, true, 6),
  ('a2222222-2222-4222-8222-222222222203', 'Carpaccio Tilápia', NULL, NULL, 40.00, true, 7),
  ('a2222222-2222-4222-8222-222222222203', 'Carpaccio Salmão', NULL, NULL, 50.00, true, 8);

-- Sobremesa
INSERT INTO produtos (categoria_id, nome, descricao, ingredientes, preco, disponivel, ordem) VALUES
  ('a2222222-2222-4222-8222-222222222204', 'Joy Romeu e Julieta (4 unidades)', '4 unidades', '4 unidades', 10.00, true, 1),
  ('a2222222-2222-4222-8222-222222222204', 'Hotroll de Chocolate (6 unidades)', '6 unidades', '6 unidades', 20.00, true, 2);

-- Sushi Combinados
INSERT INTO produtos (categoria_id, nome, descricao, ingredientes, preco, disponivel, ordem) VALUES
  ('a2222222-2222-4222-8222-222222222205', 'Combinado da Gi', '22 peças', '8 unidades sushi variado, 8 unidades uramaki variado, 6 unidades hotroll variados', 55.00, true, 1),
  ('a2222222-2222-4222-8222-222222222205', 'Combinado da Vih + Temaki hot', '16 peças + Temaki hot', '8 unidades sushi especial, 8 unidades uramaki filadelfia especial, 1 temaki hot nacho e gambey', 65.00, true, 2),
  ('a2222222-2222-4222-8222-222222222205', 'Combinado Miranda', '22 peças', '8 unidades joy salmão gambey, 8 unidades uramaki filadelfia, 6 unidades hotroll geleia de pimenta', 70.00, true, 3);

-- Hot Roll (6 unidades)
INSERT INTO produtos (categoria_id, nome, descricao, ingredientes, preco, disponivel, ordem) VALUES
  ('a2222222-2222-4222-8222-222222222206', 'Salmão', '6 unidades', '6 unidades', 22.00, true, 1),
  ('a2222222-2222-4222-8222-222222222206', 'Salmão Nacho', '6 unidades', '6 unidades', 24.00, true, 2),
  ('a2222222-2222-4222-8222-222222222206', 'Salmão Gambey', '6 unidades', '6 unidades', 24.00, true, 3),
  ('a2222222-2222-4222-8222-222222222206', 'Geleia de pimenta', '6 unidades', '6 unidades', 25.00, true, 4);

-- Joy (arroz enrolado c/ salmão) (6 unidades)
INSERT INTO produtos (categoria_id, nome, descricao, ingredientes, preco, disponivel, ordem) VALUES
  ('a2222222-2222-4222-8222-222222222207', 'Cream cheese', '6 unidades', 'Arroz enrolado c/ salmão, 6 unidades', 20.00, true, 1),
  ('a2222222-2222-4222-8222-222222222207', 'Nacho', '6 unidades', 'Arroz enrolado c/ salmão, 6 unidades', 22.00, true, 2),
  ('a2222222-2222-4222-8222-222222222207', 'Gambey', '6 unidades', 'Arroz enrolado c/ salmão, 6 unidades', 22.00, true, 3),
  ('a2222222-2222-4222-8222-222222222207', 'Salmão', '6 unidades', 'Arroz enrolado c/ salmão, 6 unidades', 23.00, true, 4),
  ('a2222222-2222-4222-8222-222222222207', 'Salmão Nacho', '6 unidades', 'Arroz enrolado c/ salmão, 6 unidades', 25.00, true, 5),
  ('a2222222-2222-4222-8222-222222222207', 'Salmão Gambey', '6 unidades', 'Arroz enrolado c/ salmão, 6 unidades', 25.00, true, 6),
  ('a2222222-2222-4222-8222-222222222207', 'Geleia de pimenta', '6 unidades', 'Arroz enrolado c/ salmão, 6 unidades', 25.00, true, 7),
  ('a2222222-2222-4222-8222-222222222207', 'Raspas de limão c/ mel', '6 unidades', 'Arroz enrolado c/ salmão, 6 unidades', 23.00, true, 8);

-- Niguiri (6 unidades)
INSERT INTO produtos (categoria_id, nome, descricao, ingredientes, preco, disponivel, ordem) VALUES
  ('a2222222-2222-4222-8222-222222222208', 'Salmão', '6 unidades', '6 unidades', 21.00, true, 1),
  ('a2222222-2222-4222-8222-222222222208', 'Salmão Especial', '6 unidades', '6 unidades', 23.00, true, 2),
  ('a2222222-2222-4222-8222-222222222208', 'Raspas de limão c/ mel', '6 unidades', '6 unidades', 23.00, true, 3);

-- Temaki (unitário)
INSERT INTO produtos (categoria_id, nome, descricao, ingredientes, preco, disponivel, ordem) VALUES
  ('a2222222-2222-4222-8222-222222222209', 'Tradicional', 'Unitário', 'Unitário', 28.00, true, 1),
  ('a2222222-2222-4222-8222-222222222209', 'Tradicional Nacho', 'Unitário', 'Unitário', 30.00, true, 2),
  ('a2222222-2222-4222-8222-222222222209', 'Tradicional Gambey', 'Unitário', 'Unitário', 30.00, true, 3),
  ('a2222222-2222-4222-8222-222222222209', 'Hot Salmão', 'Unitário', 'Unitário', 32.00, true, 4),
  ('a2222222-2222-4222-8222-222222222209', 'Hot Salmão Nacho', 'Unitário', 'Unitário', 34.00, true, 5),
  ('a2222222-2222-4222-8222-222222222209', 'Hot Salmão Gambey', 'Unitário', 'Unitário', 34.00, true, 6);
