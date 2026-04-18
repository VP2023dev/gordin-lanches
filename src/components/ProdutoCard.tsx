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
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='240'%3E%3Crect fill='%23f0f0f0' width='400' height='240'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='system-ui' font-size='13' fill='%239ca3af'%3ESem foto%3C/text%3E%3C/svg%3E";

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
      <article className="cardapio-card-produto group flex h-full flex-col overflow-hidden rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] shadow-[var(--shadow-card)] hover:border-[var(--border-strong)] hover:shadow-[var(--shadow-hover)]">
        <div className="relative aspect-[5/3] w-full shrink-0 overflow-hidden bg-neutral-100">
          <img
            src={imgSrc}
            alt={produto.nome}
            className="cardapio-card-img h-full w-full object-cover"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent" />
          {produto.destaque && (
            <span className="absolute left-2.5 top-2.5 rounded-md bg-[var(--accent)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white shadow-sm">
              Destaque
            </span>
          )}
        </div>

        <div className="flex min-h-0 flex-1 flex-col p-3.5 sm:p-4">
          <h3 className="text-base font-semibold leading-snug text-[var(--foreground)] sm:text-[1.05rem]">
            {produto.nome}
          </h3>
          {ingredientesTexto && (
            <p className="mt-1 line-clamp-3 text-sm leading-relaxed text-[var(--muted)]">
              {ingredientesTexto}
            </p>
          )}
          <div className="mt-auto flex flex-wrap items-center justify-between gap-2 border-t border-[var(--border)] pt-3">
            <span className="text-lg font-bold tabular-nums text-[var(--foreground)]">
              {formatPrice(produto.preco)}
            </span>
            <button
              type="button"
              onClick={handleClickAdicionar}
              className={`flex shrink-0 items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold transition active:scale-[0.98] ${
                adicionado
                  ? "bg-emerald-600 text-white"
                  : "btn-accent text-white"
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
