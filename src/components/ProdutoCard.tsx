"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/data";
import { ModalAdicionar } from "./ModalAdicionar";
import type { Produto } from "@/types";
import type { Acrescimo, AcrescimoSelecionado } from "@/types";

interface ProdutoCardProps {
  produto: Produto;
  acrescimos: Acrescimo[];
}

const PLACEHOLDER_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='240'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%23fff4ed'/%3E%3Cstop offset='100%25' stop-color='%23fde68a'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill='url(%23g)' width='400' height='240'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='system-ui' font-size='14' fill='%23957569'%3ESem foto%3C/text%3E%3C/svg%3E";

function parseIngredientes(ingredientes: string | undefined): string[] {
  if (!ingredientes?.trim()) return [];
  return ingredientes
    .split(/[\n,;]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export function ProdutoCard({ produto, acrescimos }: ProdutoCardProps) {
  const { addItem } = useCart();
  const [adicionado, setAdicionado] = useState(false);
  const [modalAberto, setModalAberto] = useState(false);

  if (!produto.disponivel) return null;

  const imgSrc = produto.imagem || PLACEHOLDER_IMAGE;
  const ingredientesLista = parseIngredientes(produto.ingredientes);
  const ingredientesTexto =
    ingredientesLista.length > 0 ? ingredientesLista.join(" · ") : produto.descricao || "";
  const temAcrescimos = acrescimos.length > 0;

  const handleClickAdicionar = () => {
    if (temAcrescimos) {
      setModalAberto(true);
    } else {
      addItem(produto);
      setAdicionado(true);
      setTimeout(() => setAdicionado(false), 1500);
    }
  };

  const handleConfirmarModal = (
    quantidade: number,
    acrescimosSel: AcrescimoSelecionado[]
  ) => {
    addItem(produto, quantidade, acrescimosSel);
    setAdicionado(true);
    setTimeout(() => setAdicionado(false), 1500);
  };

  return (
    <>
      <article className="cardapio-card-produto group relative flex h-full flex-col overflow-hidden rounded-2xl border-2 border-[var(--card-border)] bg-[var(--card-bg)] shadow-[var(--shadow-card)] transition duration-300 hover:-translate-y-0.5 hover:border-[var(--accent)]/35 hover:shadow-[var(--shadow-hover)]">
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-1 bg-gradient-to-r from-transparent via-[var(--accent)]/40 to-transparent opacity-0 transition group-hover:opacity-100" />

        <div className="relative aspect-[5/3] w-full shrink-0 overflow-hidden bg-[var(--accent-soft)]">
          <img
            src={imgSrc}
            alt={produto.nome}
            className="cardapio-card-img h-full w-full object-cover"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-60" />
          {produto.destaque && (
            <span className="absolute left-3 top-3 rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--gold)] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white shadow-lg ring-2 ring-white/30">
              Destaque
            </span>
          )}
        </div>

        <div className="flex min-h-0 flex-1 flex-col p-4 pt-3">
          <h3 className="font-extrabold leading-tight text-[var(--foreground)] text-lg tracking-tight">
            {produto.nome}
          </h3>
          {ingredientesTexto && (
            <p className="mt-1.5 line-clamp-3 text-sm leading-relaxed text-[var(--muted)]">
              {ingredientesTexto}
            </p>
          )}
          <div className="mt-auto flex flex-wrap items-end justify-between gap-3 border-t border-[var(--border)] pt-4">
            <span className="inline-flex items-baseline gap-0.5 rounded-xl bg-[var(--accent-soft)] px-3 py-2 text-xl font-black tabular-nums text-[var(--accent)]">
              {formatPrice(produto.preco)}
            </span>
            <button
              type="button"
              onClick={handleClickAdicionar}
              className={`flex shrink-0 items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold shadow-lg transition active:scale-[0.98] ${
                adicionado
                  ? "bg-gradient-to-b from-emerald-500 to-emerald-600 text-white ring-2 ring-emerald-300/50"
                  : "btn-accent text-white hover:brightness-110"
              }`}
            >
              {adicionado ? (
                <>
                  <CheckIcon />
                  No carrinho
                </>
              ) : (
                <>
                  <CartIcon />
                  Adicionar
                </>
              )}
            </button>
          </div>
        </div>
      </article>

      {modalAberto && (
        <ModalAdicionar
          produto={produto}
          acrescimos={acrescimos}
          onConfirmar={handleConfirmarModal}
          onFechar={() => setModalAberto(false)}
        />
      )}
    </>
  );
}

function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 01-8 0" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
