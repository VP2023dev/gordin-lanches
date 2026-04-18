import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { mapConfigFromSupabaseRow } from "@/lib/config-loja";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function GET(request: Request) {
  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json(
      { error: "Supabase não configurado. Configure as variáveis de ambiente." },
      { status: 503 }
    );
  }

  const { searchParams } = new URL(request.url);
  const full = searchParams.get("full") === "1";

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);

    const [configRes, categoriasRes, produtosRes, promocoesRes, acrescimosRes] = await Promise.all([
      supabase.from("config_loja").select("*").single(),
      supabase.from("categorias").select("*").order("ordem"),
      full
        ? supabase.from("produtos").select("*").order("ordem")
        : supabase.from("produtos").select("*").eq("disponivel", true).order("ordem"),
      full
        ? supabase.from("promocoes").select("*").order("ordem")
        : supabase.from("promocoes").select("*").eq("ativa", true).order("ordem"),
      full
        ? supabase.from("acrescimos").select("*").order("ordem")
        : supabase.from("acrescimos").select("*").eq("ativo", true).order("ordem"),
    ]);

    const config = mapConfigFromSupabaseRow(
      (configRes.data as Record<string, unknown> | null) ?? {
        nome: "Gordinho Lanches",
        whatsapp: "5517991449785",
        endereco: "",
        horario: "",
        hora_abertura: null,
        hora_fechamento: null,
      }
    );

    const categoriasData = categoriasRes.data || [];
    const categoriasFiltered = full ? categoriasData : categoriasData.filter((c: { ativa?: boolean }) => c.ativa !== false);
    const categorias = categoriasFiltered.map((c: { id: string; nome: string; ordem: number; secao?: string }) => ({
      id: c.id,
      nome: c.nome,
      ordem: c.ordem,
      secao: c.secao || "lanches",
    }));

    const produtos = (produtosRes.data || []).map((p) => ({
      id: p.id,
      nome: p.nome,
      descricao: p.descricao || "",
      ingredientes: p.ingredientes || "",
      preco: parseFloat(p.preco),
      imagem: p.imagem_url,
      categoriaId: p.categoria_id,
      disponivel: p.disponivel,
      ordem: p.ordem,
      destaque: p.destaque,
    }));

    const promocoes = (promocoesRes.data || []).map((p) => ({
      id: p.id,
      titulo: p.titulo,
      descricao: p.descricao || "",
      precoPromocional: p.preco_promocional ? parseFloat(p.preco_promocional) : undefined,
      imagem: p.imagem_url,
      ativa: p.ativa,
      ordem: p.ordem,
      createdAt: p.created_at,
    }));

    const acrescimosData = acrescimosRes.data || [];
    const acrescimos = acrescimosData.map((a: { id: string; nome: string; preco: string; ativo?: boolean; ordem: number }) => ({
      id: a.id,
      nome: a.nome,
      preco: parseFloat(a.preco),
      ativo: a.ativo !== false,
      ordem: a.ordem,
    }));

    let combos: { id: string; nome: string; descricao?: string; preco: number; imagem?: string; ativo: boolean; ordem: number; itens: { produtoId: string; produtoNome: string; quantidade: number }[] }[] = [];
    try {
      const combosRes = full
        ? await supabase.from("combos").select("*").order("ordem")
        : await supabase.from("combos").select("*").eq("ativo", true).order("ordem");
      const combosData = combosRes.data || [];
      const itensRes = await supabase.from("combo_itens").select("combo_id, produto_id, quantidade, produtos(nome)");
      const itensData = itensRes.data || [];
      const produtosMap = new Map((produtosRes.data || []).map((p: { id: string; nome: string }) => [p.id, p.nome]));
      type ComboItemRow = { combo_id: string; produto_id: string; quantidade: number; produtos: { nome: string } | null };
      const itensTyped = itensData as unknown as ComboItemRow[];
      combos = combosData.map((c: { id: string; nome: string; descricao?: string; preco: string; imagem_url?: string; ativo?: boolean; ordem: number }) => ({
        id: c.id,
        nome: c.nome,
        descricao: c.descricao || undefined,
        preco: parseFloat(c.preco),
        imagem: c.imagem_url || undefined,
        ativo: c.ativo !== false,
        ordem: c.ordem,
        itens: itensTyped
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

    return NextResponse.json({
      config,
      categorias,
      produtos,
      promocoes,
      acrescimos,
      combos,
    });
  } catch (error) {
    console.error("Erro ao carregar cardápio:", error);
    return NextResponse.json(
      { error: "Erro ao carregar cardápio" },
      { status: 500 }
    );
  }
}
