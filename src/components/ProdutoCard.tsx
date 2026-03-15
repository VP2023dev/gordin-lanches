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
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Crect fill='%23f5f0e8' width='120' height='120'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='12' fill='%23a8a29e'%3ESem foto%3C/text%3E%3C/svg%3E";

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
    ingredientesLista.length > 0 ? ingredientesLista.join(", ") : produto.descricao || "";
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
      <article
        className="flex gap-4 border-b border-[var(--border)] bg-[var(--card-bg)] py-4 last:border-b-0 transition-colors hover:bg-[var(--background)]/30"
      >
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border-2 border-[var(--card-border)] shadow-[var(--shadow-card)]">
          <img
            src={imgSrc}
            alt={produto.nome}
            className="h-full w-full object-cover"
          />
          {produto.destaque && (
            <span className="absolute left-1 top-1 rounded-md bg-gradient-to-r from-[var(--accent)] to-[var(--gold)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shadow-md">
              Destaque
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="font-bold text-[var(--foreground)]">{produto.nome}</h3>
          {ingredientesTexto && (
            <p className="mt-0.5 line-clamp-2 text-sm text-[var(--muted)]">
              {ingredientesTexto}
            </p>
          )}
          <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
            <span className="text-lg font-extrabold text-[var(--accent)]">
              {formatPrice(produto.preco)}
            </span>
            <button
              type="button"
              onClick={handleClickAdicionar}
              className={`flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-bold shadow-md transition active:scale-[0.98] ${
                adicionado
                  ? "bg-gradient-to-b from-emerald-500 to-emerald-600 text-white"
                  : "btn-accent text-white hover:brightness-110"
              }`}
            >
              {adicionado ? (
                <>
                  <CheckIcon />
                  Adicionado!
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
