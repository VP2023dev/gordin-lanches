"use client";

import { useState } from "react";
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
  const { addCombo } = useCart();
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
      <main className="mx-auto max-w-4xl">
        <PromocoesDia promocoes={promocoes} />

        <div
          className="sticky top-[57px] z-30 border-b-2 border-[var(--border-strong)] bg-[var(--card-bg)]/98 px-4 py-3 shadow-[var(--shadow)] backdrop-blur-md sm:top-[65px]"
        >
          <input
            type="search"
            placeholder="Buscar lanche, sushi, ingrediente..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full rounded-xl border-2 border-[var(--border)] bg-[var(--card-bg)] px-4 py-3 text-[var(--foreground)] placeholder-[var(--muted)] transition focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-glow)]"
          />
          <div className="mt-2 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            <button
              type="button"
              onClick={() => setCategoriaFiltro(null)}
              className={`shrink-0 rounded-xl px-4 py-2.5 text-sm font-bold transition ${
                !categoriaFiltro
                  ? "btn-accent text-white"
                  : "bg-[var(--border)] text-[var(--muted)] hover:bg-[var(--border-strong)] hover:text-[var(--foreground)]"
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
                className={`shrink-0 rounded-xl px-4 py-2.5 text-sm font-bold transition ${
                  categoriaFiltro === cat.id
                    ? "btn-accent text-white"
                    : "bg-[var(--border)] text-[var(--muted)] hover:bg-[var(--border-strong)] hover:text-[var(--foreground)]"
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
            <h2 className="text-xl font-extrabold text-[var(--foreground)] mb-4">🍔 Combos</h2>
            <ul className="space-y-3">
              {combos.filter((c) => c.ativo).map((combo) => (
                <li
                  key={combo.id}
                  className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border-2 border-[var(--card-border)] bg-[var(--card-bg)] p-4 shadow-[var(--shadow)] transition hover:shadow-[var(--shadow-hover)]"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-[var(--foreground)]">{combo.nome}</p>
                    {combo.descricao && <p className="text-sm text-[var(--muted)] mt-0.5">{combo.descricao}</p>}
                    {combo.itens?.length > 0 && (
                      <p className="text-xs text-[var(--muted)] mt-1">
                        {combo.itens.map((i) => `${i.quantidade}x ${i.produtoNome}`).join(" + ")}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-[var(--accent)]">{formatPrice(combo.preco)}</span>
                    <button
                      type="button"
                      onClick={() => addCombo(combo, 1)}
                      className="btn-accent rounded-xl px-4 py-2.5 text-sm font-bold text-white shadow-md transition hover:brightness-110"
                    >
                      Adicionar
                    </button>
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
          <section className="mt-10 border-t-2 border-[var(--border-strong)] pt-8">
            <div className="px-4 mb-4 flex items-center gap-3">
              <span className="text-3xl" aria-hidden>🍣</span>
              <h2 className="text-2xl font-extrabold text-[var(--foreground)]">
                Comida Japonesa
              </h2>
            </div>
            <p className="px-4 text-sm text-[var(--muted)] mb-4">
              Gordinho Sushi — sushis, combinados, entradas e sobremesas
            </p>
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
    </div>
  );
}
