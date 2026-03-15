"use client";

import { useState } from "react";
import Link from "next/link";

export default function AvaliarPage() {
  const [nota, setNota] = useState(0);
  const [comentario, setComentario] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (nota < 1 || nota > 5) {
      setErro("Escolha de 1 a 5 estrelas.");
      return;
    }
    setErro(null);
    try {
      const res = await fetch("/api/avaliacoes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nota, comentario: comentario.trim() || null }),
      });
      if (res.ok) {
        setEnviado(true);
      } else {
        setErro("Não foi possível enviar. Tente de novo.");
      }
    } catch {
      setErro("Erro de conexão. Tente de novo.");
    }
  };

  if (enviado) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <p className="text-5xl mb-4">🙏</p>
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Obrigado!</h1>
        <p className="mt-2 text-[var(--muted)]">Sua avaliação foi registrada.</p>
        <Link
          href="/"
          className="btn-accent mt-6 inline-block rounded-xl px-6 py-3 font-bold text-white"
        >
          Voltar ao cardápio
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <h1 className="text-2xl font-bold text-[var(--foreground)] text-center mb-2">
        Como foi sua experiência?
      </h1>
      <p className="text-center text-[var(--muted)] text-sm mb-8">
        Sua opinião ajuda a melhorar nosso atendimento.
      </p>
      <form onSubmit={handleSubmit} className="rounded-2xl border-2 border-[var(--card-border)] bg-[var(--card-bg)] p-6 shadow-[var(--shadow)]">
        <div className="mb-6">
          <p className="text-sm font-medium text-[var(--foreground)] mb-2">Nota (estrelas)</p>
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setNota(n)}
                className={`text-3xl transition hover:scale-110 ${
                  nota >= n ? "text-[var(--gold)] opacity-100" : "text-gray-300"
                }`}
                aria-label={`${n} estrelas`}
              >
                ★
              </button>
            ))}
          </div>
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
            Comentário (opcional)
          </label>
          <textarea
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            placeholder="Conte o que achou..."
            className="w-full rounded-xl border-2 border-[var(--border)] bg-[var(--background)] px-4 py-3 text-[var(--foreground)] placeholder-[var(--muted)] focus:border-[var(--accent)] focus:outline-none"
            rows={3}
            maxLength={1000}
          />
        </div>
        {erro && <p className="text-red-600 text-sm mb-4">{erro}</p>}
        <button
          type="submit"
          disabled={nota < 1}
          className="btn-accent w-full rounded-xl py-3.5 font-bold text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Enviar avaliação
        </button>
      </form>
      <p className="text-center mt-6">
        <Link href="/" className="text-sm text-[var(--muted)] hover:underline">
          Voltar ao cardápio
        </Link>
      </p>
    </div>
  );
}
