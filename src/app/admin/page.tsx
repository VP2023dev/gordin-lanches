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
      <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/50"
        >
          <div className="mb-6 flex justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-800 text-2xl shadow-lg">⚙️</div>
          </div>
          <h1 className="mb-1 text-center text-xl font-bold text-slate-800">
            Painel do Dono
          </h1>
          <p className="mb-6 text-center text-sm text-slate-500">
            Digite a senha para acessar
          </p>
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="Senha"
            className="mb-4 w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-slate-800 shadow-sm transition focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400/30"
            autoFocus
          />
          {erro && <p className="mb-4 text-sm font-medium text-red-600">{erro}</p>}
          <button
            type="submit"
            className="w-full rounded-xl bg-orange-500 py-3.5 font-semibold text-white shadow-lg transition hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2"
          >
            Entrar
          </button>
        </form>
      </div>
    );
  }

  return <AdminPainel onSair={handleSair} />;
}
