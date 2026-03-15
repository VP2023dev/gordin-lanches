"use client";

import { formatPrice } from "@/lib/data";
import type { Promocao } from "@/types";

interface PromocoesDiaProps {
  promocoes: Promocao[];
}

export function PromocoesDia({ promocoes }: PromocoesDiaProps) {
  const promocoesAtivas = promocoes.filter((p) => p.ativa);

  if (promocoesAtivas.length === 0) return null;

  return (
    <section className="border-b-2 border-[var(--border-strong)] bg-gradient-to-r from-[var(--accent-soft)] via-[var(--gold-soft)] to-[var(--accent-soft)] px-4 py-6">
      <div className="mb-4 flex items-center gap-3">
        <span className="text-3xl drop-shadow-sm" aria-hidden>🔥</span>
        <h2 className="text-xl font-extrabold text-[var(--foreground)] sm:text-2xl tracking-tight">
          Promoções do Dia
        </h2>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {promocoesAtivas.map((promo) => (
          <div
            key={promo.id}
            className="card-lift flex min-w-[280px] shrink-0 overflow-hidden rounded-2xl border-2 border-[var(--card-border)] bg-[var(--card-bg)] shadow-[var(--shadow)] transition hover:shadow-[var(--shadow-hover)] hover:border-[var(--accent)]/40"
          >
            {promo.imagem ? (
              <div className="relative h-28 w-28 shrink-0 overflow-hidden">
                <img
                  src={promo.imagem}
                  alt={promo.titulo}
                  className="h-full w-full object-cover"
                />
              </div>
            ) : (
              <div className="flex h-28 w-28 shrink-0 items-center justify-center bg-gradient-to-br from-[var(--accent-soft)] to-[var(--gold-soft)] text-4xl">
                🎉
              </div>
            )}
            <div className="flex flex-1 flex-col justify-center p-4">
              <h3 className="font-bold text-[var(--foreground)] text-base">
                {promo.titulo}
              </h3>
              <p className="line-clamp-2 text-sm text-[var(--muted)] mt-0.5">
                {promo.descricao}
              </p>
              {promo.precoPromocional !== undefined && (
                <p className="mt-2 inline-flex w-fit rounded-lg bg-[var(--accent-soft)] px-2.5 py-1 text-lg font-extrabold text-[var(--accent)]">
                  {formatPrice(promo.precoPromocional)}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
