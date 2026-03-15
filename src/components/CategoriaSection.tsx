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
    <section className="px-4 py-6" id={`cat-${categoria.id}`}>
      <h2 className="mb-3 text-lg font-extrabold text-[var(--foreground)] sm:text-xl">
        {categoria.nome}
      </h2>
      <div className="card-lift overflow-hidden rounded-2xl border-2 border-[var(--card-border)] bg-[var(--card-bg)]">
        {produtosDaCategoria.map((produto) => (
          <div key={produto.id} className="px-4">
            <ProdutoCard produto={produto} acrescimos={acrescimos} />
          </div>
        ))}
      </div>
    </section>
  );
}
