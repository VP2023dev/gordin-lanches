"use client";

import { useEffect, useState } from "react";
import { AdminPainel } from "@/components/AdminPainel";

export default function AdminPage() {
  const [autenticado, setAutenticado] = useState(false);
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem("admin_auth") === "true") {
      setAutenticado(true);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ senha }),
    });
    const data = await res.json();
    if (data.ok) {
      sessionStorage.setItem("admin_auth", "true");
      sessionStorage.setItem("admin_token", senha);
      setAutenticado(true);
    } else {
      setErro("Senha incorreta");
    }
  };

  const handleSair = () => {
    sessionStorage.removeItem("admin_auth");
    sessionStorage.removeItem("admin_token");
    setAutenticado(false);
  };

  if (!autenticado) {
    return (
      <div className="admin-page flex min-h-screen items-center justify-center bg-zinc-100 px-4">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-md rounded-lg border border-zinc-200 bg-white p-8 shadow-sm"
        >
          <div className="mb-6 flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-zinc-200 bg-zinc-900 text-white">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
              </svg>
            </div>
          </div>
          <h1 className="mb-1 text-center text-lg font-semibold tracking-tight text-zinc-900">
            Acesso ao painel
          </h1>
          <p className="mb-6 text-center text-sm text-zinc-500">
            Introduza a palavra-passe administrativa
          </p>
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="Senha"
            className="mb-4 w-full rounded-md border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 shadow-sm transition focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/10"
            autoFocus
          />
          {erro && <p className="mb-4 text-sm font-medium text-red-600">{erro}</p>}
          <button
            type="submit"
            className="w-full rounded-md bg-zinc-900 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2"
          >
            Entrar
          </button>
        </form>
      </div>
    );
  }

  return <AdminPainel onSair={handleSair} />;
}
