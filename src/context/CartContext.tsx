"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import type { Produto } from "@/types";
import type { AcrescimoSelecionado } from "@/types";

export interface ItemCarrinho {
  produto: Produto;
  quantidade: number;
  acrescimos: AcrescimoSelecionado[];
  /** Observação do cliente (ex: "sem cebola", "sem tomate") */
  observacao?: string;
}

export function totalItemLinha(item: ItemCarrinho): number {
  const precoUnitario =
    item.produto.preco +
    item.acrescimos.reduce((s, a) => s + a.preco * a.quantidade, 0);
  return precoUnitario * item.quantidade;
}

function mesmaLinha(
  a: ItemCarrinho,
  b: { produto: Produto; acrescimos: AcrescimoSelecionado[] }
): boolean {
  if (a.produto.id !== b.produto.id) return false;
  if (a.acrescimos.length !== b.acrescimos.length) return false;
  const sort = (arr: AcrescimoSelecionado[]) =>
    [...arr].sort((x, y) => x.id.localeCompare(y.id));
  const sa = sort(a.acrescimos).map((x) => `${x.id}:${x.quantidade}`).join(",");
  const sb = sort(b.acrescimos).map((x) => `${x.id}:${x.quantidade}`).join(",");
  return sa === sb;
}

interface CartContextValue {
  itens: ItemCarrinho[];
  addItem: (
    produto: Produto,
    quantidade?: number,
    acrescimos?: AcrescimoSelecionado[]
  ) => void;
  removeItem: (index: number) => void;
  updateQuantity: (index: number, quantidade: number) => void;
  updateObservation: (index: number, observacao: string) => void;
  clearCart: () => void;
  totalItens: number;
  totalPreco: number;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [itens, setItens] = useState<ItemCarrinho[]>([]);

  const addItem = useCallback(
    (
      produto: Produto,
      quantidade = 1,
      acrescimos: AcrescimoSelecionado[] = []
    ) => {
      const normalizados = acrescimos.filter((a) => a.quantidade > 0);
      setItens((prev) => {
        const idx = prev.findIndex((i) =>
          mesmaLinha(i, { produto, acrescimos: normalizados })
        );
        if (idx >= 0) {
          return prev.map((it, i) =>
            i === idx
              ? { ...it, quantidade: it.quantidade + quantidade }
              : it
          );
        }
        return [
          ...prev,
          { produto, quantidade, acrescimos: normalizados, observacao: undefined },
        ];
      });
    },
    []
  );

  const removeItem = useCallback((index: number) => {
    setItens((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const updateQuantity = useCallback((index: number, quantidade: number) => {
    if (quantidade < 1) {
      setItens((prev) => prev.filter((_, i) => i !== index));
      return;
    }
    setItens((prev) =>
      prev.map((it, i) => (i === index ? { ...it, quantidade } : it))
    );
  }, []);

  const updateObservation = useCallback((index: number, observacao: string) => {
    setItens((prev) =>
      prev.map((it, i) => (i === index ? { ...it, observacao: observacao.trim() || undefined } : it))
    );
  }, []);

  const clearCart = useCallback(() => setItens([]), []);

  const totalItens = useMemo(
    () => itens.reduce((s, i) => s + i.quantidade, 0),
    [itens]
  );

  const totalPreco = useMemo(
    () => itens.reduce((s, i) => s + totalItemLinha(i), 0),
    [itens]
  );

  const value = useMemo(
    () => ({
      itens,
      addItem,
      removeItem,
      updateQuantity,
      updateObservation,
      clearCart,
      totalItens,
      totalPreco,
    }),
    [itens, addItem, removeItem, updateQuantity, updateObservation, clearCart, totalItens, totalPreco]
  );

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
