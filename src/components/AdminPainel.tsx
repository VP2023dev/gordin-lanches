"use client";

import { useCallback, useEffect, useState } from "react";
import type { CardapioData } from "@/lib/data";
import type { Categoria, Produto, Promocao, ConfigLoja, Acrescimo, Combo } from "@/types";

interface AdminPainelProps {
  onSair: () => void;
}

export function AdminPainel({ onSair }: AdminPainelProps) {
  const [data, setData] = useState<CardapioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [aba, setAba] = useState<"config" | "categorias" | "produtos" | "acrescimos" | "promocoes" | "pedidos" | "combos" | "avaliacoes">("config");

  const [erro, setErro] = useState<string | null>(null);

  const carregar = async () => {
    setErro(null);
    const res = await fetch("/api/cardapio?full=1");
    if (res.ok) {
      setData(await res.json());
    } else {
      const err = await res.json().catch(() => ({}));
      setErro(err.error || "Erro ao carregar. Configure o Supabase no .env");
    }
    setLoading(false);
  };

  useEffect(() => {
    carregar();
  }, []);

  const salvarPorTipo = async (
    tipo: "config" | "categorias" | "produtos" | "acrescimos" | "promocoes" | "combos",
    dados: unknown
  ) => {
    const token = typeof window !== "undefined" ? sessionStorage.getItem("admin_token") : null;
    const res = await fetch("/api/cardapio/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token || "gordin123"}`,
      },
      body: JSON.stringify({ tipo, dados }),
    });
    if (res.ok) {
      const json = await res.json();
      if (json.success) {
        setData((prev) => {
          if (!prev) return null;
          const key = tipo === "config" ? "config" : tipo;
          return { ...prev, [key]: dados as CardapioData[keyof CardapioData] };
        });
        alert("Salvo!");
      }
    } else {
      const err = await res.json().catch(() => ({}));
      alert(err.error || "Erro ao salvar");
    }
  };

  const atualizarConfig = (config: Partial<ConfigLoja>) => {
    if (!data) return;
    salvarPorTipo("config", { ...data.config, ...config });
  };

  const atualizarCategorias = (categorias: Categoria[]) => {
    if (!data) return;
    setData({ ...data, categorias });
    salvarPorTipo("categorias", categorias);
  };

  const atualizarProdutos = (produtos: Produto[]) => {
    if (!data) return;
    setData({ ...data, produtos });
    salvarPorTipo("produtos", produtos);
  };

  const atualizarAcrescimos = (acrescimos: Acrescimo[]) => {
    if (!data) return;
    setData({ ...data, acrescimos });
    salvarPorTipo("acrescimos", acrescimos);
  };

  const atualizarPromocoes = (promocoes: Promocao[]) => {
    if (!data) return;
    setData({ ...data, promocoes });
    salvarPorTipo("promocoes", promocoes);
  };

  const atualizarCombos = (combos: Combo[]) => {
    if (!data) return;
    setData({ ...data, combos });
    salvarPorTipo("combos", combos);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
          <p className="text-slate-600 font-medium">Carregando painel...</p>
        </div>
      </div>
    );
  }

  if (erro || !data) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-slate-100 px-4">
        <div className="rounded-2xl bg-white p-8 shadow-xl border border-slate-200 max-w-md w-full text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-2xl">⚠️</div>
          <p className="text-red-600 font-semibold">{erro || "Sem dados"}</p>
          <p className="mt-2 text-sm text-slate-500">
            Configure NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no .env
          </p>
          <button
            onClick={carregar}
            className="mt-6 w-full rounded-xl bg-orange-500 px-4 py-3 font-semibold text-white shadow-lg transition hover:bg-orange-600"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 pb-12">
      <header className="sticky top-0 z-50 bg-slate-800 shadow-lg">
        <div className="mx-auto flex max-w-4xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 text-white text-lg shadow-md">⚙️</div>
            <h1 className="text-xl font-bold text-white">Painel do Dono</h1>
          </div>
          <div className="flex gap-2">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-slate-500 bg-slate-700/50 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:bg-slate-600 hover:text-white"
            >
              Ver cardápio
            </a>
            <button
              onClick={onSair}
              className="rounded-xl bg-slate-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-500"
            >
              Sair
            </button>
          </div>
        </div>
        <nav className="mx-auto max-w-4xl overflow-x-auto px-4 pb-3 scrollbar-hide">
          <div className="flex gap-2 min-w-0">
            {(["config", "categorias", "produtos", "acrescimos", "promocoes", "pedidos", "combos", "avaliacoes"] as const).map(
              (a) => (
                <button
                  key={a}
                  onClick={() => setAba(a)}
                  className={`whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                    aba === a
                      ? "bg-orange-500 text-white shadow-md"
                      : "bg-slate-700/60 text-slate-300 hover:bg-slate-600 hover:text-white"
                  }`}
                >
                  {a === "config" && "Configurações"}
                  {a === "categorias" && "Categorias"}
                  {a === "produtos" && "Produtos"}
                  {a === "acrescimos" && "Acréscimos"}
                  {a === "promocoes" && "Promoções"}
                  {a === "pedidos" && "Pedidos"}
                  {a === "combos" && "Combos"}
                  {a === "avaliacoes" && "Avaliações"}
                </button>
              )
            )}
          </div>
        </nav>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-6">
        {aba === "config" && (
          <AdminConfig config={data.config} onSalvar={atualizarConfig} />
        )}
        {aba === "categorias" && (
          <AdminCategorias
            categorias={data.categorias}
            onSalvar={atualizarCategorias}
          />
        )}
        {aba === "produtos" && (
          <AdminProdutos
            produtos={data.produtos}
            categorias={data.categorias}
            onSalvar={atualizarProdutos}
          />
        )}
        {aba === "acrescimos" && (
          <AdminAcrescimos
            acrescimos={data.acrescimos ?? []}
            onSalvar={atualizarAcrescimos}
          />
        )}
        {aba === "promocoes" && (
          <AdminPromocoes
            promocoes={data.promocoes}
            onSalvar={atualizarPromocoes}
          />
        )}
        {aba === "pedidos" && <AdminPedidos />}
        {aba === "combos" && (
          <AdminCombos
            combos={data.combos ?? []}
            produtos={data.produtos}
            onSalvar={atualizarCombos}
          />
        )}
        {aba === "avaliacoes" && <AdminAvaliacoes />}
      </main>
    </div>
  );
}

