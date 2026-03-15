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
      <div className="flex min-h-screen items-center justify-center bg-amber-50">
        <p>Carregando...</p>
      </div>
    );
  }

  if (erro || !data) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-amber-50 px-4">
        <p className="text-center text-red-600">{erro || "Sem dados"}</p>
        <p className="text-center text-sm text-gray-600">
          Configure NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no .env
        </p>
        <button
          onClick={carregar}
          className="rounded-lg bg-amber-600 px-4 py-2 text-white"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50 pb-8">
      <header className="sticky top-0 z-50 border-b border-amber-200 bg-white px-4 py-3">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <h1 className="text-lg font-bold text-amber-900">Painel do Dono</h1>
          <div className="flex gap-2">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-amber-300 px-3 py-2 text-sm text-amber-800"
            >
              Ver cardápio
            </a>
            <button
              onClick={onSair}
              className="rounded-lg bg-gray-200 px-3 py-2 text-sm text-gray-700 hover:bg-gray-300"
            >
              Sair
            </button>
          </div>
        </div>
        <nav className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {(["config", "categorias", "produtos", "acrescimos", "promocoes", "pedidos", "combos", "avaliacoes"] as const).map(
            (a) => (
              <button
                key={a}
                onClick={() => setAba(a)}
                className={`whitespace-nowrap rounded-lg px-3 py-2 text-sm ${
                  aba === a ? "bg-amber-600 text-white" : "bg-amber-100 text-amber-800"
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
        </nav>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-4">
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

  return (
    <div className="space-y-4 rounded-xl border border-amber-200 bg-white p-4">
      <h2 className="font-bold text-amber-900">Configurações da Loja</h2>
      <div>
        <label className="block text-sm text-gray-600">Logo (aparece ao lado do nome no topo)</label>
        <div className="mt-1 flex items-center gap-3">
          {form.logoUrl ? (
            <img src={form.logoUrl} alt="Logo" className="h-14 w-14 rounded-lg object-cover" />
          ) : (
            <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-gray-100 text-2xl">🍔</div>
          )}
          <div className="flex-1">
            <input
              type="url"
              value={form.logoUrl || ""}
              onChange={(e) => setForm({ ...form, logoUrl: e.target.value || null })}
              placeholder="URL da logo ou envie uma imagem"
              className="w-full rounded-lg border border-amber-300 px-3 py-2 text-sm"
            />
            <label className="mt-1 inline-block cursor-pointer text-sm text-amber-700">
              {uploadingLogo ? "Enviando..." : "Enviar imagem"}
              <input type="file" accept="image/*" className="hidden" disabled={uploadingLogo} onChange={handleLogoUpload} />
            </label>
          </div>
        </div>
      </div>
      <div>
        <label className="block text-sm text-gray-600">Nome</label>
        <input
          value={form.nome}
          onChange={(e) => setForm({ ...form, nome: e.target.value })}
          className="mt-1 w-full rounded-lg border border-amber-300 px-3 py-2"
        />
      </div>
      <div>
        <label className="block text-sm text-gray-600">
          WhatsApp (ex: 5511999999999)
        </label>
        <input
          value={form.whatsapp}
          onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
          className="mt-1 w-full rounded-lg border border-amber-300 px-3 py-2"
          placeholder="5511999999999"
        />
      </div>
      <div>
        <label className="block text-sm text-gray-600">Endereço</label>
        <input
          value={form.endereco || ""}
          onChange={(e) => setForm({ ...form, endereco: e.target.value })}
          className="mt-1 w-full rounded-lg border border-amber-300 px-3 py-2"
        />
      </div>
      <div>
        <label className="block text-sm text-gray-600">Horário (texto exibido)</label>
        <input
          value={form.horario || ""}
          onChange={(e) => setForm({ ...form, horario: e.target.value })}
          className="mt-1 w-full rounded-lg border border-amber-300 px-3 py-2"
          placeholder="Seg a Dom: 11h às 23h"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm text-gray-600">Abertura (Aberto agora)</label>
          <input
            type="time"
            value={form.horaAbertura ?? ""}
            onChange={(e) => setForm({ ...form, horaAbertura: e.target.value || null })}
            className="mt-1 w-full rounded-lg border border-amber-300 px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600">Fechamento</label>
          <input
            type="time"
            value={form.horaFechamento ?? ""}
            onChange={(e) => setForm({ ...form, horaFechamento: e.target.value || null })}
            className="mt-1 w-full rounded-lg border border-amber-300 px-3 py-2"
          />
        </div>
      </div>
      <p className="text-xs text-gray-500">Se preenchidos, o header mostra &quot;Aberto&quot;/&quot;Fechado&quot; e o botão de pedido fica desabilitado quando fechado.</p>
      <button
        onClick={() => onSalvar(form)}
        className="rounded-lg bg-amber-600 px-4 py-2 text-white hover:bg-amber-700"
      >
        Salvar
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

  return (
    <div className="space-y-4 rounded-xl border border-amber-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-amber-900">Categorias</h2>
        <button
          onClick={adicionar}
          className="rounded-lg bg-green-600 px-3 py-1 text-sm text-white"
        >
          + Nova
        </button>
      </div>
      <p className="text-sm text-gray-600">Seção &quot;Comida Japonesa&quot; agrupa as categorias no cardápio.</p>
      <div className="space-y-3">
        {lista.map((cat) => (
          <div
            key={cat.id}
            className="flex flex-wrap items-center gap-2 rounded-lg border border-amber-100 p-3"
          >
            <input
              value={cat.nome}
              onChange={(e) => atualizar(cat.id, "nome", e.target.value)}
              className="flex-1 min-w-[120px] rounded border border-amber-200 px-2 py-1"
            />
            <select
              value={cat.secao || "lanches"}
              onChange={(e) => atualizar(cat.id, "secao", e.target.value)}
              className="rounded border border-amber-200 px-2 py-1 text-sm"
            >
              <option value="lanches">Lanches</option>
              <option value="japonesa">Comida Japonesa</option>
            </select>
            <span className="text-sm text-gray-500">Ordem:</span>
            <input
              type="number"
              value={cat.ordem}
              onChange={(e) =>
                atualizar(cat.id, "ordem", parseInt(e.target.value) || 0)
              }
              className="w-14 rounded border border-amber-200 px-2 py-1"
            />
            <button
              onClick={() => remover(cat.id)}
              className="rounded bg-red-100 px-2 py-1 text-sm text-red-700"
            >
              Excluir
            </button>
          </div>
        ))}
      </div>
      <button
        onClick={() => onSalvar(lista)}
        className="rounded-lg bg-amber-600 px-4 py-2 text-white hover:bg-amber-700"
      >
        Salvar
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

  return (
    <div className="space-y-4 rounded-xl border border-amber-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-amber-900">Acréscimos (extras nos lanches)</h2>
        <button
          onClick={adicionar}
          className="rounded-lg bg-green-600 px-3 py-1 text-sm text-white"
        >
          + Novo
        </button>
      </div>
      <p className="text-sm text-gray-600">
        Os acréscimos aparecem quando o cliente clica em &quot;Adicionar&quot; no produto. Ex: Bacon, Queijo extra, Ovo.
      </p>
      <div className="space-y-3">
        {lista.map((a) => (
          <div
            key={a.id}
            className="flex flex-wrap items-center gap-2 rounded-lg border border-amber-100 p-3"
          >
            <input
              value={a.nome}
              onChange={(e) => atualizar(a.id, "nome", e.target.value)}
              placeholder="Nome (ex: Bacon)"
              className="min-w-[140px] flex-1 rounded border border-amber-200 px-2 py-1"
            />
            <span className="text-sm text-gray-500">+ R$</span>
            <input
              type="number"
              step="0.01"
              value={a.preco}
              onChange={(e) => atualizar(a.id, "preco", parseFloat(e.target.value) || 0)}
              placeholder="0,00"
              className="w-20 rounded border border-amber-200 px-2 py-1"
            />
            <span className="text-sm text-gray-500">Ordem:</span>
            <input
              type="number"
              value={a.ordem}
              onChange={(e) => atualizar(a.id, "ordem", parseInt(e.target.value) || 0)}
              className="w-14 rounded border border-amber-200 px-2 py-1"
            />
            <label className="flex items-center gap-1">
              <input
                type="checkbox"
                checked={a.ativo}
                onChange={(e) => atualizar(a.id, "ativo", e.target.checked)}
              />
              <span className="text-sm">Ativo</span>
            </label>
            <button
              onClick={() => remover(a.id)}
              className="rounded bg-red-100 px-2 py-1 text-sm text-red-700"
            >
              Excluir
            </button>
          </div>
        ))}
      </div>
      <button
        onClick={() => onSalvar(lista)}
        className="rounded-lg bg-amber-600 px-4 py-2 text-white hover:bg-amber-700"
      >
        Salvar
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

  const adicionar = () => {
    const id = crypto.randomUUID();
    const primeiraCat = categorias[0]?.id;
    if (!primeiraCat) return alert("Crie uma categoria primeiro!");
    setLista([
      ...lista,
      {
        id,
        nome: "Novo produto",
        descricao: "",
        ingredientes: "",
        preco: 0,
        imagem: null,
        categoriaId: primeiraCat,
        disponivel: true,
        ordem: lista.length + 1,
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

  return (
    <div className="space-y-4 rounded-xl border border-amber-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-amber-900">Produtos</h2>
        <button
          onClick={adicionar}
          className="rounded-lg bg-green-600 px-3 py-1 text-sm text-white"
        >
          + Novo
        </button>
      </div>
      <div className="space-y-3">
        {lista.map((p) => (
          <div
            key={p.id}
            className="rounded-lg border border-amber-100 p-3 space-y-2"
          >
            <div className="flex flex-wrap gap-2">
              <input
                value={p.nome}
                onChange={(e) => atualizar(p.id, "nome", e.target.value)}
                placeholder="Nome"
                className="flex-1 min-w-[140px] rounded border border-amber-200 px-2 py-1"
              />
              <input
                type="number"
                step="0.01"
                value={p.preco}
                onChange={(e) =>
                  atualizar(p.id, "preco", parseFloat(e.target.value) || 0)
                }
                placeholder="Preço"
                className="w-24 rounded border border-amber-200 px-2 py-1"
              />
              <select
                value={p.categoriaId}
                onChange={(e) => atualizar(p.id, "categoriaId", e.target.value)}
                className="rounded border border-amber-200 px-2 py-1"
              >
                {categorias.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nome}
                  </option>
                ))}
              </select>
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={p.disponivel}
                  onChange={(e) => atualizar(p.id, "disponivel", e.target.checked)}
                />
                <span className="text-sm">Disponível</span>
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={p.destaque ?? false}
                  onChange={(e) => atualizar(p.id, "destaque", e.target.checked)}
                />
                <span className="text-sm">Destaque</span>
              </label>
              <button
                onClick={() => remover(p.id)}
                className="rounded bg-red-100 px-2 py-1 text-sm text-red-700"
              >
                Excluir
              </button>
            </div>
            <input
              value={p.descricao}
              onChange={(e) => atualizar(p.id, "descricao", e.target.value)}
              placeholder="Descrição curta"
              className="w-full rounded border border-amber-200 px-2 py-1 text-sm"
            />
            <div>
              <label className="block text-xs text-gray-500">Ingredientes (um por linha ou separados por vírgula)</label>
              <textarea
                value={p.ingredientes ?? ""}
                onChange={(e) => atualizar(p.id, "ingredientes", e.target.value)}
                placeholder="Ex: Pão, hambúrguer, queijo, alface, tomate"
                className="mt-0.5 w-full rounded border border-amber-200 px-2 py-1 text-sm"
                rows={2}
              />
            </div>
            <div className="flex items-center gap-2">
              {p.imagem ? (
                <img
                  src={p.imagem}
                  alt={p.nome}
                  className="h-16 w-16 rounded object-cover"
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded bg-gray-100 text-xs text-gray-500">
                  Sem foto
                </div>
              )}
              <label className="cursor-pointer rounded bg-amber-100 px-2 py-1 text-sm text-amber-800">
                {uploading === p.id ? "Enviando..." : "Enviar foto"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={!!uploading}
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) uploadFoto(p.id, f);
                  }}
                />
              </label>
              {p.imagem && (
                <button
                  type="button"
                  onClick={() => atualizar(p.id, "imagem", null)}
                  className="text-xs text-red-600"
                >
                  Remover
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={() => onSalvar(lista)}
        className="rounded-lg bg-amber-600 px-4 py-2 text-white hover:bg-amber-700"
      >
        Salvar
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

  return (
    <div className="space-y-4 rounded-xl border border-amber-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-amber-900">Promoções do Dia</h2>
        <button
          onClick={adicionar}
          className="rounded-lg bg-green-600 px-3 py-1 text-sm text-white"
        >
          + Nova
        </button>
      </div>
      <div className="space-y-3">
        {lista.map((promo) => (
          <div
            key={promo.id}
            className="rounded-lg border border-amber-100 p-3 space-y-2"
          >
            <div className="flex flex-wrap gap-2">
              <input
                value={promo.titulo}
                onChange={(e) => atualizar(promo.id, "titulo", e.target.value)}
                placeholder="Título"
                className="flex-1 min-w-[140px] rounded border border-amber-200 px-2 py-1"
              />
              <input
                type="number"
                step="0.01"
                value={promo.precoPromocional ?? ""}
                onChange={(e) =>
                  atualizar(
                    promo.id,
                    "precoPromocional",
                    e.target.value ? parseFloat(e.target.value) : undefined
                  )
                }
                placeholder="Preço promocional"
                className="w-28 rounded border border-amber-200 px-2 py-1"
              />
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={promo.ativa}
                  onChange={(e) => atualizar(promo.id, "ativa", e.target.checked)}
                />
                <span className="text-sm">Ativa</span>
              </label>
              <button
                onClick={() => remover(promo.id)}
                className="rounded bg-red-100 px-2 py-1 text-sm text-red-700"
              >
                Excluir
              </button>
            </div>
            <input
              value={promo.descricao}
              onChange={(e) => atualizar(promo.id, "descricao", e.target.value)}
              placeholder="Descrição da promoção"
              className="w-full rounded border border-amber-200 px-2 py-1 text-sm"
            />
          </div>
        ))}
      </div>
      <button
        onClick={() => onSalvar(lista)}
        className="rounded-lg bg-amber-600 px-4 py-2 text-white hover:bg-amber-700"
      >
        Salvar
      </button>
    </div>
  );
}

function AdminPedidos() {
  const [pedidos, setPedidos] = useState<{ id: string; createdAt: string; nomeCliente: string | null; itens: string; total: number; tipoEntrega: string; formaPagamento: string | null; endereco: string | null }[]>([]);
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
    <div className="space-y-4 rounded-xl border border-amber-200 bg-white p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-bold text-amber-900">Pedidos</h2>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={hoje} onChange={(e) => setHoje(e.target.checked)} />
          <span className="text-sm">Só hoje</span>
        </label>
        <button onClick={carregar} className="rounded-lg bg-amber-100 px-3 py-1.5 text-sm text-amber-800 hover:bg-amber-200">
          Atualizar
        </button>
      </div>
      {loading ? (
        <p className="text-sm text-gray-500">Carregando...</p>
      ) : pedidos.length === 0 ? (
        <p className="text-sm text-gray-500">Nenhum pedido encontrado.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-amber-200 text-left">
                <th className="p-2">Data/Hora</th>
                <th className="p-2">Cliente</th>
                <th className="p-2">Itens</th>
                <th className="p-2">Total</th>
                <th className="p-2">Entrega</th>
              </tr>
            </thead>
            <tbody>
              {pedidos.map((p) => {
                let itensParsed: { nome?: string; quantidade?: number; observacao?: string; precoLinha?: number }[] = [];
                try {
                  itensParsed = typeof p.itens === "string" ? JSON.parse(p.itens) : p.itens;
                } catch {}
                const resumo = itensParsed.map((i) => `${i.quantidade}x ${i.nome}`).join("; ") || "—";
                return (
                  <tr key={p.id} className="border-b border-amber-100">
                    <td className="p-2">{formatDate(p.createdAt)}</td>
                    <td className="p-2">{p.nomeCliente || "—"}</td>
                    <td className="max-w-[200px] truncate p-2" title={resumo}>{resumo}</td>
                    <td className="p-2 font-medium">{formatPrice(Number(p.total))}</td>
                    <td className="p-2">{p.tipoEntrega === "entrega" ? "Entrega" : "Retirada"}</td>
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

  return (
    <div className="space-y-4 rounded-xl border border-amber-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-amber-900">Combos</h2>
        <button onClick={adicionar} className="rounded-lg bg-green-600 px-3 py-1 text-sm text-white">
          + Novo combo
        </button>
      </div>
      <div className="space-y-4">
        {lista.map((c) => (
          <div key={c.id} className="rounded-lg border border-amber-100 p-4 space-y-2">
            <div className="flex flex-wrap gap-2">
              <input
                value={c.nome}
                onChange={(e) => atualizar(c.id, "nome", e.target.value)}
                placeholder="Nome do combo"
                className="min-w-[180px] flex-1 rounded border border-amber-200 px-2 py-1.5"
              />
              <input
                type="number"
                step="0.01"
                value={c.preco}
                onChange={(e) => atualizar(c.id, "preco", parseFloat(e.target.value) || 0)}
                placeholder="Preço"
                className="w-24 rounded border border-amber-200 px-2 py-1.5"
              />
              <label className="flex items-center gap-1">
                <input type="checkbox" checked={c.ativo} onChange={(e) => atualizar(c.id, "ativo", e.target.checked)} />
                <span className="text-sm">Ativo</span>
              </label>
              <button onClick={() => remover(c.id)} className="rounded bg-red-100 px-2 py-1 text-sm text-red-700">
                Excluir
              </button>
            </div>
            <p className="text-xs text-gray-500">Itens do combo:</p>
            <div className="space-y-1 pl-2">
              {c.itens.map((it, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <select
                    value={it.produtoId}
                    onChange={(e) => updateComboItem(c.id, idx, "produtoId", e.target.value)}
                    className="rounded border border-amber-200 px-2 py-1 text-sm"
                  >
                    {produtos.map((p) => (
                      <option key={p.id} value={p.id}>{p.nome}</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min={1}
                    value={it.quantidade}
                    onChange={(e) => updateComboItem(c.id, idx, "quantidade", e.target.value)}
                    className="w-14 rounded border border-amber-200 px-2 py-1 text-sm"
                  />
                  <button type="button" onClick={() => removeComboItem(c.id, idx)} className="text-red-600 text-sm">Remover</button>
                </div>
              ))}
              <button type="button" onClick={() => addItem(c.id)} className="text-sm text-amber-700 hover:underline">+ Adicionar item</button>
            </div>
          </div>
        ))}
      </div>
      <button onClick={() => onSalvar(lista)} className="rounded-lg bg-amber-600 px-4 py-2 text-white hover:bg-amber-700">
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
    <div className="space-y-4 rounded-xl border border-amber-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-amber-900">Avaliações</h2>
        <button onClick={carregar} className="rounded-lg bg-amber-100 px-3 py-1.5 text-sm text-amber-800 hover:bg-amber-200">
          Atualizar
        </button>
      </div>
      {loading ? (
        <p className="text-sm text-gray-500">Carregando...</p>
      ) : avaliacoes.length === 0 ? (
        <p className="text-sm text-gray-500">Nenhuma avaliação ainda.</p>
      ) : (
        <ul className="space-y-3">
          {avaliacoes.map((a) => (
            <li key={a.id} className="rounded-lg border border-amber-100 p-3">
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium">{["", "★", "★★", "★★★", "★★★★", "★★★★★"][a.nota] || a.nota + " estrelas"}</span>
                <span className="text-xs text-gray-500">{formatDate(a.createdAt)}</span>
              </div>
              {a.comentario && <p className="mt-1 text-sm text-gray-600">{a.comentario}</p>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
