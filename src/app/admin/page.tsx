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
      <div className="flex min-h-screen items-center justify-center bg-amber-50 px-4">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm rounded-2xl border border-amber-200 bg-white p-6 shadow-lg"
        >
          <h1 className="mb-4 text-xl font-bold text-amber-900">
            Painel do Dono
          </h1>
          <p className="mb-4 text-sm text-gray-600">
            Digite a senha para acessar
          </p>
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="Senha"
            className="mb-4 w-full rounded-lg border border-amber-300 px-4 py-3 focus:border-amber-500 focus:outline-none"
            autoFocus
          />
          {erro && <p className="mb-4 text-sm text-red-600">{erro}</p>}
          <button
            type="submit"
            className="w-full rounded-lg bg-amber-600 py-3 font-medium text-white hover:bg-amber-700"
          >
            Entrar
          </button>
        </form>
      </div>
    );
  }

  return <AdminPainel onSair={handleSair} />;
}
