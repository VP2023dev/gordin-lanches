"use client";

import { ProdutoCard } from "./ProdutoCard";
import type { Categoria, Produto, Acrescimo } from "@/types";

interface CategoriaSectionProps {
  categoria: Categoria;
  produtos: Produto[];
  acrescimos: Acrescimo[];
}

export function CategoriaSection({
  categoria,
  produtos,
  acrescimos,
}: CategoriaSectionProps) {
  const produtosDaCategoria = produtos
    .filter((p) => p.categoriaId === categoria.id && p.disponivel)
    .sort((a, b) => a.ordem - b.ordem);

  if (produtosDaCategoria.length === 0) return null;

  return (
    <section className="px-4 py-7" id={`cat-${categoria.id}`}>
      <div className="mb-5 flex items-center gap-3">
        <span className="h-9 w-1.5 shrink-0 rounded-full bg-gradient-to-b from-[var(--accent)] via-[var(--gold)] to-amber-400 shadow-sm" aria-hidden />
        <div>
          <h2 className="text-xl font-extrabold tracking-tight text-[var(--foreground)] sm:text-2xl">
            {categoria.nome}
          </h2>
          <p className="mt-0.5 text-xs font-medium uppercase tracking-wider text-[var(--muted)]">
            Toque para adicionar ao pedido
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {produtosDaCategoria.map((produto) => (
          <ProdutoCard key={produto.id} produto={produto} acrescimos={acrescimos} />
        ))}
      </div>
    </section>
  );
}
