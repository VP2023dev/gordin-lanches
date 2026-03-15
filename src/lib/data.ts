import type { ConfigLoja, Categoria, Produto, Promocao, Acrescimo, Combo } from "@/types";
import { getCardapioFromDb } from "./cardapio-server";

export interface CardapioData {
  config: ConfigLoja;
  categorias: Categoria[];
  produtos: Produto[];
  promocoes: Promocao[];
  acrescimos?: Acrescimo[];
  combos?: Combo[];
}

/** Usado na página inicial (servidor): busca direto do Supabase, sem depender da API. */
export async function getCardapio(): Promise<CardapioData> {
  return getCardapioFromDb(false);
}

export function formatPrice(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}
