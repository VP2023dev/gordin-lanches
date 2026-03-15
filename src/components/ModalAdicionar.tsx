"use client";

import { useState } from "react";
import { formatPrice } from "@/lib/data";
import type { Produto } from "@/types";
import type { Acrescimo, AcrescimoSelecionado } from "@/types";

interface ModalAdicionarProps {
  produto: Produto;
  acrescimos: Acrescimo[];
  onConfirmar: (
    quantidade: number,
    acrescimos: AcrescimoSelecionado[]
  ) => void;
  onFechar: () => void;
}

export function ModalAdicionar({
  produto,
  acrescimos,
  onConfirmar,
  onFechar,
}: ModalAdicionarProps) {
  const [quantidade, setQuantidade] = useState(1);
  const [extras, setExtras] = useState<Record<string, number>>({});

  const alterarExtra = (id: string, delta: number) => {
    setExtras((prev) => {
      const atual = prev[id] || 0;
      const novo = Math.max(0, atual + delta);
      if (novo === 0) {
        const { [id]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [id]: novo };
    });
  };

  const acrescimosSelecionados: AcrescimoSelecionado[] = acrescimos
    .filter((a) => (extras[a.id] || 0) > 0)
    .map((a) => ({
      id: a.id,
      nome: a.nome,
      preco: a.preco,
      quantidade: extras[a.id] || 0,
    }));

  const subtotalProduto = produto.preco * quantidade;
  const subtotalExtras = acrescimosSelecionados.reduce(
    (s, a) => s + a.preco * a.quantidade * quantidade,
    0
  );
  const total = subtotalProduto + subtotalExtras;

  const handleConfirmar = () => {
    onConfirmar(quantidade, acrescimosSelecionados);
    onFechar();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/55 backdrop-blur-sm sm:items-center"
      onClick={onFechar}
    >
      <div
        className="w-full max-w-lg rounded-t-3xl border-2 border-[var(--card-border)] bg-[var(--card-bg)] shadow-[var(--shadow-hover)] sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="max-h-[85vh] overflow-y-auto p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-[var(--foreground)]">
              {produto.nome}
            </h2>
            <button
              type="button"
              onClick={onFechar}
              className="rounded-full p-2 text-[var(--muted)] transition hover:bg-[var(--accent-soft)] hover:text-[var(--foreground)]"
              aria-label="Fechar"
            >
              ✕
            </button>
          </div>

          <p className="mb-4 font-semibold text-[var(--accent)]">
            {formatPrice(produto.preco)} cada
          </p>

          <div className="mb-4">
            <p className="mb-2 text-sm font-bold text-[var(--foreground)]">
              Quantidade
            </p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setQuantidade((q) => Math.max(1, q - 1))}
                className="flex h-11 w-11 items-center justify-center rounded-xl border-2 border-[var(--border-strong)] bg-[var(--background)] text-xl font-bold transition hover:border-[var(--accent)]/50 hover:bg-[var(--accent-soft)]"
              >
                −
              </button>
              <span className="w-10 text-center text-lg font-bold">{quantidade}</span>
              <button
                type="button"
                onClick={() => setQuantidade((q) => q + 1)}
                className="flex h-11 w-11 items-center justify-center rounded-xl border-2 border-[var(--accent)] bg-[var(--accent)] text-xl font-bold text-white transition hover:brightness-110"
              >
                +
              </button>
            </div>
          </div>

          {acrescimos.length > 0 && (
            <div className="mb-4">
              <p className="mb-2 text-sm font-bold text-[var(--foreground)]">
                Acréscimos (opcional)
              </p>
              <ul className="space-y-2">
                {acrescimos.map((a) => (
                  <li
                    key={a.id}
                    className="flex items-center justify-between rounded-xl border-2 border-[var(--card-border)] bg-[var(--background)]/50 p-3"
                  >
                    <span className="font-semibold text-[var(--foreground)]">{a.nome}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-[var(--accent)]">
                        +{formatPrice(a.preco)}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => alterarExtra(a.id, -1)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border-2 border-[var(--border)] bg-white text-sm font-bold transition hover:border-[var(--accent)]/50"
                        >
                          −
                        </button>
                        <span className="w-6 text-center text-sm font-bold">
                          {extras[a.id] || 0}
                        </span>
                        <button
                          type="button"
                          onClick={() => alterarExtra(a.id, 1)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg btn-accent text-sm font-bold text-white"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="border-t-2 border-[var(--border-strong)] pt-4">
            <div className="mb-4 flex justify-between text-lg font-extrabold">
              <span>Total</span>
              <span className="text-[var(--accent)]">{formatPrice(total)}</span>
            </div>
            <button
              type="button"
              onClick={handleConfirmar}
              className="btn-accent w-full rounded-xl py-3.5 font-bold text-white transition hover:brightness-110 active:scale-[0.99]"
            >
              Adicionar ao carrinho
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
