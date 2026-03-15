"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";

interface HeaderProps {
  nome: string;
  whatsapp: string;
  logoUrl?: string | null;
}

export function Header({ nome, whatsapp, logoUrl }: HeaderProps) {
  const { totalItens } = useCart();
  const whatsappLink = `https://wa.me/${whatsapp.replace(/\D/g, "")}`;

  return (
    <header className="sticky top-0 z-50 border-b-2 border-[var(--border-strong)] bg-[var(--card-bg)]/98 shadow-[var(--shadow)] backdrop-blur-md">
      <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-4 py-3.5">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-xl py-1 pr-2 transition hover:opacity-90 active:opacity-95"
        >
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={nome}
              className="h-11 w-11 shrink-0 rounded-xl object-cover shadow-md sm:h-12 sm:w-12"
            />
          ) : (
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--accent)] to-[var(--accent-hover)] text-xl shadow-lg sm:h-12 sm:w-12">
              🍔
            </div>
          )}
          <span className="text-xl font-extrabold tracking-tight text-[var(--foreground)] sm:text-2xl">
            {nome}
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <Link
            href="/finalizar-pedido"
            className="relative flex items-center gap-2 rounded-xl border-2 border-[var(--border-strong)] bg-[var(--background)] px-3 py-2.5 text-sm font-semibold text-[var(--foreground-soft)] transition hover:border-[var(--accent)]/40 hover:bg-[var(--accent-soft)] hover:text-[var(--foreground)]"
          >
            <CartIcon />
            <span className="hidden sm:inline">Carrinho</span>
            {totalItens > 0 && (
              <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-gradient-to-br from-[var(--accent)] to-[var(--accent-hover)] px-1.5 text-xs font-bold text-white shadow-md">
                {totalItens > 99 ? "99+" : totalItens}
              </span>
            )}
          </Link>
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-xl bg-gradient-to-b from-[#25d366] to-[#20bd5a] px-4 py-2.5 text-sm font-bold text-white shadow-lg transition-all hover:shadow-xl hover:brightness-105 active:scale-[0.98]"
          >
            <WhatsAppIcon />
            <span className="hidden sm:inline">Fazer pedido</span>
          </a>
        </div>
      </div>
    </header>
  );
}

function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 01-8 0" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}
