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
    <section className="border-b border-[var(--border)] bg-[var(--card-bg)] px-4 py-5">
      <div className="mb-3 flex items-center gap-2">
        <h2 className="text-lg font-semibold text-[var(--foreground)] sm:text-xl">Promoções do dia</h2>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
        {promocoesAtivas.map((promo) => (
          <div
            key={promo.id}
            className="flex min-w-[260px] shrink-0 overflow-hidden rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] shadow-[var(--shadow-card)] transition hover:shadow-[var(--shadow-hover)]"
          >
            {promo.imagem ? (
              <div className="relative h-24 w-24 shrink-0 overflow-hidden bg-neutral-100">
                <img
                  src={promo.imagem}
                  alt={promo.titulo}
                  className="h-full w-full object-cover"
                />
              </div>
            ) : (
              <div className="flex h-24 w-24 shrink-0 items-center justify-center bg-neutral-100 text-xs font-semibold uppercase tracking-wide text-neutral-400">
                Promo
              </div>
            )}
            <div className="flex min-w-0 flex-1 flex-col justify-center p-3">
              <h3 className="font-semibold text-[var(--foreground)] text-sm leading-snug">
                {promo.titulo}
              </h3>
              <p className="line-clamp-2 text-xs text-[var(--muted)] mt-0.5">
                {promo.descricao}
              </p>
              {promo.precoPromocional !== undefined && (
                <p className="mt-2 text-base font-bold text-[var(--accent)] tabular-nums">
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
