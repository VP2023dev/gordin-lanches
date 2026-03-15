# Deploy na Vercel (gratuito)

## 1. Subir o código no GitHub

1. Crie uma conta em [github.com](https://github.com) se ainda não tiver.
2. Crie um **novo repositório** (ex: `gordin-lanches`). Não marque "Add README" se a pasta já tiver arquivos.
3. No terminal, na pasta do projeto (`gordin-lanches`), rode:

```bash
git init
git add .
git commit -m "Cardápio Gordin Lanches + Comida Japonesa"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/gordin-lanches.git
git push -u origin main
```

(Substitua `SEU-USUARIO` pelo seu usuário do GitHub.)

---

## 2. Conectar na Vercel

1. Acesse [vercel.com](https://vercel.com) e entre com **GitHub**.
2. Clique em **Add New** → **Project**.
3. Selecione o repositório **gordin-lanches** (ou o nome que você deu).
4. Em **Configure Project**:
   - **Framework Preset:** Next.js (já vem detectado).
   - **Root Directory:** deixe em branco.
   - **Build Command:** `npm run build` (padrão).
   - Não clique em Deploy ainda.

---

## 3. Variáveis de ambiente

Antes de dar Deploy, clique em **Environment Variables** e adicione as mesmas do seu `.env`:

| Nome | Valor | Observação |
|------|--------|------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxx.supabase.co` | URL do projeto no Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJ...` | Chave anon (pública) do Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJ...` | Chave service_role (Settings → API) |
| `ADMIN_PASSWORD` | sua senha do painel | Senha do `/admin` |

- Marque para **Production**, **Preview** e **Development**.
- Depois clique em **Deploy**.

---

## 4. Depois do deploy

- A Vercel vai dar uma URL tipo `gordin-lanches.vercel.app`.
- Acesse essa URL para ver o cardápio.
- Painel admin: `https://sua-url.vercel.app/admin`.
- O **Storage do Supabase** (fotos) já funciona em produção; só conferir se o bucket `cardapio` está público para leitura.

---

## 5. (Opcional) Domínio próprio

No projeto na Vercel: **Settings** → **Domains** → adicione seu domínio (ex: `cardapio.gordinlanches.com.br`). A Vercel explica como apontar o DNS.

---

## Resumo

1. Código no GitHub  
2. Novo projeto na Vercel vinculado ao repo  
3. Variáveis de ambiente preenchidas (Supabase + ADMIN_PASSWORD)  
4. Deploy  

O plano gratuito da Vercel cobre esse tipo de projeto (Next.js + Supabase) sem custo.
