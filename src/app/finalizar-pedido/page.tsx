"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCart, totalItemLinha } from "@/context/CartContext";
import { formatPrice } from "@/lib/data";

const CUSTO_ENTREGA = 5;
const FORMAS_PAGAMENTO = [
  { id: "dinheiro", label: "Dinheiro" },
  { id: "pix", label: "PIX" },
  { id: "cartao", label: "Cartão (débito/crédito)" },
] as const;

/** Coloque `true` quando a Stripe liberar PIX na conta e `NEXT_PUBLIC_STRIPE_PIX=1` no ambiente. */
const STRIPE_CHECKOUT_PIX_ENABLED = false;

function stripePixCheckoutHabilitado() {
  if (!STRIPE_CHECKOUT_PIX_ENABLED) return false;
  const raw = process.env.NEXT_PUBLIC_STRIPE_PIX;
  if (raw == null || String(raw).trim() === "") return false;
  const v = String(raw).toLowerCase().trim();
  return v === "1" || v === "true" || v === "yes";
}

export default function FinalizarPedidoPage() {
  const { itens, removeItem, updateQuantity, updateObservation, totalPreco, clearCart } = useCart();
  const [config, setConfig] = useState<{ nome: string; whatsapp: string } | null>(null);
  const [nomeCliente, setNomeCliente] = useState("");
  const [tipoEntrega, setTipoEntrega] = useState<"entrega" | "retirada">("retirada");
  const [formaPagamento, setFormaPagamento] = useState<string>("dinheiro");
  const [mostrarCancelamentoPix, setMostrarCancelamentoPix] = useState(false);
  const [erroStripe, setErroStripe] = useState<string | null>(null);
  const [indoParaStripe, setIndoParaStripe] = useState(false);
  const [endereco, setEndereco] = useState({
    rua: "",
    bairro: "",
    numero: "",
    complemento: "",
  });
  const [enviado, setEnviado] = useState(false);
  const [numeroPedido, setNumeroPedido] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/cardapio")
      .then((r) => r.json())
      .then((data) => setConfig(data.config))
      .catch(() =>
        setConfig({ nome: "Gordinho Lanches", whatsapp: "5517991449785" })
      );
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const sp = new URLSearchParams(window.location.search);
    if (sp.get("cancelado") === "pix") {
      setMostrarCancelamentoPix(true);
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  const totalEntrega = tipoEntrega === "entrega" ? CUSTO_ENTREGA : 0;
  const totalGeral = totalPreco + totalEntrega;

  const podeFinalizar =
    itens.length > 0 &&
    (tipoEntrega === "retirada" ||
      (endereco.rua.trim() && endereco.bairro.trim() && endereco.numero.trim()));

  const handleFinalizar = async () => {
    if (!config || !podeFinalizar) return;
    setErroStripe(null);

    const resumoItens = itens.map((i) => {
      const valorLinha = totalItemLinha(i);
      const nome = i.combo ? i.combo.nome : i.produto?.nome ?? "";
      return {
        nome,
        quantidade: i.quantidade,
        observacao: i.observacao?.trim() || null,
        extras: i.acrescimos.length > 0 ? i.acrescimos.map((a) => `${a.quantidade}x ${a.nome}`) : [],
        precoLinha: valorLinha,
      };
    });

    const linhasItens = itens.map((i) => {
      const valorLinha = totalItemLinha(i);
      const nome = i.combo ? i.combo.nome : i.produto?.nome ?? "";
      const extrasTexto =
        i.acrescimos.length > 0
          ? ` (${i.acrescimos.map((a) => `${a.quantidade}x ${a.nome}`).join(", ")})`
          : "";
      const obsTexto = i.observacao?.trim() ? ` | Obs: ${i.observacao.trim()}` : "";
      return `${i.quantidade}x ${nome}${extrasTexto}${obsTexto} - R$ ${valorLinha.toFixed(2)}`;
    });

    let numero: number | null = null;
    try {
      const res = await fetch("/api/pedidos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nomeCliente: nomeCliente.trim() || null,
          itens: resumoItens,
          total: totalGeral,
          tipoEntrega,
          formaPagamento,
          endereco: tipoEntrega === "entrega" ? endereco : null,
        }),
      });
      const data = await res.json();
      if (data?.numero != null) numero = Number(data.numero);
    } catch {
      // segue mesmo se falhar o registro (pedido vai no WhatsApp)
    }

    const linhas = [
      `*Pedido - ${config.nome}*`,
      ...(numero != null ? ["", `*Nº do pedido: #${String(numero).padStart(3, "0")}*`] : []),
      "",
      ...(nomeCliente.trim() ? [`*Cliente:* ${nomeCliente.trim()}`, ""] : []),
      "*Itens:*",
      ...linhasItens,
      "",
      `*Subtotal:* R$ ${totalPreco.toFixed(2)}`,
    ];

    if (tipoEntrega === "entrega") {
      linhas.push(`*Entrega:* R$ ${CUSTO_ENTREGA.toFixed(2)}`);
      linhas.push("");
      linhas.push("*Endereço de entrega:*");
      linhas.push(`Rua ${endereco.rua}, nº ${endereco.numero}`);
      linhas.push(`Bairro: ${endereco.bairro}`);
      if (endereco.complemento.trim()) linhas.push(`Complemento: ${endereco.complemento}`);
    } else {
      linhas.push("");
      linhas.push("*Retirada no estabelecimento*");
    }

    linhas.push("");
    linhas.push(`*Forma de pagamento:* ${FORMAS_PAGAMENTO.find((f) => f.id === formaPagamento)?.label || formaPagamento}`);
    linhas.push("");
    linhas.push(`*Total: R$ ${totalGeral.toFixed(2)}*`);

    const msg = encodeURIComponent(linhas.join("\n"));
    const waUrl = `https://wa.me/${config.whatsapp.replace(/\D/g, "")}?text=${msg}`;

    const usarStripePix =
      formaPagamento === "pix" && stripePixCheckoutHabilitado() && totalGeral >= 0.5;

    if (usarStripePix) {
      setIndoParaStripe(true);
      try {
        const stripeRes = await fetch("/api/stripe/checkout-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amountReais: totalGeral,
            pedidoNumero: numero,
            nomeLoja: config.nome,
          }),
        });
        const stripeData = (await stripeRes.json()) as { url?: string; error?: string };
        if (stripeRes.ok && stripeData?.url) {
          try {
            sessionStorage.setItem("pix_wa_url", waUrl);
            sessionStorage.setItem("pix_pedido_numero", numero != null ? String(numero) : "");
          } catch {
            /* sessionStorage indisponível */
          }
          window.location.href = stripeData.url;
          return;
        }
        setErroStripe(
          stripeData?.error ||
            "Não foi possível abrir o pagamento PIX. Verifique STRIPE_SECRET_KEY e NEXT_PUBLIC_BASE_URL."
        );
      } catch {
        setErroStripe("Erro de rede ao iniciar o PIX. Tente de novo ou use outra forma de pagamento.");
      } finally {
        setIndoParaStripe(false);
      }
      return;
    }

    window.open(waUrl, "_blank");
    clearCart();
    setNumeroPedido(numero);
    setEnviado(true);
  };

  if (config === null) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-[var(--muted)]">Carregando...</p>
      </div>
    );
  }

  if (enviado) {
    return (
      <div className="mx-auto max-w-lg px-4 py-12 text-center">
        <div className="rounded-2xl border-2 border-[var(--card-border)] bg-[var(--card-bg)] p-8 shadow-[var(--shadow-hover)]">
          <p className="text-5xl mb-4">✅</p>
          <h1 className="text-2xl font-extrabold text-[var(--foreground)]">
            Pedido enviado!
          </h1>
          {numeroPedido != null && (
            <p className="mt-3 text-lg font-bold text-[var(--accent)]">
              Seu pedido é o #{String(numeroPedido).padStart(3, "0")}
            </p>
          )}
          <p className="mt-2 text-[var(--muted)]">
            Seu pedido foi enviado para o WhatsApp. Aguarde a confirmação.
          </p>
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
              Avalie sua experiência
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (itens.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-4 py-12 text-center">
        <div className="rounded-2xl border-2 border-[var(--card-border)] bg-[var(--card-bg)] p-8 shadow-[var(--shadow-hover)]">
          <p className="text-5xl mb-4">🛒</p>
          <h1 className="text-2xl font-extrabold text-[var(--foreground)]">
            Nenhum item adicionado ainda
          </h1>
          <p className="mt-2 text-[var(--muted)]">
            Adicione itens no cardápio para poder finalizar sua compra.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/"
              className="btn-accent inline-block rounded-xl px-6 py-3.5 font-bold text-white transition hover:brightness-110"
            >
              Adicionar mais itens
            </Link>
            <span className="inline-block rounded-xl border-2 border-[var(--border-strong)] px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
              Finalizar compra disponível após adicionar itens
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 pb-16">
      <h1 className="mb-6 text-2xl font-extrabold text-[var(--foreground)]">
        Finalizar pedido
      </h1>

      {mostrarCancelamentoPix && (
        <div
          className="mb-6 rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-[var(--foreground)]"
          role="status"
        >
          Pagamento PIX cancelado na página da Stripe. Seus itens continuam no carrinho.
        </div>
      )}

      {stripePixCheckoutHabilitado() && formaPagamento === "pix" && (
        <div className="mb-6 rounded-xl border border-[var(--accent)]/30 bg-[var(--accent-soft)]/50 px-4 py-3 text-sm text-[var(--foreground)]">
          Com PIX selecionado, ao finalizar você será enviado à página segura da Stripe para ver o{" "}
          <strong>QR Code</strong> ou o código copia e cola. Depois do pagamento, abra o WhatsApp com
          o pedido na tela seguinte.
        </div>
      )}

      {erroStripe && (
        <div className="mb-6 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-800 dark:text-red-200">
          {erroStripe}
        </div>
      )}

      {/* Nome do cliente */}
      <section className="card-lift mb-8 rounded-2xl border-2 border-[var(--card-border)] bg-[var(--card-bg)] p-5 shadow-[var(--shadow)]">
        <h2 className="mb-4 text-lg font-bold text-[var(--foreground)]">
          Quem é o pedido?
        </h2>
        <p className="mb-3 text-sm text-[var(--muted)]">
          Informe seu nome para o estabelecimento identificar seu pedido.
        </p>
        <input
          type="text"
          placeholder="Seu nome"
          value={nomeCliente}
          onChange={(e) => setNomeCliente(e.target.value)}
          className="w-full rounded-xl border-2 border-[var(--border)] bg-[var(--card-bg)] px-4 py-3 text-[var(--foreground)] placeholder-[var(--muted)] transition focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-glow)]"
        />
      </section>

      {/* Itens do carrinho */}
      <section className="card-lift mb-8 rounded-2xl border-2 border-[var(--card-border)] bg-[var(--card-bg)] p-5 shadow-[var(--shadow)]">
        <h2 className="mb-4 text-lg font-bold text-[var(--foreground)]">
          Seu pedido
        </h2>
        <ul className="space-y-4">
          {itens.map((item, index) => {
            const valorLinha = totalItemLinha(item);
            const nome = item.combo ? item.combo.nome : item.produto?.nome ?? "";
            const key = item.combo ? item.combo.id : item.produto?.id ?? index;
            return (
              <li
                key={`${key}-${index}`}
                className="border-b border-[var(--border)] pb-4 last:border-0 last:pb-0"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-[var(--foreground)]">
                      {nome}
                      {item.combo && <span className="ml-1 text-xs text-[var(--muted)]">(combo)</span>}
                    </p>
                    {item.acrescimos.length > 0 && (
                      <p className="text-sm text-[var(--muted)]">
                        + {item.acrescimos.map((a) => `${a.quantidade}x ${a.nome} (+${formatPrice(a.preco)})`).join(", ")}
                      </p>
                    )}
                    <p className="text-sm text-[var(--muted)]">
                      {item.quantidade}x = {formatPrice(valorLinha)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(index, Math.max(0, item.quantidade - 1))
                      }
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border)] text-lg leading-none hover:bg-[var(--background)]"
                    >
                      −
                    </button>
                    <span className="w-8 text-center font-medium">
                      {item.quantidade}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(index, item.quantidade + 1)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border)] text-lg leading-none hover:bg-[var(--background)]"
                    >
                      +
                    </button>
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="ml-1 text-sm text-red-600 hover:underline"
                    >
                      Remover
                    </button>
                  </div>
                </div>
                <div className="mt-2">
                  <input
                    type="text"
                    placeholder="Alterações? (ex: sem cebola, sem tomate)"
                    value={item.observacao ?? ""}
                    onChange={(e) => updateObservation(index, e.target.value)}
                    className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] placeholder-[var(--muted)]"
                  />
                </div>
              </li>
            );
          })}
        </ul>
        <p className="mt-4 border-t-2 border-[var(--border-strong)] pt-4 text-right text-lg font-bold text-[var(--foreground)]">
          Subtotal: <span className="text-[var(--accent)]">{formatPrice(totalPreco)}</span>
        </p>
      </section>

      {/* Entrega ou retirada */}
      <section className="card-lift mb-8 rounded-2xl border-2 border-[var(--card-border)] bg-[var(--card-bg)] p-5 shadow-[var(--shadow)]">
        <h2 className="mb-4 text-lg font-bold text-[var(--foreground)]">
          Entrega ou retirada
        </h2>
        <div className="space-y-3">
          <label className="flex cursor-pointer items-center gap-3 rounded-xl border-2 border-[var(--card-border)] p-4 transition has-[:checked]:border-[var(--accent)] has-[:checked]:bg-[var(--accent-soft)] has-[:checked]:shadow-md">
            <input
              type="radio"
              name="tipoEntrega"
              checked={tipoEntrega === "retirada"}
              onChange={() => setTipoEntrega("retirada")}
              className="h-4 w-4 accent-[var(--accent)]"
            />
            <span className="font-semibold">Retirada no estabelecimento</span>
          </label>
          <label className="flex cursor-pointer items-center gap-3 rounded-xl border-2 border-[var(--card-border)] p-4 transition has-[:checked]:border-[var(--accent)] has-[:checked]:bg-[var(--accent-soft)] has-[:checked]:shadow-md">
            <input
              type="radio"
              name="tipoEntrega"
              checked={tipoEntrega === "entrega"}
              onChange={() => setTipoEntrega("entrega")}
              className="h-4 w-4 accent-[var(--accent)]"
            />
            <span className="font-semibold">
              Entrega (custo de {formatPrice(CUSTO_ENTREGA)})
            </span>
          </label>
        </div>

        {tipoEntrega === "entrega" && (
          <div className="mt-4 space-y-3 rounded-xl border-2 border-[var(--border)] bg-[var(--accent-soft)]/40 p-4">
            <p className="text-sm font-medium text-[var(--foreground)]">
              Endereço de entrega
            </p>
            <input
              type="text"
              placeholder="Rua"
              value={endereco.rua}
              onChange={(e) =>
                setEndereco((prev) => ({ ...prev, rua: e.target.value }))
              }
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--card-bg)] px-3 py-2.5 text-[var(--foreground)] placeholder-[var(--muted)]"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Bairro"
                value={endereco.bairro}
                onChange={(e) =>
                  setEndereco((prev) => ({ ...prev, bairro: e.target.value }))
                }
                className="rounded-lg border border-[var(--border)] bg-[var(--card-bg)] px-3 py-2.5 text-[var(--foreground)] placeholder-[var(--muted)]"
              />
              <input
                type="text"
                placeholder="Número"
                value={endereco.numero}
                onChange={(e) =>
                  setEndereco((prev) => ({ ...prev, numero: e.target.value }))
                }
                className="rounded-lg border border-[var(--border)] bg-[var(--card-bg)] px-3 py-2.5 text-[var(--foreground)] placeholder-[var(--muted)]"
              />
            </div>
            <input
              type="text"
              placeholder="Complemento (opcional)"
              value={endereco.complemento}
              onChange={(e) =>
                setEndereco((prev) => ({ ...prev, complemento: e.target.value }))
              }
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--card-bg)] px-3 py-2.5 text-[var(--foreground)] placeholder-[var(--muted)]"
            />
          </div>
        )}
      </section>

      {/* Forma de pagamento */}
      <section className="card-lift mb-8 rounded-2xl border-2 border-[var(--card-border)] bg-[var(--card-bg)] p-5 shadow-[var(--shadow)]">
        <h2 className="mb-4 text-lg font-bold text-[var(--foreground)]">
          Forma de pagamento
        </h2>
        <div className="space-y-2">
          {FORMAS_PAGAMENTO.map((forma) => (
            <label
              key={forma.id}
              className="flex cursor-pointer items-center gap-3 rounded-xl border-2 border-[var(--card-border)] p-3 transition has-[:checked]:border-[var(--accent)] has-[:checked]:bg-[var(--accent-soft)] has-[:checked]:font-semibold"
            >
              <input
                type="radio"
                name="pagamento"
                value={forma.id}
                checked={formaPagamento === forma.id}
                onChange={() => setFormaPagamento(forma.id)}
                className="h-4 w-4 accent-[var(--accent)]"
              />
              <span>{forma.label}</span>
            </label>
          ))}
        </div>
      </section>

      {/* Total e botão */}
      <div className="sticky bottom-0 left-0 right-0 rounded-2xl border-2 border-[var(--card-border)] bg-[var(--card-bg)] p-5 shadow-[var(--shadow-hover)]">
        <div className="mb-4 flex justify-between text-lg">
          <span className="font-semibold text-[var(--muted)]">
            {tipoEntrega === "entrega" ? "Subtotal + Entrega" : "Total"}
          </span>
          <span className="text-xl font-extrabold text-[var(--accent)]">
            {formatPrice(totalGeral)}
          </span>
        </div>
        <button
          type="button"
          onClick={handleFinalizar}
          disabled={!podeFinalizar || indoParaStripe}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-[#25d366] to-[#20bd5a] py-4 text-lg font-bold text-white shadow-lg transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50 disabled:grayscale"
        >
          <WhatsAppIcon />
          {indoParaStripe
            ? "Abrindo pagamento PIX…"
            : stripePixCheckoutHabilitado() && formaPagamento === "pix"
              ? "Continuar: PIX (Stripe) e pedido"
              : "Finalizar pedido no WhatsApp"}
        </button>
      </div>
    </div>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}
