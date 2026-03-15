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
      <h2 className="mb-4 flex items-center gap-2 text-xl font-extrabold text-[var(--foreground)]">
        <span className="text-3xl drop-shadow-sm" aria-hidden>🔥</span>
        Promoções do Dia
      </h2>
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {promocoesAtivas.map((promo) => (
          <div
            key={promo.id}
            className="card-lift flex min-w-[280px] shrink-0 overflow-hidden rounded-2xl border-2 border-[var(--card-border)] bg-[var(--card-bg)]"
          >
            {promo.imagem ? (
              <div className="relative h-24 w-24 shrink-0">
                <img
                  src={promo.imagem}
                  alt={promo.titulo}
                  className="h-full w-full object-cover"
                />
              </div>
            ) : (
              <div className="flex h-24 w-24 shrink-0 items-center justify-center bg-gradient-to-br from-[var(--accent-soft)] to-[var(--gold-soft)] text-3xl">
                🎉
              </div>
            )}
            <div className="flex flex-1 flex-col justify-center p-3">
              <h3 className="font-bold text-[var(--foreground)]">
                {promo.titulo}
              </h3>
              <p className="line-clamp-2 text-sm text-[var(--muted)]">
                {promo.descricao}
              </p>
              {promo.precoPromocional !== undefined && (
                <p className="mt-1 text-lg font-extrabold text-[var(--accent)]">
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
