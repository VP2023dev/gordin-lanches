"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const STORAGE_SOM = "admin_producao_som";
const STORAGE_VISTOS = "admin_producao_ids_recebido_vistos";

function playPedidoChime() {
  if (typeof window === "undefined") return;
  try {
    const w = window as unknown as {
      AudioContext: typeof AudioContext;
      webkitAudioContext?: typeof AudioContext;
    };
    const Ctor = w.AudioContext || w.webkitAudioContext;
    if (!Ctor) return;
    const ctx = new Ctor();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.connect(gain);
    gain.connect(ctx.destination);
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.11, ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.28);
    osc.frequency.setValueAtTime(740, ctx.currentTime);
    osc.frequency.setValueAtTime(990, ctx.currentTime + 0.07);
    osc.frequency.exponentialRampToValueAtTime(620, ctx.currentTime + 0.22);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.3);
    void ctx.resume();
  } catch {
    /* autoplay bloqueado ou áudio indisponível */
  }
}

function carregarIdsVistos(): Set<string> {
  try {
    const raw = sessionStorage.getItem(STORAGE_VISTOS);
    if (raw) {
      const arr = JSON.parse(raw) as unknown;
      if (Array.isArray(arr)) return new Set(arr.filter((x) => typeof x === "string"));
    }
  } catch {
    /* ignore */
  }
  return new Set();
}

function salvarIdsVistos(set: Set<string>) {
  try {
    sessionStorage.setItem(STORAGE_VISTOS, JSON.stringify([...set]));
  } catch {
    /* ignore */
  }
}

export type PedidoProducao = {
  id: string;
  numero?: number | null;
  createdAt: string;
  nomeCliente: string | null;
  itens: string;
  total: number;
  tipoEntrega: string;
  formaPagamento: string | null;
  endereco: string | null;
  statusProducao?: string;
};

function notificarNovosPedidos(pedidosNovos: PedidoProducao[]) {
  if (typeof window === "undefined" || typeof Notification === "undefined") return;
  if (Notification.permission !== "granted") return;
  for (const p of pedidosNovos.slice(0, 4)) {
    const num = p.numero != null ? `#${String(p.numero).padStart(3, "0")}` : "Pedido";
    const preco = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(p.total));
    try {
      new Notification("Novo pedido — cozinha", {
        body: `${num} · ${p.nomeCliente || "Cliente"} · ${preco}`,
        tag: `pedido-${p.id}`,
        silent: true,
      });
    } catch {
      /* ignore */
    }
  }
}

const COLUNAS = [
  { key: "recebido" as const, titulo: "Novos", subtitulo: "Aguardando preparo", cor: "bg-zinc-800", borda: "border-zinc-200" },
  { key: "em_producao" as const, titulo: "Em preparo", subtitulo: "Na cozinha", cor: "bg-zinc-700", borda: "border-zinc-200" },
  { key: "pronto" as const, titulo: "Pronto", subtitulo: "Retirada / entrega", cor: "bg-zinc-900", borda: "border-zinc-200" },
];

function statusNorm(s?: string | null) {
  const v = (s || "recebido").toLowerCase();
  if (v === "em_producao" || v === "pronto" || v === "concluido" || v === "recebido") return v;
  return "recebido";
}

