"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Header } from "./Header";

interface Config {
  nome: string;
  whatsapp: string;
  logoUrl?: string | null;
  horaAbertura?: string | null;
  horaFechamento?: string | null;
}

export function ConfigShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [config, setConfig] = useState<Config | null>(null);
  const isAdmin = pathname?.startsWith("/admin");

  useEffect(() => {
    if (isAdmin) return;
    fetch("/api/cardapio")
      .then((r) => r.json())
      .then((data) => setConfig(data.config))
      .catch(() =>
        setConfig({ nome: "Gordinho Lanches", whatsapp: "5517991449785" })
      );
  }, [isAdmin]);

  if (isAdmin) return <>{children}</>;

  if (!config) {
    return (
      <div className="min-h-screen">
        <div className="flex h-14 items-center justify-between border-b border-[var(--border)] bg-[var(--card-bg)] px-4">
          <div className="h-6 w-32 animate-pulse rounded-lg bg-[var(--border)]" />
        </div>
        <main className="mx-auto max-w-5xl px-4 py-6 space-y-4">
          <div className="h-6 w-40 animate-pulse rounded-lg bg-[var(--border)]" />
          <div className="space-y-3">
            <div className="h-24 animate-pulse rounded-2xl bg-[var(--border)]/60" />
            <div className="h-24 animate-pulse rounded-2xl bg-[var(--border)]/50" />
            <div className="h-24 animate-pulse rounded-2xl bg-[var(--border)]/40" />
          </div>
        </main>
      </div>
    );
  }

  return (
    <>
      <Header
        nome={config.nome}
        whatsapp={config.whatsapp}
        logoUrl={config.logoUrl}
        horaAbertura={config.horaAbertura}
        horaFechamento={config.horaFechamento}
      />
      {children}
    </>
  );
}