function AdminConfig({
  config,
  onSalvar,
}: {
  config: ConfigLoja;
  onSalvar: (c: Partial<ConfigLoja>) => void;
}) {
  const [form, setForm] = useState(config);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingLogo(true);
    const token = sessionStorage.getItem("admin_token");
    const fd = new FormData();
    fd.append("file", file);
    fd.append("pasta", "logo");
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      const data = await res.json();
      if (data.url) setForm((prev) => ({ ...prev, logoUrl: data.url }));
    } catch {
      alert("Erro no upload");
    } finally {
      setUploadingLogo(false);
    }
  };

  const inputClass = "mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-800 shadow-sm transition focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400/30";
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/50">
      <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-3 mb-6">Configurações da Loja</h2>
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-600">Logo (aparece ao lado do nome no topo)</label>
          <div className="mt-1.5 flex items-center gap-4">
            {form.logoUrl ? (
              <img src={form.logoUrl} alt="Logo" className="h-16 w-16 rounded-xl object-cover border border-slate-200 shadow-sm" />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-slate-100 text-2xl border border-slate-200">🍔</div>
            )}
            <div className="flex-1 min-w-0">
              <input type="url" value={form.logoUrl || ""} onChange={(e) => setForm({ ...form, logoUrl: e.target.value || null })} placeholder="URL da logo ou envie uma imagem" className={inputClass} />
              <label className="mt-2 inline-block cursor-pointer rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200">
                {uploadingLogo ? "Enviando..." : "Enviar imagem"}
                <input type="file" accept="image/*" className="hidden" disabled={uploadingLogo} onChange={handleLogoUpload} />
              </label>
            </div>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600">Nome</label>
          <input value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600">WhatsApp (ex: 5511999999999)</label>
          <input value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} placeholder="5511999999999" className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600">Endereço</label>
          <input value={form.endereco || ""} onChange={(e) => setForm({ ...form, endereco: e.target.value })} className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600">Horário (texto exibido)</label>
          <input value={form.horario || ""} onChange={(e) => setForm({ ...form, horario: e.target.value })} placeholder="Seg a Dom: 11h às 23h" className={inputClass} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-600">Abertura (Aberto agora)</label>
            <input type="time" value={form.horaAbertura ?? ""} onChange={(e) => setForm({ ...form, horaAbertura: e.target.value || null })} className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600">Fechamento</label>
            <input type="time" value={form.horaFechamento ?? ""} onChange={(e) => setForm({ ...form, horaFechamento: e.target.value || null })} className={inputClass} />
          </div>
        </div>
        <p className="text-xs text-slate-500 bg-slate-50 rounded-lg p-3">Se preenchidos, o header mostra &quot;Aberto&quot;/&quot;Fechado&quot; e o botão de pedido fica desabilitado quando fechado.</p>
      </div>
      <button onClick={() => onSalvar(form)} className="mt-6 w-full rounded-xl bg-orange-500 px-4 py-3 font-semibold text-white shadow-lg transition hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2">
        Salvar configurações
      </button>
    </div>
  );
}

