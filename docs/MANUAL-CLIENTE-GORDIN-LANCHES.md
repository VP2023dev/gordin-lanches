# Cardápio Online — Gordin Lanches

**Documentação do sistema**  
*O que o sistema faz e como usar*

---

## O que é o sistema

É um **cardápio digital** para o seu estabelecimento. O cliente acessa pelo celular ou computador, monta o pedido no carrinho e envia direto pelo **WhatsApp** para você. Você ainda tem um **painel administrativo** para alterar cardápio, ver pedidos e avaliações.

---

## Para o cliente (quem compra)

### 1. Cardápio
- Ver **todos os produtos** organizados por categoria (Lanches, Bebidas, Comida Japonesa etc.).
- Ver **foto**, **nome**, **descrição**, **ingredientes** e **preço** de cada item.
- **Buscar** por nome ou ingrediente (ex.: “bacon”, “sushi”).
- **Filtrar** por categoria (botões: Todos, Lanches, Bebidas, etc.).
- Seção de **Combos** com preço único e itens que compõem o combo.
- Seção **Promoções do Dia** em destaque no topo.

### 2. Carrinho
- **Adicionar** itens com quantidade.
- Em produtos que têm **acréscimos** (bacon, queijo extra etc.), ao clicar em “Adicionar” abre uma tela para escolher quantidade e acréscimos.
- **Ir para o carrinho** pelo botão no topo (mostra quantidade de itens).

### 3. Finalizar pedido
- Informar **nome** (para você identificar o pedido).
- Escolher **retirada** ou **entrega** (com endereço).
- Escolher **forma de pagamento** (Dinheiro, PIX, Cartão).
- Para cada item, opção de **observação** (ex.: “sem cebola”, “ponto da carne assim”).
- Ver **resumo** e **total** (com valor de entrega, se houver).
- Ao finalizar, o sistema:
  - **Registra o pedido** com um **número** (ex.: #042).
  - **Abre o WhatsApp** com a mensagem pronta (itens, nome, endereço, total).
  - Mostra na tela **“Seu pedido é o #042”** para o cliente anotar.
- Depois de enviar, o cliente pode clicar em **“Avalie sua experiência”** (estrelas e comentário opcional).

### 4. Outros
- **Aberto/Fechado**: no topo aparece se o estabelecimento está “Aberto” ou “Fechado” conforme o horário que você configurar; quando fechado, o botão de pedido fica desabilitado.
- **Logo** da loja ao lado do nome no topo (se configurada).

---

## Para você (dono) — Painel Administrativo

Acesso por **senha**. No painel você altera tudo que aparece no cardápio e vê pedidos e avaliações.

### 1. Configurações
- **Nome** da loja.
- **WhatsApp** (número para onde os pedidos são enviados).
- **Endereço** (exibido no site se quiser).
- **Horário** em texto (ex.: “Seg a Dom: 11h às 23h”).
- **Abertura e Fechamento** (horas) para o sistema mostrar “Aberto” ou “Fechado” e desabilitar o botão de pedido quando fechado.
- **Logo** da loja (upload de imagem).

### 2. Categorias
- Criar, editar e excluir **categorias** (ex.: Lanches, Bebidas, Comida Japonesa).
- Definir **ordem** de exibição.
- Escolher **seção**: “Lanches” ou “Comida Japonesa” (agrupa no cardápio).

### 3. Produtos
- Produtos organizados **por categoria**.
- Em cada categoria: **+ Novo nesta categoria**.
- Por produto: **nome**, **preço**, **categoria**, **descrição**, **ingredientes**, **foto**, **disponível**, **destaque**.
- **Upload de foto** por produto.
- **Excluir** produto.

### 4. Acréscimos
- Cadastrar **extras** (ex.: Bacon, Queijo extra, Ovo) com **preço** e **ordem**.
- Eles aparecem quando o cliente clica em “Adicionar” em produtos que usam acréscimos.

### 5. Promoções do Dia
- Criar **promoções** com título, descrição, **preço promocional** e imagem.
- Aparecem em destaque no topo do cardápio.

### 6. Combos
- Criar **combos** com nome, preço único e **lista de produtos** (e quantidade de cada um).
- Ex.: “Combo X-Tudo + Batata + Refri” com preço único.

### 7. Pedidos
- Lista de **pedidos registrados** (número, data/hora, cliente, itens, total, entrega ou retirada).
- Filtro **“Só hoje”** para ver apenas os pedidos do dia.
- Cada pedido tem um **número** (ex.: #042) para você identificar no WhatsApp.

### 8. Avaliações
- Ver **avaliações** dos clientes (estrelas e comentário opcional) feitas após “Pedido enviado”.

---

## Resumo das funções

| Onde | Função |
|------|--------|
| **Cardápio (cliente)** | Ver produtos por categoria, buscar, filtrar, combos, promoções, carrinho, acréscimos, observações por item, nome do cliente, entrega/retirada, forma de pagamento, envio por WhatsApp, número do pedido, link para avaliar. |
| **Painel (dono)** | Configurações (nome, WhatsApp, endereço, horário, aberto/fechado, logo), categorias, produtos por categoria, acréscimos, promoções, combos, lista de pedidos (com número), avaliações. |

---

## Acesso

- **Cardápio (público):** [link do seu site]
- **Painel do dono:** [link do seu site]/admin  
  → Senha definida na instalação; guarde com segurança.

---

## Observações técnicas (para o desenvolvedor)

- Front: Next.js (React).
- Banco de dados e armazenamento de imagens: Supabase.
- Hospedagem: Vercel (ou outra).
- Pedidos são enviados pelo WhatsApp; o sistema só registra um resumo (número, itens, total) para você organizar no painel.

---

*Documento gerado para o cliente Gordin Lanches. Atualize os links antes de enviar.*
