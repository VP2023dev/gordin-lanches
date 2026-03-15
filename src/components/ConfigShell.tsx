"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Header } from "./Header";

interface Config {
  nome: string;
  whatsapp: string;
  logoUrl?: string | null;
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
        <div className="flex h-14 items-center justify-between border-b-2 border-[var(--border-strong)] bg-[var(--card-bg)] px-4">
          <div className="h-6 w-32 animate-pulse rounded-lg bg-[var(--border)]" />
        </div>
        <div className="flex min-h-[60vh] items-center justify-center">
          <p className="font-semibold text-[var(--muted)]">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header nome={config.nome} whatsapp={config.whatsapp} logoUrl={config.logoUrl} />
      {children}
    </>
  );
}