function AdminCategorias({
  categorias,
  onSalvar,
}: {
  categorias: Categoria[];
  onSalvar: (c: Categoria[]) => void;
}) {
  const [lista, setLista] = useState(categorias);

  const adicionar = () => {
    const id = crypto.randomUUID();
    setLista([...lista, { id, nome: "Nova categoria", ordem: lista.length + 1, secao: "lanches" }]);
  };

  const remover = (id: string) => {
    setLista(lista.filter((c) => c.id !== id));
  };

  const atualizar = (id: string, campo: keyof Categoria, valor: string | number) => {
    setLista(
      lista.map((c) => (c.id === id ? { ...c, [campo]: valor } : c))
    );
  };

  const inputClass = "rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-800 shadow-sm focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400/30";
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/50">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-6">
        <h2 className="text-lg font-bold text-slate-800">Categorias</h2>
        <button onClick={adicionar} className="rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-emerald-600">
          + Nova categoria
        </button>
      </div>
      <p className="text-sm text-slate-500 mb-4">Seção &quot;Comida Japonesa&quot; agrupa as categorias no cardápio.</p>
      <div className="space-y-3">
        {lista.map((cat) => (
          <div key={cat.id} className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/50 p-4">
            <input value={cat.nome} onChange={(e) => atualizar(cat.id, "nome", e.target.value)} className={`flex-1 min-w-[140px] ${inputClass}`} placeholder="Nome" />
            <select value={cat.secao || "lanches"} onChange={(e) => atualizar(cat.id, "secao", e.target.value)} className={inputClass}>
              <option value="lanches">Lanches</option>
              <option value="japonesa">Comida Japonesa</option>
            </select>
            <span className="text-sm text-slate-500">Ordem</span>
            <input type="number" value={cat.ordem} onChange={(e) => atualizar(cat.id, "ordem", parseInt(e.target.value) || 0)} className={`w-16 ${inputClass}`} />
            <button onClick={() => remover(cat.id)} className="rounded-xl bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100">
              Excluir
            </button>
          </div>
        ))}
      </div>
      <button onClick={() => onSalvar(lista)} className="mt-6 w-full rounded-xl bg-orange-500 px-4 py-3 font-semibold text-white shadow-lg transition hover:bg-orange-600">
        Salvar categorias
      </button>
    </div>
  );
}

