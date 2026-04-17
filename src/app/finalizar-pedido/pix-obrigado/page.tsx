"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/context/CartContext";

function PixObrigadoContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { clearCart } = useCart();

  const [status, setStatus] = useState<"loading" | "paid" | "pending" | "error">("loading");
  const [mensagem, setMensagem] = useState("");
  const [waUrl, setWaUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setStatus("error");
      setMensagem("Link incompleto. Volte ao cardápio e finalize o pedido novamente.");
      return;
    }

    let cancelled = false;
    let tentativas = 0;
    const maxTentativas = 8;

    const poll = async () => {
      try {
        const res = await fetch(`/api/stripe/session-status?session_id=${encodeURIComponent(sessionId)}`);
        const data = await res.json();
        if (cancelled) return;

        if (!res.ok) {
          setStatus("error");
          setMensagem(data?.error || "Não foi possível confirmar o pagamento.");
          return;
        }

        if (data.payment_status === "paid") {
          const url =
            typeof window !== "undefined" ? sessionStorage.getItem("pix_wa_url") : null;
          if (typeof window !== "undefined") {
            sessionStorage.removeItem("pix_wa_url");
            sessionStorage.removeItem("pix_pedido_numero");
          }
          clearCart();
          setWaUrl(url);
          setStatus("paid");
          setMensagem("Seu PIX foi confirmado. Avise o estabelecimento pelo WhatsApp se ainda não enviou o pedido.");
          return;
        }

        if (data.payment_status === "unpaid" && tentativas < maxTentativas) {
          tentativas += 1;
          setStatus("pending");
          setMensagem("Aguardando confirmação do pagamento…");
          window.setTimeout(poll, 2000);
          return;
        }

        setStatus("pending");
        setMensagem(
          "Pagamento ainda não consta como pago. Se você já pagou, aguarde alguns instantes ou fale no WhatsApp da loja."
        );
      } catch {
        if (!cancelled) {
          setStatus("error");
          setMensagem("Erro de rede ao confirmar o pagamento.");
        }
      }
    };

    void poll();
    return () => {
      cancelled = true;
    };
  }, [sessionId, clearCart]);

  return (
    <div className="mx-auto max-w-lg px-4 py-12 text-center">
      <div className="rounded-2xl border-2 border-[var(--card-border)] bg-[var(--card-bg)] p-8 shadow-[var(--shadow-hover)]">
        {status === "loading" || status === "pending" ? (
          <>
            <p className="text-4xl mb-4">⏳</p>
            <h1 className="text-2xl font-extrabold text-[var(--foreground)]">
              {status === "loading" ? "Confirmando pagamento…" : "Quase lá…"}
            </h1>
            <p className="mt-3 text-[var(--muted)]">{mensagem}</p>
          </>
        ) : null}

        {status === "paid" ? (
          <>
            <p className="text-5xl mb-4">✅</p>
            <h1 className="text-2xl font-extrabold text-[var(--foreground)]">PIX recebido</h1>
            <p className="mt-3 text-[var(--muted)]">{mensagem}</p>
            {waUrl ? (
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-[#25d366] to-[#20bd5a] py-4 text-lg font-bold text-white shadow-lg transition hover:brightness-105"
              >
                Abrir WhatsApp com o pedido
              </a>
            ) : (
              <p className="mt-4 text-sm text-[var(--muted)]">
                Se o botão não aparecer, envie o pedido manualmente pelo WhatsApp da loja.
              </p>
            )}
          </>
        ) : null}

        {status === "error" ? (
          <>
            <p className="text-5xl mb-4">⚠️</p>
            <h1 className="text-2xl font-extrabold text-[var(--foreground)]">Algo deu errado</h1>
            <p className="mt-3 text-[var(--muted)]">{mensagem}</p>
          </>
        ) : null}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="btn-accent inline-block rounded-xl px-6 py-3.5 font-bold text-white transition hover:brightness-110"
          >
            Voltar ao cardápio
          </Link>
          <Link
            href="/avaliar"
            className="inline-block rounded-xl border-2 border-[var(--accent)] bg-transparent px-6 py-3.5 font-bold text-[var(--accent)] transition hover:bg-[var(--accent-soft)]"
          >
            Avaliar experiência
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PixObrigadoPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center px-4">
          <p className="text-[var(--muted)]">Carregando…</p>
        </div>
      }
    >
      <PixObrigadoContent />
    </Suspense>
  );
}
