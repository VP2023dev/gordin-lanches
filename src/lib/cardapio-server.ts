import { createClient } from "@supabase/supabase-js";
import type { CardapioData } from "@/lib/data";

/**
 * Busca o cardápio direto do Supabase (uso no servidor).
 * Não depende de fetch à própria API, evita erro na Vercel.
 */
export async function getCardapioFromDb(full = false): Promise<CardapioData> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return getCardapioFallback();
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);

    const [configRes, categoriasRes, produtosRes, promocoesRes] = await Promise.all([
      supabase.from("config_loja").select("*").single(),
      supabase.from("categorias").select("*").order("ordem"),
      full
        ? supabase.from("produtos").select("*").order("ordem")
        : supabase.from("produtos").select("*").eq("disponivel", true).order("ordem"),
      full
        ? supabase.from("promocoes").select("*").order("ordem")
        : supabase.from("promocoes").select("*").eq("ativa", true).order("ordem"),
    ]);

    let acrescimosRaw: { id: string; nome: string; preco: string; ativo?: boolean; ordem: number }[] = [];
    try {
      const acrescimosRes = full
        ? await supabase.from("acrescimos").select("*").order("ordem")
        : await supabase.from("acrescimos").select("*").eq("ativo", true).order("ordem");
      acrescimosRaw = (acrescimosRes.data || []) as typeof acrescimosRaw;
    } catch {
      acrescimosRaw = [];
    }
    const acrescimosFiltered = full
      ? acrescimosRaw
      : acrescimosRaw.filter((a) => a.ativo !== false);

    const config = configRes.data || {
      nome: "Gordinho Lanches",
      whatsapp: "5517991449785",
      endereco: "",
      horario: "",
      logo_url: null,
      hora_abertura: null,
      hora_fechamento: null,
    };

    const categoriasData = categoriasRes.data || [];
    const categoriasFiltered = full
      ? categoriasData
      : categoriasData.filter((c: { ativa?: boolean }) => c.ativa !== false);
    const categorias = categoriasFiltered.map(
      (c: { id: string; nome: string; ordem: number; secao?: string }) => ({
        id: c.id,
        nome: c.nome,
        ordem: c.ordem,
        secao: c.secao || "lanches",
      })
    );

    const produtos = (produtosRes.data || []).map((p: Record<string, unknown>) => ({
      id: p.id,
      nome: p.nome,
      descricao: p.descricao || "",
      ingredientes: p.ingredientes || "",
      preco: parseFloat(String(p.preco)),
      imagem: p.imagem_url,
      categoriaId: p.categoria_id,
      disponivel: p.disponivel,
      ordem: p.ordem,
      destaque: p.destaque,
    }));

    const promocoes = (promocoesRes.data || []).map((p: Record<string, unknown>) => ({
      id: p.id,
      titulo: p.titulo,
      descricao: p.descricao || "",
      precoPromocional: p.preco_promocional ? parseFloat(String(p.preco_promocional)) : undefined,
      imagem: p.imagem_url,
      ativa: p.ativa,
      ordem: p.ordem,
      createdAt: p.created_at,
    }));

    const acrescimos = acrescimosFiltered.map((a) => ({
        id: a.id,
        nome: a.nome,
        preco: parseFloat(a.preco),
        ativo: a.ativo !== false,
        ordem: a.ordem,
      }));

    let combos: CardapioData["combos"] = [];
    try {
      const combosRes = full
        ? await supabase.from("combos").select("*").order("ordem")
        : await supabase.from("combos").select("*").eq("ativo", true).order("ordem");
      const combosData = combosRes.data || [];
      const itensRes = await supabase.from("combo_itens").select("combo_id, produto_id, quantidade, produtos(nome)");
      type ComboItemRow = { combo_id: string; produto_id: string; quantidade: number; produtos: { nome: string } | null };
      const itensData = (itensRes.data || []) as unknown as ComboItemRow[];
      const produtosMap = new Map((produtosRes.data || []).map((p: Record<string, string>) => [p.id, p.nome]));
      combos = combosData.map((c: Record<string, unknown>) => ({
        id: c.id as string,
        nome: c.nome as string,
        descricao: (c.descricao as string) || undefined,
        preco: parseFloat(String(c.preco)),
        imagem: (c.imagem_url as string) || undefined,
        ativo: c.ativo !== false,
        ordem: c.ordem as number,
        itens: itensData
          .filter((i) => i.combo_id === c.id)
          .map((i) => ({
            produtoId: i.produto_id,
            produtoNome: (i.produtos?.nome ?? produtosMap.get(i.produto_id)) || "—",
            quantidade: i.quantidade || 1,
          })),
      }));
    } catch {
      combos = [];
    }

    return {
      config: {
        nome: config.nome,
        whatsapp: config.whatsapp,
        endereco: config.endereco,
        horario: config.horario,
        logoUrl: config.logo_url || null,
        horaAbertura: config.hora_abertura ?? null,
        horaFechamento: config.hora_fechamento ?? null,
      },
      categorias,
      produtos: produtos as CardapioData["produtos"],
      promocoes: promocoes as CardapioData["promocoes"],
      acrescimos,
      combos,
    };
  } catch (err) {
    console.error("getCardapioFromDb error:", err);
    return getCardapioFallback();
  }
}

function getCardapioFallback(): CardapioData {
  return {
    config: {
      nome: "Gordinho Lanches",
      whatsapp: "5517991449785",
      endereco: "",
      horario: "",
      logoUrl: null,
    },
    categorias: [],
    produtos: [],
    promocoes: [],
    acrescimos: [],
  };
}