function AdminAcrescimos({
  acrescimos,
  onSalvar,
}: {
  acrescimos: Acrescimo[];
  onSalvar: (a: Acrescimo[]) => void;
}) {
  const [lista, setLista] = useState(acrescimos);

  const adicionar = () => {
    const id = crypto.randomUUID();
    setLista([
      ...lista,
      { id, nome: "Novo acréscimo", preco: 0, ativo: true, ordem: lista.length + 1 },
    ]);
  };

  const remover = (id: string) => {
    setLista(lista.filter((a) => a.id !== id));
  };

  const atualizar = (id: string, campo: keyof Acrescimo, valor: string | number | boolean) => {
    setLista(lista.map((a) => (a.id === id ? { ...a, [campo]: valor } : a)));
  };

  const inputClass = "rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-800 shadow-sm focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400/30";
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/50">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-6">
        <h2 className="text-lg font-bold text-slate-800">Acréscimos (extras nos lanches)</h2>
        <button onClick={adicionar} className="rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-emerald-600">
          + Novo acréscimo
        </button>
      </div>
      <p className="text-sm text-slate-500 mb-4">Os acréscimos aparecem quando o cliente clica em &quot;Adicionar&quot; no produto. Ex: Bacon, Queijo extra, Ovo.</p>
      <div className="space-y-3">
        {lista.map((a) => (
          <div key={a.id} className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/50 p-4">
            <input value={a.nome} onChange={(e) => atualizar(a.id, "nome", e.target.value)} placeholder="Nome (ex: Bacon)" className={`min-w-[140px] flex-1 ${inputClass}`} />
            <span className="text-sm text-slate-500 font-medium">+ R$</span>
            <input type="number" step="0.01" value={a.preco} onChange={(e) => atualizar(a.id, "preco", parseFloat(e.target.value) || 0)} placeholder="0,00" className={`w-20 ${inputClass}`} />
            <span className="text-sm text-slate-500">Ordem</span>
            <input type="number" value={a.ordem} onChange={(e) => atualizar(a.id, "ordem", parseInt(e.target.value) || 0)} className={`w-16 ${inputClass}`} />
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={a.ativo} onChange={(e) => atualizar(a.id, "ativo", e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-orange-500 focus:ring-orange-400" />
              <span className="text-sm font-medium text-slate-600">Ativo</span>
            </label>
            <button onClick={() => remover(a.id)} className="rounded-xl bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100">
              Excluir
            </button>
          </div>
        ))}
      </div>
      <button onClick={() => onSalvar(lista)} className="mt-6 w-full rounded-xl bg-orange-500 px-4 py-3 font-semibold text-white shadow-lg transition hover:bg-orange-600">
        Salvar acréscimos
      </button>
    </div>
  );
}

function AdminProdutos({
  produtos,
  categorias,
  onSalvar,
}: {
  produtos: Produto[];
  categorias: Categoria[];
  onSalvar: (p: Produto[]) => void;
}) {
  const [lista, setLista] = useState(produtos);
  const [uploading, setUploading] = useState<string | null>(null);

  const uploadFoto = async (produtoId: string, file: File) => {
    const token = sessionStorage.getItem("admin_token");
    setUploading(produtoId);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("pasta", "produtos");
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        setLista((prev) =>
          prev.map((p) => (p.id === produtoId ? { ...p, imagem: data.url } : p))
        );
      }
    } catch {
      alert("Erro no upload");
    } finally {
      setUploading(null);
    }
  };

  const adicionar = (categoriaId: string) => {
    const id = crypto.randomUUID();
    const maxOrdem = Math.max(0, ...lista.filter((p) => p.categoriaId === categoriaId).map((p) => p.ordem));
    setLista([
      ...lista,
      {
        id,
        nome: "Novo produto",
        descricao: "",
        ingredientes: "",
        preco: 0,
        imagem: null,
        categoriaId,
        disponivel: true,
        ordem: maxOrdem + 1,
      },
    ]);
  };

  const remover = (id: string) => {
    setLista(lista.filter((p) => p.id !== id));
  };

  const atualizar = (id: string, campo: keyof Produto, valor: string | number | boolean | null) => {
    setLista(
      lista.map((p) => (p.id === id ? { ...p, [campo]: valor } : p))
    );
  };

  const categoriasOrdenadas = [...categorias].sort((a, b) => a.ordem - b.ordem);
  const produtosPorCategoria = categoriasOrdenadas.map((cat) => ({
    categoria: cat,
    produtos: lista.filter((p) => p.categoriaId === cat.id).sort((a, b) => a.ordem - b.ordem),
  }));
  const produtosSemCategoria = lista.filter((p) => !categorias.some((c) => c.id === p.categoriaId));

  const inputClass = "rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-800 shadow-sm focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400/30";

  const renderProduto = (p: Produto) => (
    <div key={p.id} className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-3">
      <div className="flex flex-wrap gap-3">
        <input value={p.nome} onChange={(e) => atualizar(p.id, "nome", e.target.value)} placeholder="Nome" className={`flex-1 min-w-[160px] ${inputClass}`} />
        <input type="number" step="0.01" value={p.preco} onChange={(e) => atualizar(p.id, "preco", parseFloat(e.target.value) || 0)} placeholder="Preço" className={`w-24 ${inputClass}`} />
        <select value={p.categoriaId} onChange={(e) => atualizar(p.id, "categoriaId", e.target.value)} className={inputClass}>
          {categorias.map((c) => (
            <option key={c.id} value={c.id}>{c.nome}</option>
          ))}
        </select>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={p.disponivel} onChange={(e) => atualizar(p.id, "disponivel", e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-orange-500 focus:ring-orange-400" />
          <span className="text-sm font-medium text-slate-600">Disponível</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={p.destaque ?? false} onChange={(e) => atualizar(p.id, "destaque", e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-orange-500 focus:ring-orange-400" />
          <span className="text-sm font-medium text-slate-600">Destaque</span>
        </label>
        <button onClick={() => remover(p.id)} className="rounded-xl bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100">
          Excluir
        </button>
      </div>
      <input value={p.descricao} onChange={(e) => atualizar(p.id, "descricao", e.target.value)} placeholder="Descrição curta" className={`w-full ${inputClass}`} />
      <div>
        <label className="block text-xs font-medium text-slate-500 mb-1">Ingredientes (um por linha ou separados por vírgula)</label>
        <textarea value={p.ingredientes ?? ""} onChange={(e) => atualizar(p.id, "ingredientes", e.target.value)} placeholder="Ex: Pão, hambúrguer, queijo, alface, tomate" className={`w-full ${inputClass}`} rows={2} />
      </div>
      <div className="flex items-center gap-3 flex-wrap">
        {p.imagem ? (
          <img src={p.imagem} alt={p.nome} className="h-20 w-20 rounded-xl object-cover border border-slate-200 shadow-sm" />
        ) : (
          <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-500">Sem foto</div>
        )}
        <label className="cursor-pointer rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-200">
          {uploading === p.id ? "Enviando..." : "Enviar foto"}
          <input type="file" accept="image/*" className="hidden" disabled={!!uploading} onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadFoto(p.id, f); }} />
        </label>
        {p.imagem && (
          <button type="button" onClick={() => atualizar(p.id, "imagem", null)} className="text-sm font-medium text-red-600 hover:underline">
            Remover foto
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/50">
      <div className="border-b border-slate-100 pb-4 mb-6">
        <h2 className="text-lg font-bold text-slate-800">Produtos</h2>
        <p className="mt-1 text-sm text-slate-500">Organizados por categoria. Use o select em cada produto para mudar de categoria.</p>
      </div>
      <div className="space-y-8">
        {categoriasOrdenadas.length === 0 && (
          <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-6 text-center">
            <p className="text-amber-800 font-medium">Crie uma categoria na aba <strong>Categorias</strong> para organizar e adicionar produtos.</p>
          </div>
        )}
        {produtosPorCategoria.map(({ categoria, produtos }) => (
          <section key={categoria.id} className="rounded-xl border border-slate-200 bg-slate-50/30 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <h3 className="text-base font-bold text-slate-800">
                {categoria.nome}
                <span className="ml-2 text-sm font-normal text-slate-500">({produtos.length} {produtos.length === 1 ? "item" : "itens"})</span>
              </h3>
              <button
                type="button"
                onClick={() => adicionar(categoria.id)}
                className="rounded-xl bg-emerald-500 px-3 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-emerald-600"
              >
                + Novo nesta categoria
              </button>
            </div>
            <div className="space-y-3">
              {produtos.length === 0 ? (
                <p className="py-4 text-center text-sm text-slate-500">Nenhum produto. Clique em &quot;+ Novo nesta categoria&quot; para adicionar.</p>
              ) : (
                produtos.map((p) => renderProduto(p))
              )}
            </div>
          </section>
        ))}
        {produtosSemCategoria.length > 0 && (
          <section className="rounded-xl border border-amber-200 bg-amber-50/50 p-4">
            <h3 className="text-base font-bold text-amber-900 mb-4">Sem categoria ({produtosSemCategoria.length})</h3>
            <div className="space-y-3">
              {produtosSemCategoria.map((p) => renderProduto(p))}
            </div>
          </section>
        )}
      </div>
      <button onClick={() => onSalvar(lista)} className="mt-6 w-full rounded-xl bg-orange-500 px-4 py-3 font-semibold text-white shadow-lg transition hover:bg-orange-600">
        Salvar produtos
      </button>
    </div>
  );
}

function AdminPromocoes({
  promocoes,
  onSalvar,
}: {
  promocoes: Promocao[];
  onSalvar: (p: Promocao[]) => void;
}) {
  const [lista, setLista] = useState(promocoes);

  const adicionar = () => {
    const id = crypto.randomUUID();
    setLista([
      ...lista,
      {
        id,
        titulo: "Nova promoção",
        descricao: "",
        ativa: true,
        ordem: lista.length + 1,
        createdAt: new Date().toISOString().slice(0, 10),
      },
    ]);
  };

  const remover = (id: string) => {
    setLista(lista.filter((p) => p.id !== id));
  };

  const atualizar = (id: string, campo: keyof Promocao, valor: string | number | boolean | undefined) => {
    setLista(
      lista.map((p) => (p.id === id ? { ...p, [campo]: valor } : p))
    );
  };

  const inputClass = "rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-800 shadow-sm focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400/30";
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/50">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-6">
        <h2 className="text-lg font-bold text-slate-800">Promoções do Dia</h2>
        <button onClick={adicionar} className="rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-emerald-600">
          + Nova promoção
        </button>
      </div>
      <div className="space-y-4">
        {lista.map((promo) => (
          <div key={promo.id} className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-3">
            <div className="flex flex-wrap gap-3">
              <input value={promo.titulo} onChange={(e) => atualizar(promo.id, "titulo", e.target.value)} placeholder="Título" className={`flex-1 min-w-[160px] ${inputClass}`} />
              <input type="number" step="0.01" value={promo.precoPromocional ?? ""} onChange={(e) => atualizar(promo.id, "precoPromocional", e.target.value ? parseFloat(e.target.value) : undefined)} placeholder="Preço promocional" className={`w-28 ${inputClass}`} />
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={promo.ativa} onChange={(e) => atualizar(promo.id, "ativa", e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-orange-500 focus:ring-orange-400" />
                <span className="text-sm font-medium text-slate-600">Ativa</span>
              </label>
              <button onClick={() => remover(promo.id)} className="rounded-xl bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100">
                Excluir
              </button>
            </div>
            <input value={promo.descricao} onChange={(e) => atualizar(promo.id, "descricao", e.target.value)} placeholder="Descrição da promoção" className={`w-full ${inputClass}`} />
          </div>
        ))}
      </div>
      <button onClick={() => onSalvar(lista)} className="mt-6 w-full rounded-xl bg-orange-500 px-4 py-3 font-semibold text-white shadow-lg transition hover:bg-orange-600">
        Salvar promoções
      </button>
    </div>
  );
}

function AdminPedidos() {
  const [pedidos, setPedidos] = useState<{ id: string; numero?: number | null; createdAt: string; nomeCliente: string | null; itens: string; total: number; tipoEntrega: string; formaPagamento: string | null; endereco: string | null }[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoje, setHoje] = useState(true);

  const carregar = useCallback(() => {
    setLoading(true);
    const token = typeof window !== "undefined" ? sessionStorage.getItem("admin_token") : null;
    fetch(`/api/pedidos?hoje=${hoje ? "1" : "0"}`, {
      headers: { Authorization: `Bearer ${token || ""}` },
    })
      .then((r) => r.json())
      .then((data) => setPedidos(data.pedidos || []))
      .catch(() => setPedidos([]))
      .finally(() => setLoading(false));
  }, [hoje]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const formatDate = (s: string) => {
    const d = new Date(s);
    return d.toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
  };

  const formatPrice = (n: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(n);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/50">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-6">
        <h2 className="text-lg font-bold text-slate-800">Pedidos</h2>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={hoje} onChange={(e) => setHoje(e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-orange-500 focus:ring-orange-400" />
            <span className="text-sm font-medium text-slate-600">Só hoje</span>
          </label>
          <button onClick={carregar} className="rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-200">
            Atualizar
          </button>
        </div>
      </div>
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
        </div>
      ) : pedidos.length === 0 ? (
        <p className="py-8 text-center text-slate-500">Nenhum pedido encontrado.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-left">
                <th className="p-3 font-semibold text-slate-700">Nº</th>
                <th className="p-3 font-semibold text-slate-700">Data/Hora</th>
                <th className="p-3 font-semibold text-slate-700">Cliente</th>
                <th className="p-3 font-semibold text-slate-700">Itens</th>
                <th className="p-3 font-semibold text-slate-700">Total</th>
                <th className="p-3 font-semibold text-slate-700">Entrega</th>
              </tr>
            </thead>
            <tbody>
              {pedidos.map((p) => {
                let itensParsed: { nome?: string; quantidade?: number; observacao?: string; precoLinha?: number }[] = [];
                try {
                  itensParsed = typeof p.itens === "string" ? JSON.parse(p.itens) : p.itens;
                } catch {}
                const resumo = itensParsed.map((i) => `${i.quantidade}x ${i.nome}`).join("; ") || "—";
                const numeroStr = p.numero != null ? `#${String(p.numero).padStart(3, "0")}` : "—";
                return (
                  <tr key={p.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition">
                    <td className="p-3 font-semibold text-orange-600">{numeroStr}</td>
                    <td className="p-3 text-slate-700">{formatDate(p.createdAt)}</td>
                    <td className="p-3 font-medium text-slate-800">{p.nomeCliente || "—"}</td>
                    <td className="max-w-[200px] truncate p-3 text-slate-600" title={resumo}>{resumo}</td>
                    <td className="p-3 font-semibold text-slate-800">{formatPrice(Number(p.total))}</td>
                    <td className="p-3"><span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${p.tipoEntrega === "entrega" ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-700"}`}>{p.tipoEntrega === "entrega" ? "Entrega" : "Retirada"}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function AdminCombos({
  combos,
  produtos,
  onSalvar,
}: {
  combos: Combo[];
  produtos: Produto[];
  onSalvar: (c: Combo[]) => void;
}) {
  const [lista, setLista] = useState(combos);

  useEffect(() => {
    setLista(combos);
  }, [combos]);

  const adicionar = () => {
    setLista([
      ...lista,
      {
        id: crypto.randomUUID(),
        nome: "Novo combo",
        descricao: "",
        preco: 0,
        ativo: true,
        ordem: lista.length,
        itens: [],
      },
    ]);
  };

  const remover = (id: string) => setLista(lista.filter((c) => c.id !== id));

  const atualizar = (id: string, field: keyof Combo, value: unknown) => {
    setLista(lista.map((c) => (c.id === id ? { ...c, [field]: value } : c)));
  };

  const addItem = (comboId: string) => {
    const primeiro = produtos[0]?.id;
    if (!primeiro) return;
    setLista(
      lista.map((c) =>
        c.id === comboId
          ? { ...c, itens: [...c.itens, { produtoId: primeiro, produtoNome: produtos.find((p) => p.id === primeiro)?.nome || "", quantidade: 1 }] }
          : c
      )
    );
  };

  const updateComboItem = (comboId: string, idx: number, field: "produtoId" | "quantidade", value: string | number) => {
    setLista(
      lista.map((c) => {
        if (c.id !== comboId) return c;
        const next = [...c.itens];
        if (field === "produtoId") {
          const nome = produtos.find((p) => p.id === value)?.nome ?? "";
          next[idx] = { ...next[idx], produtoId: value as string, produtoNome: nome, quantidade: next[idx].quantidade };
        } else next[idx] = { ...next[idx], quantidade: Number(value) || 1 };
        return { ...c, itens: next };
      })
    );
  };

  const removeComboItem = (comboId: string, idx: number) => {
    setLista(lista.map((c) => (c.id === comboId ? { ...c, itens: c.itens.filter((_, i) => i !== idx) } : c)));
  };

  const inputClass = "rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-800 shadow-sm focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400/30";
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/50">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-6">
        <h2 className="text-lg font-bold text-slate-800">Combos</h2>
        <button onClick={adicionar} className="rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-emerald-600">
          + Novo combo
        </button>
      </div>
      <div className="space-y-4">
        {lista.map((c) => (
          <div key={c.id} className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-3">
            <div className="flex flex-wrap gap-3">
              <input value={c.nome} onChange={(e) => atualizar(c.id, "nome", e.target.value)} placeholder="Nome do combo" className={`min-w-[180px] flex-1 ${inputClass}`} />
              <input type="number" step="0.01" value={c.preco} onChange={(e) => atualizar(c.id, "preco", parseFloat(e.target.value) || 0)} placeholder="Preço" className={`w-24 ${inputClass}`} />
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={c.ativo} onChange={(e) => atualizar(c.id, "ativo", e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-orange-500 focus:ring-orange-400" />
                <span className="text-sm font-medium text-slate-600">Ativo</span>
              </label>
              <button onClick={() => remover(c.id)} className="rounded-xl bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100">
                Excluir
              </button>
            </div>
            <p className="text-xs font-medium text-slate-500">Itens do combo:</p>
            <div className="space-y-2 pl-1">
              {c.itens.map((it, idx) => (
                <div key={idx} className="flex items-center gap-2 flex-wrap">
                  <select value={it.produtoId} onChange={(e) => updateComboItem(c.id, idx, "produtoId", e.target.value)} className={inputClass}>
                    {produtos.map((p) => (
                      <option key={p.id} value={p.id}>{p.nome}</option>
                    ))}
                  </select>
                  <input type="number" min={1} value={it.quantidade} onChange={(e) => updateComboItem(c.id, idx, "quantidade", e.target.value)} className={`w-16 ${inputClass}`} />
                  <button type="button" onClick={() => removeComboItem(c.id, idx)} className="text-sm font-medium text-red-600 hover:underline">Remover</button>
                </div>
              ))}
              <button type="button" onClick={() => addItem(c.id)} className="text-sm font-medium text-orange-600 hover:underline">+ Adicionar item</button>
            </div>
          </div>
        ))}
      </div>
      <button onClick={() => onSalvar(lista)} className="mt-6 w-full rounded-xl bg-orange-500 px-4 py-3 font-semibold text-white shadow-lg transition hover:bg-orange-600">
        Salvar combos
      </button>
    </div>
  );
}

function AdminAvaliacoes() {
  const [avaliacoes, setAvaliacoes] = useState<{ id: string; createdAt: string; nota: number; comentario: string | null }[]>([]);
  const [loading, setLoading] = useState(true);

  const carregar = useCallback(() => {
    setLoading(true);
    const token = typeof window !== "undefined" ? sessionStorage.getItem("admin_token") : null;
    fetch("/api/avaliacoes", { headers: { Authorization: `Bearer ${token || ""}` } })
      .then((r) => r.json())
      .then((data) => setAvaliacoes(data.avaliacoes || []))
      .catch(() => setAvaliacoes([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const formatDate = (s: string) => new Date(s).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", year: "2-digit", hour: "2-digit", minute: "2-digit" });

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/50">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-6">
        <h2 className="text-lg font-bold text-slate-800">Avaliações</h2>
        <button onClick={carregar} className="rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-200">
          Atualizar
        </button>
      </div>
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
        </div>
      ) : avaliacoes.length === 0 ? (
        <p className="py-8 text-center text-slate-500">Nenhuma avaliação ainda.</p>
      ) : (
        <ul className="space-y-3">
          {avaliacoes.map((a) => (
            <li key={a.id} className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="text-lg text-amber-500">{["", "★", "★★", "★★★", "★★★★", "★★★★★"][a.nota] || a.nota + " estrelas"}</span>
                <span className="text-xs text-slate-500">{formatDate(a.createdAt)}</span>
              </div>
              {a.comentario && <p className="mt-2 text-sm text-slate-600">{a.comentario}</p>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
