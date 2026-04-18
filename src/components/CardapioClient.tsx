"use client";

import { useState } from "react";
import Link from "next/link";
import { PromocoesDia } from "./PromocoesDia";
import { CategoriaSection } from "./CategoriaSection";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/data";
import type { Produto, Categoria, Promocao, Acrescimo, Combo } from "@/types";

interface CardapioClientProps {
  categorias: Categoria[];
  produtos: Produto[];
  promocoes: Promocao[];
  acrescimos: Acrescimo[];
  combos?: Combo[];
  config: { nome: string; whatsapp: string };
}

export function CardapioClient({
  categorias,
  produtos,
  promocoes,
  acrescimos = [],
  combos = [],
}: CardapioClientProps) {
  const { addCombo, totalItens, totalPreco } = useCart();
  const [busca, setBusca] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState<string | null>(null);

  const categoriasOrdenadas = [...categorias].sort((a, b) => a.ordem - b.ordem);
  const categoriasLanches = categoriasOrdenadas.filter((c) => (c.secao || "lanches") === "lanches");
  const categoriasJaponesa = categoriasOrdenadas.filter((c) => c.secao === "japonesa");

  const produtosFiltrados = produtos.filter((p) => {
    const matchBusca =
      !busca ||
      p.nome.toLowerCase().includes(busca.toLowerCase()) ||
      (p.descricao || "").toLowerCase().includes(busca.toLowerCase()) ||
      (p.ingredientes || "").toLowerCase().includes(busca.toLowerCase());
    const matchCat = !categoriaFiltro || p.categoriaId === categoriaFiltro;
    return matchBusca && matchCat;
  });

  const categoriasLanchesComProdutos = categoriasLanches.filter((cat) =>
    produtosFiltrados.some((p) => p.categoriaId === cat.id)
  );
  const categoriasJaponesaComProdutos = categoriasJaponesa.filter((cat) =>
    produtosFiltrados.some((p) => p.categoriaId === cat.id)
  );

  return (
    <div className="min-h-screen pb-8">
      <main className="mx-auto max-w-5xl">
        <PromocoesDia promocoes={promocoes} />

        <div className="sticky top-[57px] z-30 border-b border-[var(--border)] bg-[var(--card-bg)]/95 px-4 py-3 shadow-[var(--shadow-card)] backdrop-blur-md sm:top-[65px]">
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" aria-hidden>
              <SearchIcon />
            </span>
            <input
              type="search"
              placeholder="Buscar item ou ingrediente..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full rounded-lg border border-[var(--border)] bg-neutral-50 py-2.5 pl-10 pr-3 text-sm text-[var(--foreground)] placeholder:text-neutral-400 transition focus:border-neutral-300 focus:bg-[var(--card-bg)] focus:outline-none focus:ring-1 focus:ring-neutral-200"
            />
          </div>
          <div className="mt-2.5 flex gap-2 overflow-x-auto pb-0.5 scrollbar-hide">
            <button
              type="button"
              onClick={() => setCategoriaFiltro(null)}
              className={`shrink-0 rounded-full border px-3.5 py-2 text-sm font-medium transition ${
                !categoriaFiltro
                  ? "border-transparent bg-[var(--foreground)] text-white"
                  : "border-[var(--border)] bg-[var(--card-bg)] text-[var(--muted)] hover:border-[var(--border-strong)]"
              }`}
            >
              Todos
            </button>
            {categoriasOrdenadas.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() =>
                  setCategoriaFiltro(categoriaFiltro === cat.id ? null : cat.id)
                }
                className={`shrink-0 rounded-full border px-3.5 py-2 text-sm font-medium transition ${
                  categoriaFiltro === cat.id
                    ? "border-transparent bg-[var(--foreground)] text-white"
                    : "border-[var(--border)] bg-[var(--card-bg)] text-[var(--muted)] hover:border-[var(--border-strong)]"
                }`}
              >
                {cat.nome}
              </button>
            ))}
          </div>
        </div>

        {/* Seção Combos */}
        {combos.length > 0 && (
          <section className="px-4 py-6">
            <div className="mb-3 flex items-baseline gap-2 border-b border-[var(--border)] pb-3">
              <h2 className="text-lg font-semibold text-[var(--foreground)] sm:text-xl">Combos</h2>
              <span className="text-xs text-[var(--muted)]">pacotes prontos</span>
            </div>
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
              {combos.filter((c) => c.ativo).map((combo) => (
                <li
                  key={combo.id}
                  className="cardapio-card-produto flex flex-col overflow-hidden rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] shadow-[var(--shadow-card)] hover:border-[var(--border-strong)] hover:shadow-[var(--shadow-hover)]"
                >
                  <div className="flex flex-1 flex-col p-3.5 sm:p-4">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--muted)]">Combo</p>
                    <p className="mt-0.5 text-base font-semibold leading-snug text-[var(--foreground)]">{combo.nome}</p>
                    {combo.descricao && <p className="mt-1 text-sm leading-relaxed text-[var(--muted)]">{combo.descricao}</p>}
                    {combo.itens?.length > 0 && (
                      <p className="mt-2 rounded-md border border-[var(--border)] bg-neutral-50 px-2 py-1.5 text-xs leading-relaxed text-[var(--foreground-soft)]">
                        {combo.itens.map((i) => `${i.quantidade}× ${i.produtoNome}`).join(" · ")}
                      </p>
                    )}
                    <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-[var(--border)] pt-3">
                      <span className="text-lg font-bold tabular-nums text-[var(--foreground)]">{formatPrice(combo.preco)}</span>
                      <button
                        type="button"
                        onClick={() => addCombo(combo, 1)}
                        className="btn-accent rounded-lg px-4 py-2 text-sm font-semibold text-white active:scale-[0.98]"
                      >
                        Adicionar
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Seção Lanches */}
        {categoriasLanchesComProdutos.map((categoria) => (
          <CategoriaSection
            key={categoria.id}
            categoria={categoria}
            produtos={produtosFiltrados}
            acrescimos={acrescimos}
          />
        ))}

        {/* Seção Comida Japonesa */}
        {categoriasJaponesaComProdutos.length > 0 && (
          <section className="mt-8 border-t border-[var(--border)] pt-6">
            <div className="mb-4 px-4">
              <h2 className="text-lg font-semibold text-[var(--foreground)] sm:text-xl">Comida japonesa</h2>
              <p className="mt-0.5 text-sm text-[var(--muted)]">Sushis, combinados e mais</p>
            </div>
            {categoriasJaponesaComProdutos.map((categoria) => (
              <CategoriaSection
                key={categoria.id}
                categoria={categoria}
                produtos={produtosFiltrados}
                acrescimos={acrescimos}
              />
            ))}
          </section>
        )}
      </main>

      {/* CTA fixo: Ver carrinho (mobile) */}
      {totalItens > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--border)] bg-[var(--card-bg)]/98 px-4 py-3 shadow-[var(--shadow-card)] backdrop-blur-md sm:hidden">
          <div className="mx-auto flex max-w-5xl items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                Você tem {totalItens} {totalItens === 1 ? "item" : "itens"} no carrinho
              </p>
              <p className="text-sm font-extrabold text-[var(--accent)]">
                Total: {formatPrice(totalPreco)}
              </p>
            </div>
            <Link
              href="/finalizar-pedido"
              className="btn-accent rounded-lg px-4 py-2.5 text-xs font-semibold text-white transition hover:brightness-105"
            >
              Ver carrinho
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}
