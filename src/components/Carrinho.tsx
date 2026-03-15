"use client";

import { formatPrice } from "@/lib/data";
import type { Produto } from "@/types";

interface ItemCarrinho {
  produto: Produto;
  quantidade: number;
}

interface CarrinhoProps {
  itens: ItemCarrinho[];
  whatsapp: string;
  nomeLoja?: string;
  onRemover: (produtoId: string) => void;
  onLimpar: () => void;
}

export function Carrinho({
  itens,
  whatsapp,
  nomeLoja = "Gordinho Lanches",
  onRemover,
  onLimpar,
}: CarrinhoProps) {
  if (itens.length === 0) return null;

  const total = itens.reduce(
    (s, i) => s + i.produto.preco * i.quantidade,
    0
  );

  const mensagem = itens
    .map(
      (i) =>
        `${i.quantidade}x ${i.produto.nome} - R$ ${(i.produto.preco * i.quantidade).toFixed(2)}`
    )
    .join("\n");
  const msgEncoded = encodeURIComponent(
    `*Pedido - ${nomeLoja}*\n\n${mensagem}\n\n*Total: R$ ${total.toFixed(2)}*`
  );
  const linkWhatsApp = `https://wa.me/${whatsapp.replace(/\D/g, "")}?text=${msgEncoded}`;

  const totalItens = itens.reduce((s, i) => s + i.quantidade, 0);

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-[var(--border)] bg-[var(--card-bg)] p-4 shadow-[0_-8px_32px_rgba(44,36,22,0.12)] sm:bottom-5 sm:left-auto sm:right-5 sm:max-w-sm sm:rounded-2xl sm:border sm:shadow-[var(--shadow-hover)]"
    >
      <div className="mx-auto flex max-w-4xl items-center justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium uppercase tracking-wider text-[var(--muted)]">
            Seu carrinho
          </p>
          <p className="truncate text-sm font-semibold text-[var(--foreground)]">
            {totalItens} {totalItens === 1 ? "item" : "itens"} · {formatPrice(total)}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onLimpar}
            className="rounded-xl border border-[var(--border)] px-3 py-2.5 text-sm font-medium text-[var(--muted)] transition hover:bg-[var(--background)] hover:text-[var(--foreground)]"
          >
            Limpar
          </button>
          <a
            href={linkWhatsApp}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-xl bg-[#22c55e] px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-[#16a34a] hover:shadow-lg active:scale-[0.98]"
          >
            <WhatsAppIcon />
            Finalizar no WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}
