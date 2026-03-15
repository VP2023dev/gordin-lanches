import type { ConfigLoja, Categoria, Produto, Promocao, Acrescimo } from "@/types";

export interface CardapioData {
  config: ConfigLoja;
  categorias: Categoria[];
  produtos: Produto[];
  promocoes: Promocao[];
  acrescimos?: Acrescimo[];
}

export async function getCardapio(): Promise<CardapioData> {
  const base =
    typeof window !== "undefined" ? "" : process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const url = base ? `${base}/api/cardapio` : "/api/cardapio";
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error("Erro ao carregar cardápio");
  return res.json();
}

export function formatPrice(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}
