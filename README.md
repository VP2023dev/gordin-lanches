# Gordin Lanches - Cardápio Online

Cardápio digital estilo Anota.ai: produtos com foto, promoções do dia, carrinho + WhatsApp e painel administrativo.

## Funcionalidades

- **Cardápio público** – Produtos em cards com fotos, busca e filtros por categoria
- **Promoções do dia** – Seção destacada no topo
- **Carrinho + WhatsApp** – Monte o pedido e envie direto pro WhatsApp
- **Painel do dono** – Edite produtos, categorias, promoções, fotos e configurações
- **Banco de dados** – PostgreSQL via Supabase
- **Upload de fotos** – Supabase Storage para imagens dos produtos
- **100% responsivo** – Mobile-first

## Configuração

### 1. Criar projeto no Supabase

1. Acesse [supabase.com](https://supabase.com) e crie um projeto
2. No **SQL Editor**, execute o conteúdo de `database/schema.sql`
3. Em **Storage**, crie um bucket público chamado `cardapio`
4. Em **Settings > API**, copie a URL e as chaves

### 2. Variáveis de ambiente

Copie `.env.example` para `.env` e preencha:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
ADMIN_PASSWORD=sua_senha_admin
```

### 3. Rodar o projeto

```bash
npm install
npm run dev
```

- **Cardápio:** http://localhost:3000
- **Painel admin:** http://localhost:3000/admin

## Estrutura do banco

Execute `database/schema.sql` no Supabase para criar as tabelas:

- `config_loja` – Nome, WhatsApp, endereço, horário
- `categorias` – Categorias do cardápio
- `produtos` – Itens com nome, descrição, preço, foto (URL)
- `promocoes` – Promoções do dia

## WhatsApp

No painel, em **Configurações**, informe o número no formato: `5511999999999` (país + DDD + número).
