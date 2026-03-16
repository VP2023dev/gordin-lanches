# Como gerar o PDF do manual para o cliente

## Opção 1 — Pelo navegador (recomendado)

1. Abra o arquivo **`MANUAL-CLIENTE-GORDIN-LANCHES.html`** no Chrome ou no Edge (duplo clique ou arraste o arquivo para o navegador).
2. Pressione **Ctrl+P** (ou **Cmd+P** no Mac).
3. Em **Destino**, escolha **Salvar como PDF**.
4. Clique em **Salvar** e escolha a pasta (por exemplo, a pasta `docs` ou a área de trabalho).

O PDF será gerado com a formatação do manual.

---

## Opção 2 — Pelo terminal (npm)

Se você tiver o projeto aberto no terminal:

```bash
npm run doc:pdf
```

Isso gera o arquivo **`MANUAL-CLIENTE-GORDIN-LANCHES.pdf`** na pasta `docs` (a primeira vez pode demorar por causa do download de dependências).

---

Antes de enviar ao cliente, edite o manual e troque **[link do seu site]** pelo endereço real do cardápio.