function formatHora(iso: string) {
  return new Date(iso).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

function formatPreco(n: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(n);
}

function parseItens(json: string) {
  try {
    const arr = typeof json === "string" ? JSON.parse(json) : json;
    if (!Array.isArray(arr)) return [];
    return arr as { nome?: string; quantidade?: number; observacao?: string | null; extras?: string[] }[];
  } catch {
    return [];
  }
}

export function AdminProducao({ onMensagem }: { onMensagem: (msg: string) => void }) {
  const [pedidos, setPedidos] = useState<PedidoProducao[]>([]);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [atualizandoId, setAtualizandoId] = useState<string | null>(null);
  const [somAtivo, setSomAtivo] = useState(true);
  const [notifEstado, setNotifEstado] = useState<NotificationPermission | "unsupported">("default");
  const bootRecebidoFeito = useRef(false);
  const onMensagemRef = useRef(onMensagem);
  onMensagemRef.current = onMensagem;

  useEffect(() => {
    try {
      const v = localStorage.getItem(STORAGE_SOM);
      if (v === "0") setSomAtivo(false);
    } catch {
      /* ignore */
    }
    if (typeof Notification !== "undefined") {
      setNotifEstado(Notification.permission);
    } else {
      setNotifEstado("unsupported");
    }
  }, []);

  const definirSom = (ativo: boolean) => {
    setSomAtivo(ativo);
    try {
      localStorage.setItem(STORAGE_SOM, ativo ? "1" : "0");
    } catch {
      /* ignore */
    }
  };

  const solicitarNotificacoes = async () => {
    if (typeof Notification === "undefined") {
      onMensagem("Este navegador não suporta notificações.");
      return;
    }
    try {
      const r = await Notification.requestPermission();
      setNotifEstado(r);
      if (r === "granted") onMensagem("Alertas do navegador ativados.");
      else onMensagem("Notificações não autorizadas — o som ao vivo continua disponível.");
    } catch {
      onMensagem("Não foi possível pedir permissão de notificação.");
    }
  };

  const carregar = useCallback(async () => {
    setLoading(true);
    const token = typeof window !== "undefined" ? sessionStorage.getItem("admin_token") : null;
    try {
      const res = await fetch("/api/pedidos?hoje=1", {
        headers: { Authorization: `Bearer ${token || ""}` },
      });
      const data = await res.json();
      setPedidos(Array.isArray(data.pedidos) ? data.pedidos : []);
    } catch {
      setPedidos([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void carregar();
  }, [carregar]);

  useEffect(() => {
    if (!autoRefresh) return;
    const id = window.setInterval(() => void carregar(), 22000);
    return () => window.clearInterval(id);
  }, [autoRefresh, carregar]);

  useEffect(() => {
    if (loading) return;
    const recebidos = pedidos.filter((p) => statusNorm(p.statusProducao) === "recebido");
    const vistos = carregarIdsVistos();

    if (!bootRecebidoFeito.current) {
      bootRecebidoFeito.current = true;
      for (const p of recebidos) vistos.add(p.id);
      salvarIdsVistos(vistos);
      return;
    }

    const novos = recebidos.filter((p) => !vistos.has(p.id));
    if (novos.length === 0) return;

    for (const p of novos) vistos.add(p.id);
    salvarIdsVistos(vistos);

    if (somAtivo) playPedidoChime();
    notificarNovosPedidos(novos);
    onMensagemRef.current(`Novo pedido na fila (${novos.length})`);
  }, [pedidos, loading, somAtivo]);

  const patchStatus = async (id: string, status_producao: string) => {
    const token = typeof window !== "undefined" ? sessionStorage.getItem("admin_token") : null;
    setAtualizandoId(id);
    try {
      const res = await fetch("/api/pedidos", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token || ""}`,
        },
        body: JSON.stringify({ id, status_producao }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        onMensagem(data?.error || "Erro ao atualizar status");
        return;
      }
      onMensagem("Status atualizado.");
      await carregar();
    } finally {
      setAtualizandoId(null);
    }
  };

  const porColuna = (key: (typeof COLUNAS)[number]["key"]) =>
    pedidos.filter((p) => statusNorm(p.statusProducao) === key);

  const concluidosHoje = pedidos
    .filter((p) => statusNorm(p.statusProducao) === "concluido")
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 12);

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 border-b border-zinc-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-zinc-900">Produção</h2>
            <p className="mt-1 text-sm text-slate-600">
              Acompanhe os pedidos de <strong>hoje</strong> do recebimento ao pronto. Atualize o status conforme a cozinha avança.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:items-end">
            <div className="flex flex-wrap items-center justify-end gap-2">
              <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm">
                <input
                  type="checkbox"
                  checked={somAtivo}
                  onChange={(e) => definirSom(e.target.checked)}
                  className="h-4 w-4 rounded border-zinc-300 text-zinc-800 focus:ring-zinc-400"
                />
                Som em novo pedido
              </label>
              {notifEstado !== "unsupported" && notifEstado !== "granted" && (
                <button
                  type="button"
                  onClick={() => void solicitarNotificacoes()}
                  className="rounded-xl border border-sky-300 bg-sky-50 px-3 py-2 text-sm font-semibold text-sky-900 shadow-sm transition hover:bg-sky-100"
                >
                  Ativar alertas do navegador
                </button>
              )}
              {notifEstado === "granted" && (
                <span className="rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs font-medium text-zinc-700">
                  Notificações ativas
                </span>
              )}
              {notifEstado === "denied" && (
                <span className="rounded-xl border border-slate-200 bg-slate-100 px-3 py-2 text-xs text-slate-600">
                  Notificações bloqueadas no navegador
                </span>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm">
                <input
                  type="checkbox"
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                  className="h-4 w-4 rounded border-zinc-300 text-zinc-800 focus:ring-zinc-400"
                />
                Atualizar sozinho (~22s)
              </label>
              <button
                type="button"
                onClick={() => void carregar()}
                className="rounded-md bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-800"
              >
                Atualizar agora
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-zinc-200 border-t-zinc-800" />
          </div>
        ) : (
          <>
            <div className="mt-6 grid gap-4 lg:grid-cols-3">
              {COLUNAS.map((col) => (
                <div
                  key={col.key}
                  className={`flex min-h-[280px] flex-col rounded-lg border bg-white shadow-sm ${col.borda}`}
                >
                  <div className={`rounded-t-lg px-4 py-3 text-white shadow-sm ${col.cor}`}>
                    <p className="text-base font-bold">{col.titulo}</p>
                    <p className="text-xs font-medium text-white/90">{col.subtitulo}</p>
                    <p className="mt-1 text-2xl font-semibold tabular-nums">{porColuna(col.key).length}</p>
                  </div>
                  <div className="flex flex-1 flex-col gap-3 p-3">
                    {porColuna(col.key).length === 0 ? (
                      <p className="py-8 text-center text-sm text-slate-400">Nenhum pedido aqui.</p>
                    ) : (
                      porColuna(col.key).map((p) => (
                        <PedidoCardProducao
                          key={p.id}
                          pedido={p}
                          coluna={col.key}
                          busy={atualizandoId === p.id}
                          onAvancar={(next) => void patchStatus(p.id, next)}
                        />
                      ))
                    )}
                  </div>
                </div>
              ))}
            </div>

            {concluidosHoje.length > 0 && (
              <div className="mt-2 rounded-lg border border-zinc-200 bg-zinc-50/80 p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Finalizados hoje</p>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {concluidosHoje.map((p) => (
                    <li
                      key={p.id}
                      className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm"
                    >
                      {p.numero != null ? `#${String(p.numero).padStart(3, "0")}` : "—"} · {formatHora(p.createdAt)} ·{" "}
                      {p.nomeCliente || "Cliente"}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </div>

      <p className="text-center text-xs text-slate-500">
        Rode no Supabase o arquivo <code className="rounded bg-slate-200 px-1 py-0.5 text-slate-800">database/migration-pedido-status-producao.sql</code> se o status não atualizar.
      </p>
    </div>
  );
}

function PedidoCardProducao({
  pedido,
  coluna,
  busy,
  onAvancar,
}: {
  pedido: PedidoProducao;
  coluna: "recebido" | "em_producao" | "pronto";
  busy: boolean;
  onAvancar: (next: string) => void;
}) {
  const itens = parseItens(pedido.itens);
  const num = pedido.numero != null ? `#${String(pedido.numero).padStart(3, "0")}` : "—";
  let enderecoObj: { rua?: string; bairro?: string; numero?: string; complemento?: string } | null = null;
  try {
    if (pedido.endereco && typeof pedido.endereco === "string") {
      enderecoObj = JSON.parse(pedido.endereco);
    }
  } catch {
    /* ignore */
  }

  const proximo =
    coluna === "recebido" ? "em_producao" : coluna === "em_producao" ? "pronto" : "concluido";
  const labelBotao =
    coluna === "recebido" ? "Iniciar preparo" : coluna === "em_producao" ? "Marcar pronto" : "Finalizar pedido";

  return (
    <article className="rounded-md border border-zinc-200 bg-white p-3 shadow-sm transition hover:border-zinc-300 hover:shadow-md">
      <div className="flex items-start justify-between gap-2">
        <div>
          <span className="text-lg font-semibold text-zinc-900">{num}</span>
          <span className="ml-2 text-xs font-medium text-slate-500">{formatHora(pedido.createdAt)}</span>
        </div>
        <span
          className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
            pedido.tipoEntrega === "entrega" ? "bg-sky-100 text-sky-800" : "bg-slate-100 text-slate-700"
          }`}
        >
          {pedido.tipoEntrega === "entrega" ? "Entrega" : "Retirada"}
        </span>
      </div>
      <p className="mt-1 font-semibold text-slate-900">{pedido.nomeCliente || "Cliente"}</p>
      <ul className="mt-2 max-h-28 space-y-1 overflow-y-auto text-xs text-slate-600">
        {itens.map((i, idx) => (
          <li key={idx}>
            <span className="font-bold text-slate-800">{i.quantidade}×</span> {i.nome}
            {i.observacao ? <span className="text-slate-500"> — {i.observacao}</span> : null}
          </li>
        ))}
      </ul>
      {pedido.tipoEntrega === "entrega" && enderecoObj && (enderecoObj.rua || enderecoObj.bairro) && (
        <p className="mt-2 line-clamp-2 rounded-lg bg-slate-50 px-2 py-1 text-[11px] text-slate-600">
          {enderecoObj.rua}, {enderecoObj.numero} — {enderecoObj.bairro}
        </p>
      )}
      <div className="mt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-2">
        <span className="text-sm font-bold text-slate-900">{formatPreco(Number(pedido.total))}</span>
        {pedido.formaPagamento && (
          <span className="text-[10px] font-medium uppercase text-slate-500">{pedido.formaPagamento}</span>
        )}
      </div>
      <button
        type="button"
        disabled={busy}
        onClick={() => onAvancar(proximo)}
        className="mt-3 w-full rounded-md bg-zinc-900 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-800 disabled:opacity-50"
      >
        {busy ? "Salvando…" : labelBotao}
      </button>
    </article>
  );
}
