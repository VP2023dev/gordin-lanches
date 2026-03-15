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
      <div className="mb-4 flex items-center gap-3">
        <span className="h-8 w-1 shrink-0 rounded-full bg-gradient-to-b from-[var(--accent)] to-[var(--gold)]" aria-hidden />
        <h2 className="text-xl font-extrabold text-[var(--foreground)] sm:text-2xl tracking-tight">
          {categoria.nome}
        </h2>
      </div>
      <div className="space-y-2">
        {produtosDaCategoria.map((produto) => (
          <ProdutoCard key={produto.id} produto={produto} acrescimos={acrescimos} />
        ))}
      </div>
    </section>
  );
}
