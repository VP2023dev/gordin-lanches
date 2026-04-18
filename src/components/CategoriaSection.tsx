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
      <div className="mb-4 flex items-baseline gap-2 border-b border-[var(--border)] pb-3">
        <h2 className="text-base font-semibold tracking-tight text-[var(--foreground)] sm:text-lg">{categoria.nome}</h2>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
        {produtosDaCategoria.map((produto) => (
          <ProdutoCard key={produto.id} produto={produto} acrescimos={acrescimos} />
        ))}
      </div>
    </section>
  );
}
